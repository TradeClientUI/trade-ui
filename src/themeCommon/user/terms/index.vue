<template>
    <template v-if="locale === 'zh-CN'">
        <CN />
    </template>
    <template v-else-if="locale === 'zh-HK'">
        <HK />
    </template>
    <template v-else>
        <EN />
    </template>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import EN from './en'
import CN from './cn'
import HK from './hk'

const { locale } = useI18n({ useScope: 'global' })
</script>

<style lang="scss" scoped>
.privacyPolicy {
    width: 100%;
    color: var(--normalColor);
    background: var(--bgColor);
    padding: 64px 0;
    :deep {
        .content {
            width: 1000px;
            margin: 0 auto;
            text-align: left;
            font-size: 14px;
            line-height: 24px;
            @media screen and (max-width: 768px) {
                width: 100%;
                padding: 0 15px;
            }
            &-title {
                font-size: 30px;
                font-weight: 600;
                text-align: center;
                line-height: 32px;
                margin-bottom: 64px;
                color: var(--primary);
                @media screen and (max-width: 768px) {
                    font-size: 24px;
                    margin-bottom: 30px;
                }
            }
            &_section {
                font-size: 14px;
                line-height: 21px;
            }
        }
        .text {
            margin-bottom: 20px;
        }
        .li {
            text-indent: 0;
            margin-bottom: 20px;
            position: relative;
        }
    }
}
</style>
