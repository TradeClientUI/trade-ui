<template>
    <el-carousel v-if='data.items.length' arrow='never' class='swiper-module' :class='{ "h5Preview": h5Preview }' height='540px'>
        <el-carousel-item v-for='(item, index) in data.items' :key='index'>
            <!-- <img src='@planspc/images/home/banner.png' /> -->
            <div class='bannerImg' :style='{ backgroundImage: "url("+(item.src || bannerImg)+")" }' @click='openUrl(item)'></div>
        </el-carousel-item>
    </el-carousel>
</template>

<script>
import { computed, onMounted } from 'vue'
import bannerImg from './placeholder.png'
export default {
    props: {
        data: {
            type: Object,
            default: function () {
                return {
                    href: '',
                    src: '',
                    target: '',
                }
            }
        },
    },
    setup (props) {
        // onMounted(() => {
        //     console.log(props.data)
        // })
        return {
            bannerImg
        }
    }
}
</script>

<style lang="scss" scoped>
.swiper-module {
    // craig-modify
    position: fixed;
    z-index: 0;
    left: 0;
    top: 0;
    width: 100%;
    &.h5Preview{
        position: relative;
    }
    .bannerImg{
        height: 100%;
        width: 100%;
        background-size: cover;
        background-position: center;
    }
    img {
        display: block;
        height: 100%;
    }
}
</style>
