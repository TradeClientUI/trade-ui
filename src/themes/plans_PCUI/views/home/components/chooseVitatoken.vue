<template>
    <div class='chooseVitatoken-module'>
        <div class='title-warp'>
            <h2 class='title' data-aos='fade-up' data-aos-delay='200'>
                {{ $t('homeJD.whyJD') }}
            </h2>
            <p class='title-label' data-aos='fade-up' data-aos-delay='400'>
                {{ $t('homeJD.whyJDDesc') }}
            </p>
        </div>
        <ul class='list'>
            <li v-for='item in list' :key='item.id' class='item'>
                <div class='img_icon'>
                    <img :alt='item.title' :src='item.img' />
                </div>
                <p class='img-title'>
                    {{ item.title }}
                </p>
                <div class='active-box'>
                    <div class='cont-info'>
                        <p class='active-title'>
                            {{ item.title }}
                        </p>
                        <p class='img-desc' v-html='item.desc'></p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
// 公告列表
const list = [
    {
        id: 1, img: require('../../../images/home/new_version/indicator.png?8888'), title: t('homeJD.indicator'), desc: t('homeJD.indicatorDesc')
    },
    {
        id: 2, img: require('../../../images/home/new_version/magnifier.png'), title: t('homeJD.magnifier'), desc: t('homeJD.magnifierDesc')
    },
    {
        id: 3, img: require('../../../images/home/new_version/light.png'), title: t('homeJD.hotProduct'), desc: t('homeJD.hotProductDesc')
    },
    {
        id: 4, img: require('../../../images/home/new_version/calendar.png'), title: t('homeJD.calendar'), desc: t('homeJD.calendarDesc')
    }
]
</script>

<style lang="scss" scoped>
.chooseVitatoken-module {
    @include pagePadding();
    font-weight: 500;
    margin-bottom: 100px;
    .title-warp {
        padding: 64px 0;
        .title {
            text-align: center;
            color: var(--mainColor);
            font-size: 48px;
            line-height: 56px;
            font-weight: 700;
        }
        .title-label {
            text-align: center;
            color: var(--color);
            font-size: 16px;
            line-height: 20px;
            margin-top: 16px;
        }
    }
    .list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .item {
            flex: 1;
            background: #F1F4F8;
            box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.08);
            border-radius: 8px;
            position: relative;
            margin-right: 48px;
            &:last-child {
                margin-right: 0;
            }
            .img_icon {
                height: 300px;
                display: flex;
                align-items: center;
                justify-content: center;
                img {
                    display: block;
                    width: 113px;
                }
            }
            .img-title {
                font-size: 16px;
                font-weight: 600;
                margin: 32px 0;
                color: #111;
                text-align: center;
            }
            .active-box {
                width: 0;
                background: #FFF;
                font-size: 16px;
                color: #111;
                line-height: 24px;
                border-radius: 8px;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                .cont-info {
                    // visibility:hidden;
                    opacity: 0;
                    // min-width:248px;
                    max-width: 100%;
                }
                .active-title {
                    font-size: 24px;
                    color: #111;
                    margin: 32px 0 24px;
                    text-align: center;
                    // text-decoration: underline;
                }
            }
            &:hover {
                cursor: pointer;
                .active-box {
                    right: 0;
                    width: 100%;
                    padding: 32px 24px;
                    transition: width 0.2s;
                    color: #111;
                    // display: block;
                    .cont-info {
                        opacity: 1;
                        // visibility: visible;
                        transition: opacity 1.6s;
                        color: #111;
                    }
                }
            }
        }
    }
    .more-btn {
        width: 200px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary);
        font-size: 16px;
        text-align: center;
        border-radius: 12px;
        border: 2px solid var(--lineColor);
        margin: 40px auto;
        &:hover {
            cursor: pointer;
            border-color: var(--primary);
        }
    }
}
html[lang=zh-CN] {
    .chooseVitatoken-module .list .item .active-box .cont-info {
        text-align: justify;
    }
}
</style>
