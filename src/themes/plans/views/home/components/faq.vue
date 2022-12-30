<template>
    <div class='faq-module'>
        <div class='title'>
            <span class='underline'>
                {{ $t('homeJD.faqs') }}
            </span>
        </div>
        <van-collapse v-model='activeName' accordion>
            <van-collapse-item name='1'>
                <template #title>
                    <img alt='' class='icon' src='../../../images/home/new_version/faq.png' />
                    <span class='collapse-title'>
                        {{ $t('homeJD.faqs1') }}
                    </span>
                </template>
                <div class='desc'>
                    {{ $t('homeJD.faqs1Desc') }}
                </div>
            </van-collapse-item>
            <van-collapse-item name='2'>
                <template #title>
                    <img alt='' class='icon' src='../../../images/home/new_version/faq.png' />
                    <span class='collapse-title'>
                        {{ $t('homeJD.faqs2') }}
                    </span>
                </template>
                <div class='desc'>
                    {{ $t('homeJD.faqs2Desc') }}
                </div>
            </van-collapse-item>
            <van-collapse-item name='3'>
                <template #title>
                    <img alt='' class='icon' src='../../../images/home/new_version/faq.png' />
                    <span class='collapse-title'>
                        {{ $t('homeJD.faqs3') }}
                    </span>
                </template>
                <div class='desc'>
                    {{ $t('homeJD.faqs3Desc') }}
                </div>
            </van-collapse-item>
            <van-collapse-item name='4'>
                <template #title>
                    <img alt='' class='icon' src='../../../images/home/new_version/faq.png' />
                    <span class='collapse-title'>
                        {{ $t('homeJD.faqs4') }}
                    </span>
                </template>
                <div class='desc'>
                    {{ $t('homeJD.faqs4Desc') }}
                </div>
            </van-collapse-item>
            <van-collapse-item name='5'>
                <template #title>
                    <img alt='' class='icon' src='../../../images/home/new_version/faq.png' />
                    <span class='collapse-title'>
                        {{ $t('homeJD.faqs5') }}
                    </span>
                </template>
                <div class='desc'>
                    {{ $t('homeJD.faqs5Desc') }}
                </div>
            </van-collapse-item>
        </van-collapse>
    </div>
</template>

<script setup>
import { localGet } from '@/utils/util'
import { ref } from 'vue'

const activeName = ref('1')

const theme = ref(localGet('invertColor'))
</script>

<style lang="scss" scoped>
.faq-module {
    background: var(--contentColor);
    color: var(--color);
    padding: 0 rem(32px) rem(32px);
    :deep(.van-collapse-item) {
        border: rem(2px) solid var(--lineColor);
        border-radius: rem(32px);
        overflow: hidden;
        margin-bottom: rem(40px);
        &:last-child {
            margin-bottom: rem(80px);
        }
        .van-cell {
            line-height: rem(38px);
            height: rem(144px);
            display: flex;
            align-items: center;
            padding: 0 rem(48px);
            &::after {
                display: none;
            }
        }
        .van-cell__title {
            color: var(--color);
            font-size: rem(32px);
            font-weight: 600;
            display: flex;
            align-items: center;
        }
        .van-icon-arrow {
            font-size: rem(48px);
        }
        .van-collapse-item__content {
            padding: 0 rem(60px) rem(50px);
        }
    }
    .title {
        font-size: rem(48px);
        padding-top: rem(80px);
        margin-bottom: rem(20px);
        text-align: center;
        font-weight: 600;
        border-bottom: rem(4px) solid var(--lineColor);
        .underline {
            height: rem(92px);
            display: inline-block;
            // border-bottom: rem(2px) solid #111111;
        }
    }
    .icon {
        margin-right: rem(32px);
        width: rem(28px);
        display: block;
    }
    .desc {
        color: var(--normalColor);
        font-size: rem(28px);
        font-weight: 400;
        line-height: rem(45px);
    }
}
body.night {
    .faq-module {
        .icon {
            filter: invert(1);
        }
    }
}
</style>
