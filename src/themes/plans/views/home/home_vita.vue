<template>
    <div id='homePage' class='homePage'>
        <router-view />
        <div class='banner'>
            <div class='banner_full'>
                <!-- 快速注册模块 -->
                <new-quick />
            </div>
        </div>
        <!-- 公告模块 -->
        <new-notice />
        <!--排行榜-->
        <top-products />
        <!--加入基金的优势-->
        <advantages />
        <!--现在是分批买入加密基金的好时机-->
        <buy-now />
        <!--选择CATS-->
        <choose-Cats />
        <!--评价vitatoken-->
        <said-about-Cats />
        <!--3分钟开启投资-->
        <start-investment />
        <!--下载vitatoken-->
        <download-Cats />
        <!--faq-->
        <faq />
    </div>
    <div class='serviceIcon'>
        <!-- 置顶-->
        <!-- <img v-if='showTop' alt='' class='img' src='../../images/home/top.png' @click='toTop' /> -->
        <!-- 客服 -->
        <img alt='' class='img' src='../../images/home/kefu.png' @click='toService' />
    </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import newQuick from './components_vita/new-quick.vue'
import newNotice from './components_vita/new-notice.vue'
import advantages from './components_vita/advantages.vue'
import topProducts from './components/topProducts.vue'
import buyNow from './components_vita/buyNow.vue'
import chooseVitatoken from './components_vita/chooseVitatoken.vue'
import saidAboutVitatoken from './components_vita/saidAboutVitatoken.vue'
import startInvestment from './components_vita/startInvestment.vue'
import downloadVitatoken from './components_vita/downloadVitatoken.vue'
import faq from './components_vita/faq.vue'

import service from './components_vita/service.vue'
import privacyTip from './components_vita/privacy-tip.vue'
import { localGet, localSet } from '@/utils/util'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })

const router = useRouter()
const store = useStore()
const customerInfo = computed(() => store.state._user.customerInfo)

const bannerClick = () => {
    // 游客去到开户界面，登录去V10
    if (customerInfo.value) {
        router.push('/fundV10/index')
    } else {
        router.push('/register')
    }
}
const privacyVis = ref(false)
const agree = () => {
    localSet('privacyFlag', true)
    privacyVis.value = false
}

if (!localGet('privacyFlag')) {
    privacyVis.value = true
}
const toService = () => {
    const onlineService = store.state._base.wpCompanyInfo?.onlineService
    if (onlineService) {
        router.push({
            name: 'Otherpage',
            params: { type: 'page' },
            query: { title: t('route.onlineService'), url: onlineService }
        })
    }
}
// const showTop = ref(false)
// const handleScroll = () => { // 显示回到顶部按钮
//     if (document.documentElement.scrollTop > 900) { showTop.value = true } else showTop.value = false
// }
// onMounted(() => { // 绑定滚动事件
//     window.addEventListener('scroll', handleScroll)
// })
// onBeforeUnmount(() => { // 移出滚动事件
//     window.removeEventListener('scroll', handleScroll)
// })
// 回到顶部
// const toTop = () => {
//     window.scrollTo({
//         top: 0,
//         behavior: 'smooth' // 平滑滚动
//     })
// }
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.homePage {
    position: relative;
    background: #fff;
    .relativeFloor {
        position: relative;
        z-index: 101;
    }
}
// 内容模块
.content-module {
    padding-bottom: 4px;
    overflow: auto;
    background-color: var(--bgColor);
}
// banner文字
.banner{
    width: 100%;
    background: url('../../images/home/new_version/banner_bgd.png') top center no-repeat;
    background-size: 100% 100%;
    padding: rem(80px) rem(32px) rem(104px);
    &_full{
        display: flex;
        margin: auto;
        justify-content: space-between;
        width: 100%;
    }
    .right{
        height: 600px;
        margin-left:40px;
        cursor: pointer;
    }
}
.privacy {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    padding: rem(30px);
    overflow: hidden;
    font-size: rem(28px);
    line-height: rem(50px);
    background-color: rgb(250, 251, 252);
    .close-wrap {
        display: flex;
        justify-content: flex-end;
        margin-bottom: rem(10px);
        .close {
            display: flex;
            flex-shrink: 0;
            align-items: center;
            align-self: flex-end;
            justify-content: center;
            width: 24px;
            height: 24px;
            padding: 0;
            background-color: rgb(112, 133, 153);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0.5;
            -webkit-box-align: center;
            -webkit-box-pack: center;
            .icon-svg {
                cursor: pointer;
                transition: fill 0.15s ease 0s;
                fill: rgb(255, 255, 255);
            }
        }
    }
    a {color: #0062FF;}
    .content {
        padding: 0 0 10px;
    }
    .footer {
        text-align: center;
        .close-btn {
            display: inline-block;
            padding: 0 24px;
            color: var(--primary);
            border: solid 1px var(--primary);
            border-radius: 4px;
            cursor: pointer;
        }
        .agree {
            display: inline-block;
            width: fit-content;
            margin-right: rem(40px);
            padding: 0 24px;
            color: rgb(255, 255, 255);
            // font-size: 14px;
            white-space: nowrap;
            background-color: #0062FF;
            border: 1px solid #0062FF;
            border-radius: 4px;
            cursor: pointer;
        }
    }
}
.serviceIcon {
    position: fixed;
    right: rem(32px);
    bottom: rem(160px);
    z-index: 109;
    .img {
        width: rem(84px);
        display: block;
        margin-top: rem(56px);
    }
}
</style>
