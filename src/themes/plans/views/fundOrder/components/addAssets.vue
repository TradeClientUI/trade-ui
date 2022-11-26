<template>
    <van-popup
        v-model:show='show'
        position='bottom'
        round
        @close='close'
        @open='open'
    >
        <div class='add-wrap'>
            <h2>{{ $t('fundInfo.chooseGetAssets') }}</h2>
            <div class='item' @click="way = 'deposit'">
                <div class='left'>
                    <i
                        class='icon iconfong icon_icon_assets'
                    ></i>
                    <div class='text'>
                        <h3>{{ $t('fundInfo.deposit') }}</h3>
                        <h5>{{ $t('fundInfo.depositTip') }}</h5>
                    </div>
                </div>
                <van-icon :color="way === 'deposit' ? $style.success : $style.minorColor" name='checked' size='22' />
            </div>
            <div class='item' @click="way = 'trade'">
                <div class='left'>
                    <img alt='' class='icon' src='/images/trade.png' />
                    <div class='text'>
                        <h3>{{ $t('trade.buy') }}</h3>
                        <h5>{{ $t('fundInfo.buyTip') }}</h5>
                    </div>
                </div>
                <van-icon :color="way === 'trade' ? $style.success : $style.minorColor" name='checked' size='22' />
            </div>
        </div>
        <van-button block type='primary' @click='onConfirm'>
            {{ $t('common.sure') }}
        </van-button>
    </van-popup>
</template>

<script setup>
import { getDepositCoinList } from '@/api/user'
import { ref, computed, defineProps, defineEmits } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Toast } from 'vant'

const router = useRouter()
const store = useStore()
const { t } = useI18n({ useScope: 'global' })
const emit = defineEmits(['update:show'])
const props = defineProps({
    // 是否显示弹窗
    show: {
        type: Boolean,
        default: false
    },
    // 基金信息
    fund: {
        type: Object,
        default: () => {}
    },
    // 需要添加的资产
    currency: {
        type: String,
        default: 'USDT'
    }
})

// 现货玩法的账户列表
const accountList = computed(() => store.state._user.customerInfo?.accountList?.filter(el => el.tradeType === 5) || [])
// 当前账户
const curAccount = ref(null)
// 新增资产方式 deposit:存款 trade:买入
const way = ref('deposit')

// 获取客户支持的存款币种列表
const queryDepositCoinList = () => {
    getDepositCoinList({ clientType: 'mobile' }).then(res => {
        const data = res.data
        const list = accountList.value.filter(el => data.includes(el.currency))
        curAccount.value = list.find(el => el.currency === props.currency)
    })
}

// 打开弹窗
const open = () => {
    way.value = 'deposit'
    // 获取客户支持的存款币种列表
    queryDepositCoinList()
}

// 关闭弹窗
const close = () => {
    emit('update:show', false)
}

// 点击确定
const onConfirm = () => {
    switch (way.value) {
        case '':
            Toast(t('fundInfo.chooseGetAssets'))
            break
        // 存款
        case 'deposit':
            toDeposit()
            break
        // 买入
        case 'trade':
            toOrderFund()
            break
    }
}

// 跳转到充值页面
const toDeposit = () => {
    if (!curAccount.value) {
        return Toast(t('fundInfo.notDepositTip'))
    }
    close()
    router.push({
        path: '/depositChoose',
        query: {
            tradeType: 5,
            accountId: curAccount.value.accountId,
            currency: props.currency
        }
    })
}

// 点击前往交易页面的对应产品
const toOrderFund = () => {
    const productList = store.state._quote.productList
    let product = productList.find(el => el.baseCurrency === props.currency && el.profitCurrency === 'USDT' && el.tradeType === 5)
    if (!product) {
        product = productList.find(el => el.baseCurrency === props.currency && el.tradeType === 5)
    }
    if (!product || product.baseCurrency === product.profitCurrency) {
        return Toast(t('fundInfo.noTradeMarket'))
    }
    close()
    router.push(`/order?symbolId=${product.symbolId}&tradeType=${product.tradeType}`)
}
</script>

<style scoped lang='scss'>
@import '@/sass/mixin.scss';
.add-wrap {
    padding: rem(30px);
    h2 {
        margin: rem(20px) 0 rem(40px) 0;
        text-align: center;
    }
    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: rem(40px);
        padding: rem(40px) rem(30px);
        background: var(--bgColor);
        .left {
            display: flex;
            .icon {
                width: rem(80px);
                height: rem(80px);
                margin-right: rem(40px);
                font-size: rem(80px);
                &.icon_icon_assets {
                    color: var(--focusColor);
                }
            }
            .text {
                h3 {
                    font-weight: bold;
                }
                h5 {
                    color: var(--minorColor);
                }
            }
        }
    }
}
</style>
