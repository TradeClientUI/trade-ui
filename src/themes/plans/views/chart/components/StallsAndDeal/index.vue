<template>
    <div class='stallsAndDeal'>
        <van-tabs
            ref='tabs'
            class='tabs'
            :color='primaryColor'
            line-height='2'
            line-width='33.3%'
            sticky
            :title-active-color='primaryColor'
        >
            <van-tab name='stalls' :title='$t("trade.handicap")'>
                <!-- 盘口报价 -->
                <Handicap
                    :show-pending='showPending'
                    :symbol-id='symbolId'
                />
            </van-tab>
            <van-tab name='deal' :title='$t("trade.deal")'>
                <!-- 实时成交记录 -->
                <DealList :symbol-id='symbolId' />
            </van-tab>
            <van-tab v-if='product.etf' name='fundInfo' :title='$t("fundInfo.information")'>
                <!-- 基金资料 -->
                <!-- <suspense>

                </suspense> -->
                <fundInformation :fund-id='product.fundId' />
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import Handicap from '@plans/modules/handicap/index'
import DealList from '@plans/modules/realTimeDealList/index'
import LoadingComponent from '@/components/loadingComponent'
import { computed, defineAsyncComponent, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import Base from '@/store/modules/base'

export default {
    components: {
        Handicap,
        DealList,
        fundInformation: defineAsyncComponent({
            loader: () => import('@plans/modules/fundInformation'),
            loadingComponent: LoadingComponent,
            delay: 0, // 在显示 loadingComponent 之前的延迟 | 默认值：200（单位 ms）
            suspensible: false
        })
    },
    props: ['symbolId', 'settingList', 'curPrice'],
    setup (props) {
        const route = useRoute()
        const store = useStore()
        const tradeType = route.query.tradeType
        const state = reactive({
            isDealDelaying: false,
            timer: 0,

        })
        const product = computed(() => store.getters.productActived)
        const primaryColor = computed(() => Base.state.wpCompanyInfo.themeColor)
        // 当前产品id 的挂单列表
        const pendingList = computed(() => store.state._trade.pendingList.filter(item => Number(item.symbolId) === Number(props.symbolId)))

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        // 是否显示挂单数量
        const showPending = computed(() => {
            if ([3, 5, 9].includes(Number(tradeType))) {
                return true
            } else {
                return false
            }
        })
        return {
            primaryColor,
            product,
            tradeType,
            customInfo,
            pendingList,
            showPending,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.stallsAndDeal {
    min-width: rem(200px);
    min-height: rem(600px);
    margin-top: rem(10px);
    margin-bottom: rem(30px);
    padding-bottom: rem(90px);
    background: var(--contentColor);
    .tabs {
        display: flex;
        flex-direction: column;
        height: 100%;
        :deep() {
            .van-tab {
                font-size: rem(24px);
                line-height: rem(50px);
                background-color: var(--contentColor);
            }
            .van-tabs__wrap {
                height: rem(80px);
                border-bottom: solid 1px var(--lineColor);
                .van-tab__text {
                    font-weight: bold;
                    font-size: rem(28px);
                }
            }
            .van-tabs__content {
                flex: 1;
                box-sizing: border-box;
                padding-top: rem(10px);
                padding-bottom: rem(20px);
                background: var(--contentColor);
                .van-tab__pane {
                    height: 100%;
                }
            }
        }
    }
    .trust-wrap {
        text-align: center;
        .to-all {
            color: var(--primary);
            line-height: rem(75px);
        }
    }
}
</style>
