<template>
    <div class='faqs'>
        <div class='content'>
            <h1 class='content-title'>
                MagnaMarkets {{ $t('faqs.faqs') }}
            </h1>
            <template v-for='(item, index) in list' :key='index'>
                <div class='title'>
                    {{ item.q }}
                </div>
                <div class='reply'>
                    <template v-if='Array.isArray(item.a)'>
                        <div v-for='(sitem, sindex) in item.a' :key='sindex'>
                            <span>{{ sitem }}</span>
                        </div>
                    </template>
                    <span v-else>
                        {{ item.a }}
                    </span>
                    <span v-if='item.link'>
                        {{ ' ' + $t('faqs.link') + ':' }}
                        <a :href='item.link' target='_blank'>
                            {{ item.link }}
                        </a>
                    </span>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
const list = ref([
    {
        q: t('faqs.faqs1'),
        a: t('faqs.faqs1Desc')
    },
    {
        q: t('faqs.faqs2'),
        a: t('faqs.faqs2Desc'),
        link: 'https://www.cysec.gov.cy/en-GB/entities/investment-firms/cypriot/71224/'
    },
    {
        q: t('faqs.faqs3'),
        a: t('faqs.faqs3Desc')
    },
    {
        q: t('faqs.faqs4'),
        a: t('faqs.faqs4Desc')
    },
    {
        q: t('faqs.faqs5'),
        a: t('faqs.faqs5Desc')
    },
    {
        q: t('faqs.faqs6'),
        a: t('faqs.faqs6Desc')
    },
    {
        q: t('faqs.faqs7'),
        a: t('faqs.faqs7Desc')
    },
    {
        q: t('faqs.faqs8'),
        a: [
            t('faqs.faqs8Desc'),
            t('faqs.faqs8Desc2'),
            t('faqs.faqs8Desc3')
        ]
    },
    {
        q: t('faqs.faqs9'),
        a: t('faqs.faqs9Desc')
    },
    {
        q: t('faqs.faqs10'),
        a: t('faqs.faqs10Desc')
    },
    {
        q: t('faqs.faqs11'),
        a: t('faqs.faqs11Desc')
    },
    {
        q: t('faqs.faqs12'),
        a: t('faqs.faqs12Desc')
    }
])
</script>

<style lang="scss" scoped>
.faqs {
    width: 100%;
    color: var(--normalColor);
    background: var(--bgColor);
    padding: 64px 0;
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
        .reply {
            &:not(:last-child) {
                margin-bottom: rem(50px);
            }
            a {
                color: var(--normalColor);
                text-decoration: underline;
                &:hover {
                    color: var(--primary);
                }
            }
        }
    }
    .title {
        color: var(--color);
        font-size: 20px;
        margin-bottom: 8px;
        position: relative;
        padding-left: 20px;
        &::after {
            position: absolute;
            top: 8px;
            left: 0;
            display: block;
            content: '';
            width: 8px;
            height: 8px;
            background: var(--color);
            border-radius: 50%;
        }
        @media screen and (max-width: 768px) {
            font-size: 14px;
            padding-left: 14px;
            &::after {
                width: 6px;
                height: 6px;
            }
        }
    }
}

@media screen and (max-width: 768px) {
    .faqs {
        padding: 15px 0;
    }
}
</style>
