<template>
    <div v-loading='!inited' class='seven-module'>
        <div
            v-infinite-scroll='loadMore'
            class='seven-list'
            :infinite-scroll-distance='50'
            :infinite-scroll-immediate='false'
        >
            <p class='today'>
                {{ today }}
            </p>
            <el-timeline>
                <el-timeline-item
                    v-for='item in list'
                    :key='item.id'
                    :timestamp='item.title'
                >
                    {{ item.addtime_text.slice(11, 16) }}
                </el-timeline-item>
            </el-timeline>
        </div>
        <!-- <div class='pagination-case'>
            <el-pagination layout='prev, pager, next' :total='total' @current-change='changePage' />
        </div> -->
        <!-- <div v-if="loading !== 'noMore'" class='load-more'>
            <a href='javascript:;' @click='getNewsLilst'>
                <span>{{ $t('loadMore') }}</span>
                <i class='el-icon-arrow-down'></i>
            </a>
        </div> -->
    </div>
</template>

<script>
import { reactive, onMounted, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { getCookie } from '@/utils/util'
import { newsListByTypeByPage } from '@/api/information'

export default {
    props: {
        data: {
            type: Object,
            default: function () {
                return {
                    href: '',
                    src: '',
                    target: '',
                }
            }
        },
    },
    setup (props) {
        const store = useStore()
        const wpCompanyInfo = computed(() => store.state._base.wpCompanyInfo)
        const today = window.dayjs().format('YYYY-MM-DD')
        const state = reactive({
            today,
            lang: getCookie('lang') || 'zh-CN',
            page: 1,
            type: 8,
            size: 10,
            list: [],
            total: 0,
            loading: 'more',
            inited: false
        })

        // 获取新闻列表
        const getNewsLilst = () => {
            if (state.loading !== 'more') return
            state.loading = 'loading'
            const params = {
                type: state.type,
                page: state.page,
                pageSize: state.size,
                orgid: props.data.orgid || 1
            }
            newsListByTypeByPage(params, state.lang, props.data.newsArea).then(res => {
                state.inited = true
                state.list = state.page === 1 ? res.data : state.list.concat(res.data)
                state.total = res.total
                state.page += 1
                state.loading = state.list.length === state.total ? 'noMore' : 'more'
            })
        }

        // 改变当前分页
        const changePage = (value) => {
            state.page = value
            getNewsLilst()
        }

        // 加载更多
        const loadMore = () => {
            getNewsLilst()
        }

        onMounted(() => {
            // 获取新闻列表
            getNewsLilst()
        })

        return {
            ...toRefs(state),
            getNewsLilst,
            changePage,
            loadMore
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.seven-list {
    @include scroll-pc();
    height: 600px;
    padding-right: 20px;
    overflow-y: auto;
    .today {
        margin-bottom: 30px;
        color: var(--minorColor);
        font-size: 14px;
    }
}
:deep(.el-timeline) {
    .el-timeline-item {
        .el-timeline-item__node {
            left: 1px;
            width: 8px;
            height: 8px;
            background: var(--placeholdColor);
        }
        .el-timeline-item__tail {
            border-left: 1px solid var(--lineColor);
        }
        .el-timeline-item__content {
            color: var(--minorColor);
            font-size: 14px;
        }
        .el-timeline-item__timestamp {
            color: var(--color);
            font-size: 16px;
            line-height: 22px;
        }
    }
}
.pagination-case {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 50px;
    font-size: 14px;
}
.load-more {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    cursor: pointer;
    a {
        display: inline-flex;
        align-items: center;
        height: 100%;
        color: var(--minorColor);
    }
    span {
        margin-right: 2px;
        font-size: 14px;
    }
}
</style>
