<template>
    <div v-if='positionList.length > 0' class='position-wrap'>
        <p v-if='showHeader' class='header'>
            <span>{{ $t('trade.position') }}({{ positionList?.length }})</span>
            <span class='fr' :class="userAccount?.profitLoss > 0 ? 'riseColor': 'fallColor'">
                {{ userAccount?.profitLoss || '--' }}
            </span>
        </p>
        <van-loading v-if='loading && showHeader' class='loading' />

        <positionItem
            v-for='item in positionList'
            :key='item.positionId'
            :data='item'
            :product='product'
            @showAdjustPopup='showAdjustPopup'
            @showClose='showClose'
            @showMultiplePopup='showMultiplePopup'
            @showSLTP='showSLTP'
        />
    </div>
    <div v-else-if='showTradeBtn' class='none-data'>
        <button @click='onTrade'>
            {{ $t('common.startTrade') }}
        </button>
        <p class='tip'>
            {{ $t('trade.positionEmpty') }}
        </p>
    </div>
    <van-empty
        v-else
        :description="$t('trade.positionEmpty')"
        image='/images/empty.png'
    />

    <!-- {{ subscribList }} -->

    <!-- 平仓 -->
    <DialogClosePosition
        v-if='product'
        v-model:show='closeVisible'
        :data='positionData'
        :product='product'
    />
    <!-- 调整保证金 -->
    <DialogAdjustMargin
        v-model:show='adjustVisible'
        :data='positionData'
    />
    <!-- 设置止损止盈 -->
    <DialogSLTP
        v-if='product && showSetProfit'
        :data='positionData'
        :product='product'
        :show='showSetProfit'
        @update:show='updateSLTPVisible'
    />
    <!-- 设置止损止盈 -->
    <MultipleSet
        v-if="product && product.tradeType===2 && product.marginInfo && product.marginInfo.type!=='1'"
        v-model='multipleSetVisible'
        v-model:multipleVal='mVal'
        :position='positionData'
        :product='product'
        @save='saveMultiple'
    />
    <MultipleSetCross
        v-if="product && product.tradeType===1 && product.marginInfo && product.marginInfo.type!=='1'"
        v-model='multipleSetVisible'
        v-model:multipleVal='mVal'
        :position='positionData'
        :product='product'
        @save='saveMultiple'
    />
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import positionItem from './positionItem'
import DialogClosePosition from '@plans/components/dialogClosePosition'
import DialogAdjustMargin from '@plans/components/dialogAdjustMargin'
import DialogSLTP from '@plans/components/dialogSLTP'
import MultipleSet from '@plans/components/multipleSet'
import MultipleSetCross from '@plans/components/multipleSetCross'
export default {
    components: {
        positionItem,
        MultipleSet,
        MultipleSetCross,
        DialogClosePosition,
        DialogAdjustMargin,
        DialogSLTP
    },
    props: {
        // 是否显示头部标题
        showHeader: {
            type: Boolean,
            default: true
        },
        // 是否显示交易按钮
        showTradeBtn: {
            type: Boolean,
            default: true
        }
    },
    setup (props, { emit }) {
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            closeVisible: false,
            adjustVisible: false,
            multipleSetVisible: false,
            mVal: '',
            positionData: null,
            showSetProfit: false
        })

        // 获取玩法列表
        const plans = computed(() => store.state._base.plans)
        const tradeType = computed(() => store.state._quote.curTradeType || plans.value[0].id)

        const positionList = computed(() => store.state._trade.positionList[Number(tradeType.value)] ?? [])

        const userAccount = computed(() => store.state._user.accountAssets[tradeType.value])

        const loading = computed(() => store.state._trade.positionLoading)
        const product = computed(() => store.state._quote.productMap[state.positionData?.symbolId + '_' + tradeType.value])

        // 平仓
        const showClose = (data) => {
            store.commit('_quote/Update_productActivedID', data.symbolId + '_' + tradeType.value)
            state.positionData = data
            state.closeVisible = true
            if (!product.value.minVolume) {
                store.dispatch('_quote/querySymbolInfo', {
                    symbolId: data.symbolId,
                    tradeType: tradeType.value
                })
            }
        }

        // 调整保证金
        const showAdjustPopup = (data) => {
            state.positionData = data
            state.adjustVisible = true
        }

        // 设置止盈止损
        const showSLTP = (data) => {
            state.positionData = data
            state.showSetProfit = true
            store.commit('_quote/Update_productActivedID', data.symbolId + '_' + tradeType.value)
        }

        // 设置杠杆倍数
        const showMultiplePopup = (data) => {
            state.positionData = data
            state.multipleSetVisible = true
            state.mVal = data.crossLevelNum
            // store.commit('_quote/Update_productActivedID', data.symbolId + '_' + tradeType.value)
            if (!product.value.minVolume) {
                store.dispatch('_quote/querySymbolInfo', {
                    symbolId: data.symbolId,
                    tradeType: tradeType.value
                })
            }
        }
        // 保存杠杆倍数
        const saveMultiple = (val) => {
            console.log(val)
        }

        const updateSLTPVisible = (val) => {
            state.showSetProfit = val
        }

        // 点击开始交易
        const onTrade = () => {
            store.commit('_quote/setQuoteTradeType', tradeType.value)
            router.push({ path: '/quote' })
        }

        return {
            ...toRefs(state),
            positionList,
            product,
            showAdjustPopup,
            showClose,
            showSLTP,
            showMultiplePopup,
            updateSLTPVisible,
            saveMultiple,
            tradeType,
            loading,
            userAccount,
            onTrade
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.none-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: rem(160px) 0;
    margin-top: rem(20px);
    background: var(--contentColor);
    border-radius: 4px;
    button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: rem(200px);
        height: rem(72px);
        color: #FFF;
        background: var(--primary);
        border-radius: rem(10px);
    }
    .tip {
        margin-top: rem(25px);
        font-size: rem(27px);
        letter-spacing: 1px;
        color: var(--minorColor);
    }
}
.position-wrap {
    background-color: var(--contentColor);
    .header {
        display: flex;
        justify-content: space-between;
        padding: 0 rem(30px);
        color: var(--color);
        font-size: rem(28px);
        line-height: rem(100px);
        border-bottom: solid rem(1px) var(--lineColor);
        .fr {
            font-weight: bold;
            font-size: rem(34px);
        }
    }
}
.loading {
    line-height: rem(100px);
    background: var(--contentColor);
}
.van-empty {
    border-radius: rem(6px);
}
</style>
