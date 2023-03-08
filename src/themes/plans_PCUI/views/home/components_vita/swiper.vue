<template>
    <el-carousel arrow='never' class='swiper-module' height='540px'>
        <el-carousel-item v-for='(item, index) in bannerList' :key='index'>
            <div class='bannerImg' :style='{ backgroundImage: "url("+ item.url +")" }' @click='bannerClick(item.link)'></div>
        </el-carousel-item>
    </el-carousel>
</template>

<script setup>
import { getCookie } from '@/utils/util.js'
import { useRouter } from 'vue-router'

const router = useRouter()
// 当前语言
const lang = getCookie('lang')
// 轮播图列表
const bannerList = [
    {
        url: require('@planspc/images/' + lang + '/banner1.jpg'),
        link: '/newCustomerActivities'
    },
    {
        url: require('@planspc/images/' + lang + '/banner2.jpg'),
        link: '/fundV10/index'
    },
    // {
    //     url: require('@planspc/images/' + lang + '/banner3.jpg'),
    //     link: '/openAccount'
    // },
    {
        url: require('@planspc/images/' + lang + '/banner4.png'),
        link: '/about'
    }
]
// 点击轮播图
const bannerClick = (url) => {
    router.push({ path: url })
}
</script>

<style lang="scss" scoped>
.swiper-module {
    position: fixed;
    z-index: 0;
    left: 0;
    top: 64px;
    width: 100%;
    .bannerImg{
        height: 100%;
        width: 100%;
        background-size: cover;
        background-position: center;
        cursor: pointer;
    }
    img {
        display: block;
        height: 100%;
    }
}
</style>
