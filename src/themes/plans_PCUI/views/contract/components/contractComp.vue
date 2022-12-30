<template>
    <div class='contractWrapper'>
        <top :sub-title='product.symbolCode' :title='product.symbolName'>
            <template #left>
                <a class='topBack' href='javascript:;' style='padding-left:0' @click='$router.back()'>
                    <span class='icon_icon_close_big'></span>
                </a>
            </template>
        </top>
        <div class='container'>
            <van-cell :title='$t("contract.symbolCode")' :value='product.symbolCode' />
            <van-cell :title='$t("contract.contractSize")' :value='product.contractSize' />
            <van-cell :title="$t('contract.profitCurrency')" :value='product.profitCurrency' />
            <van-cell :title="$t('contract.spread')" :value="$t('contract.float')" />
            <van-cell :title="$t('contract.singleNumbers')" :value='product.minVolume+"-"+product.maxVolume' />
            <van-cell :title="$t('contract.limitDistance')" :value='product.priceMinLimit+"/"+product.priceMaxLimit + $t("contract.point")' />
            <van-cell v-if='product.marginInfo?.type==="1" && usedMarginSet && usedMarginSet.length' class='yfk' :title="$t('contract.advance')">
                <div class='margin-info'>
                    <span class='left-label header'>
                        {{ $t('contract.volumeRange') }}
                    </span>
                    <span class='right-val header'>
                        {{ $t('contract.margins') }}
                    </span>
                </div>
                <div v-for='(item, index) in usedMarginSet' :key='index' class='margin-info'>
                    <span class='left-label'>
                        {{ item.rangeLeftVolume }} &lt; {{ $t('contract.volumes') }} &le; {{ item.rangeRightVolume }}
                    </span>
                    <span class='right-val'>
                        {{ item.percent * 100 }}%
                    </span>
                </div>
                <div class='margin-info'>
                    <span class='left-label'>
                        {{ $t('contract.volumes') }} &gt; {{ usedMarginSet[usedMarginSet.length-1].rangeRightVolume }}
                    </span>
                    <span class='right-val'>
                        {{ usedMarginSet[usedMarginSet.length-1].percent * 100 }}%
                    </span>
                </div>
            </van-cell>
            <van-cell :title="$t('contract.feeType')" :value='["1","3"].includes(product.feeFormula)?$t("contract.ratio"):$t("contract.amount")' />
            <van-cell :title="$t('fee')" :value='fee' />
            <van-cell>
                <div class='margin-info'>
                    <span class='left-label'>
                        {{ $t('contract.interest') }}
                        <van-icon class='questionIcon' name='question-o' @click='showInterest = true' />
                    </span>
                    <span class='right-val'>
                        {{ interest }}
                    </span>
                </div>
            </van-cell>
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
            <van-cell v-if='expireTime && product.endTime' :title='$t("contract.expireTime")' :value='expireTime' />
        </div>
    </div>

    <!-- 隔夜利息 -->
    <van-dialog v-model:show='showInterest' :confirm-button-text="$t('common.sure')" title=''>
        <div class='question-tip'>
            <p>{{ $t('contract.interestTip') }}</p>
        </div>
    </van-dialog>
</template>

<script>
import top from '@planspc/layout/centerViewTop'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isEmpty, objArraySort } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { mul } from '@/utils/calculation'
import { sortTimeList, timeListFormat, timeListSort } from '../contractUtil'
import BigNumber from 'bignumber.js'
export default {
    components: {
        top,
    },
    setup () {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const utcOffset = parseFloat(sessionStorage.getItem('utcOffset')) || window.dayjs().utcOffset()
        const symbolId = route.query.symbolId
        const tradeType = route.query.tradeType
        const product = computed(() => store.state._quote.productMap[`${symbolId}_${tradeType}`])
        if (product.value) store.dispatch('_quote/querySymbolInfo', { symbolId, tradeType, forceQuery: true })
        else router.replace('/')
        const showInterest = ref(false)
        const usedMarginSet = computed(() => {
            if (product.value.marginInfo?.type === '1' && !isEmpty(product.value.usedMarginSet)) {
                const contractSize = product.value.contractSize
                return objArraySort(product.value.usedMarginSet, 'rangeLeft').map(el => {
                    el.rangeLeftVolume = BigNumber(el.rangeLeft).div(contractSize).toNumber()
                    el.rangeRightVolume = BigNumber(el.rangeRight).div(contractSize).toNumber()
                    return el
                })
            }
            return []
        })
        // 交易时间
        const tradeTimeList = computed(() => {
            if (!isEmpty(product.value.tradeTimeList)) {
                const newTimeList = sortTimeList(product.value.tradeTimeList, utcOffset)
                timeListFormat(newTimeList)
                const timeStrList = JSON.parse(JSON.stringify(newTimeList))
                timeStrList.forEach((el, i) => {
                    timeStrList[i] = timeListSort(el)
                })
                return timeStrList
            }
            return []
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

        // 年利率
        const interest = computed(() => {
            return mul(product.value.buyInterest, 100) + '%/' + mul(product.value.sellInterest, 100) + '%(' + t('contract.interestRate') + ')'
        })
        // 手续费
        const fee = computed(() => {
            return ['1', '3'].includes(product.value.feeFormula) ? mul(product.value.feeRate, 100) + '%' : product.value.fee
        })
        // 手续费
        const expireTime = computed(() => {
            if (product.value.endTime === 9999999999999) return null
            return window.dayjs(product.value.endTime).format('YYYY-MM-DD HH:mm:ss')
        })

        return {
            product,
            tradeTimeList,
            eodTime,
            interest,
            fee,
            expireTime,
            usedMarginSet,
            showInterest
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.contractWrapper{
    height: 100%;
    overflow: auto;
    scrollbar-width:thin;
}
.container {
    flex: 1;
    padding-top: rem(100px);
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
                color: var(--normalColor);
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
        cursor: pointer;
    }
}
.question-tip {
    padding: rem(30px);
    font-size: rem(26px);
    p {
        line-height: 1.6;
        margin-top: rem(10px);
    }
}
</style>
