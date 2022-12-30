<template>
    <div class='WhyFunds'>
        <div class='group banner'>
            <p class='h1'>
                In the long term Over 90% of investors can't beat funds
            </p>
            <p class='bt-warp'>
                <span class='btn res' @click="handleClick( isLogin? 'deposit' : 'Register' )">
                    {{ isLogin? 'Deposit' : 'Register' }}
                </span>
                <span class='btn' @click="handleClick( isLogin? 'buyFunds' : 'login' )">
                    {{ isLogin? 'Buy funds' : 'Sign in' }}
                </span>
            </p>
            <img alt='' class='right' src='../../../images/business/whyFunds/banner.png' />
        </div>
        <div class='group round'>
            <p class='title'>
                What are crypto funds?
            </p>
            <p class='h3'>
                Investors buy funds via <br /> MagnaMarkets
            </p>
            <div class='cont'>
                <img alt='' class='img' src='../../../images/business/whyFunds/crypto.png' />
                <div class='center'>
                    <div class='item top'>
                        <p class='left-text'>
                            Investors can redeem part of or all crypto funds anytime
                        </p>
                        <p class='right-text'>
                            Managed by fund managers or smart contracts
                        </p>
                    </div>
                    <div class='item bottom'>
                        <p class='left-text'>
                            Aim to make profits for investors
                        </p>
                        <p class='right-text'>
                            Strict risk control through deep and extensive research
                        </p>
                    </div>
                </div>
            </div>
            <p class='h3'>
                Manage and invest in <br /> different cryptocurrencies
            </p>
        </div>
        <div class='group vs'>
            <p class='title'>
                Buying crypto funds is better than speculation
            </p>
            <p class='text-grey'>
                By regularly invest in index funds, the outsider investors can get more than most of the professional master’s performance.
            </p>
            <p class='text-grey'>
                <span style='letter-spacing: -2px;'>
                    ————
                </span>
                Warren Buffett
            </p>
            <div class='box-skew'>
                <div class='top'>
                    <img alt='' class='bgc' src='../../../images/business/whyFunds/buying.png' />
                    <div class='box-buy'>
                        <img alt='' class='icon' src='../../../images/business/whyFunds/buying-icon.png' />
                        <p class='hr'></p>
                        <p class='img-text'>
                            Buying crypto funds
                        </p>
                    </div>
                </div>
                <div class='list'>
                    <p class='item'>
                        <van-icon class='item-icon success' name='success' />
                        Simple and convenient
                    </p>
                    <p class='item'>
                        <van-icon class='item-icon success' name='success' />
                        Professional <br /> management team
                    </p>
                    <p class='item'>
                        <van-icon class='item-icon success' name='success' />
                        Diversify different <br /> targets, low risk
                    </p>
                    <p class='item'>
                        <van-icon class='item-icon success' name='success' />
                        Regular review
                    </p>
                    <p class='item'>
                        <van-icon class='item-icon success' name='success' />
                        Long-term investment <br /> with stable returns
                    </p>
                    <p class='item'>
                        <van-icon class='item-icon success' name='success' />
                        Professional team <br />research report
                    </p>
                </div>
            </div>
            <img alt='' class='center-img' src='../../../images/business/whyFunds/vs.png' />
            <div class='box-skew'>
                <div class='top'>
                    <img alt='' class='bgc' src='../../../images/business/whyFunds/speculating.png' />
                    <div class='box-buy'>
                        <img alt='' class='icon' src='../../../images/business/whyFunds/speculating-icon.png' />
                        <p class='hr'></p>
                        <p class='img-text'>
                            Speculation
                        </p>
                    </div>
                </div>
                <div class='list'>
                    <p class='item'>
                        <van-icon class='item-icon cross' name='cross' />
                        High requirements for <br /> selection
                    </p>
                    <p class='item'>
                        <van-icon class='item-icon cross' name='cross' />
                        Personal skills and <br /> discipline
                    </p>
                    <p class='item'>
                        <van-icon class='item-icon cross' name='cross' />
                        May encounter black <br /> swan, high risk
                    </p>
                    <p class='item'>
                        <van-icon class='item-icon cross' name='cross' />
                        Takes time to <br /> monitor
                    </p>
                    <p class='item'>
                        <van-icon class='item-icon cross' name='cross' />
                        High probability <br /> of loss
                    </p>
                    <p class='item'>
                        <van-icon class='item-icon cross' name='cross' />
                        Limited information <br /> and data
                    </p>
                </div>
            </div>
        </div>
        <div class='group carousel'>
            <p class='title'>
                Who is suitable to buy <br />crypto funds?
            </p>
            <div class='carousel-swipe'>
                <van-swipe ref='mySwipe' :autoplay='5000' class='my-swipe'>
                    <van-swipe-item>
                        <div class='item-warp'>
                            <img alt='' class='user-img' src='../../../images/business/whyFunds/user1.png' />
                            <p class='content'>
                                I think bitcoin is on the verge of getting broad acceptance by conventional finance people.
                            </p>
                            <p class='btn'>
                                <span style='letter-spacing: -2px;'>
                                    ——&nbsp;
                                </span>
                                Elon Musk. founder, CEO of SpaceX & Tesla, Inc.
                            </p>
                        </div>
                    </van-swipe-item>
                    <van-swipe-item>
                        <div class='item-warp'>
                            <img alt='' class='user-img' src='../../../images/business/whyFunds/user2.png' />
                            <p class='content'>
                                I do think Bitcoin is the first [encrypted money] that has the potential to do something like change the world.
                            </p>
                            <p class='btn line'>
                                <span style='letter-spacing: -2px;'>
                                    ——&nbsp;
                                </span>
                                Peter Thiel. Co-founder of PayPal
                            </p>
                        </div>
                    </van-swipe-item>
                    <van-swipe-item>
                        <div class='item-warp'>
                            <img alt='' class='user-img' src='../../../images/business/whyFunds/user3.png' />
                            <p class='content'>
                                As a portfolio manager, when do you start advising to your clients that they have some cryptocurrency exposure? When will there be an index fund, a mutual fund of cryptocurrencies? It will happen.
                            </p>
                            <p class='btn'>
                                <span style='letter-spacing: -2px;'>
                                    ——&nbsp;
                                </span>
                                Melanie Swan, Portfolio Analyst at New Holland Capital.
                            </p>
                        </div>
                    </van-swipe-item>
                    <van-swipe-item>
                        <div class='item-warp'>
                            <img alt='' class='user-img' src='../../../images/business/whyFunds/user4.png' />
                            <p class='content'>
                                It's an incredible asset. It's the only one with a limited supply with growing demand. It's an extraordinary thing, a call option on the future and the world's most pristine reserve asset.
                            </p>
                            <p class='btn'>
                                <span style='letter-spacing: -2px;'>
                                    ——&nbsp;
                                </span>
                                CEO & Co-Founder, Real Vision Group & Global Macro Investor
                            </p>
                        </div>
                    </van-swipe-item>
                </van-swipe>
                <div class='swipe-btn'>
                    <van-icon class='lfet' name='arrow-left' @click='mySwipe.prev()' />
                    <van-icon class='right' name='arrow' @click='mySwipe.next()' />
                </div>
            </div>
            <div class='row-icon'>
                <img alt='' src='../../../images/business/whyFunds/icon1.png' />
                <p class='text'>
                    Crypto beginners
                </p>
                <p class='num'>
                    01
                </p>
            </div>
            <div class='row-icon'>
                <img alt='' src='../../../images/business/whyFunds/icon2.png' />
                <p class='text'>
                    People who are not good at investments
                </p>
                <p class='num'>
                    02
                </p>
            </div>
            <div class='row-icon'>
                <img alt='' src='../../../images/business/whyFunds/icon3.png' />
                <p class='text'>
                    People who would like to earn passive income
                </p>
                <p class='num'>
                    03
                </p>
            </div>
            <div class='row-icon'>
                <img alt='' src='../../../images/business/whyFunds/icon4.png' />
                <p class='text'>
                    People who have lost money in cryptocurrency spot, futures or options
                </p>
                <p class='num'>
                    04
                </p>
            </div>
            <div class='row-icon'>
                <img alt='' src='../../../images/business/whyFunds/icon5.png' />
                <p class='text'>
                    People who have no time, professional finance knwoledge or fund managers
                </p>
                <p class='num'>
                    05
                </p>
            </div>
        </div>
        <div class='group'>
            <p class='title'>
                How to buy crypto funds?
            </p>
            <div class='htb'>
                <div class='list-icon'>
                    <img alt='' src='../../../images/business/whyFunds/icon01.png' />
                    <p>
                        <span class='tilte'>
                            01.
                        </span>
                        <span class='cont'>
                            Choose a good fund
                        </span>
                    </p>
                </div>
                <div class='list-icon'>
                    <img alt='' src='../../../images/business/whyFunds/icon02.png' />
                    <p>
                        <span class='tilte'>
                            02.
                        </span>
                        <span class='cont'>
                            Choose a good buy point
                        </span>
                    </p>
                </div>
                <div class='list-icon'>
                    <img alt='' src='../../../images/business/whyFunds/icon03.png' />
                    <p>
                        <span class='tilte'>
                            03.
                        </span>
                        <span class='cont'>
                            Hold it for a long time, then choose a good sell point
                        </span>
                    </p>
                </div>
                <div class='bot'>
                    <img alt='' src='../../../images/business/whyFunds/Vitatoken.png' />
                    <p class='h2'>
                        MagnaMarkets
                    </p>
                    <p class='h3'>
                        MagnaMarkets's quantitative engine will recommend high-quality funds, and long term indicators suggesting buying and selling zones.
                    </p>
                    <p>
                        <span class='btn btn-res' @click="handleClick( isLogin? 'deposit' : 'Register' )">
                            {{ isLogin? 'Deposit' : 'Register' }}
                        </span>
                        <span class='btn btn-log' @click="handleClick( isLogin? 'buyFunds' : 'login' )">
                            {{ isLogin? 'Buy funds' : 'Sign in' }}
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <NewFooter />
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { isUniapp } from '@/utils/util.js'
import NewFooter from '../../../layout/layoutBottom'

export default ({
    name: '',
    components: {
        NewFooter
    },
    props: {},
    setup (props, ctx) {
        const store = useStore()
        const isLogin = computed(() => route.query.isLogin || store.state._user.customerInfo)
        const route = useRoute()
        const router = useRouter()
        const handleClick = (type) => {
            if (type === 'login') {
                if (isUniapp) {
                    goAppPage('login')
                } else {
                    router.push('/login')
                }
            } else if (type === 'Register') {
                if (isUniapp) {
                    goAppPage('register')
                } else {
                    router.push('/register')
                }
            } else if (type === 'deposit') {
                if (isUniapp) {
                    goAppPage('deposit')
                } else {
                    router.push({
                        path: '/depositChoose',
                        query: {
                            tradeType: 5
                        }
                    })
                }
            } else if (type === 'buyFunds') {
                if (isUniapp) {
                    goAppPage('funds')
                } else {
                    router.push('/earning')
                }
            }
        }

        // 跳转到app页面
        const goAppPage = (type) => {
            uni.postMessage({
                data: {
                    action: 'message',
                    type,
                    params: { name: 'WhyFunds' }
                }
            })
        }

        const mySwipe = ref(null)
        return {
            handleClick,
            mySwipe,
            isLogin
        }
    },
})
</script>

<style lang="scss" scoped>
.WhyFunds {
    background-color: #FFF;
    padding-top: rem(128px);
    .group {
        padding: 0 rem(30px);
        padding-top: rem(80px);
        .title {
            font-size: rem(48px);
            margin: 0 auto rem(64px);
            text-align: center;
        }
    }
    .banner {
        .h1 {
            font-weight: 700;
            font-size: rem(48px);
        }
        .btn {
            display: inline-block;
            padding: 0 rem(60px);
            line-height: rem(60px);
            border: 1px solid #134CE1;
            border-radius: 12px 3px;
            margin-top: 30px;
            margin-bottom: 20px;
            &.res {
                margin-right: rem(40px);
                background: linear-gradient(270deg, #134CE1 0%, #4B77EC 100%);
                color: #FFF;
            }
        }
        img {
            width: 100%;
        }
    }
    .round {
        padding: 40px 0 0;
        width: 100%;
        position: relative;
        .img {
            width: 100%;
        }
        .h3 {
            max-width: rem(400px);
            text-align: center;
            padding: rem(20px) 0;
            box-shadow: 0 0 1px 1px rgb(27 44 88 / 9%);
            border-radius: rem(6px);
            font-size: rem(28px);
            margin: auto;
            background-color: #FFF;
        }
        .cont {
            position: relative;
            padding-top: rem(40px);
        }
        .center {
            position: absolute;
            top: rem(40px);
            .item {
                display: flex;
                justify-content: space-between;
                width: 100%;
                padding: 0 rem(30px);
                font-size: rem(28px);
                &.top {
                    margin-bottom: rem(420px);
                }
                .h3 {
                    max-width: rem(271px);
                }
            }
            .right-text {
                text-align: right;
            }
            .left-text {
                text-align: left;
            }
            .right-text,
            .left-text {
                max-width: 40%;
                padding: rem(20px) rem(10px);
                box-shadow: 0 0 1px 1px rgb(27 44 88 / 9%);
                border-radius: rem(6px);
                font-size: rem(28px);
                background-color: #FFF;
            }
        }
    }
    .vs {
        text-align: center;
        .text-grey {
            color: #999;
            text-align: center;
            font-size: rem(32px);
            margin-bottom: rem(48px);
        }
        .center-img {
            height: rem(200px);
        }
        .box-skew {
            width: 90%;
            margin: auto;
            position: relative;
            border-radius: rem(24px);
            border: rem(2px) solid #DCDCDC;
            transform: skew(-3deg);
            background-color: #FFF;
            text-align: left;
            .top {
                position: relative;
                .bgc {
                    width: 100%;
                    border-radius: rem(24px);
                }
                .box-buy {
                    color: #FFF;
                    font-weight: 600;
                    font-size: rem(48px);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    .icon,
                    .img-text {
                        z-index: 101;
                    }
                }
            }
            .hr {
                width: rem(500px);
                height: rem(8px);
                background-color: #FFF;
                transform: skew(-45deg);
                margin: rem(14px) auto rem(6px);
            }
            .icon {
                height: rem(70px);
            }
            .list {
                display: flex;
                flex-wrap: wrap;
                padding: rem(35px) 0 0 rem(30px);
                .item {
                    width: 50%;
                    font-size: rem(28px);
                    padding: 0 rem(10px) rem(40px) 0;
                    z-index: 101;
                }
                .item-icon {
                    font-size: rem(32px);
                    border-radius: 50%;
                    height: rem(90px);
                    width: rem(90px);
                    line-height: rem(60px);
                    text-align: center;
                    color: #FFF;
                    display: block;
                    margin-bottom: rem(16px);
                    &.success {
                        border: rem(12px) solid #D9FAFF;
                        background-color: #0CC3DC;
                    }
                    &.cross {
                        border: rem(12px) solid #FFD8D8;
                        background-color: #FF7F7F;
                    }
                }
            }
        }
    }
    .carousel {
        .my-swipe {
            padding: 1px;
        }
        .row-icon {
            background: #FFF;
            box-shadow: 0 0 rem(8px) rem(8px) rgba(27, 44, 88, 0.09);
            border-radius: rem(6px);
            padding: rem(30px) 0;
            display: flex;
            align-items: center;
            &:not(:last-child) {
                margin-bottom: rem(40px);
            }
            img {
                width: rem(170px);
            }
            .num {
                margin-left: auto;
                margin-right: 10px;
                font-size: rem(96px);
                font-weight: 700;
                color: #999;
            }
            .text {
                margin-right: rem(10px);
                font-size: rem(32px);
            }
        }
        .item-warp {
            text-align: center;
            position: relative;
            margin: rem(102px) 2px 0;
            padding-top: rem(240px);
            box-shadow: 0 0 1px 1px rgba(27, 44, 88, 0.09);
            border-radius: 3px;
            padding-bottom: rem(50px);
            .user-img {
                position: absolute;
                top: rem(-100px);
                left: 0;
                right: 0;
                margin: auto;
                height: rem(340px);
            }
            .content {
                font-size: rem(32px);
                font-weight: 500;
                margin: rem(24px) 0;
                min-height: rem(230px);
            }
            .btn {
                background: #0062FF;
                border-radius: rem(24px) rem(6px);
                width: rem(540px);
                margin: auto;
                margin-bottom: rem(10px);
                padding: rem(10px) rem(20px);
                color: #FFF;
                font-size: rem(28px);
                min-height: rem(100px);
                &.line {
                    line-height: rem(80px);
                }
            }
        }
        .carousel-swipe {
            margin-bottom: rem(40px);
            position: relative;
            .swipe-btn {
                position: absolute;
                top: rem(260px);
                width: 100%;
                display: flex;
                .van-icon {
                    width: rem(90px);
                    line-height: rem(90px);
                    background-color: #EBEEF7;
                    text-align: center;
                    border-radius: rem(6px);
                    color: #0062FF;
                    font-size: rem(32px);
                    display: block;
                }
                .right {
                    margin-left: auto;
                }
            }
        }
    }
    .htb {
        padding-bottom: rem(80px);
        .list-icon {
            display: flex;
            align-items: center;
            font-size: rem(32px);
            font-weight: 500;
            margin-bottom: 20px;
        }
        .tilte {
            display: block;
        }
        .bot {
            background: linear-gradient(125.12deg, #2058EE -4.12%, #144CE1 95.09%);
            border-radius: 12px;
            padding: rem(30px);
            text-align: center;
            color: #FFF;
            .h2 {
                margin: rem(28px) 0;
                font-size: rem(40px);
            }
            .h3 {
                font-size: rem(32px);
                margin-bottom: rem(24px);
            }
        }
        .btn {
            padding: rem(18px) rem(60px);
            border-radius: rem(24px) rem(6px);
            display: inline-block;
            &.btn-res {
                margin-right: rem(40px);
                background: linear-gradient(270deg, #E08B0A 0%, #FFDF39 100%);
            }
            &.btn-log {
                border: 1px solid #FFCA99;
            }
        }
    }
}

</style>
