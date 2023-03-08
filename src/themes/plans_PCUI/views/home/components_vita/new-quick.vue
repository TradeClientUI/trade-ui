<template>
    <div class='full'>
        <div class='centerBox'>
            <div class='new-quick-module'>
                <h2 class='title'>
                    Earn crypto by funds
                </h2>
                <p class='banner-text'>
                    CATS is the world's first and largest crypto funds platform, gathering and recommending high-quality funds
                </p>
                <div v-if='isLogin' class='register-box'>
                    <button class='btn' @click='goDeposit'>
                        Deposit
                    </button>
                    <button class='detail-btn btn' @click='goV10Detail'>
                        Buy Funds
                    </button>
                </div>
                <div v-else class='register-box'>
                    <input v-model.trim='registerAccount' :placeholder="$t('home.quick.emailOrPhone')" />
                    <button @click='goRegister'>
                        {{ $t('home.getStarted') }}
                    </button>
                </div>
                <!-- <p class='describe'>
                    <img alt='' class='gift_img' src='../../../images/home/gift.png' />
                    <span v-if='isLogin' class='active' @click='goNotice(45)'>
                        Trade V10 for free &nbsp; >
                    </span>
                    <span v-else class='active' @click='goNotice(44)'>
                        Register & verify to get V10 for free &nbsp; >
                    </span>
                </p> -->
                <!-- <p class='learn-more' @click='viewVideo'>
                    Learn more about CATS
                </p> -->
                <bannerProfitsAmount />
            </div>
            <div ref='rightBlockRef' class='right'>
                <div class='item1' :class='{ active:animationLineActive===1 }' @animationend='animationend(1)' @click="linkTo('indexFunds')">
                    <p class='item-title'>
                        New Products
                    </p>
                    <div class='icon-list'>
                        <img alt='' class='icon24' src='../../../images/home/bannerIcon/banner1_1.png' />
                        <img alt='' class='icon24' src='../../../images/home/bannerIcon/banner1_2.png' />
                        <img alt='' class='icon24' src='../../../images/home/bannerIcon/banner1_3.png' />
                        <img alt='' class='icon24' src='../../../images/home/bannerIcon/banner1_4.png' />
                        <img alt='' class='icon24' src='../../../images/home/bannerIcon/banner1_5.png' />
                        <img alt='' class='icon24' src='../../../images/home/bannerIcon/banner1_6.png' />
                        <img alt='' class='icon24' src='../../../images/home/bannerIcon/banner1_7.png' />
                        <img alt='' class='icon24' src='../../../images/home/bannerIcon/banner1_8.png' />
                    </div>
                </div>
                <div class='item2' :class='{ active:animationLineActive===3 }' @animationend='animationend(3)' @click="linkTo('/fundV10/index')">
                    <p class='item-title'>
                        Hot Products
                    </p>
                    <p class='item-desc'>
                        Cryptocurrency index fund
                    </p>
                    <img alt='' class='center' src='../../../images/home/bannerIcon/banner2-center.png' />
                    <div class='icon-list column5'>
                        <img alt='' class='icon20' src='../../../images/home/bannerIcon/banner2_1.png' />
                        <img alt='' class='icon20' src='../../../images/home/bannerIcon/banner2_2.png' />
                        <img alt='' class='icon20' src='../../../images/home/bannerIcon/banner2_3.png' />
                        <img alt='' class='icon20' src='../../../images/home/bannerIcon/banner2_4.png' />
                        <img alt='' class='icon20' src='../../../images/home/bannerIcon/banner2_5.png' />
                        <img alt='' class='icon20' src='../../../images/home/bannerIcon/banner2_6.png' />
                        <img alt='' class='icon20' src='../../../images/home/bannerIcon/banner2_7.png' />
                        <img alt='' class='icon20' src='../../../images/home/bannerIcon/banner2_8.png' />
                        <img alt='' class='icon20' src='../../../images/home/bannerIcon/banner2_9.png' />
                        <img alt='' class='icon20' src='../../../images/home/bannerIcon/banner2_10.png' />
                    </div>
                </div>
                <div class='item3-wrap' @click="linkTo('/order')">
                    <div class='item3' :class='{ active:animationLineActive===2 }' @animationend='animationend(2)'>
                        <p class='item-title'>
                            Spot Trading
                        </p>
                        <p class='hr1'></p>
                        <p class='hr2'></p>
                        <div class='chart'>
                            <p v-for='item in chartList' :key='item.id' class='chart—item' :style="'height:'+item.height"></p>
                        </div>
                    </div>
                </div>
                <div class='item4' :class='{ active:animationLineActive===4 }' @animationend='animationend(4)' @click="linkTo('/earning')">
                    <p class='item-title'>
                        Market
                    </p>
                    <div class='icon-wrap'>
                        <img alt='' class='icon20' src='../../../images/home/bannerIcon/banner4-1.png' />
                        <img alt='' class='icon20' src='../../../images/home/bannerIcon/banner4-2.png' />
                        <img alt='' class='icon20' src='../../../images/home/bannerIcon/banner4-3.png' />
                        <img alt='' class='icon20' src='../../../images/home/bannerIcon/banner4-4.png' />
                    </div>
                    <img alt='' class='icon-bottom' src='../../../images/home/bannerIcon/banner4-5.png' />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import bannerProfitsAmount from './bannerProfitsAmount'

export default {
    components: {
        bannerProfitsAmount,
    },
    setup (props, { emit }) {
        const router = useRouter()
        const registerAccount = ref('')
        // const context = useContext()

        const store = useStore()
        const isLogin = computed(() => store.state._user.customerInfo)
        // 去注册
        const goRegister = () => {
            const query = {}
            query[registerAccount.value.includes('@') ? 'email' : 'mobile'] = registerAccount.value
            router.push({ name: 'Register', query })
        }
        // 去公告详情
        const goNotice = (id) => {
            router.push({
                path: '/noticeDetail',
                query: {
                    id: id,
                    type: 'notice'
                }
            })
        }
        // 去入金
        const goDeposit = () => {
            router.push({
                path: '/depositChoose',
                query: {
                    type: 2
                }
            })
        }
        // 去V10
        const goV10Detail = () => {
            router.push('/fundV10/index')
        }

        // 去视频地址
        const viewVideo = () => {
            emit('viewVideoHandle')
        }
        const linkTo = (url) => {
            if (url === '/order') {
                router.push({
                    path: '/order',
                    query: {
                        name: 'BTC/USDT',
                        symbolId: 328,
                        tradeType: 5
                    }
                })
            } else {
                router.push(url)
            }
        }
        // chart 元素
        const chartList = [
            { id: 1, height: '25px' },
            { id: 2, height: '36px' },
            { id: 3, height: '57px' },
            { id: 4, height: '42px' },
            { id: 5, height: '69px' },
            { id: 6, height: '102px' },
            { id: 7, height: '54px' },
            { id: 8, height: '77px' },
        ]

        // 右侧4个块的横线动画效果
        const rightBlockRef = ref(null)
        const animationLineActive = ref(1)
        // 动画结束
        const animationend = (index) => {
            // console.log('animationend', index)
            if (animationLineActive.value < 4) animationLineActive.value++
            else animationLineActive.value = 1
        }

        return {
            rightBlockRef,
            animationend,
            animationLineActive,
            registerAccount,
            goRegister,
            goDeposit,
            goNotice,
            goV10Detail,
            viewVideo,
            isLogin,
            chartList,
            linkTo
        }
    }
}
</script>

<style lang="scss" scoped>
.full{
    @include globalFont();
    @include pagePadding();
    margin: auto;
    width: 100%;
    background: url('../../../images/home/new_version/top_banner_left.svg') left top no-repeat,url('../../../images/home/new_version/top_banner_right.svg') right bottom no-repeat;
    background-color: rgba(246, 250, 255, 1);
}
.centerBox{
    max-width: 1280px;
    justify-content: space-between;
    display: flex;
    margin: 0 auto;
}
.new-quick-module {
    flex:1;
    display: flex;
    flex-direction: column;
    max-width: 590px;
    margin-left: 32px;
    .title {
        font-size: 48px;
        font-weight: 700;
        color: #111;
        line-height: 56px;
        margin-bottom: 20px;
        padding-top:86px;
    }
    .banner-text {
        color: var(--normalColor);
        font-weight:400;
        font-size: 24px;
        line-height: 28px;
        min-width: 510px;
    }
    .describe {
        font-size: 16px;
        color: var(--color);
        display: flex;
        align-items: center;
        font-weight: 600;
        .usdt-num {
            color:#E6B24F;
            font-size: 24px;
        }
        .active:hover{
            color: var(--primary);
            cursor: pointer;
        }
        .gift_img{
            width: 22px;
            margin-right: 16px;
        }
    }
    .register-box {
        display: flex;
        align-items: center;
        margin: 40px 0 20px;
        .labelText{
            margin-right: 30px;
            font-size: 16px;
        }
        input {
            @include globalFont();
            width: 370px;
            height: 50px;
            padding: 0 20px;
            font-size: 16px;
            background: #fff;
            border-radius: 12px;
            border: 2px solid rgba(0,0,0,0.15);
        }
        button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 150px;
            height: 50px;
            font-size: 16px;
            font-weight: 500;
            margin-left:12px;
            color: #fff;
            background: var(--primary);
            border-radius: 12px;
            border: 1px solid var(--primary);
            cursor: pointer;
            @include hover();
        }
        .btn {
            border-radius: 12px;
            width: 160px;
            margin-left: 0px;
            margin-right: 32px;
        }
        .detail-btn {
            border-color:var(--primary);
            background: #fff;
            color:var(--primary);
            &:hover {
                background: #E7F2FF;
            }
        }
    }
    .learn-more {
        width:max-content;
        cursor: pointer;
        display: block;
        font-size: 16px;
        color: var(--primary);
        background: url('../../../images/home/new_version/video_icon.png') left center no-repeat;
        padding-left: 22px;
        font-weight: 600;
        margin-top:40px;
    }
}
// 右侧四个方块 start
.right{
    height: 442px;
    column-count: 2;
    column-gap: 16px;
    margin: 56px 0;
    max-width: 464px;
    @include pagePadding();
    padding-left: 0px!important;
    .item1,.item2,.item3,.item4{
        border-radius: 8px;
        background-color: #fff;
        padding: 16px;
        break-inside: avoid;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: all .2s linear;
        &.active{
            box-shadow: 0 0 5px 5px rgba(0,0,0,.1);
            &::after{
                content: '';
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 4px;
                background: #ebb650;
                transform-origin: left;
                animation: animLine 5s linear;
            }
        }
        &:hover {
            box-shadow: 0 0 5px 5px rgba(0,0,0,.1);
            &::after{
                animation-play-state: paused;
            }
        }
        .item-title{
            font-size: 14px;
            font-weight: 600;
            color: #333333;
        }
        .item-desc{
            font-size: 12px;
            color: #666;
            font-weight: 400;
        }
        .icon-list{
            column-count: 4;
            &.column5{
                column-count: 5;
            }
            .icon20{
                height: 20px;
            }
            .icon24{
                height: 24px;
                margin-top: 16px;
            }

        }
    }
    .item1{
        margin-bottom: 16px;
        .icon-list{
            margin-top: 4px;
        }
    }
    .item2{
        .center{
            width: 96px;
            display: block;
            margin: 16px auto 2px;
        }
        .icon20{
            margin-top: 12px;
        }
    }
    .item3-wrap{
        min-width: 220px;
        padding-top: 40px;
        .item3{
            margin-bottom: 16px;
            box-sizing: border-box;
        }
        .hr1{
            width: 55px;
            height: 10px;
            background: #F5F7F8;
            margin-top: 14px;
        }
        .hr2{
            width: 31px;
            height: 10px;
            background: #CFF5E5;
            margin-top: 4px;
        }
        .chart{
            display: flex;
            margin-top: 14px;
            justify-content:space-between;
            align-items: flex-end;
            .chart—item{
                width: 10px;
                max-width: 10px;
                background: #0062FF;
            }
        }
    }
    .item4{
        min-width: 220px;
        .item-title{
            margin-bottom: 14px;
        }
        .icon20{
            margin-bottom: 24px;
            height: 20px;
        }
        .icon-wrap{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
        }
        .icon-bottom{
            height: 14px;
        }
    }

} // 右侧四个方块 end

// 右侧四个方块的动画效果
@keyframes animLine {
 0% {
    transform: scaleX(0);

 }
 100% {
    transform: scaleX(1);
 }

}
</style>
