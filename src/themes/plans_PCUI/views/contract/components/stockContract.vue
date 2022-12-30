<template>
    <div class='contractWrapper'>
        <Top back left-icon='arrow-left' :right-action='false' show-center :title='product.symbolName'>
            <template #left>
                <a class='topBack' href='javascript:;' @click='$router.back()'>
                    <span class='icon_icon_close_big'></span>
                </a>
            </template>
        </Top>
        <div class='container'>
            <van-cell :title='$t("contract.stockCode")' :value='product.symbolCode' />
            <van-cell :title='$t("contract.volunit")' :value='product.minTradeUnit || "--"' />
            <van-cell :title="$t('contract.profitCurrency')" :value='product.profitCurrency' />
            <van-cell :title="$t('contract.singleOrderLot')" :value='(product.minVolume && product.minVolume ) ? (product.minVolume + "-" + product.maxVolume): "--"' />
            <van-cell :title="$t('contract.limitDistance')" :value='(product.priceMinLimit && product.priceMaxLimit) ? (product.priceMinLimit+"/"+product.priceMaxLimit+ $t("contract.point")) : "--"' />
            <van-cell :title="$t('contract.feeType')" :value='["1","3"].includes(product.feeFormula)?$t("contract.ratio"):$t("contract.amount")' />
            <van-cell :title='["1","3"].includes(product.feeFormula) ? $t("contract.feeRate") : $t("fee")' :value='fee' />
            <van-cell :title="$t('contract.feeItems')" :value="isHK ? $t('contract.hkFeeTip') : $t('contract.usFeeTip')" />
            <van-cell :title="$t('contract.lowFee')" :value='product.minFee + product.profitCurrency' />
            <van-cell :title="$t('contract.zone')" :value="'GMT +' + (0 - new Date().getTimezoneOffset() / 60)" />
            <van-cell v-if='tradeTimeList && tradeTimeList.length' class='timeListCell' :title="$t('contract.tradeTime')">
                <template v-for='(item,index) in tradeTimeList' :key='index'>
                    <div v-if='item.length' class='item-item'>
                        {{ $t('weekdayMap.'+ item[0].dayOfWeek) }}:
                        <span v-for='el in item' :key='el.timeStr' class='timeItem'>
                            {{ el.timeStr }}
                        </span>
                    </div>
                </template>
            </van-cell>
            <van-cell v-if='product.eodTime || product.eodTime===0' :title="$t('contract.eodTime')" :value='eodTime' />
        </div>
    </div>
</template>

<script>
import Top from '@/components/top'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { isEmpty } from '@/utils/util'
import { mul, toFixed } from '@/utils/calculation'
import { sortTimeList, timeListFormat, timeListSort } from '../contractUtil'
import { deepClone } from '@/utils/deepClone'
export default {
    components: {
        Top,
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const utcOffset = parseFloat(sessionStorage.getItem('utcOffset')) || window.dayjs().utcOffset()
        const symbolId = route.query.symbolId
        const tradeType = route.query.tradeType
        const product = computed(() => store.state._quote.productMap[`${symbolId}_${tradeType}`])
        const labels = computed(() => product.value.labels?.toLowerCase().split(',') || [])
        const isHK = computed(() => labels.value.includes('hk-stock'))
        // 交易时间
        const tradeTimeList = computed(() => {
            if (!isEmpty(product.value.tradeTimeList)) {
                const newTimeList = sortTimeList(product.value.tradeTimeList, utcOffset)
                timeListFormat(newTimeList)
                const timeStrList = deepClone(newTimeList)
                timeStrList.forEach((el, i) => {
                    timeStrList[i] = timeListSort(el)
                })
                return timeStrList
            }
            return []
        })
        // 手续费
        const fee = computed(() => {
            return ['1', '3'].includes(product.value.feeFormula) ? mul(product.value.feeRate, 100) + '%' : product.value.fee
        })
        // 结算时间
        const eodTime = computed(() => {
            if (!isEmpty(product.value.eodTime)) {
                return product.value.eodTime.split(',').map(el => {
                    return window.dayjs().utc().startOf('day').utcOffset(utcOffset).add(parseInt(el), 'minute').format('HH:mm')
                }).sort((a, b) => a.replace(/:/, '') - b.replace(/:/, '')).join(', ')
            }
            return ''
        })

        return {
            product,
            tradeTimeList,
            eodTime,
            mul,
            toFixed,
            fee,
            isHK
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.contractWrapper {
    height: 100%;
    display: flex;
    flex-flow: column;
}
.container {
    flex: 1;
    overflow-y: auto;
    background-color: var(--bgColor);
    :deep(.van-cell) {
        .margin-info {
            display: flex;
            justify-content: space-between;
            .left-label {
                display: inline-block;
                margin-right: rem(10px);
                text-align: right;
                &.header {
                    text-align: center;
                }
            }
            .right-val {
                display: inline-block;
                text-align: center;
                &.header {
                    text-align: center;
                }
            }
        }
        .timeItem {
            &:not(:last-of-type) {
                padding-right: 5px;
                &::after {
                    content: ',';
                }
            }
        }
        &.yfk {
            .van-cell__title {
                flex: 1;
            }
            .van-cell__value {
                flex: 2;
            }
        }
    }
    .timeListCell :deep(.van-cell__value) {
        flex: none;
        width: 70%;
    }
    .questionIcon {
        font-size: rem(34px);
        color: var(--nomalColor);
        vertical-align: -2px;
    }
}
.question-tip {
    padding: rem(30px);
    font-size: rem(26px);
    p {
        margin-top: rem(10px);
    }
}
</style>
