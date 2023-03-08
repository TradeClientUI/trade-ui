<template>
    <div class='chooseCATS-module'>
        <h2 class='title'>
            Choose CATS, choose wealth
        </h2>
        <Swiper
            class='Swiper'
            :long-swipes-ratio='0.1'
            :modules='modules'
            :pagination='true'
            slides-per-view='auto'
            :space-between='32'
        >
            <SwiperSlide v-for='item in list' :key='item.id' style='width:80%'>
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
const modules = [Pagination]
const list = [
    {
        id: 0, img: require('../../../images/home/chooseImg.png'), title: 'heading 1', desc: 'content content content content content content content content content'
    },
    {
        id: 1, img: require('../../../images/home/chooseImg.png'), title: 'heading 2', desc: 'content content content content content content content content content'
    },
    {
        id: 2, img: require('../../../images/home/chooseImg.png'), title: 'heading 3', desc: 'content content content content content content content content content'
    },
    {
        id: 3, img: require('../../../images/home/chooseImg.png'), title: 'heading 4', desc: 'content content content content content content content content content'
    }
]

</script>

<style lang="scss" scoped>
.chooseCATS-module {
    width:100%;
    margin:0 auto;
    padding: 0 rem(32px) rem(40px);
    @include globalFont();
    font-weight: 500;
    .title {
        color:#111;
        line-height: rem(56px);
        font-size: rem(48px);
        font-weight: bold;
        text-align: center;
        padding: rem(96px) 0;
    }
    .list-item{
        text-align: center;
        padding-bottom: rem(40px);
        .img_wp{
            background: #F2F4F8;
            border-radius: rem(20px);
            margin-bottom: rem(32px);
        }
        .img_icon{
            width:  rem(338px);
            margin: rem(254px) auto;
        }
        .img-title{
            font-size: rem(32px);
            font-weight: 600;
            line-height: rem(48px);
            color: #111111;
        }
        .img-desc{
            font-size: rem(28px);
            color: #666;
            min-height: rem(134px);
            margin-top: rem(24px);
            max-width: rem(604px);
        }
    }
    :deep(.swiper-pagination){
        bottom:0;
    }
}
</style>
