<template>
    <div class='answer'>
        <h4>{{ $t('common.question') }}：</h4>
        <van-collapse v-model='activeNames' accordion>
            <van-collapse-item
                v-for='(item, index) in answerArr'
                :key='index'
                :name='index'
            >
                <template #title>
                    <div class='item'>
                        <van-icon :name="activeNames === index ? 'minus' : 'plus'" />
                        <span>{{ item.title }}</span>
                    </div>
                </template>
                <p v-html='item.text'></p>
            </van-collapse-item>
        </van-collapse>
    </div>
</template>

<script setup>
import { ref, unref, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const store = useStore()
const { tm } = useI18n()
// 在线客服地址
const onlineService = unref(computed(() => store.state._base.wpCompanyInfo?.onlineService))
// 当前显示的模块
const activeNames = ref(-1)
// 问答内容
const answerArr = tm('deposit.answers')

// 打开客服页面
const goService = () => {
    if (onlineService) window.open(onlineService)
}
</script>

<style lang="scss" scoped>
.answer {
    margin-top: rem(30px);
    padding: rem(30px);
    background-color: var(--contentColor);
    border: 1px solid var(--lineColor);
    border-radius: rem(16px);
    h4 {
        font-size: 18px;
        font-weight: bold;
        color: var(--color);
    }
    &:deep {
        .van-collapse {
            margin-top: 12px;
        }
        .van-cell {
            color: var(--color);
            background-color: transparent;
            &::after {
                border-bottom: none;
            }
        }
        .van-cell__title {
            line-height: 1.4;
            color: var(--mainColor);
        }
        .van-collapse-item__content {
            color: var(--normalColor);
            background-color: transparent;
        }
        .van-collapse-item__wrapper {
            margin-top: -15px;
        }
        .van-icon-arrow {
            display: none;
        }
        .van-collapse-item--border::after {
            border-top: none;
        }
        .van-hairline--top-bottom::after {
            border: none;
        }
    }
    .item {
        span {
            margin-left: 5px;
        }
    }
}
</style>
