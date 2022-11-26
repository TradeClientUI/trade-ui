<template>
    <div v-if='fund' class='pageWrapp'>
        <LayoutTop :back='true' :menu='false'>
            <template #right>
                <!-- <router-link class='text' href='javascript:;' to='/fundRules?direction=buy'>
                    {{ $t('fundInfo.applyRules1') }}
                </router-link> -->
                <span class='text' @click='goFundRulesPage'>
                    {{ $t('fundInfo.applyRules1') }}
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
                :can-choose-currency='true'
                :currency='activeCurrency'
                :fund-assets-list='fundAssetsList'
                :label="$t('fundInfo.youPay')"
                :readonly='true'
                @open='openCurrencyExplain'
                @touchCurrency='touchCurrency'
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
                            {{ mul(activeAssets.purchaseFeeProportion, 100) }}%
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
                v-model='amountPay'
                :can-choose-currency='false'
                :currency='fund.shareTokenCode'
                :digits='fund.shareTokenDigits || 0'
                :label="$t('fundInfo.wantGet')"
                :placeholder="$t('fundInfo.inputCount')"
                :readonly='false'
                @input='inputAmount'
            />
        </div>

        <div class='pay-wrap'>
            <p class='title'>
                {{ $t('fundInfo.needAssets') }}
            </p>
            <div class='header'>
                <span>{{ $t('fundInfo.assets') }}</span>
                <span>{{ $t('fundInfo.payCount') }}</span>
            </div>
            <van-loading
                v-if='calcLoading'
                class='loading-block'
                :color='$style.primary'
                size='24'
            />
            <ul class='content'>
                <li v-for='item in lastAssetsPay' :key='item.currencyCode'>
                    <div class='flex'>
                        <div class='c-left'>
                            <currencyIcon
                                :currency='item.currency'
                                size='18'
                            />
                            <span class='currency-text'>
                                {{ item.currency }}
                            </span>
                        </div>
                        <div class='c-right'>
                            <div class='cr-inline'>
                                <span>{{ item.amountPay }}</span>
                            </div>
                            <div v-if='item.isShow' class='cr-icon'>
                                <van-icon
                                    v-if='item.depositAmount > 0'
                                    :color='$style.primary'
                                    name='add'
                                    size='20'
                                    @click='openAddAssets(item)'
                                />
                                <van-icon
                                    v-else
                                    :color='$style.placeholdColor'
                                    name='checked'
                                    size='20'
                                />
                            </div>
                        </div>
                    </div>
                    <p v-if='item.isShow && item.depositAmount > 0' class='error-text'>
                        * {{ $t('fundInfo.availableNot') }}{{ item.depositAmount }}
                    </p>
                </li>
            </ul>
            <div class='notice'>
                {{ $t('fundInfo.applyCalculateTip') }}
                <!-- <router-link class='toRule' href='javascript:;' to='/fundRules?direction=buy'>
                    {{ $t('fundInfo.viewRule') }}
                </router-link> -->
                <!-- <router-link class='toRule' href='javascript:;' to='/fundRules?direction=buy'>
                    {{ $t('fundInfo.viewRule') }}
                </router-link> -->
                <span class='toRule' @click='goFundRulesPage'>
                    {{ $t('fundInfo.viewRule') }}
                </span>
            </div>
        </div>
    </div>

    <div class='footerBtn'>
        <van-button block :disabled='loading || fund?.canPurchase!==1' size='normal' @click='submitHandler'>
            {{ fund?.canPurchase === 1 ? $t('fundInfo.buy'): $t('fundInfo.disabledBuy') }}
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
    <!-- 添加资产弹窗 -->
    <AddAssets
        v-model:show='addAssetShow'
        :currency='addAssetsCurrency'
        :fund='fund'
    />
    <!-- 资产说明弹窗 -->
    <CurrencyExplainDialog
        v-model:show='currencyExplainShow'
        :currency='activeCurrency'
        :fund='fund'
        :fund-assets-list='fundAssetsList'
        :list='selectActions'
    />
</template>

<script setup>
import loadingVue from '@/components/loading.vue'
import CurrencyIcon from '@/components/currencyIcon.vue'
import TradeAssetBar from './components/tradeAssetBar.vue'
import SelectAssetsDialog from './components/selectAssetsDialog.vue'
import AddAssets from './components/addAssets.vue'
import CurrencyExplainDialog from './components/currencyExplainDialog.vue'
import { orderHook } from './orderHook'
import { ref, unref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toast, Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
import { isEmpty } from '@/utils/util'
import { mul } from '@/utils/calculation'
const { t } = useI18n({ useScope: 'global' })
const route = useRoute()
const router = useRouter()
const { fundId } = route.query

const {
    fund,
    fundAssetsList,
    lastAssetsPay,
    loading,
    queryFundNetValue,
    calcApplyShares,
    submitFundApply,
    activeCurrency,
    activeAssets,
    selectShow,
    selectActions,
    onSelect,
    calcLoading
} = orderHook()

// 输入的基金份额
const amountPay = ref('')
// 是否显示新增资产弹窗
const addAssetShow = ref(false)
// 新增资产的货币
const addAssetsCurrency = ref('')
// 是否显示资产说明弹窗
const currencyExplainShow = ref(false)

// 输入数量
const inputAmount = () => {
    queryFundNetValue()
    calcApplyShares(amountPay.value)
}
// 显示选择资产弹窗
const touchCurrency = () => {
    selectShow.value = true
}
// 选择资产
const selectAssets = (item) => {
    onSelect(item)
    queryFundNetValue()
    calcApplyShares(amountPay.value)
}
// 显示添加资产弹窗
const openAddAssets = (item) => {
    addAssetShow.value = true
    addAssetsCurrency.value = item.currency
}
// 显示资产说明弹窗
const openCurrencyExplain = () => {
    currencyExplainShow.value = true
}
// 点击切换赎回
const switchWay = () => {
    router.replace({
        name: 'FundRedeem',
        query: { direction: 'sell', fundId }
    })
}

// 提交申购
const submitHandler = () => {
    // 验证参数
    if (isEmpty(amountPay.value)) {
        return Toast(t('fundInfo.subScriptePlaceholder'))
    }
    if (Number(amountPay.value) < Number(activeAssets.value.minPurchaseNum)) {
        return Toast(t('fundInfo.applyMinTip') + activeAssets.value.minPurchaseNum)
    }
    let assetsTip = ''
    lastAssetsPay.value.map(elem => {
        if (elem.depositAmount > 0) assetsTip += elem.currency + '、'
    })
    if (assetsTip) {
        assetsTip = assetsTip.substring(0, assetsTip.length - 1)
        assetsTip = assetsTip + ' \n' + t('fundInfo.applyNotTip')
        return Toast(assetsTip)
    }
    // 提交申购
    submitFundApply({
        fundId: parseInt(fundId),
        amountPay: unref(amountPay),
        currencyPay: unref(activeCurrency),
        applyType: 2
    }).then(res => {
        if (res.check()) {
            amountPay.value = ''
            queryFundNetValue()
            calcApplyShares()
            Dialog.confirm({
                title: t('fundInfo.applySuccessed'),
                confirmButtonText: t('fundInfo.records'),
                cancelButtonText: t('fundInfo.iknow')
            })
                .then(() => {
                    router.push({
                        path: '/fundRecord',
                        query: {
                            direction: 'buy'
                        }
                    })
                })
                .catch(() => {
                    // on cancel
                })
        }
    })
}

const goFundRulesPage = () => {
    router.push({
        path: '/fundRules',
        query: {
            direction: 'buy',
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
    position: relative;
    margin: rem(30px) 0;
    padding: rem(30px) 0;
    background: var(--contentColor);
    .loading-block {
        position: absolute;
        top: 50%;
        left: 50%;
    }
    .title {
        font-weight: bold;
        font-size: rem(30px);
        text-align: center;
    }
    .header {
        display: flex;
        justify-content: space-between;
        margin: rem(30px) 0;
        padding: 0 rem(40px);
    }
    .content {
        margin: rem(30px);
        border-bottom: solid 1px var(--lineColor);
        li {
            margin-bottom: rem(40px);
            .flex {
                display: flex;
                align-items: center;
                justify-content: space-between;
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
                        margin-top: rem(-16px);
                        margin-left: rem(20px);
                    }
                    .cr-inline {
                        display: inline-block;
                    }
                }
            }
            .error-text {
                margin-top: rem(10px);
                color: var(--warn);
                text-align: right;
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
</style>
