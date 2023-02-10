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
        <button class='answer-btn' @click='goService'>
            {{ $t('common.serivce') }}
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { tm } = useI18n()
// 当前显示的模块
const activeNames = ref(-1)
// 问答内容
const answerArr = tm('deposit.answers')

</script>

<style lang="scss" scoped>
.answer {
    h4 {
        line-height: 1;
        font-size: 18px;
        font-weight: bold;
        color: var(--color);
    }
    &:deep {
        .van-collapse {
            margin-top: 20px;
        }
        .van-cell {
            padding: 8px 0;
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
.answer-btn {
    margin-top: 20px;
    padding: 6px 18px;
    color: var(--primary);
    border: 1px solid var(--primary);
    background-color: transparent;
    border-radius: 6px;
    cursor: pointer;
    &:hover {
        color: #FFF;
        background-color: var(--primary);
    }
}
</style>
