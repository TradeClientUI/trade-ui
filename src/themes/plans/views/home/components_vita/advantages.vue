<!--加入基金的优势-->
<template>
    <div class='advantages-module'>
        <div class='module-cont'>
            <h2 class='title'>
                Benefits of crypto funds
            </h2>
            <Swiper
                class='my-swipe'
                :long-swipes-ratio='0.1'
                :modules='modules'
                :pagination='true'
                slides-per-view='auto'
                :space-between='32'
            >
                <SwiperSlide v-for='item in list' :key='item.id' style='width:80%'>
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
const modules = [Pagination]
const list = [
    { id: 0, img: require('../../../images/home/new_version/advantage3_default_icon.png'), title: 'heading 1', desc: 'content content content content content content.' },
    { id: 1, img: require('../../../images/home/new_version/advantage3_default_icon.png'), title: 'heading 2', desc: 'content content content content content content' },
    { id: 2, img: require('../../../images/home/new_version/advantage3_default_icon.png'), title: 'heading 3', desc: 'content content content content content content' },
    { id: 3, img: require('../../../images/home/new_version/advantage3_default_icon.png'), title: 'heading 4', desc: 'content content content content content content' },
    { id: 4, img: require('../../../images/home/new_version/advantage3_default_icon.png'), title: 'heading 5', desc: 'content content content content content content' },
    { id: 5, img: require('../../../images/home/new_version/advantage3_default_icon.png'), title: 'heading 6', desc: 'content content content content content content' },
]

</script>

<style lang="scss" scoped>
.advantages-module {
    @include globalFont();
    background-color: #F2F4F8;
    .module-cont {
        width: 100%;
        margin: 0 auto;
        padding: 0 rem(32px);
        padding-bottom: rem(80px);
        .title {
            color: #111;
            line-height: rem(72px);
            font-size: rem(48px);
            font-weight: bold;
            text-align: center;
            padding: rem(96px) 0;
        }
    }
    .my-swipe {

        .list-item {
            margin-bottom: rem(32px);
        }
        .swipe-cont {
            padding: rem(32px);
            background: #FFFFFF;
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
                    color: #666;
                    font-weight: 400;
                    line-height: rem(28px);
                }
            }
        }
    }
    :deep(.swiper-pagination){
        bottom: 0;
    }

}
</style>
