<template>
    <div class='publicPage'>
        <div class='search'>
            <div class='search-title'>
                <p> 您好！</p>
                <p>请告诉我们，您需要怎样的帮助？</p>
            </div>
            <div class='form'>
                <input placeholder='搜索' type='input' />
                <button class='btn'>
                    搜索
                </button>
            </div>
            <newNotice v-if='isPC' />
            <newNoticeH5 v-else />
        </div>
        <div class='content'>
            <div
                v-for='(item, index) in list'
                :key='index'
                class='list'
            >
                <h4 class='title'>
                    {{ item.title }}
                </h4>
                <div class='container'>
                    <a
                        v-for='(sitem, sindex) in item.children'
                        :key='sindex'
                    >
                        {{ sitem.title }}
                    </a>
                </div>
                <a class='view-all'>
                    查看全部
                </a>
            </div>
        </div>
        <div v-if='$store.state._base.wpCompanyInfo?.onlineService' class='help'>
            <div class='title'>
                获得进一步帮助
            </div>
            <a class='btn' :href='$store.state._base.wpCompanyInfo?.onlineService' target='_blank'>
                24小时客服
            </a>
        </div>
    </div>
</template>

<script setup>

import { onBeforeMount, computed, reactive, toRefs, onUnmounted, ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import newNotice from '@planspc/views/home/components/new-notice.vue'
import newNoticeH5 from '@plans/views/home/components/new-notice.vue'

const store = useStore()

const isPC = window.isPC

const list = ref([
    {
        title: '常见问题1',
        children: [
            { title: '常见问题1-1' },
            { title: '常见问题1-2' },
            { title: '常见问题1-3' },
            { title: '常见问题1-4' }
        ]
    },
    {
        title: '常见问题2',
        children: [
            { title: '常见问题2-1' },
            { title: '常见问题2-2' },
            { title: '常见问题2-3' },
            { title: '常见问题2-4' }
        ]
    },
    {
        title: '常见问题3',
        children: [
            { title: '常见问题3-1' },
            { title: '常见问题3-2' },
            { title: '常见问题3-3' },
            { title: '常见问题3-4' }
        ]
    },
    {
        title: '常见问题4',
        children: [
            { title: '常见问题4-1' },
            { title: '常见问题4-2' },
            { title: '常见问题4-3' },
            { title: '常见问题4-4' }
        ]
    }
])
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.publicPage {
    background: var(--contentColor);
    margin: 8px;
    padding: 40px;
    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: var(--primary);
        height: 48px;
        color: #FFF;
        font-size: 18px;
        border-radius: 4px;
        text-align: center;
        padding: 0 20px;
        cursor: pointer;
        &:hover {
            opacity: 0.8;
        }
    }
    .search {
        .search-title {
            font-size: 32px;
            color: var(--primary);
        }
        .form {
            margin: 40px 0;
            display: flex;
            max-width: 600px;
            input {
                flex: 1;
                border: 1px solid var(--lineColor);
                border-radius: 4px;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
                padding: 0 15px;
                font-size: 16px;
                &:focus {
                    border-color: var(--primary);
                }
            }
            .btn {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                width: 140px;
            }
        }
        :deep(.new-notice-module) {
            padding: 0;
        }
    }
    .content {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 80px 0;
        .list {
            flex: 1;
        }
        .title {
            font-size: 22px;
            margin: 4px 0 8px;
        }
        .container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            a {
                font-size: 15px;
                cursor: pointer;
                margin: 8px 0;
                color: var(--minorColor);
                &:hover {
                    text-decoration: underline;
                }
            }
        }
        .view-all {
            font-size: 15px;
            color: var(--primary);
            cursor: pointer;
            margin: 8px 0;
            display: inline-flex;
            &:hover {
                text-decoration: underline;
            }
        }
    }
    .help {
        padding: 40px 0;
        text-align: center;
        .title {
            font-size: 22px;
            color: var(--color);
        }
        .btn {
            margin: 20px 0;
        }
    }
}

@media (max-width: 768px) {
    .publicPage {
        padding: 40px 16px 20px;
        .search {
            .search-title {
                font-size: 24px;
            }
            .form {
                margin: 20px 0;
            }
            .btn {
                height: 44px;
                font-size: 18px;
            }
        }
        .content {
            flex-wrap: wrap;
            text-align: center;
            padding: 40px 0;
            .list {
                width: 50%;
                flex: none;
                margin-bottom: 40px;
            }
        }
        :deep(.new-notice-module) {
            .van-swipe-item {
                padding: 0;
            }
        }
    }
}
</style>
