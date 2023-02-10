<template>
    <router-view />

    <div class='assets'>
        <div class='assets-content'>
            <div class='assets-side'>
                <h2 class='title'>
                    {{ $t('trade.accountAssets') }}
                </h2>
                <div class='plans-list'>
                    <ul>
                        <li
                            v-for='item in plansList'
                            :key='item.tradeType'
                            :class="{ 'active': Number(item.tradeType) === tradeType }"
                            @click='switchTradeType(Number(item.tradeType))'
                        >
                            <i v-if='Number(item.tradeType) === 5' class='icon_xianhuojiaoyizhanghu'></i>
                            <i v-if='Number(item.tradeType) === 3' class='icon_gangganjiaoyizhanghu'></i>
                            <i v-if='Number(item.tradeType) === 1' class='icon_heyuequancangzhanghu'></i>
                            <i v-if='Number(item.tradeType) === 2' class='icon_heyuezhucangzhanghu'></i>
                            <span>{{ $t('tradeType.' + item.tradeType) }}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 全仓合约 -->
            <contract-all
                v-if='tradeType === 1'
                :trade-type='tradeType'
            />
            <!-- 逐仓合约 -->
            <contract-by
                v-if='tradeType === 2'
                :trade-type='tradeType'
            />
            <!-- 现货杠杆 -->
            <cash-lever
                v-if='tradeType === 3'
                :trade-type='tradeType'
            />
            <!-- 现货撮合 -->
            <cash-wallet
                v-if='tradeType === 5'
                :trade-type='tradeType'
            />
        </div>
    </div>
</template>

<script>
// components
import cashWallet from './components/cash-wallet.vue'
import cashLever from './components/cash-lever.vue'
import contractAll from './components/contract-all.vue'
import contractBy from './components/contract-by.vue'

import { unref, reactive, toRefs, computed, onMounted, onUnmounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { QuoteSocket, MsgSocket } from '@/plugins/socket/socket'

export default {
    name: 'Assets',
    components: {
        cashWallet,
        cashLever,
        contractAll,
        contractBy
    },
    setup () {
        const state = reactive({
            // 玩法类型
            tradeType: ''
        })
        const store = useStore()
        // 玩法列表
        const plansList = unref(computed(() => store.state._base.plans))
        // 是否显示全仓玩法真实模拟净值
        const showFullNetAsset = computed(() => store.getters.showFullNetAsset)
        // 设置默认玩法
        state.tradeType = Number(plansList[0].tradeType)

        // 初始化数据
        const initData = () => {
            const val = state.tradeType
            if ([1, 2].includes(val)) {
                queryPositionList(val)
            } else if ([3, 5, 9].includes(val)) {
                store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: val })
            }
            // 订阅资产数据
            MsgSocket.subscribeAsset(state.tradeType)
        }

        // 获取持仓列表数据
        const queryPositionList = () => {
            store.dispatch('_trade/queryPositionPage', {
                tradeType: state.tradeType,
                sortFieldName: 'openTime',
                sortType: 'desc'
            }).then(res => {
                const productKeys = []
                const { data } = res
                if (data) {
                    data.map(elem => {
                        productKeys.push(elem.symbolId + '_' + elem.tradeType)
                    })
                }
                // 订阅行情数据
                QuoteSocket.send_subscribe(productKeys)
            })
        }

        // 切换玩法
        const switchTradeType = (type) => {
            if (state.tradeType !== type) {
                state.tradeType = type
                initData()
            }
        }

        onMounted(() => {
            // 拉取用户信息
            store.dispatch('_user/findCustomerInfo', false).then(() => {
                // 初始化数据
                initData()
            })
        })

        onBeforeUnmount(() => {
            // 取消订阅
            QuoteSocket.cancel_subscribe()
            if (!showFullNetAsset.value) {
                MsgSocket.cancelSubscribeAsset()
            }
        })

        return {
            ...toRefs(state),
            plansList,
            switchTradeType
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.assets {
    padding: 8px;
    background: var(--bgColor);
}
.assets-content {
    display: flex;
    min-width: 1200px;
    min-height: 820px;
}
.assets-side {
    flex-shrink: 0;
    width: 216px;
    margin-right: 16px;
    background: var(--contentColor);
    border-radius: 10px;
    .title {
        @include font();
        padding: 30px;
        color: var(--color);
        font-weight: bold;
        font-size: 30px;
        line-height: 1;
    }
    .plans-list {
        padding: 0 20px;
        li {
            @include hover();
            display: flex;
            align-items: center;
            height: 56px;
            margin-bottom: 10px;
            color: var(--color);
            font-size: 14px;
            background: var(--contentColor);
            border-radius: 10px;
            cursor: pointer;
            i {
                margin-right: 18px;
                margin-left: 20px;
                font-size: 18px;
            }
            &:hover {
                color: var(--primary);
            }
        }
        .active {
            color: #FFF;
            background: var(--primary);
            i {
                color: #FFF;
            }
            span {
                color: #FFF;
            }
        }
    }
}
</style>
