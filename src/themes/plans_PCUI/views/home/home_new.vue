<template>
    <div class='homePage'>
        <router-view />
        <!-- 快速注册模块 -->
        <new-quick @viewVideoHandle='viewVideoHandle' />
        <div class='centerBox'>
            <!-- 公告模块 -->
            <new-notice />
            <!-- 交易信号 -->
            <!-- <trade-signal /> -->
            <!--投资机会-->
            <!-- <opportunities /> -->
            <!--排行榜-->
            <top-products />
        </div>
        <!--加入基金的优势-->
        <advantages />
        <div class='centerBox'>
            <!--现在是分批买入加密基金的好时机-->
            <!-- <buy-now /> -->
            <choose-Cats />
        </div>
        <said-about-Cats />
        <div class='centerBox'>
            <!--3分钟开启投资-->
            <start-investment />
            <download-Cats />
        </div>

        <div class='centerBox'>
            <!--faq-->
            <faq />
        </div>
    </div>
    <!-- 客服 -->
    <service />
    <!-- 底部隐私协议 -->
    <!-- <privacy-tip /> -->
</template>

<script setup>
import newQuick from './components/new-quick.vue'
import newNotice from './components/new-notice.vue'
import tradeSignal from './components/tradeSignal.vue'
import opportunities from './components/opportunities.vue'
import topProducts from './components/topProducts.vue'
import advantages from './components/advantages.vue'
import buyNow from './components/buyNow.vue'
import chooseVitatoken from './components/chooseVitatoken.vue'
import saidAboutVitatoken from './components/saidAboutVitatoken.vue'
import startInvestment from './components/startInvestment.vue'
import downloadVitatoken from './components/downloadVitatoken.vue'
import meetVitatoken from './components/meetVitatoken.vue'
import faq from './components/faq.vue'
import service from './components/service.vue'
import privacyTip from './components/privacy-tip.vue'

import { useStore } from 'vuex'
import { computed, onMounted, onBeforeUnmount, ref, vShow } from 'vue'
import { showExplain } from '@/hooks/deposit'
import { MsgSocket } from '@/plugins/socket/socket'

import AOS from 'aos'
import 'aos/dist/aos.css'

const store = useStore()
// 获取账户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 是否显示全仓玩法真实模拟净值
const showFullNetAsset = computed(() => store.getters.showFullNetAsset)

onMounted(() => {
    AOS.init({
        once: true,
        offset: 40,
        duration: 200
    })
    // 订阅资产
    if (showFullNetAsset.value && customerInfo.value) {
        MsgSocket.subscribedListAdd(() => {
            MsgSocket.subscribeAsset(1)
        })
    }
})

onBeforeUnmount(() => {
    // 取消订阅资产
    if (!showFullNetAsset.value) {
        MsgSocket.cancelSubscribeAsset()
    }
})

const viewVideoHandle = () => {
    const el = document.getElementById('videoBox')
    if (el) {
        window.scrollTo({
            top: el.getBoundingClientRect().top + window.scrollY,
            behavior: 'smooth' // 平滑滚动
        })
    }
}

</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.homePage {
    position: relative;
    background: #FFF;
    min-width: 1200px;
    // overflow-x: auto;
    .relativeFloor {
        position: relative;
        z-index: 101;
    }
}
.centerBox {
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
body.night {
    .homePage {
        background: var(--bgColor);
    }
}
</style>
