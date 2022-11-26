<template>
    <div v-loading='!inited' class='news-module'>
        <div
            v-infinite-scroll='loadMore'
            class='news-list'
            :infinite-scroll-distance='50'
            :infinite-scroll-immediate='false'
        >
            <div v-for='item in list' :key='item.id' class='item' @click='openNewsDialog(item)'>
                <div class='item-left'>
                    <p class='title'>
                        {{ item.title }}
                    </p>
                    <p class='row'>
                        <span>{{ item.resource }}</span>
                        <span>{{ item.updatetimeStr }}</span>
                    </p>
                </div>
                <div class='item-right'>
                    <img :src='item.image' />
                </div>
            </div>
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
    <!-- 新闻详情弹窗 -->
    <news-dialog ref='dialog' :data='data' />
</template>

<script>
// components
import newsDialog from './news-dialog.vue'
import { beforeTime } from './util.js'

import { ref, reactive, onMounted, toRefs, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getCookie } from '@/utils/util'
import { newsListByTypeByPage } from '@/api/information'

export default {
    components: {
        newsDialog
    },
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
        moduleId: {
            type: String,
            default: ''
        },
    },
    setup (props) {
        const { t } = useI18n({ useScope: 'global' })
        const dialog = ref(null)
        console.log(props.data)
        const orgid = computed(() => props.data.orgid || 1)
        const newsArea = computed(() => props.data.newsArea)
        const state = reactive({
            lang: getCookie('lang') || 'zh-CN',
            page: 1,
            type: 7,
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
                orgid: orgid?.value || 1
            }
            newsListByTypeByPage(params, state.lang, newsArea.value).then(res => {
                res.data.map(elem => {
                    elem.updatetimeStr = beforeTime(elem.updatetime * 1000, t)
                })
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

        // 打开新闻详情弹窗
        const openNewsDialog = (item) => {
            dialog.value.open(item)
        }

        onMounted(() => {
            // 获取新闻列表
            getNewsLilst()
        })

        return {
            ...toRefs(state),
            getNewsLilst,
            changePage,
            loadMore,
            openNewsDialog,
            dialog
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.news-list {
    @include scroll-pc();
    height: 600px;
    overflow-y: auto;
    .item {
        display: flex;
        height: 120px;
        margin-bottom: 40px;
        cursor: pointer;
        &:last-of-type {
            margin-bottom: 0;
        }
        .item-left {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 332px;
            height: 100%;
            margin-right: 25px;
            .title {
                @include ellipsisLn(3);
                color: var(--color);
                font-size: 16px;
                line-height: 22px;
            }
            .row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: var(--minorColor);
                font-size: 14px;
            }
        }
        .item-right {
            width: 200px;
            height: 120px;
            img {
                display: block;
                width: 200px;
                height: 120px;
            }
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
