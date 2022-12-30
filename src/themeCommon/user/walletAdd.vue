<template>
    <div class='layout'>
        <Top
            back
            left-icon='arrow-left'
            show-center
        />
        <div class='container'>
            <div class='empty'></div>
            <div class='module-form'>
                <div class='select' @click='coinKindVisible = true'>
                    <label>{{ $t('walletAdd.coinName') }}</label>
                    <div class='option'>
                        <input v-model='coinKind' :placeholder="$t('walletAdd.coinPlaceholder')" readonly type='text' />
                        <van-icon name='arrow-down' />
                    </div>
                </div>
                <div class='select' @click='chainNameVisible = true'>
                    <label>{{ $t('walletAdd.chainName') }}</label>
                    <div class='option'>
                        <input v-model='chainName' :placeholder="$t('walletAdd.chainPlaceholder')" readonly type='text' />
                        <van-icon name='arrow-down' />
                    </div>
                </div>
            </div>
            <div class='empty'></div>
            <div class='module-import'>
                <div class='box'>
                    <input v-model='address' :placeholder="$t('walletAdd.addressPlaceholder')" type='text' />
                </div>
                <div class='box'>
                    <input v-model='name' :placeholder="$t('walletAdd.namePlaceholder')" type='text' />
                </div>
                <div class='tip'>
                    {{ $t('common.sendToYou') }} {{ customInfo?.phone || customInfo?.email }}
                </div>
                <div class='box'>
                    <input v-model='code' :placeholder="$t('common.inputVerifyCode')" />
                    <span v-if='countDown === 0' class='get' @click='getCode'>
                        {{ $t('walletAdd.codeBtn') }}
                    </span>
                    <span v-else class='time'>
                        {{ countDown }}s
                    </span>
                </div>
                <div v-if='googleCodeVis' class='box google'>
                    <googleVerifyCode @getGooleVerifyCode='getGooleVerifyCode' />
                </div>
            </div>
        </div>
        <!-- 底部按钮 -->
        <button class='footer-btn' @click='onConfirm'>
            <span>{{ $t('walletAdd.confirm') }}</span>
        </button>

        <!-- 提币币种弹窗 -->
        <van-action-sheet v-model:show='coinKindVisible' :actions='coinKindList' class='action-sheet-coin' @select='selectCoinKind' />
        <!-- 链名称弹窗 -->
        <van-action-sheet v-model:show='chainNameVisible' :actions='chainNameList' class='action-sheet-chain' @select='selectChainName' />
    </div>
</template>

<script>
// vue
import { reactive, toRefs, computed, onMounted } from 'vue'
// vuex
import { useStore } from 'vuex'
// router
import { useRouter, useRoute } from 'vue-router'
// components
import Top from '@/components/top'
// vant
import { Toast, Dialog } from 'vant'
// i18n
import { useI18n } from 'vue-i18n'
// api
import { getAllWithdrawCurrencyList, addWalletAddressV1v1v2 } from '@/api/user'
import { verifyCodeSend } from '@/api/base'
import googleVerifyCode from '@/themeCommon/components/googleVerifyCode.vue'

export default {
    components: {
        Top,
        googleVerifyCode
    },
    setup () {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { tradeType, accountId } = route.query
        const state = reactive({
            // 提币链名称数据列表
            allList: [],
            // 提币币种选项列表
            coinKindList: [],
            // 链名称列表
            chainNameList: [],
            // 提币币种
            coinKind: '',
            // 链名称
            chainName: '',
            // 钱包地址
            address: '',
            // 钱包名称
            name: '',
            // 验证码
            code: '',
            // 当前验证码倒计时时间
            countDown: 0,
            // 是否显示提币币种选项弹窗
            coinKindVisible: false,
            // 是否显示链名称选项弹窗
            chainNameVisible: false,
            // 发送验证码返回的信息
            verifyInfo: {
                code: '',
                token: ''
            },
            googleCode: ''
        })
        // 账户信息
        const { value: customInfo } = computed(() => store.state._user.customerInfo)
        const googleCodeVis = computed(() => customInfo.googleId > 0)

        // 初始化数据
        let timer = null
        const init = () => {
            state.coinKind = ''
            state.chainName = ''
            state.address = ''
            state.name = ''
            state.code = ''
            state.countDown = 0
            state.verifyInfo = {
                code: '',
                token: ''
            }
            clearInterval(timer)
        }
        // 点击选择提币币种
        const selectCoinKind = (item) => {
            state.coinKind = item.name
            state.chainName = ''
            state.coinKindVisible = false
            // 根据提币币种筛选链名称
            filterChainName()
        }
        // 点击选项链名称
        const selectChainName = (item) => {
            state.chainName = item.name
            state.chainNameVisible = false
        }
        const getGooleVerifyCode = val => {
            state.googleCode = val
        }
        // 获取客户提币币种和链名称
        const queryWithdrawCurrencyList = () => {
            getAllWithdrawCurrencyList({
                companyId: customInfo.companyId,
                customerNo: customInfo.customerNo,
                customerGroupId: customInfo.customerGroupId,
                country: customInfo.country,
                withdrawMethod: 'digit_wallet',
                tradeType,
                accountId

            }).then(res => {
                if (res.check()) {
                    const { data } = res
                    const coinKindList = []
                    data.map(elem => {
                        if (!coinKindList.some(v => v.name === elem.withdrawCurrency)) {
                            coinKindList.push({ name: elem.withdrawCurrency })
                        }
                    })
                    state.allList = data
                    state.coinKindList = coinKindList
                }
            })
        }
        // 根据提币币种筛选链名称
        const filterChainName = () => {
            const chainNameList = []
            const arr = state.allList.filter(v => v.withdrawCurrency === state.coinKind)
            arr.map(elem => {
                chainNameList.push({ name: elem.blockchainName })
            })
            state.chainNameList = chainNameList
        }
        // 点击获取验证码
        const getCode = () => {
            // 发送验证码
            verifyCodeSend({
                bizType: customInfo?.phone ? 'SMS_LOGINED_VERIFICATION_CODE' : 'EMAIL_LOGINED_VERIFICATION_CODE'
            }).then(res => {
                state.verifyInfo = res.data
                state.countDown = 59
                timer = setInterval(() => {
                    state.countDown -= 1
                    if (state.countDown === 0) {
                        clearInterval(timer)
                    }
                }, 1000)
            })
        }
        // 点击确定
        const onConfirm = () => {
            const verifyInfo = state.verifyInfo
            if (!state.coinKind) {
                return Toast({ message: t('walletAdd.coinPlaceholder') })
            }
            if (!state.chainName) {
                return Toast({ message: t('walletAdd.chainPlaceholder') })
            }
            if (!state.address) {
                return Toast({ message: t('walletAdd.addressPlaceholder') })
            }
            if (!state.code) {
                return Toast({ message: t('walletAdd.codePlaceholder') })
            }
            if (googleCodeVis.value && !state.googleCode) {
                return Toast(t('common.inputGoogleCode'))
            }

            // 发起api请示
            addWalletAddressV1v1v2({
                currency: state.coinKind,
                chainName: state.chainName,
                address: state.address,
                remark: state.name,
                type: customInfo?.phone ? 2 : 1,
                verifyCode: state.code,
                phoneArea: customInfo?.phoneArea,
                sendToken: verifyInfo.token,
                googleCode: state.googleCode,

            }).then(res => {
                if (res.check()) {
                    Dialog.alert({
                        message: t('withdraw.successHint'),
                    }).then(() => {
                        router.go(-1)
                    })
                } else {
                    Toast(res.msg)
                }
            })
        }

        onMounted(() => {
            // 获取客户提币币种和链名称
            queryWithdrawCurrencyList()
        })

        return {
            ...toRefs(state),
            selectCoinKind,
            selectChainName,
            getCode,
            onConfirm,
            customInfo,
            googleCodeVis,
            getGooleVerifyCode
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bgColor);
}
.container {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-y: auto;
    background: var(--contentColor);
    .empty {
        height: rem(20px);
        background-color: var(--bgColor);
    }
}
.module-form {
    background-color: var(--contentColor);
    .select {
        display: flex;
        align-items: center;
        height: rem(100px);
        padding: 0 rem(30px);
        color: var(--color);
        font-size: rem(28px);
        border-bottom: 1px solid var(--lineColor);
        .option {
            display: inline-flex;
            flex: 1;
            align-items: center;
            justify-content: flex-end;
            height: 100%;
            input {
                flex: 1;
                height: 100%;
                margin: 0 rem(20px);
                text-align: right;
            }
        }
    }
}
.module-import {
    padding: 0 rem(28px);
    .box {
        display: flex;
        justify-content: space-between;
        height: rem(100px);
        color: var(--color);
        font-size: rem(28px);
        background-color: var(--contentColor);
        border-bottom: 1px solid var(--lineColor);
        &.google {
            .form-item {
                margin-bottom: 0;
            }
        }
        :deep(.van-cell) {
            padding-left: 0;
            padding-right: 0;
            &::after {
                border: none;
            }
        }
        input {
            flex: 1;
            height: 100%;
            margin-right: rem(20px);
        }
        .time {
            color: var(--minorColor);
            line-height: rem(104px);
        }
        .get {
            color: var(--primary);
            line-height: rem(104px);
        }
    }
    .tip {
        padding-top: rem(20px);
        color: var(--normalColor);
    }
}
.footer-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: rem(104px);
    background-color: var(--contentColor);
    border-top: 1px solid var(--lineColor);
    span {
        color: var(--color);
        font-weight: bold;
        font-size: rem(34px);
        letter-spacing: 1px;
    }
}

</style>
