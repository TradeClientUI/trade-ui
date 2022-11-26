<template>
    <section class='supplyInfoText'>
        <div class='infoItem'>
            <p class='title'>
                Minimum {{ to.symbol }} Received
            </p>
            <p class='value'>
                {{ formatAmount(swapQuoteInfo.minimumReceived, 5) }} {{ to.symbol }}
            </p>
        </div>
        <div class='infoItem'>
            <p class='title'>
                Network Fee
            </p>
            <p class='value'>
                {{ formatAmount(fee, 5) }} {{ networkConfigs[$store.state._web3.chainId].baseAssetSymbol }}
            </p>
        </div>
        <div class='infoItem'>
            <p class='title'>
                Slippage Tolerance
            </p>
            <p class='value'>
                3%
            </p>
        </div>
        <div class='infoItem'>
            <p class='title'>
                Offered From
            </p>
            <p v-for='(item,i) in sources' :key='i' class='value'>
                {{ item.name }}
            </p>
        </div>
    </section>
</template>

<script setup>
import networkConfigs from '@/plugins/web3/config/networkConfigs'
import { pow, formatAmount } from '@/utils/calculation'
import BigNumber from 'bignumber.js'
import { computed } from 'vue'

const props = defineProps(['swapQuoteInfo', 'from', 'to', 'count'])

// 手续费
const fee = computed(() => {
    if (!props.swapQuoteInfo) return ''
    return BigNumber(props.swapQuoteInfo.gas).times(props.swapQuoteInfo.gasPrice)
        .div(pow(10, 18))
        .toString()
})

const sources = computed(() => {
    return props.swapQuoteInfo.sources.filter(el => el.proportion > 0)
})

</script>

<style lang="scss" scoped>
.supplyInfoText {
    margin-top: 20px;
    .infoItem {
        margin-bottom: 20px;
        .title {
            font-size: 14px;
        }
        .value {
            font-weight: 700;
            font-size: 20px;
        }
    }
}
</style>
