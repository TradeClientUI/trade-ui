<template>
    <div class='WhyFunds'>
        <div class='group banner'>
            <div class='left'>
                <span class='text'>
                    In the long term Over 90% of investors can't beat funds
                </span>
                <span class='btn res' @click="handleClick( isLogin? 'deposit' : 'Register' )">
                    {{ isLogin? 'Deposit' : 'Register' }}
                </span>
                <span class='btn' @click="handleClick( isLogin? 'buyFunds' : 'login' )">
                    {{ isLogin? 'Buy funds' : 'Sign in' }}
                </span>
            </div>
            <img alt='' class='right' src='../../../images/business/whyFunds/banner.png' />
        </div>
        <div class='group'>
            <p class='title'>
                What are crypto funds?
            </p>
            <div class='frame'>
                <div class='item'>
                    <p class='boxText'>
                        Investors can redeem part of <br /> or all crypto funds anytime
                    </p>
                    <p class='boxText'>
                        Aim to make profits for <br />investors
                    </p>
                </div>
                <div class='item center'>
                    <p class='boxText'>
                        Investors buy funds via <br /> CATS
                    </p>
                    <p class='boxText'>
                        Manage and invest in <br /> different cryptocurrencies
                    </p>
                </div>
                <div class='item'>
                    <p class='boxText'>
                        Managed by fund managers  <br /> or smart contracts
                    </p>
                    <p class='boxText'>
                        Strict risk control through <br /> deep and extensive research
                    </p>
                </div>
            </div>
        </div>
        <div class='group vs'>
            <p class='title'>
                Buying crypto funds is better <br /> than speculation
            </p>
            <p class='text-grey'>
                By regularly invest in index funds, the outsider investors can get more <br />than most of the professional master’s performance.
            </p>
            <p class='text-grey'>
                <span style='letter-spacing: -2px;'>
                    ————
                </span>
                Warren Buffett
            </p>
            <div class='flex'>
                <div class='box'>
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
                <img alt='' class='center' src='../../../images/business/whyFunds/vs.png' />
                <div class='box'>
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
        </div>
        <div class='group'>
            <p class='title'>
                Who is suitable to buy <br />crypto funds?
            </p>
            <el-carousel arrow='always' :autoplay='false' height='344px' :interval='5000'>
                <el-carousel-item>
                    <div class='evaluate'>
                        <div class='message-text'>
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
                        <img alt='' class='user-img' src='../../../images/business/whyFunds/user1.png' />
                    </div>
                </el-carousel-item>
                <el-carousel-item>
                    <div class='evaluate'>
                        <div class='message-text'>
                            <p class='content'>
                                I do think Bitcoin is the first [encrypted money] that has the potential to do something like change the world.
                            </p>
                            <p class='btn'>
                                <span style='letter-spacing: -2px;'>
                                    ——&nbsp;
                                </span>
                                Peter Thiel. Co-founder of PayPal
                            </p>
                        </div>
                        <img alt='' class='user-img' src='../../../images/business/whyFunds/user2.png' />
                    </div>
                </el-carousel-item>
                <el-carousel-item>
                    <div class='evaluate'>
                        <div class='message-text'>
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
                        <img alt='' class='user-img' src='../../../images/business/whyFunds/user3.png' />
                    </div>
                </el-carousel-item>
                <el-carousel-item>
                    <div class='evaluate'>
                        <div class='message-text'>
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
                        <img alt='' class='user-img' src='../../../images/business/whyFunds/user4.png' />
                    </div>
                </el-carousel-item>
            </el-carousel>
            <div class='row-icon'>
                <div class='item'>
                    <img alt='' src='../../../images/business/whyFunds/icon1.png' />
                    <p class='num'>
                        01
                    </p>
                    <p class='text'>
                        Crypto beginners
                    </p>
                </div>
                <div class='item center'>
                    <img alt='' src='../../../images/business/whyFunds/icon2.png' />
                    <p class='num'>
                        02
                    </p>
                    <p class='text'>
                        People who are not good at investments
                    </p>
                </div>
                <div class='item'>
                    <img alt='' src='../../../images/business/whyFunds/icon3.png' />
                    <p class='num'>
                        03
                    </p>
                    <p class='text'>
                        People who would like to earn passive income
                    </p>
                </div>
                <div class='item'>
                    <img alt='' src='../../../images/business/whyFunds/icon4.png' />
                    <p class='num'>
                        04
                    </p>
                    <p class='text'>
                        People who have lost money in cryptocurrency spot, futures or options
                    </p>
                </div>
                <div class='item center'>
                    <img alt='' src='../../../images/business/whyFunds/icon5.png' />
                    <p class='num'>
                        05
                    </p>
                    <p class='text'>
                        People who have no time, professional finance knwoledge or fund managers
                    </p>
                </div>
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
                <div class='right'>
                    <img alt='' src='../../../images/business/whyFunds/Vita.png' />
                    <p class='h2'>
                        CATS
                    </p>
                    <p class='h3'>
                        CATS' quantitative engine will recommend high-quality funds, and long- term indicators suggesting buying and selling zones
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
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const isLogin = computed(() => store.state._user.customerInfo)
const handleClick = (type) => {
    if (type === 'login') {
        router.push('/login')
    } else if (type === 'Register') {
        router.push('/register')
    } else if (type === 'deposit') {
        router.push({
            path: '/depositChoose',
            query: {
                tradeType: 5
            }
        })
    } else if (type === 'buyFunds') {
        router.push('/earning')
    }
}
</script>

<style lang="scss" scoped>
.WhyFunds {
    background-color: #FFF;
    .group {
        padding-top: 60px;
        width: 1200px;
        margin: 0 auto;
        .title {
            font-size: 30px;
            text-align: center;
            font-weight: 600;
            margin-bottom: 32px;
        }
        :deep(.el-carousel__arrow) {
            border-radius: 1%;
            top: 65%;
            background: #EBEEF7;
            color: var(--primary);
            font-size: 20px;
        }
        :deep(.el-carousel__button) {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #E0E2EA;
        }
        :deep(.is-active > .el-carousel__button) {
            background: var(--primary);
        }
        :deep(.el-carousel__arrow--left) {
            left: 0;
        }
        :deep(.el-carousel__arrow--right) {
            right: 0;
        }
    }
    .banner {
        display: flex;
        align-items: center;
        .right {
            height: 445px;
        }
        .text {
            font-weight: 700;
            font-size: 48px;
            line-height: 59px;
            display: inline-block;
            margin-bottom: 30px;
        }
        .btn {
            width: 128px;
            height: 40px;
            border-radius: 12px 3px;
            display: inline-block;
            border: 1px solid #134CE1;
            line-height: 40px;
            text-align: center;
            cursor: pointer;
            &.res {
                background: linear-gradient(270deg, #134CE1 0%, #4B77EC 100%);
                color: #FFF;
                margin-right: 40px;
            }
        }
    }
    .frame {
        height: 720px;
        background-image: url('../../../images/business/whyFunds/crypto.png');
        display: flex;
        justify-content: center;
        background-size: auto 640px;
        background-repeat: no-repeat;
        background-position: center center;
        .item {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            padding-bottom: 34px;
            text-align: right;
            &.center {
                justify-content: space-between;
                text-align: center;
            }
            &:last-child {
                text-align: left;
            }
        }
        .boxText {
            width: 272px;
            padding: 10px;
            box-shadow: 0 20px 120px rgba(27, 44, 88, 0.09);
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
        }
    }
    .vs {
        padding-top: 26px;
        .title {
            font-style: italic;
        }
        .text-grey {
            color: #999;
            text-align: center;
            font-size: 16px;
            margin-bottom: 20px;
        }
        .flex {
            margin-top: 60px;
            display: flex;
            .box {
                transform: skew(357deg);
                border-radius: 12px;
                border: 1px solid #DCDCDC;
                .top {
                    position: relative;
                    .bgc {
                        width: 100%;
                        border-radius: 12px;
                    }
                }
                .box-buy {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    right: 0;
                    left: 0;
                    color: #FFF;
                    text-align: center;
                    font-weight: 600;
                    font-size: 24px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    .icon,
                    .img-text {
                        z-index: 101;
                    }
                }
                .hr {
                    width: 250px;
                    height: 4px;
                    background-color: #FFF;
                    transform: skew(-45deg);
                    margin: 14px auto 6px;
                }
                .icon {
                    height: 70px;
                }
                .list {
                    display: flex;
                    flex-wrap: wrap;
                    padding: 10px 20px;
                    .item {
                        width: 50%;
                        font-size: 16px;
                        font-weight: 400;
                        padding: 10px 0;
                        z-index: 101;
                    }
                    .item-icon {
                        font-size: 15px;
                        border-radius: 50%;
                        height: 45px;
                        width: 45px;
                        line-height: 30px;
                        text-align: center;
                        color: #FFF;
                        display: block;
                        margin-bottom: 16px;
                        &.success {
                            border: 6px solid #D9FAFF;
                            background-color: #0CC3DC;
                        }
                        &.cross {
                            border: 6px solid #FFD8D8;
                            background-color: #FF7F7F;
                        }
                    }
                }
            }
            .center {
                height: 243px;
                align-self: center;
            }
        }
    }
    .evaluate {
        // height: 340px;
        padding-top: 74px;
        padding-bottom: 4px;
        position: relative;
        .message-text {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 1074px;
            height: 266px;
            margin: 0 auto;
            box-shadow: 0 0 2px 2px rgba(27, 44, 88, 0.09);
            border-radius: 3px;
            padding: 30px 80px;
        }
        .user-img {
            position: absolute;
            top: 0;
            right: 64px;
        }
        .content {
            font-size: 20px;
            font-weight: 600;
            max-width: 564px;
            margin-bottom: 20px;
        }
        .btn {
            background: var(--primary);
            border-radius: 12px 3px;
            width: 292px;
            height: 60px;
            padding: 10px 20px;
            color: #FFF;
            font-size: 14px;
        }
    }
    .row-icon {
        display: flex;
        flex-wrap: wrap;
        width: 1074px;
        margin-left: 63px;
        margin-top: 60px;
        .item {
            padding-bottom: 108px;
            margin-bottom: 60px;
            &:nth-child(odd) {
                img {
                    box-shadow: 0 0 10px 2px rgb(0 0 0 / 9%);
                    border-radius: 3px;
                }
            }
            &:nth-child(even) {
                img {
                    border: 1px solid #E3E3E3;
                    border-radius: 3px;
                }
            }
            &.center {
                margin: 0 280px;
            }
            .num {
                position: absolute;
                font-size: 96px;
                font-weight: 700;
                color: #F7F7F7;
            }
            .text {
                position: absolute;
                font-weight: 600;
                font-size: 20px;
                line-height: 24px;
                color: #333;
                max-width: 224px;
                margin-top: 78px;
            }
        }
    }
    .htb {
        position: relative;
        height: 470px;
        padding-bottom: 60px;
        .list-icon {
            display: flex;
            align-items: center;
            font-size: 16px;
            margin-bottom: 10px;
            padding-top: 20px;
            .tilte {
                display: block;
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 5px;
            }
            img {
                margin-right: 20px;
            }
        }
        .right {
            position: absolute;
            top: 0;
            right: 0;
            width: 477px;
            background: linear-gradient(125.12deg, #2058EE -4.12%, #144CE1 95.09%);
            box-shadow: 0 20px 120px rgba(19, 49, 128, 0.16);
            border-radius: 12px;
            text-align: center;
            padding: 30px 0;
            color: #FFF;
            .h2 {
                font-size: 20px;
                font-weight: 600;
                margin: 28px 0;
            }
            .h3 {
                font-size: 16px;
                line-height: 20px;
                max-width: 370px;
                margin: 20px auto;
            }
            .btn {
                display: inline-block;
                width: 152px;
                line-height: 40px;
                border-radius: 12px 3px;
                cursor: pointer;
                &-res {
                    background: linear-gradient(270deg, #E08B0A 0%, #FFDF39 100%);
                }
                &-log {
                    border: 1px solid #FFCA99;
                    margin-left: 20px;
                }
            }
        }
    }
}
</style>
