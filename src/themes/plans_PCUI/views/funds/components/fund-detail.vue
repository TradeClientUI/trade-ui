<template>
    <div v-if='fund.fundId' class='fund-detail'>
        <div class='fund-switch'>
            <a :class="['item', { 'disable': fundIndex === 0 }]" href='javascript:;' @click='switchPrev'>
                {{ $t('compLang.lastBox') }}
            </a>
            <a :class="['item', { 'disable': fundIndex === fundProductList.length - 1 }]" href='javascript:;' @click='switchNext'>
                {{ $t('compLang.nextBox') }}
            </a>
        </div>
        <div class='fund-block'>
            <div class='fund-left'>
                <!-- 基金信息 -->
                <fund-info :fund='fund' />
            </div>
            <div class='fund-right'>
                <fund-deal :fund='fund' />
            </div>
        </div>
        <!-- 市场表现 -->
        <div class='fund-chart'>
            <performance />
        </div>
        <!-- 投资组件 -->
        <div class='fund-chart'>
            <realtimeInvestCompose :rotate='0' :show-bottom-tip='false' :show-switch='false' />
        </div>
        <!-- 基金pdf -->
        <div class='fund-pdf'>
            <div class='fund-row'>
                <div class='col'>
                    <span>{{ $t('fundInfo.fundName') }}</span>
                    <strong>{{ fund.fundName }}</strong>
                </div>
                <div class='col'>
                    <span>{{ $t('fundInfo.shareCurrency') }}</span>
                    <div class='box'>
                        <currency-icon class='currency' :currency='fund.shareTokenCode' size='23px' />
                        <strong>{{ fund.shareTokenCode }}</strong>
                    </div>
                </div>
                <div v-if='fund.managerName' class='col'>
                    <span>{{ $t('fundInfo.fundManager') }}</span>
                    <strong>{{ fund.managerName }}</strong>
                </div>
                <div v-if='fund.trackProduct || fund.trackIndexOut' class='col'>
                    <span>{{ $t('fundInfo.followIndex') }}</span>
                    <strong>{{ (fund.trackProduct ? fund.trackProduct.symbolName : fund.trackIndexOut) }}</strong>
                </div>
                <div class='col'>
                    <span>{{ $t('fundInfo.operationMode') }}</span>
                    <strong>
                        {{ fund.operationMode === 1 ? $t('fundInfo.operationModeValue1') : $t('fundInfo.operationModeValue2') }}
                    </strong>
                </div>
                <div v-if='fund.fundType' class='col'>
                    <span>{{ $t('fundInfo.fundType') }}</span>
                    <strong>{{ fund.fundType }}</strong>
                </div>
                <div class='col'>
                    <span>{{ $t('fundInfo.latestPart') }}</span>
                    <strong>{{ calculate(fund.newShare) }}</strong>
                </div>
            </div>
            <div class='btnBox'>
                <button class='btn' @click="openPDF('https://vitatoken.io/site/V10_Index_Fund_WhitePaper.pdf')">
                    {{ $t('home.fundDesc.text3') }}
                </button>
            </div>
        </div>
        <!-- 底部提示 -->
        <bottomTip />
    </div>
</template>

<script setup>
import { ref, computed, watchEffect, provide, inject } from 'vue'
import { useStore } from 'vuex'
import { useFund } from '../hooks.js'
import { toFixed } from '@/utils/calculation.js'
import fundInfo from './fund-info.vue'
import fundDeal from './fund-deal.vue'
import currencyIcon from '@/components/currencyIcon.vue'
import performance from '@planspc/components/fundInformation/performance.vue'
import realtimeInvestCompose from '@planspc/components/fundInformation/realtimeInvestCompose.vue'
import bottomTip from '@planspc/components/fundInformation/bottomTip.vue'

const store = useStore()
const fundId = inject('fundId')
const selectFund = inject('selectFund')
// 基金产品列表
const { fundProductList } = useFund()
// 基金产品信息
const fund = computed(() => store.state._quote.fundInfo)
// 当前基金产品索引
const fundIndex = ref('')

provide('fundId', fundId.value)

// 监听基金id
watchEffect(() => {
    const result = fundProductList.value.find(el => el.fundId === fundId.value)
    const index = fundProductList.value.findIndex(el => el.fundId === fundId.value)
    store.commit('_quote/Update_fundProduct', { ...result })
    fundIndex.value = index
})

// 切换上一个
const switchPrev = () => {
    if (fundIndex.value === 0) return
    const index = fundIndex.value - 1
    const fundId = fundProductList.value[index].fundId
    selectFund(fundId)
}

// 切换下一个
const switchNext = () => {
    if (fundIndex.value === fundProductList.value.length - 1) return
    const index = fundIndex.value + 1
    const fundId = fundProductList.value[index].fundId
    selectFund(fundId)
}

// 打开pdf
const openPDF = url => {
    window.open(url)
}

// 计算显示的数值
const calculate = (num) => {
    let result = ''
    if (num >= 1000 && num < 1000000) {
        num = toFixed((num / 1000))
        result = num + 'K'
    } else if (num >= 1000000) {
        num = toFixed((num / 1000000))
        result = num + 'M'
    } else {
        result = num
    }
    return result
}
</script>

<style lang='scss' scoped>
.fund-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 32px 0 64px;
}
.fund-switch {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .item {
        font-size: 14px;
        color: var(--primary);
        &.disable {
            color: var(--minorColor);
            cursor: default;
        }
    }
}
.fund-block {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}
.fund-left {
    width: 360px;
    margin-right: 32px;
}
.fund-right {
    width: 392px;
}
.fund-chart {
    &:deep {
        .block {
            margin-top: 30px;
            padding: 30px;
            background: var(--contentColor);
            box-shadow: 3px 3px 20px rgb(0 0 0 / 9%);
        }
        .title {
            margin-top: 0;
            padding-top: 0;
            font-size: 28px;
        }
    }
}
.fund-pdf {
    margin-top: 30px;
    .fund-row {
        display: flex;
        flex-wrap: wrap;
        .col {
            display: inline-flex;
            flex-direction: column;
            padding: 0 32px;
            margin-bottom: 15px;
            .box {
                display: inline-flex;
                align-items: center;
                .currency {
                    margin-right: 5px;
                }
            }
            span {
                font-size: 14px;
                font-weight: 300;
                color: var(--normalColor);
                letter-spacing: 1px;
                margin-bottom: 5px;
            }
            strong {
                font-size: 28px;
                font-weight: 700;
                color: var(--mainColor);
            }
        }
    }
    .btnBox{
        display: flex;
        padding-left: 32px;
        margin-top: 10px;
        .btn{
            width: 200px;
            height: 40px;
            padding: 0 15px;
            font-size: 14px;
            color: #fff;
            background-color: var(--primary);
            border-radius: 4px;
            cursor: pointer;
            @include hover();
        }
    }
}
</style>
