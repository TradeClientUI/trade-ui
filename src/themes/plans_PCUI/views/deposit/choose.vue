<template>
    <centerViewDialog>
        <div class='page-wrap'>
            <!-- 头部导航栏 -->
            <LayoutTop
                :custom-back='true'
                :custom-style='{
                    "background": $style.bgColor
                }'
                icon='icon_icon_close_big'
                :title='$t("trade.desposit")'
                @back='onBack'
            >
                <template #right>
                    <span @click='toDespositList'>
                        {{ $t('deposit.depositRecord') }}
                    </span>
                </template>
            </LayoutTop>
            <!-- 页面加载状态 -->
            <Loading :show='loading' />
            <!-- 页面内容 -->
            <div class='page-content'>
                <!-- 资产账户 -->
                <div class='asset-account'>
                    <h3 class='title'>
                        {{ $t('deposit.assetAccount') }}
                    </h3>
                    <div class='asset-select'>
                        <div class='action-bar' @click='pickerShow = !pickerShow'>
                            <div v-if='accountInfo' class='left'>
                                <CurrencyIcon :currency='accountInfo.currency' :size='24' />
                                <div class='name'>
                                    <p class='t1'>
                                        {{ accountInfo?.currency }}
                                    </p>
                                    <p class='t2'>
                                        {{ accountInfo?.fullName }}
                                    </p>
                                </div>
                            </div>
                            <div v-else class='left'>
                                <CurrencyIcon :currency='accountInfo.currency' :size='24' />
                                <div class='name'>
                                    <p class='t1'>
                                        {{ $t('deposit.chooseCurrency') }}
                                    </p>
                                </div>
                            </div>
                            <van-icon name='arrow' />
                        </div>

                        <!-- 资产列表 -->
                        <assetsList
                            v-if='pickerShow'
                            :account-list='accountList'
                            :currency='accountInfo?.currency'
                            :show='pickerShow'
                            :trade-type='tradeType'
                            @update:currency='onCurrencyConfirm'
                            @update:show='updatePopupVis'
                        />
                    </div>
                </div>
                <!-- 充值操作 -->
                <div class='recharge-handle'>
                    <h3 class='title'>
                        {{ $t('deposit.rechargeWay') }}
                    </h3>
                    <div class='recharge-way'>
                        <div :class="['item', { 'active': way === 1, 'disable': disable || directDisable }]" @click='switchDirect'>
                            <div class='check'>
                                <van-icon color='#fff' name='success' />
                            </div>
                            <i class='icon icon_zhichong'></i>
                            <div class='text'>
                                <span class='name'>
                                    {{ $t('deposit.direct') }}
                                </span>
                                <span class='des'>
                                    {{ $t('deposit.directDes') }}
                                </span>
                            </div>
                        </div>
                        <div :class="['item', { 'active': way === 2, 'disable': disable || exchangeDisable }]" @click='switchExchange'>
                            <div class='check'>
                                <van-icon color='#fff' name='success' />
                            </div>
                            <i class='icon icon_huidui'></i>
                            <div class='text'>
                                <span class='name'>
                                    {{ $t('deposit.exchange') }}
                                </span>
                                <span class='des'>
                                    {{ $t('deposit.exchangeDes') }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class='btn-wrap'>
                <div :class="['recharge-btn', { 'disable': disable }]" @click='goRecharge'>
                    <span>{{ $t('deposit.immediateRecharge') }}</span>
                    <van-icon class='arrow' name='arrow' />
                </div>
            </div>
        </div>
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import CurrencyIcon from '@/components/currencyIcon'
import assetsList from './components/assetsList/assetsList'
import { computed, reactive, toRefs, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { checkKycApply, queryPayType, getDepositCoinList, queryMC900Url } from '@/api/user'
import { localSet, getToken, getCookie, localRemove } from '@/utils/util'
import { Toast, Dialog } from 'vant'
export default {
    components: {
        centerViewDialog,
        CurrencyIcon,
        assetsList
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const { query } = route
        const state = reactive({
            // 页面加载状态
            loading: false,
            // 当前语言
            lang: getCookie('lang') || 'zh-CN',
            // 玩法类型
            tradeType: query.tradeType,
            // 支付通道列表
            paymentTypes: [],
            // 当前选中币中账户
            accountInfo: '',
            // 当前选中充值方式 1.直充 2.汇兑
            way: '',
            // 是否禁用所有按钮
            disable: true,
            // 直充是否禁用
            directDisable: true,
            // 汇兑是否禁用
            exchangeDisable: true,
            // 当前直充支付通道
            paymentInfo: '',
            // 存款币种列表
            accountList: '',
            // 是否显示存款币种弹窗
            pickerShow: false,
            // 当前选择的存款币种
            selectedCurrency: '',
            // 收银台地址
            cashierUrl: '',
            // 收银台地址提示
            cashierMsg: ''
        })
        const style = computed(() => store.state.style)
        // 客户信息
        const customerInfo = computed(() => store.state._user.customerInfo)

        // 返回页面
        const onBack = () => {
            router.replace({ path: '/assets' })
        }

        // 获取支付通道
        const getPayTypes = () => {
            state.disable = true
            state.way = ''
            const accountInfo = state.accountInfo
            const params = {
                tradeType: state.tradeType,
                companyId: customerInfo.value.companyId,
                customerNo: customerInfo.value.customerNo,
                customerGroupId: customerInfo.value.customerGroupId,
                country: customerInfo.value.country,
                clientType: 'mobile',
                accountCurrency: accountInfo.currency,
                accountId: accountInfo.accountId
            }
            Toast.loading({
                message: t('common.loading'),
                forbidClick: true,
                duration: 0
            })
            queryPayType(params).then(res => {
                if (res.check()) {
                    state.paymentTypes = res.data
                    state.cashierUrl = ''
                    state.cashierMsg = ''
                    const existMC900 = res.data.find(el => el.paymentCode === 'antpay')
                    // 获取MC900收银台地址
                    if (existMC900) {
                        getMC900Url()
                    } else {
                        // 过滤支付通道数据
                        filterPayment()
                    }
                } else {
                    state.paymentTypes = []
                    filterPayment()
                }
            }).catch(() => {
                Toast.clear()
            })
        }

        // 过滤支付通道数据
        const filterPayment = () => {
            Toast.clear()
            const paymentTypes = state.paymentTypes
            state.paymentInfo = ''
            if (paymentTypes.length === 0) {
                state.disable = true
                state.way = ''
            } else {
                state.disable = false
                state.directDisable = true
                state.exchangeDisable = true
                paymentTypes.map(elem => {
                    // 直充
                    if (elem.rechargeType?.indexOf('1') !== -1) {
                        state.directDisable = false
                        if (!state.paymentInfo) state.paymentInfo = elem
                    }
                    // 汇兑
                    if (elem.rechargeType?.indexOf('2') !== -1) {
                        state.exchangeDisable = false
                    }
                })
                // 设置默认选中充值方式
                state.way = state.directDisable ? 2 : 1
            }
        }

        // 充值方式切换为直充
        const switchDirect = () => {
            if (state.disable || state.directDisable) return
            state.way = 1
        }

        // 充值方式切换汇兑
        const switchExchange = () => {
            if (state.disable || state.exchangeDisable) return
            state.way = 2
        }

        // 跳转到充值页面
        const goRecharge = () => {
            switch (state.way) {
                // 跳转到直充页面
                case 1:
                    localSet('paymentInfo', JSON.stringify(state.paymentInfo))
                    router.push({
                        path: '/assets/depositDirect',
                        query: {
                            currency: state.accountInfo.currency,
                            paymentCode: state.paymentInfo.paymentCode
                        }
                    })
                    break
                // 跳转到汇兑页面
                case 2:
                    if (state.cashierMsg) {
                        Toast(state.cashierMsg)
                    } else if (state.cashierUrl) {
                        const callbackUrl = `${window.location.protocol}//${window.location.host}/${state.lang}/assets/depositChoose?tradeType=5`
                        const url = state.cashierUrl + '&accountCurrency=' + state.accountInfo.currency + '&token=' + getToken() + '&source=2&backUrl=' + callbackUrl
                        window.location.href = url
                    } else {
                        localRemove('proposalNo')
                        router.push({
                            path: '/assets/deposit',
                            query: {
                                tradeType: state.tradeType,
                                currency: state.accountInfo.currency,
                                accountId: state.accountInfo.accountId
                            }
                        })
                    }
                    break
            }
        }

        // 检查是否需要KYC认证
        const checkKyc = () => {
            Toast.loading({
                message: t('common.loading'),
                forbidClick: true,
                duration: 0
            })
            checkKycApply({ businessCode: 'cashin', openAccountType: customerInfo.value.openAccountType }).then(res => {
                Toast.clear()
                if (res.check()) {
                    if (Number(res.data) !== 2) {
                        return Dialog.alert({
                            title: t('common.tip'),
                            confirmButtonText: Number(res.data) === 1 ? t('common.goLook') : t('login.goAuthenticate'),
                            message: Number(res.data) === 2 ? t('deposit.KYCReviewing') : t('deposit.needKYC'),
                        }).then(() => {
                            if (customerInfo.value.openAccountType === 0) {
                                router.replace({
                                    path: '/assets/authentication',
                                    query: {
                                        businessCode: 'cashin'
                                    }
                                })
                            } else {
                                router.replace({
                                    path: '/businessKYC'
                                })
                            }
                        })
                    }
                }
            }).catch(err => {
                Toast.clear()
            })
        }

        const onCurrencyConfirm = val => {
            state.accountInfo = val
            // 获取支付通道
            getPayTypes()
            state.pickerShow = false
        }
        const updatePopupVis = val => {
            state.pickerShow = val
        }
        const bgColor = style.value.primary + '0D'

        // 获取客户支持的存款币种列表
        const queryDepositCoinList = () => {
            getDepositCoinList({ clientType: 'mobile' }).then(res => {
                const accountList = store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(route.query.tradeType))
                const data = res.data
                state.accountList = accountList.filter(el => data.includes(el.currency))
                // 设置默认选择币种
                if (query.accountId && query.currency) {
                    state.accountInfo = state.accountList.find(el => el.currency === query.currency) || ''
                    if (state.accountInfo) {
                        getPayTypes()
                    }
                }
            })
        }

        // 获取MC900收银台地址
        const getMC900Url = () => {
            state.cashierUrl = ''
            state.cashierMsg = ''
            queryMC900Url({
                companyId: customerInfo.value.companyId,
                customerNo: customerInfo.value.customerNo,
                customerGroupId: customerInfo.value.customerGroupId
            }).then(res => {
                Toast.clear()
                filterPayment()
                if (res.check()) {
                    state.cashierUrl = res.data
                } else {
                    state.cashierMsg = res.msg
                }
            }).catch(() => {
                Toast.clear()
            })
        }

        // 跳转到存款记录页面
        const toDespositList = () => {
            router.push({
                path: '/assets/depositRecord'
            })
        }

        onMounted(() => {
            // 检查是否需要KYC认证
            checkKyc()
            queryDepositCoinList()
        })

        return {
            ...toRefs(state),
            switchDirect,
            switchExchange,
            goRecharge,
            updatePopupVis,
            onCurrencyConfirm,
            bgColor,
            toDespositList,
            onBack
        }
    }
}
</script>

<style lang="scss" scoped>

.page-wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding-top: rem(110px);
}
.page-content {
    position: relative;
    flex: 1;
    padding: 0 rem(30px);
    overflow-y: auto;
}
// 资产账户
.asset-account {
    margin-top: rem(30px);
    .title {
        margin-bottom: rem(32px);
        color: var(--color);
        font-weight: normal;
        font-size: rem(48px);
        line-height: 1;
    }
    .asset-select {
        position: relative;
        z-index: 100;
    }
    .action-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: rem(110px);
        margin-bottom: rem(80px);
        padding: 0 rem(30px);
        color: var(--color);
        background: var(--contentColor);
        border-radius: rem(10px);
        cursor: pointer;
        .left {
            display: flex;
            align-items: center;
            .name {
                margin-left: rem(15px);
                .t1 {
                    font-size: rem(32px);
                    vertical-align: middle;
                }
                .t2 {
                    color: var(--minorColor);
                }
            }
        }
        .van-icon {
            color: var(--minorColor);
        }
    }
    .list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .item {
            display: flex;
            align-items: center;
            width: rem(330px);
            height: rem(110px);
            margin-bottom: rem(30px);
            padding-left: rem(30px);
            background: var(--contentColor);
            border: 1px solid transparent;
            border-radius: rem(10px);
            img {
                width: rem(48px);
                height: rem(48px);
                margin-right: rem(20px);
                background: var(--assistColor);
                border-radius: 50%;
            }
            .text {
                display: flex;
                flex-direction: column;
                .name {
                    color: var(--color);
                    font-size: rem(32px);
                }
                .alias {
                    margin-top: rem(4px);
                    color: var(--minorColor);
                    font-size: rem(24px);
                }
            }
        }
        .active {
            position: relative;
            background: v-bind(bgcolor);
            border: 1px solid var(--primary);
            .check {
                position: absolute;
                top: -1px;
                right: -1px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: rem(30px);
                height: rem(30px);
                background: var(--primary);
                border-radius: 0 rem(10px) 0 rem(10px);
                &:deep(.van-icon) {
                    margin-top: rem(-5px);
                }
            }
        }
    }
}
// 充值操作
.recharge-handle {
    margin-top: rem(80px);
    .title {
        margin-bottom: rem(32px);
        color: var(--color);
        font-weight: normal;
        font-size: rem(48px);
        line-height: 1;
    }
    .recharge-way {
        .item {
            @include hover();
            position: relative;
            display: flex;
            align-items: center;
            height: rem(130px);
            margin-bottom: rem(30px);
            padding: 0 rem(36px);
            background: var(--contentColor);
            border: 1px solid transparent;
            border-radius: rem(10px);
            cursor: pointer;
            &:last-of-type {
                margin-bottom: 0;
            }
            .check {
                display: none;
            }
            .icon {
                margin-right: rem(36px);
                color: var(--color);
                font-size: rem(40px);
            }
            .text {
                display: flex;
                flex-direction: column;
                .name {
                    color: var(--color);
                    font-size: rem(32px);
                }
                .des {
                    margin-top: rem(4px);
                    color: var(--minorColor);
                    font-size: rem(24px);
                }
            }
        }
        .active {
            background: v-bind(bgcolor);
            border: 1px solid var(--primary);
            .check {
                position: absolute;
                top: -1px;
                right: -1px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: rem(30px);
                height: rem(30px);
                background: var(--primary);
                border-radius: 0 rem(10px) 0 rem(10px);
                &:deep(.van-icon) {
                    margin-top: rem(-5px);
                }
            }
        }
        .disable {
            background: var(--lineColor);
            opacity: 0.5;
            &:hover {
                box-shadow: none;
            }
        }
    }
}
.btn-wrap {
    position: absolute;
    bottom: rem(30px);
    width: 100%;
    padding: 0 rem(30px);
    .recharge-btn {
        @include hover();
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: rem(80px);
        background: var(--primary);
        border-radius: rem(6px);
        cursor: pointer;
        span {
            margin-right: rem(10px);
            color: #FFF;
            font-size: rem(30px);
        }
        .arrow {
            margin-top: rem(-6px);
            color: #FFF;
            font-size: rem(30px);
        }
        &.disable {
            opacity: 0.5;
            &:hover {
                box-shadow: none;
            }
        }
    }
}

@import '@/sass/mixin.scss';

</style>
