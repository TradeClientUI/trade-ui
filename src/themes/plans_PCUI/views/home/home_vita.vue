<template>
    <div class='homePage'>
        <router-view />
        <!-- 快速注册模块 -->
        <new-quick @viewVideoHandle='viewVideoHandle' />
        <div class='centerBox'>
            <!-- 公告模块 -->
            <new-notice />

            <!--排行榜-->
            <top-products />
        </div>
        <!--加入基金的优势-->
        <advantages />
        <div class='centerBox'>
            <!--现在是分批买入加密基金的好时机-->
            <buy-now />
            <!--选择vitatoken-->
            <choose-Cats />
        </div>
        <!--评价vitatoken-->
        <said-about-Cats />
        <div class='centerBox'>
            <!--3分钟开启投资-->
            <start-investment />
            <!--下载vitatoken-->
            <download-Cats />
            <!--遇见vitatoken-->
        </div>
        <!-- <div id='videoBox'>
            <meet-Cats />
        </div> -->

        <div class='centerBox'>
            <!--faq-->
            <faq />
        </div>
    </div>
    <!-- 返回顶部 -->
    <div v-if='showTop' class='toTop' @click='toTop'>
        <img alt='' src='../../images/home/top.png' />
    </div>
    <!-- 客服 -->
    <service />
    <!-- 底部隐私协议 -->
    <!-- <privacy-tip /> -->
</template>

<script setup>
import newQuick from './components_vita/new-quick.vue'
import newNotice from './components/new-notice.vue'
import topProducts from './components/topProducts.vue'
import advantages from './components_vita/advantages.vue'
import buyNow from './components_vita/buyNow.vue'
import chooseVitatoken from './components_vita/chooseVitatoken.vue'
import saidAboutVitatoken from './components_vita/saidAboutVitatoken.vue'
import startInvestment from './components_vita/startInvestment.vue'
import downloadVitatoken from './components_vita/downloadVitatoken.vue'
import meetVitatoken from './components_vita/meetVitatoken.vue'
import faq from './components_vita/faq.vue'

import service from './components_vita/service.vue'
import privacyTip from './components_vita/privacy-tip.vue'
import { onMounted, onBeforeUnmount, ref, vShow } from 'vue'
import { showExplain } from '@/hooks/deposit'

const viewVideoHandle = () => {
    const el = document.getElementById('videoBox')
    if (el) {
        window.scrollTo({
            top: el.getBoundingClientRect().top + window.scrollY,
            behavior: 'smooth' // 平滑滚动
        })
    }
}
// 回到顶部
// const toTop = () => {
//     window.scrollTo({
//         top: 0,
//         behavior: 'smooth' // 平滑滚动
//     })
// }
// const showTop = ref(false)
// const handleScroll = () => {
//     if (document.documentElement.scrollTop > 900) { showTop.value = true } else showTop.value = false
// }
// onMounted(() => {
//     window.addEventListener('scroll', handleScroll)
// })
// onBeforeUnmount(() => {
//     window.removeEventListener('scroll', handleScroll)
// })
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.homePage {
    position: relative;
    background: #fff;
    min-width: 1200px;
    // overflow-x: auto;
    .relativeFloor {
        position: relative;
        z-index: 101;
    }
}

.centerBox{
    max-width: 1280px;
    margin: 0 auto;
}// 内容模块
.content-module {
    padding-bottom: 4px;
    overflow: auto;
    background-color: var(--bgColor);
}
// .toTop{
//     position: fixed;
//     right: 10px;
//     bottom: 104px;
//     z-index: 102;
//     cursor: pointer;
//     img{
//         width: 64px;
//     }
// }
</style>
