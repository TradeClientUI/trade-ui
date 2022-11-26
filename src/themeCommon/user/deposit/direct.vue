<template>
    <div class='page-wrap'>
        <!-- 头部导航栏 -->

        <LayoutTop
            :custom-style='{
                "background": $style.bgColor
            }'
            :title='$t("trade.desposit")'
        >
            <!-- <template #right>
                <span @click="$router.push('/depositRecord')">
                    {{ $t('deposit.depositRecord') }}
                </span>
            </template> -->
        </LayoutTop>
        <!-- 页面加载状态 -->
        <Loading :show='loading' />
        <!-- 内容区域 -->
        <div class='page-content'>
            <div class='module'>
                <div class='currency-info'>
                    <CurrencyIcon :currency='currency' :size='48' />
                    <p class='name'>
                        {{ currency }}
                    </p>
                    <p class='des'>
                        {{ assetsMap[currency] }}
                    </p>
                </div>
                <div class='chain-list'>
                    <div v-for='(item, index) in chainList' :key='index' :class="['item', { 'active': item === chainName }]" @click='selectChain(item)'>
                        <div class='check'>
                            <van-icon color='#fff' name='success' />
                        </div>
                        <span class='name'>
                            {{ item }}
                        </span>
                    </div>
                </div>
                <div class='qr-code'>
                    <!-- 有地址 -->
                    <div v-if='address' ref='qrCode' class='qrcode'></div>
                    <!-- 无地址 -->
                    <div v-else class='none-address'>
                        <img src='/images/code.png' />
                        <div class='mask'>
                            <button v-if='showGet' class='get' @click='applyBindAddress'>
                                {{ $t('deposit.getAddress') }}
                            </button>
                        </div>
                    </div>
                </div>
                <div class='min'>
                    {{ $t('deposit.minAmount') }} {{ paymentInfo.singleLowAmount }} {{ currency }}
                </div>
                <!-- 有地址 -->
                <div v-if='address' class='address-box'>
                    <p class='text'>
                        {{ address }}
                    </p>
                    <button id='copy' class='copy' :data-clipboard-text='address' @click='copyAddress'>
                        {{ $t('common.copy') }}
                    </button>
                </div>
            </div>
            <div class='warn-box'>
                <p class='title'>
                    {{ $t('common.warning') }}
                </p>
                <p class='des'>
                    {{ $t('deposit.directTip') }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import CurrencyIcon from '@/components/currencyIcon'
import { onMounted, computed, reactive, toRefs, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { Toast, Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
import { getCryptoBlockchainInfo, getBindRechargeAddress, applyRechargeBindAddress } from '@/api/user'
import { localGet } from '@/utils/util'
import Clipboard from 'clipboard'
import QRCode from 'qrcodejs2'
import { assetsMap } from '@/themeCommon/components/assetsList/assetsMap'
export default {
    components: {
        CurrencyIcon
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const { t } = useI18n()
        const state = reactive({
            // 页面加载状态
            loading: true,
            // 当前币种
            currency: route.query.currency,
            // 支付通道code
            paymentCode: route.query.paymentCode,
            // 链名称列表
            chainList: [],
            // 当前选中链名称
            chainName: '',
            // 充值地址
            address: '',
            // 是否显示获取地址按钮
            showGet: false,
            // 支付通道信息
            paymentInfo: JSON.parse(localGet('paymentInfo')),
            // 是否可获取地址
            isGet: true
        })

        // 客户信息
        const customerInfo = computed(() => store.state._user.customerInfo)
        const btnBg = computed(() => store.state.style.primary + '1A')

        // 二维码对象
        const qrCode = ref(null)
        // 请求参数
        const params = {
            companyId: customerInfo.value.companyId,
            customerNo: customerInfo.value.customerNo,
            customerGroupId: customerInfo.value.customerGroupId,
            country: customerInfo.value.country,
            accountCurrency: state.currency,
            paymentChannelClientType: 'mobile',
            paymentChannelCode: state.paymentInfo.paymentCode,
            paymentChannelType: state.paymentInfo.paymentType,
            paymentMerchantNo: state.paymentInfo.merchantNo
        }

        // 获取直充支付通道支持币种信息
        const getChainInfo = () => {
            getCryptoBlockchainInfo({
                currency: state.currency,
                paymentCode: state.paymentCode
            }).then(res => {
                state.loading = false
                if (res.check()) {
                    state.chainList = res.data.blockchainList
                    if (state.chainList.length > 0) {
                        state.chainName = state.chainList[0]
                        getRechargeAddress()
                    }
                }
            }).catch(() => {
                state.loading = false
            })
        }

        // 获取直充支付钱包地址
        const getRechargeAddress = () => {
            if (state.isGet) {
                state.isGet = false
                params.blockchainName = state.chainName
                getBindRechargeAddress(params).then(res => {
                    state.isGet = true
                    if (res.check()) {
                        state.address = res.data.address
                        state.showGet = false
                        creatQrCode()
                    } else {
                        state.address = ''
                        state.showGet = true
                    }
                }).catch(() => {
                    state.isGet = true
                    state.address = ''
                    state.showGet = true
                })
            }
        }

        // 申请绑定直充支付钱包地址
        const applyBindAddress = () => {
            if (state.isGet) {
                state.isGet = false
                params.blockchainName = state.chainName
                applyRechargeBindAddress(params).then(res => {
                    state.isGet = true
                    if (res.check()) {
                        state.address = res.data.address
                        creatQrCode()
                    }
                }).catch(() => {
                    state.isGet = true
                })
            }
        }

        // 选择链名称
        const selectChain = (value) => {
            if (state.chainName !== value) {
                state.address = ''
                state.chainName = value
                // 获取直充支付钱包地址
                getRechargeAddress()
            }
        }

        // 复制地址
        const copyAddress = () => {
            const clipboard = new Clipboard('#copy')
            clipboard.on('success', e => {
                Toast(t('common.copySuccess'))
                // 释放内存
                clipboard.destroy()
            })
        }

        // 创建二维码
        const creatQrCode = () => {
            setTimeout(() => {
                qrCode.value.innerHTML = ''
                new QRCode(qrCode.value, {
                    text: state.address,
                    width: 150,
                    height: 150,
                    colorDark: localGet('invertColor') === 'light' ? '#000000' : '#ffffff',
                    colorLight: localGet('invertColor') === 'light' ? '#ffffff' : '#000000',
                    correctLevel: QRCode.CorrectLevel.H
                })
            }, 100)
        }

        onMounted(() => {
            // 获取直充支付通道支持币种信息
            getChainInfo()
        })

        return {
            ...toRefs(state),
            assetsMap,
            copyAddress,
            selectChain,
            getRechargeAddress,
            applyBindAddress,
            qrCode,
            btnBg
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding-top: rem(110px);
}
.page-content {
    flex: 1;
    padding: 0 rem(30px);
    overflow-y: auto;
}
.module {
    min-height: rem(760px);
    margin-top: rem(80px);
    padding: 0 rem(30px) rem(35px);
    background: var(--contentColor);
    border-radius: rem(10px);
    .currency-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        &:deep(.currencyIcon) {
            margin-top: -24px;
        }
        .name {
            line-height: 1;
            margin-top: rem(20px);
            font-size: rem(40px);
            color: var(--color);
        }
        .des {
            line-height: 1;
            margin-top: rem(5px);
            font-size: rem(28px);
            color: var(--minorColor);
        }
    }
    .chain-list {
        display: flex;
        overflow-x: auto;
        margin-top: rem(50px);
        padding-bottom: rem(30px);
        scrollbar-width: none;
        -ms-overflow-style: none;
        &::-webkit-scrollbar {
            width: 0 !important;
            display: none;
        }
        .item {
            display: flex;
            flex: 1;
            min-width: calc(50% - 20px);
            justify-content: center;
            align-items: center;
            padding: 0 rem(60px);
            height: rem(80px);
            margin-left: rem(20px);
            background: var(--assistColor);
            border: 1px solid transparent;
            border-radius: rem(10px);
            position: relative;
            &:first-child {
                margin-left: 0;
            }
            .check {
                display: none;
            }
            .name {
                font-size: rem(26px);
                color: var(--color);
            }
        }
        .active {
            background: v-bind(btnBg);
            border: 1px solid var(--primary);
            .check {
                display: flex;
                justify-content: center;
                align-items: center;
                width: rem(30px);
                height: rem(30px);
                background: var(--primary);
                border-radius: 0 rem(10px) 0 rem(10px);
                position: absolute;
                top: -1px;
                right: -1px;
                &:deep(.van-icon) {
                    margin-top: rem(-5px);
                }
            }
        }
    }
    .qr-code {
        display: flex;
        justify-content: center;
        width: 150px;
        height: 150px;
        margin: rem(50px) auto 0 auto;
        position: relative;
        img {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
        }
        .none-address {
            img {
                opacity: .2;
            }
            .mask {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                .get {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: rem(260px);
                    height: rem(88px);
                    font-size: rem(30px);
                    color: #fff;
                    background: var(--primary);
                    border-radius: rem(10px);
                }
            }
        }
    }
    .address-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: rem(25px);
        margin-top: rem(30px);
        background: var(--assistColor);
        border-radius: rem(10px);
        .text {
            text-align: center;
            line-height: rem(32px);
            word-break: break-all;
            font-size: rem(24px);
            color: var(--color);
        }
        .copy {
            margin-top: rem(16px);
            font-size: rem(28px);
            font-weight: bold;
            color: var(--primary);
            background: none;
        }
    }
}
.min {
    font-size: rem(26px);
    color: var(--primary);
    text-align: center;
    padding: rem(25px) 0;
}
.warn-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
    margin: rem(30px);
    padding: rem(36px) rem(25px);
    background: rgba(246, 0, 0, 0.05);
    border: 1px solid var(--warn);
    border-radius: rem(10px);
    .title {
        font-size: rem(40px);
        color: var(--warn);
        margin-bottom: rem(26px);
    }
    .des {
        font-size: rem(24px);
        color: var(--color);
    }
}
</style>
