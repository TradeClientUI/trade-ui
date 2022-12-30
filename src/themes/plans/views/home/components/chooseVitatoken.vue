<template>
    <div class='chooseVitatoken-module'>
        <div class='title-warp'>
            <h2 class='title'>
                {{ $t('homeJD.whyJD') }}
            </h2>
            <p class='title-label'>
                {{ $t('homeJD.whyJDDesc') }}
            </p>
        </div>
        <Swiper
            class='Swiper'
            :long-swipes-ratio='0.1'
            :modules='modules'
            :pagination='true'
            slides-per-view='auto'
            :space-between='32'
        >
            <SwiperSlide v-for='item in list' :key='item.id' style='width: 80%;'>
                <div class='list-item' @touchend='touchEnd' @touchstart='touchStart'>
                    <div class='img_wp'>
                        <img :alt='item.title' class='img_icon' :src='item.img' />
                    </div>
                    <p class='img-title'>
                        {{ item.title }}
                    </p>
                    <p class='img-desc' v-html='item.desc'></p>
                </div>
            </SwiperSlide>
        </Swiper>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Pagination } from 'swiper'
import { Swiper } from 'swiper/vue/swiper'
import { SwiperSlide } from 'swiper/vue/swiper-slide'
import 'swiper/swiper.min.css'
import 'swiper/swiper-bundle.css'
import { localGet } from '@/utils/util'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
const modules = [Pagination]
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

const theme = ref(localGet('invertColor'))

</script>

<style lang="scss" scoped>
.chooseVitatoken-module {
    width: 100%;
    margin: 0 auto;
    padding: 0 rem(32px) rem(40px);
    font-weight: 500;
    .title-warp {
        margin: rem(96px) 0 rem(50px);
        .title {
            text-align: center;
            color: var(--color);
            font-size: rem(48px);
            font-weight: bold;
            line-height: rem(72px);
            margin-bottom: rem(16px);
        }
        .title-label {
            text-align: center;
            color: var(--color);
            font-size: rem(28px);
        }
    }
    .list-item {
        text-align: center;
        padding-bottom: rem(40px);
        .img_wp {
            background: #F2F4F8;
            border-radius: rem(20px);
            margin-bottom: rem(32px);
        }
        .img_icon {
            width: rem(254px);
            margin: rem(254px) auto;
        }
        .img-title {
            font-size: rem(32px);
            font-weight: 600;
            line-height: rem(48px);
            color: var(--color);
        }
        .img-desc {
            font-size: rem(28px);
            color: var(--normalColor);
            min-height: rem(134px);
            margin-top: rem(24px);
            max-width: rem(604px);
        }
    }
    :deep(.swiper-pagination) {
        bottom: 0;
    }
}
</style>
