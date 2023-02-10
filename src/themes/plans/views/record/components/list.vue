<template>
    <div v-if='context.slots.filter' class='filterWrap'>
        <slot name='filter'></slot>
    </div>
    <div class='scrollBody'>
        <van-pull-refresh
            v-model='state.refreshing'
            v-bind='$attrs'
            class='list'
            :loading-text="$t('compLang.loading')"
            :loosing-text="$t('compLang.vanPullRefresh.loosing')"
            :pulling-text="$t('compLang.vanPullRefresh.pulling')"
            @refresh='onRefresh'
        >
            <van-list
                v-if='state.list.length > 0'
                v-model:loading='state.loading'
                :finished='state.finished'
                :finished-text='$t("historyList.noMore")'
                :loading-text="$t('compLang.loading')"
                @load='onLoad'
            >
                <slot :list='state.list'></slot>
            </van-list>

            <van-empty v-else :description='$t("common.noData")' image='/images/empty.png' />
        </van-pull-refresh>
    </div>
</template>

<script>
import { reactive, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
    emits: ['queryData'],
    props: {
        liabilitiesType: {
            type: [Number, String],
            require: true,
            default: '',
        },
        requestApi: {
            type: Function,
            default: null
        },
        requestParams: {
            type: Object,
            default: () => ({})
        }
    },
    setup (props, context) {
        const route = useRoute()

        const state = reactive({
            list: [],
            loading: false,
            finished: false,
            current: 1,
            refreshing: false,
            tradeType: route.query.tradeType
        })

        const getList = () => {
            const params = {
                ...props.requestParams,
                tradeType: state.tradeType,
                current: state.current,
                size: 20
            }

            return props.requestApi(params)
                .then(res => {
                    if (res.code === '0' && Array.isArray(res?.data?.records)) {
                        return [res.data.records, res.data.total]
                    }
                    return []
                })
        }

        const onLoad = () => {
            getList()
                .then(([data = [], total = 0]) => {
                    if (state.refreshing) {
                        state.list = []
                        state.refreshing = false
                    }
                    state.list.push(...data)
                    state.loading = false
                    state.current++
                    if (!data.length || total <= state.list.length) {
                        state.finished = true
                    } else {
                        state.finished = false
                    }
                })
        }

        const onRefresh = () => {
            state.refreshing = true
            state.current = 1
            onLoad()
        }

        const refresh = () => {
            nextTick(() => {
                state.refreshing = true
                onRefresh()
            })
        }

        onMounted(() => {
            onLoad()
        })

        return {
            state,
            onLoad,
            onRefresh,
            context,
            refresh
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.filterWrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    margin-bottom: rem(20px);
    :deep(.van-dropdown-menu) {
        .van-ellipsis {
            font-size: rem(20px);
        }
    }
    :deep(.van-dropdown-item) {
        .van-cell__title {
            font-size: rem(20px);
        }
    }
}
.scrollBody {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0 rem(20px);
    //overflow-y: auto;
    .list {
        flex: 0 0 auto;
        width: 100%;
        min-height: 100%;
    }
}

</style>
