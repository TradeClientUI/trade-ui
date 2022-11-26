<template>
    <div v-if='fund' class='pageWrapp'>
        <LayoutTop :back='true' :menu='false'>
            <template #right>
                <!-- <router-link class='text' href='javascript:;' to='/fundRules?direction=sell'>
                    {{ $t('fundInfo.redeemRules1') }}
                </router-link> -->
                <span class='text' @click='goFundRulesPage'>
                    {{ $t('fundInfo.redeemRules1') }}
                </span>
            </template>
        </LayoutTop>
        <div class='currencyBar'>
            <CurrencyIcon :currency='fund.shareTokenCode' size='28px' />
            <span class='fundCurrency'>
                {{ fund.fundName }}
            </span>
        </div>

        <div class='tradeFormBar'>
            <TradeAssetBar
                v-model='amountPay'
                :can-choose-currency='false'
                :currency='fund.shareTokenCode'
                :digits='fund.shareTokenDigits || 0'
                icon-content-type='fund'
                :label="$t('fundInfo.youPay')"
                :placeholder='payPlaceholder'
                @input='inputAmount'
            />
            <!-- 切换 -->
            <div class='switch-block'>
                <!-- <i class='switch-icon icon_huidui' @click='switchWay'></i> -->
                <div class='switch'>
                    <img alt='' class='switch-icon' src='/images/transfer.png' srcset='' @click='switchWay' />
                    <div class='line'></div>
                </div>
                <div class='switch-text'>
                    <p>
                        <span class='muted'>
                            {{ $t('fundInfo.rate') }}:
                        </span>
                        <span class='muted'>
                            {{ mul(activeAssets.redemptionFeeProportion, 100) }}%
                        </span>
                    </p>
                    <p>
                        <span class='muted'>
                            1 {{ fund.shareTokenCode }} =
                        </span>
                        <span class='muted'>
                            {{ fund.netValue }}{{ fund.currency }}
                        </span>
                    </p>
                </div>
            </div>
            <TradeAssetBar
                v-model='sharesPlaceholder'
                :can-choose-currency='true'
                :currency='activeCurrency'
                :fund-assets-list='fundAssetsList'
                icon-content-type='asset'
                :label="$t('fundInfo.wantGet')"
                :readonly='true'
                @open='openCurrencyExplain'
                @touchCurrency='touchCurrency'
            />
        </div>
        <div class='pay-wrap'>
            <p class='title'>
                {{ $t('fundInfo.expectedGetAssets') }}
            </p>
            <!-- 一篮子资产 -->
            <div v-if="activeCurrency === 'self'" class='redeem-assets'>
                <div v-for='(item, index) in fundAssetsList' :key='index' class='redeem-asset-item'>
                    <van-popover v-model:show='item.popover' placement='bottom-end' theme='dark'>
                        <p
                            style='padding: 5px;
font-size: 10px;
white-space: nowrap;'
                        >
                            {{ item.weight }}
                        </p>
                        <template #reference>
                            <currencyIcon
                                :currency='item.currencyCode'
                                size='30'
                            />
                            <p class='currency'>
                                {{ item.currencyCode }}
                            </p>
                            <p class='percent'>
                                {{ formatWeight(item.weight) }}
                            </p>
                        </template>
                    </van-popover>
                </div>
            </div>
            <!-- 单资产 -->
            <div v-else class='redeem-type'>
                <div class='header'>
                    <span>{{ $t('fundInfo.assets') }}</span>
                    <span>{{ $t('fundInfo.expectedGetAmount') }}</span>
                </div>
                <ul class='content'>
                    <li>
                        <div class='c-left'>
                            <currencyIcon
                                :currency='activeCurrency'
                                size='18'
                            />
                            <span class='currency-text'>
                                {{ activeCurrency }}
                            </span>
                        </div>
                        <div class='c-right'>
                            <span>{{ $t('fundInfo.t2Tip1') }}</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div v-if="activeCurrency === 'self'" class='notice'>
                {{ $t('fundInfo.t2Tip2') }}
                <!-- <router-link class='toRule' href='javascript:;' to='/fundRules?direction=sell'>
                    {{ $t('fundInfo.viewRule') }}
                </router-link> -->
                <span class='toRule' @click='goFundRulesPage'>
                    {{ $t('fundInfo.viewRule') }}
                </span>
            </div>
        </div>

        <div class='footerBtn'>
            <van-button block :disabled='loading || fund.canRedemption!==1' size='normal' @click='submitHandler'>
                {{ fund.canRedemption===1 ? $t('fundInfo.sell'):$t('fundInfo.disabledSell') }}
            </van-button>
        </div>

        <!-- 加载效果 -->
        <loadingVue :show='loading' />
        <!-- 选择资产弹窗 -->
        <SelectAssetsDialog
            v-model:show='selectShow'
            :active-currency='activeCurrency'
            :fund-assets-list='fundAssetsList'
            :list='selectActions'
            @select='selectAssets'
        />
        <!-- 资产说明弹窗 -->
        <CurrencyExplainDialog
            v-model:show='currencyExplainShow'
            :currency='activeCurrency'
            :fund='fund'
            :fund-assets-list='fundAssetsList'
            :list='selectActions'
        />
    </div>
</template>

<script setup>
import loadingVue from '@/components/loading.vue'
import CurrencyIcon from '@/components/currencyIcon.vue'
import TradeAssetBar from './components/tradeAssetBar.vue'
import SelectAssetsDialog from './components/selectAssetsDialog.vue'
import CurrencyExplainDialog from './components/currencyExplainDialog.vue'
import { orderHook } from './orderHook'
import { computed, unref, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toast, Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
import { isEmpty } from '@/utils/util'
import { mul, retainDecimal } from '@/utils/calculation'

const { t } = useI18n({ useScope: 'global' })
const route = useRoute()
const router = useRouter()
const { direction, fundId } = route.query
const {
    fund,
    fundAssetsList,
    accountList,
    loading,
    queryFundNetValue,
    submitFundRedeem,
    selectShow,
    selectActions,
    onSelect,
    activeCurrency,
    activeAssets
} = orderHook()

const fundAccount = computed(() => accountList.value?.find(el => el.currency === fund.value?.shareTokenCode))

// 赎回份额输入框的placeholder
const payPlaceholder = computed(() => {
    const text = t('fundInfo.canRedeemMax') + (fundAccount.value?.available || 0)
    return text
})
// 赎回的数量
const amountPay = ref('')

// 份额输入框的placeholder
const sharesPlaceholder = computed(() => {
    return t('fundInfo.redeemPlaceholder')
})

// 是否显示资产说明弹窗
const currencyExplainShow = ref(false)

// 输入数量
const inputAmount = () => {
    queryFundNetValue()
}
// 格式化权重
const formatWeight = (value) => {
    value = Number(value.replace('%', ''))
    value = retainDecimal(value, 2)
    return value + '%'
}
// 显示选择资产弹窗
const touchCurrency = () => {
    selectShow.value = true
}
// 选择资产
const selectAssets = (item) => {
    onSelect(item)
    queryFundNetValue()
}
// 显示资产说明弹窗
const openCurrencyExplain = () => {
    currencyExplainShow.value = true
}
// 点击切换申购
const switchWay = () => {
    router.replace({
        name: 'FundApply',
        query: { direction: 'buy', fundId }
    })
}

// 提交申购或者赎回
const submitHandler = () => {
    // 验证参数
    if (isEmpty(amountPay.value)) {
        return Toast(t('fundInfo.redeemNumPlaceholder'))
    }
    if (Number(amountPay.value) < Number(activeAssets.value.minRedemptionNum)) {
        return Toast(t('fundInfo.redeemMinTip') + activeAssets.value.minRedemptionNum)
    }
    // 提交赎回
    submitFundRedeem({
        fundId: parseInt(fundId),
        shares: unref(amountPay),
        currencyCode: unref(activeCurrency),
    }).then(res => {
        if (res?.check && res.check()) {
            amountPay.value = ''
            queryFundNetValue()
            Dialog.confirm({
                title: t('fundInfo.redeemSubmiteed'),
                message: t('fundInfo.redeemSubmiteedDesc'),
                confirmButtonText: t('fundInfo.records'),
                cancelButtonText: t('fundInfo.iknow')
            }).then(() => {
                router.push({
                    path: '/fundRecord',
                    query: {
                        direction: 'sell'
                    }
                })
            }).catch(() => {})
        }
    })
}

const goFundRulesPage = () => {
    router.push({
        path: '/fundRules',
        query: {
            direction: 'sell',
            fundId: fundId
        }
    })
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrapp {
    height: 100%;
    margin-top: rem(110px);
    margin-bottom: rem(88px);
    overflow-y: auto;
    .text {
        color: var(--color);
    }
    .currencyBar {
        margin-top: rem(20px);
        padding: rem(30px) rem(30px);
        line-height: 28px;
        background: var(--contentColor);
    }
    .fundCurrency {
        margin-left: 0.5em;
        font-size: rem(32px);
        vertical-align: middle;
    }
    .tradeBarMtop {
        margin-top: 25px;
    }
}
.tradeFormBar {
    margin-top: rem(20px);
    padding: rem(30px);
    background: var(--contentColor);
    .switch-block {
        display: flex;
        align-items: center;
        margin: rem(50px) 0;
        .switch {
            position: relative;
            .line {
                position: absolute;
                top: rem(-30px);
                right: rem(50px);
                z-index: 0;
                height: rem(120px);
                border-right: 1px dashed var(--placeholdColor);
            }
        }
        .switch-icon {
            position: relative;
            z-index: 1;
            width: rem(56px);
            height: rem(56px);
            margin-right: rem(20px);
            color: var(--primary);
            cursor: pointer;
        }
        .switch-text {
            p {
                line-height: 1.6;
            }
        }
    }
}
.pay-wrap {
    margin: rem(30px) 0;
    padding: rem(30px) 0;
    background: var(--contentColor);
    .title {
        font-weight: bold;
        font-size: rem(30px);
        text-align: center;
    }
    .redeem-type {
        overflow: hidden;
        .header {
            display: flex;
            justify-content: space-between;
            margin: rem(30px) 0;
            padding: 0 rem(40px);
        }
        .content {
            margin: rem(30px) 0;
            padding: 0 rem(30px);
            li {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: rem(30px);
                .c-left {
                    display: flex;
                    align-items: center;
                    height: 100%;
                    .currency-text {
                        margin-top: rem(4px);
                        margin-left: rem(10px);
                        font-weight: bold;
                    }
                }
                .c-right {
                    display: flex;
                    align-items: center;
                    text-align: right;
                    .icon_success {
                        margin-left: rem(20px);
                        color: var(--success);
                        font-size: rem(28px);
                    }
                    .icon_icon_assets {
                        margin-left: rem(20px);
                        color: var(--primary);
                        font-size: rem(28px);
                    }
                    .van-icon {
                        position: relative;
                        top: -2px;
                        display: inline-block;
                        margin-left: rem(20px);
                        vertical-align: -12%;
                    }
                    .error-text {
                        color: var(--warn);
                    }
                    .cr-inline {
                        display: inline-block;
                    }
                }
            }
        }
    }
    .redeem-assets {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin: rem(30px) rem(30px) 0;
        .redeem-asset-item {
            flex: 1;
            width: calc((100% - 30px) / 3);  // 这里的10px = (分布个数3-1)*间隙5px, 可以根据实际的分布个数和间隙区调整
            min-width: calc((100% - 30px) / 3); // 加入这两个后每个item的宽度就生效了
            max-width: calc((100% - 30px) / 3);
            margin-right: 15px;
            margin-bottom: 15px;
            padding: rem(30px) 0;
            text-align: center;
            background-color: var(--contentColor);
            border: solid 1px var(--lineColor);
            border-radius: rem(10px);
            &:nth-child(3n) { // 去除第3n个的margin-right
                margin-right: 0;
            }
            .currency {
                margin: rem(10px) 0 rem(5px);
                color: var(--color);
                font-weight: bold;
                font-size: rem(28px);
            }
            .percent {
                font-size: rem(20px);
            }
        }
    }
    .notice {
        padding: 0 rem(30px);
        color: var(--minorColor);
        .toRule {
            color: var(--primary);
            text-decoration: underline;
        }
    }
}
.footerBtn {
    position: fixed;
    bottom: 0;
    display: block;
    width: 100%;
    .van-button {
        color: #FFF;
        font-size: 15px;
        background: var(--primary);
        border-color: var(--primary);
    }
}
.popup-assets-list {
    padding: rem(30px);
    .title {
        font-size: rem(32px);
        text-align: center;
    }
    .asset-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: rem(40px);
        padding: rem(30px);
        background: var(--bgColor);
        border-radius: rem(12px);
        .top-block {
            margin-bottom: rem(10px);
            >span {
                margin-left: rem(10px);
                color: var(--color);
                vertical-align: middle;
            }
        }
        .desc {
            margin-bottom: rem(20px);
            color: var(--minorColor);
        }
    }
}
</style>
