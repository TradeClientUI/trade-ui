<template>
    <div class='fund-info width-limit'>
        <div class='header'>
            <CurrencyIcon :currency='fund.shareTokenCode' size='64' />
            <span class='name'>
                {{ fund.fundName }}
            </span>
            <span class='type'>
                {{ fund.operationMode === 1 ? $t('fundInfo.operationModeValue1') : $t('fundInfo.operationModeValue2') }}
            </span>
            <span v-if='fund.fundType' class='title'>
                {{ fund.fundType }}
            </span>
            <div class='rightImmediatTrade'>
                <van-popover v-model:show='showPopover' theme='dark'>
                    <p style='padding: 10px; width:300px;'>
                        {{ $t('fundInfo.fundTokenTradeTip') }}
                    </p>
                    <template #reference>
                        <a
                            class='immediatTrade'
                            href='javascript:;'
                            @click='toOrderFund'
                            @mouseenter='showPopover=true'
                            @mouseleave='showPopover=false'
                        >
                            {{ $t('fundInfo.fundTokenTrade') }}
                        </a>
                    </template>
                </van-popover>
            </div>
        </div>
        <p class='desc'>
            {{ fund.introduction }}
        </p>
        <ul class='valueList'>
            <li class='item'>
                <p class='muted'>
                    {{ $t('fundInfo.realtimeJZ') }}({{ fund.currency }})
                </p>
                <p>
                    <span>{{ fund.netValue }}</span>
                </p>
                <p>
                    <span>
                        {{ fund.netValueChangeQuote }}
                    </span>
                    <i class='hours24' :class="[parseFloat(fund.netValueChangeQuote) < 0 ? 'down' : 'up']">
                        24H
                    </i>
                </p>
            </li>
            <li class='item'>
                <p class='muted'>
                    {{ $t('fundInfo.marketPrice') }}({{ fund.currency }})
                </p>
                <p>
                    <span>{{ fund.marketPrice }}</span>
                </p>
                <p>
                    <span>
                        {{ fund.marketPriceChangeQuote }}
                    </span>
                    <i class='hours24' :class="[parseFloat(fund.marketPriceChangeQuote) < 0 ? 'down':'up']">
                        24H
                    </i>
                </p>
            </li>
            <li class='item'>
                <p class='muted'>
                    {{ $t('fundInfo.totalMarketValue') }}({{ fund.currency }})
                </p>
                <p>
                    <span>{{ fund.totalBalance }}</span>
                </p>
            </li>
            <li class='item'>
                <p class='muted'>
                    {{ $t('fundInfo.latestPart') }}
                </p>
                <p>
                    <span>{{ fund.latestShare }}</span>
                </p>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import CurrencyIcon from '@/components/currencyIcon.vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
const { t } = useI18n({ useScope: 'global' })

const store = useStore()
const router = useRouter()

const props = defineProps({
    fund: {
        type: Object,
        default: () => {}
    }
})

// 直接交易按钮的popover是否显示
const showPopover = ref(false)

// 点击前往交易页面的对应产品
const toOrderFund = () => {
    const productList = store.state._quote.productList
    let product = productList.find(el => el.baseCurrency === props.fund.shareTokenCode && el.profitCurrency === 'USDT' && el.tradeType === 5)
    if (!product) {
        product = productList.find(el => el.baseCurrency === props.fund.shareTokenCode && el.tradeType === 5)
    }
    if (!product) {
        return Toast(t('fundInfo.noTradeMarket'))
    }
    router.push(`/order?symbolId=${product.symbolId}&tradeType=${product.tradeType}`)
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.fund-info {
    .header {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
            line-height: 1;
        .name {
            margin-left: 25px;
            margin-right: 20px;
            font-size: 30px;
        }
        .type, .title {
            font-size: 12px;
            color: var(--primary);
            height: 18px;
            line-height: 16px;
            border: 1px solid var(--primary);
            padding: 0 4px;
            border-radius: 4px;
            background: none;
        }
        .type {
            margin-right: 10px;
        }
        .rightImmediatTrade{
            flex: 1;
            text-align: right;
        }
    }
    .immediatTrade{
        display: inline-block;
        height: 40px;
        line-height: 38px;
        padding: 0 12px;
        margin-right: rem(24px);
        cursor: pointer;
        border: 1px solid var(--primary);
        border-radius: 5px;
        background: var(--primary);
        color: #fff;
        font-size: 14px;
        @include hover();
        @include active();
    }
    .desc {
        margin-top: 20px;
        line-height: 26px;
        font-size: 14px;
        color: var(--normalColor);
        word-wrap: break-word;
    }
    .valueList{
        display: flex;
        margin-top: 30px;
        .item {
            position: relative;
            border-radius: rem(10px);
            flex: 1;
            line-height: 1.6;
            font-size: 14px;
            .hours24 {
                position: relative;
                margin-left: 5px;
                background: var(--placeholdColor);
                font-size: 14px;
                padding:0 rem(26px) 0 rem(6px);
                border-radius: rem(6px);
                color: var(--color);
                vertical-align: middle;
                &::after{
                    content: '';
                    position: absolute;
                    right: 0px;
                    top: 5px;
                    width: 0;
                    height: 0;
                    border: 8px solid var(--normalColor);
                    border-radius: 2px;
                    border-width: 5px 5px 0 5px;
                    border-color: var(--normalColor) transparent transparent transparent;
                }
                &.up{
                    color: var(--riseColor);
                    background: var(--quoteFallBg);
                }
                &.up::after{
                    border-width: 0 5px 5px 5px;
                    border-color: transparent transparent var(--riseColor)  transparent;
                }
                &.down{
                    color: var(--fallColor);
                    background: var(--quoteRiseBg);
                }
                &.down::after{
                    border-width: 5px 5px 0 5px;
                    border-color: var(--fallColor) transparent transparent transparent;
                }
            }
        }
        .mleft5{
            margin-left: 5px;
        }
    }
}
</style>
