<!--加入基金的优势-->
<template>
    <div class='advantages-module'>
        <div class='module-cont'>
            <div class='title-warp'>
                <h2 class='title'>
                    {{ $t('homeJD.whyTradeCFDs') }}
                </h2>
                <p class='title-label'>
                    {{ $t('homeJD.whyTradeCFDsDesc') }}
                </p>
            </div>
            <Swiper
                class='my-swipe'
                :long-swipes-ratio='0.1'
                :modules='modules'
                :pagination='true'
                slides-per-view='auto'
                :space-between='32'
            >
                <SwiperSlide v-for='item in list' :key='item.id' style='width: 80%;'>
                    <div class='list-item' @touchend='touchEnd' @touchstart='touchStart'>
                        <div class='swipe-cont'>
                            <p class='item-hd'>
                                <img class='icon' :src='item.img' />
                            </p>
                            <div class='info'>
                                <p class='info-title'>
                                    {{ item.title }}
                                </p>
                                <p class='desc'>
                                    {{ item.desc }}
                                </p>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
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
    { id: 0, img: require('../../../images/home/new_version/advantage1_default_icon.png'), title: t('homeJD.leverage'), desc: t('homeJD.leverageDesc') },
    { id: 1, img: require('../../../images/home/new_version/advantage2_default_icon.png'), title: t('homeJD.longOrShort'), desc: t('homeJD.longOrShortDesc') },
    { id: 2, img: require('../../../images/home/new_version/advantage3_default_icon.png'), title:  t('homeJD.globeMarkets'), desc: t('homeJD.globeMarketsDesc') },
    { id: 3, img: require('../../../images/home/new_version/advantage4_default_icon.png'), title:  t('homeJD.portfolio'), desc: t('homeJD.portfolioDesc') },
    { id: 4, img: require('../../../images/home/new_version/advantage5_default_icon.png'), title: t('homeJD.24hours'), desc: t('homeJD.24hoursDesc') },
    { id: 5, img: require('../../../images/home/new_version/advantage6_default_icon.png'), title: t('homeJD.liquidity'), desc:t('homeJD.liquidityDesc') }
]

const theme = ref(localGet('invertColor'))

</script>

<style lang="scss" scoped>
.advantages-module {
    background-color: var(--bgColor);
    .module-cont {
        width: 100%;
        margin: 0 auto;
        padding: 0 rem(32px);
        padding-bottom: rem(50px);
        .title-warp {
            padding: rem(96px) 0 rem(50px);
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
    }
    .my-swipe {
        padding-bottom: 15px;
        .list-item {
            margin-bottom: rem(32px);
        }
        .swipe-cont {
            padding: rem(32px);
            background: var(--contentColor);
            border-radius: rem(20px);
            border: rem(1px) solid rgba(0, 0, 0, 0.15);
            .icon {
                width: rem(128px);
            }
            .info {
                height: rem(200px);
                &-title {
                    font-weight: 600;
                    font-size: rem(28px);
                    margin-top: rem(32px);
                    margin-bottom: rem(16px);
                    line-height: rem(40px);
                }
                .desc {
                    font-size: rem(24px);
                    color: var(--normalColor);
                    font-weight: 400;
                    line-height: rem(30px);
                }
            }
        }
    }
    :deep(.swiper-pagination) {
        bottom: 0;
    }
}
body.night {
    .advantages-module {
        img.icon {
            filter: invert(1);
        }
    }
}
</style>
