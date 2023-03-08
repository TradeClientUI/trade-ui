<template>
    <div class='buy'>
        <!-- <p class='tips'>
            Limited time offer: After successful fiat deposit, the deposit fees will be refunded >
        </p> -->
        <div class='cont-banner'>
            <p class='h1'>
                Best platform to buy USDT with card
            </p>
            <p class='h2'>
                Cooperating directly with UnionBank is <br />safe and secure
            </p>
            <p class='bt-warp'>
                <span class='btn-res' @click="handleClick( isLogin? 'deposit' : 'register' )">
                    {{ isLogin? 'Deposit' : 'Register' }}
                </span>
                <span class='toV10' @click="handleClick('noticeDetail')">
                    Register & verify to get V10 for free >
                </span>
                <span class='btn-log' @click="handleClick( isLogin? 'kyc' : 'login' )">
                    {{ isLogin?'Verify your account':'Sign in' }}
                </span>
            </p>
        </div>
        <div class='how'>
            <p class='cont-title'>
                How to buy USDT with card
            </p>
            <img alt='' class='img' src='../../../images/business/buyUSDT/how1.png' />
            <p class='desc'>
                Register
            </p>
            <img alt='' class='arrow' src='../../../images/business/buyUSDT/how4.png' />
            <img alt='' class='img' src='../../../images/business/buyUSDT/how2.png' />
            <p class='desc'>
                Verify your account
            </p>
            <img alt='' class='arrow' src='../../../images/business/buyUSDT/how4.png' />
            <img alt='' class='img' src='../../../images/business/buyUSDT/how3.png' />
            <p class='desc'>
                Buy crypto with USD
            </p>
        </div>
        <div class='buying'>
            <p class='cont-title'>
                The process of buying <br /> USDT via card
            </p>
            <div class='top'>
                <p class='desc'>
                    CATS
                </p>
            </div>
            <div class='center'>
                <span class='gary'>
                    UnionBank stores <br /> CATS users' <br /> money
                </span>
                <div class='edge edge_left'></div>
                <div class='edge edge_right'></div>
                <!-- <img alt='' class='leftImg' src='../../../images/business/buyUSDT/buying2-1.png' />
                <img alt='' class='rightImg' src='../../../images/business/buyUSDT/buying2-2.png' /> -->
                <span class='gary'>
                    Users deposit <br />and withdraw <br />via ARX
                </span>
            </div>
            <div class='bottom'>
                <div class='item1'>
                    <img alt='' class='buying_logo' src='../../../images/business/buyUSDT/buying3-1.png' />
                    <p class='desc'>
                        UnionBank
                    </p>
                </div>
                <div class='item2'>
                    <div class='edge edge_bottom'></div>
                    <!-- <img alt='' class='arrow_img' src='../../../images/business/buyUSDT/buying3-2.png' /> -->
                    <p class='gary'>
                        ARX opens UnionBank independent account
                    </p>
                </div>
                <div class='item3'>
                    <img alt='' class='buying_logo' src='../../../images/business/buyUSDT/buying3-3.png' />
                    <p class='desc'>
                        ARX
                    </p>
                </div>
            </div>
        </div>
        <div class='why'>
            <p class='cont-title'>
                Why buy USDT on Cats
            </p>
            <div v-for='item in whyList' :key='item.id' class='item'>
                <img alt='' class='why_img' :src='item.img' />
                <p class='label'>
                    {{ item.label }}
                </p>
                <p class='desc' v-html='item.desc'>
                </p>
            </div>
        </div>
        <div class='increase'>
            <p class='cont-title'>
                How do I increase my profits after buying USDT
            </p>
            <div class='top'>
                <img alt='' class='v10Img' src='../../../images/business/buyUSDT/increase1.png' />
                <span class='text'>
                    V10 Index Fund
                </span>
            </div>
            <p class='h2'>
                The top 10 cryptocurrencies form V10,it reflects the overall trend in cryptocurrency with asset traparency.
            </p>
            <div class='fl'>
                <p class='item'>
                    Know more about V10
                    <span
                        class='link'
                        @click="handleClick('v10')"
                    >
                        Trade V10 for free >
                    </span>
                </p>
                <p class='item'>
                    Buy & Sell
                    <span class='link' @click="handleClick('order')">
                        V10/USDT >
                    </span>
                </p>
            </div>
        </div>
        <NewFooter />
    </div>
</template>

<script>
import NewFooter from '../../../layout/layoutBottom'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { isUniapp } from '@/utils/util.js'
import { useRouter } from 'vue-router'
export default ({
    name: '',
    components: {
        NewFooter
    },
    props: {},
    setup () {
        const store = useStore()
        const router = useRouter()
        const isLogin = computed(() => store.state._user.customerInfo)
        const handleClick = (url) => {
            if (isUniapp) {
                goAppPage(url)
            } else {
                switch (url) {
                    case 'deposit':
                        router.push({
                            path: '/depositChoose',
                            query: {
                                type: 2
                            }
                        })
                        break
                    case 'noticeDetail':
                        router.push({
                            path: '/noticeDetail',
                            query: {
                                id: 40,
                                type: 'notice'
                            }
                        })
                        break
                    case 'v10':
                        router.push({ path: '/fundV10/index' })
                        break
                    case 'kyc':
                        router.push({ path: '/authentication' })
                        break
                    case 'order':
                        router.push({
                            path: '/order',
                            query: {
                                name: 'V10/USDT',
                                symbolId: 368,
                                tradeType: 5
                            }
                        })
                        break
                    default:
                        router.push({ path: '/' + url })
                }
            }
        }
        // 跳转到app页面
        const goAppPage = (type) => {
            const params = {}
            if (type === 'order') {
                params.name = 'V10/USDT'
                params.symbolId = 368
                params.tradeType = 5
            }
            uni.postMessage({
                data: {
                    action: 'message',
                    type,
                    params
                }
            })
        }
        const whyList = [
            { id: 1, img: require('../../../images/business/buyUSDT/why1.png'), label: 'Financial security', desc: 'Direct cooperation with UnionBank, funds are <br/> held in a separate account' },
            { id: 2, img: require('../../../images/business/buyUSDT/why2.png'), label: 'Strictly regulated', desc: 'Audited by __placeholder, licensed by __placeholder & FinCEN' },
            { id: 3, img: require('../../../images/business/buyUSDT/why3.png'), label: 'Comprehensive risk control', desc: 'KYC , AML, delayed withdrawal and more to avoid  <br/> illicit funds' },
            { id: 4, img: require('../../../images/business/buyUSDT/why4.png'), label: 'Simple and convenient', desc: 'Easy to buy crypto with a user-friendly interface' }
        ]
        return {
            whyList,
            isLogin,
            handleClick
        }
    },
})
</script>

<style lang='scss' scoped>
.buy {
    background-color: #FFF;
    color: #111;
}
.tips {
    background-color: #EBB650;
    padding: rem(24px) rem(20px);
    font-size: rem(24px);
    font-weight: 500;
    text-align: center;
}
.cont-banner {
    background-image: url('../../../images/business/buyUSDT/h5bg.png');
    padding: rem(68px) rem(32px) rem(70px);
    text-align: center;
    .h1 {
        font-size: rem(56px);
        font-weight: bold;
    }
    .h2 {
        font-size: rem(32px);
        font-weight: 400;
        margin-top: rem(40px);
    }
    .bt-warp {
        margin-top: rem(80px);
        span {
            display: block;
            width: 100%;
            font-size: rem(28px);
            font-weight: 600;
        }
        .btn-res {
            background: #0062FF;
            border-radius: rem(20px);
            line-height: rem(86px);
            color: #FFF;
        }
        .btn-log {
            color: #0062FF;
            line-height: rem(82px);
            background: #FFF;
            border-radius: rem(20px);
            border: rem(4px) solid rgba(0, 0, 0, 0.15);
        }
        .toV10 {
            font-size: rem(24px);
            height: rem(36px);
            line-height: rem(36px);
            margin-top: rem(16px);
            margin-bottom: rem(40px);
        }
    }
}
.how {
    text-align: center;
    padding-bottom: rem(80px);
    .img {
        display: block;
        margin: auto;
        width: rem(96px);
    }
    .arrow {
        margin: rem(24px) auto;
        height: rem(180px);
    }
    .desc {
        font-size: rem(32px);
        font-weight: 500;
        margin-top: rem(12px);
    }
}
.why {
    text-align: center;
    font-size: rem(24px);
    .item {
        padding-bottom: rem(80px);
    }
    .cont-title {
        padding: rem(96px) rem(0);
    }
    .why_img {
        width: rem(96px);
    }
    .label {
        color: #333;
        font-weight: 600;
        line-height: rem(36px);
        margin-top: rem(48px);
    }
    .desc {
        font-weight: 400;
        color: #666;
        margin-top: rem(16px);
    }
}
.buying {
    background-color: #F2F4F8;
    text-align: center;
    padding-bottom: rem(80px);
    .top {
        padding-left: rem(32px);
    }
    .center {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: rem(32px);
        .rightImg {
            width: rem(73px);
        }
        .leftImg {
            width: rem(73px);
        }
        .gary {
            font-weight: 600;
            color: #666;
            font-size: rem(24px);
            text-align: right;
        }
    }
    .bottom {
        display: flex;
        padding: 0 rem(32px);
        .item2 {
            min-width: rem(200px);
            font-weight: 600;
            color: #666;
            font-size: rem(24px);
            text-align: center;
            // padding-top: rem(64px);
            margin-right: rem(50px);
            margin-left: rem(88px);
            .gary {
                margin-top: rem(32px);
            }
            .arrow_img {
                width: rem(120px);
            }
        }
        .item3 {
            padding: 0 rem(42px);
        }
    }
    .desc {
        font-size: rem(28px);
        font-weight: 600;
        line-height: rem(42px);
    }
    .buying_logo {
        width: rem(72px);
    }
    .edge {
        background-image: url('../../../images/business/buyUSDT/buying3-2.png');
        background-size: 100% 100%;
        width: rem(96px);
        height: rem(12px);
        &_left {
            transform: rotate(120deg);
        }
        &_right {
            transform: rotate(240deg);
        }
        &_bottom {
            width: rem(110px);
            margin: auto;
        }
    }
}
.increase {
    text-align: center;
    padding-bottom: rem(80px);
    .top {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: rem(10px);
        .text {
            font-size: rem(28px);
            font-weight: 400;
        }
        .v10Img {
            width: rem(84px);
            margin-right: rem(24px);
        }
    }
    .h2 {
        font-size: rem(28px);
        font-weight: 600;
        color: #333;
        padding: 0 rem(32px);
    }
    .fl {
        display: flex;
        justify-content: space-between;
        font-size: rem(28px);
        font-weight: 600;
        line-height: rem(42px);
        padding: rem(64px) rem(32px) 0;
        align-items: center;
        .link {
            display: block;
            color: #0062FF;
        }
        .gary {
            font-weight: 400;
            color: #666;
            font-size: rem(26px);
            margin-right: rem(16px);
        }
        .usdt {
            display: flex;
            font-weight: 600;
            color: #333;
            font-size: rem(48px);
        }
        .percent {
            font-weight: 600;
            color: #0062FF;
            font-size: rem(24px);
        }
    }
    .increase-img {
        width: rem(686px);
        height: rem(127px);
        margin: rem(80px) auto;
    }
}
.cont-title {
    font-size: rem(48px);
    font-weight: bold;
    text-align: center;
    padding: rem(96px) rem(32px);
}
</style>
