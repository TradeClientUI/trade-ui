<template>
    <div class='buy'>
        <!-- <p class='tips'>
            Limited time offer: After successful fiat deposit, the deposit fees will be refunded >
        </p> -->
        <div class='bestPlatform'>
            <p class='title'>
                Best platform to buy USDT with card
            </p>
            <p class='h2'>
                Cooperating directly with UnionBank is safe and secure
            </p>
            <div class='btn-wrap'>
                <p class='btn' @click="handleClick(isLogin?'/depositChoose':'/register')">
                    {{ isLogin?'Deposit':'Register' }}
                </p>
                <p class='btn' @click="handleClick(isLogin?'/authentication':'/login')">
                    {{ isLogin?'Verify your account':'Sign in' }}
                </p>
                <p class='toV10'>
                    <span class='links' @click="handleClick('/noticeDetail')">
                        Register & verify to get V10 for free  >
                    </span>
                </p>
            </div>
        </div>
        <div class='tobuy bgc-whit'>
            <p class='cont_titel'>
                How to buy USDT with card
            </p>
            <div class='step'>
                <div class='step-item'>
                    <img alt='' src='../../../images/business/buyUSDT/step1.png' />
                    <span class='desc'>
                        Register
                    </span>
                </div>
                <img alt='' class='arrow' src='../../../images/business/buyUSDT/step_arrow.png' />
                <div class='step-item'>
                    <img alt='' src='../../../images/business/buyUSDT/step2.png' />
                    <span class='desc'>
                        Verify your account
                    </span>
                </div>
                <img alt='' class='arrow' src='../../../images/business/buyUSDT/step_arrow.png' />
                <div class='step-item'>
                    <img alt='' src='../../../images/business/buyUSDT/step3.png' />
                    <span class='desc'>
                        Buy crypto with USD
                    </span>
                </div>
            </div>
        </div>
        <div class='buying'>
            <p class='cont_titel'>
                The process of buying USDT via card
            </p>
            <div class='triangle'>
                <p class='top fcc'>
                    <img alt='' src='../../../images/business/buyUSDT/triangle.png' />
                    <span class='black'>
                        MagnaMarkets
                    </span>
                </p>
                <div class='center fcc'>
                    <p class='grey'>
                        UnionBank stores <br /> MagnaMarkets users' money
                    </p>
                    <img alt='' class='leftImg' src='../../../images/business/buyUSDT/triangle2-1.png' />
                    <img alt='' class='rightImg' src='../../../images/business/buyUSDT/triangle2-2.png' />
                    <p class='grey'>
                        Users deposit and <br />withdraw via ARX
                    </p>
                </div>
                <div class='bottom fcc'>
                    <p class='fcc'>
                        <img alt='' src='../../../images/business/buyUSDT/triangle3-1.png' />
                        <span class='black'>
                            UnionBank
                        </span>
                    </p>
                    <p class='arrow'>
                        <img alt='' class='arrow-img' src='../../../images/business/buyUSDT/triangle3-3.png' />
                        <span class='grey'>
                            ARX opens UnionBank <br />independent account
                        </span>
                    </p>
                    <p class='fcc'>
                        <img alt='' src='../../../images/business/buyUSDT/triangle3-2.png' />
                        <span class='black'>
                            ARX
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <div class='why bgc-whit'>
            <p class='cont_titel'>
                Why buy USDT on MagnaMarkets
            </p>
            <div class='step fcc'>
                <div v-for='item in whyList' :key='item.id' class='item'>
                    <img alt='' :src='item.img' />
                    <p class='label'>
                        {{ item.label }}
                    </p>
                    <p class='desc'>
                        {{ item.desc }}
                    </p>
                </div>
            </div>
        </div>
        <div class='increase bgc-whit'>
            <p class='cont_titel'>
                How do I increase my profits after buying USDT
            </p>
            <div class='increase-cont'>
                <p class='fcc'>
                    <img alt='' class='increaseLeft' src='../../../images/business/buyUSDT/increase1.png' />
                    <span class='name'>
                        V10 Index Fund
                    </span>
                </p>
                <p class='desc'>
                    The top 10 cryptocurrencies form V10,it reflects the  overall trend in cryptocurrency with asset traparency.
                </p>
                <div class='fcc'>
                    <p class='more'>
                        Know more about V10 <span class='link' @click="handleClick('/fundV10/index')">
                            Trade V10 for free >
                        </span>
                    </p>
                    <p class='more'>
                        Buy & Sell <span class='link' @click="handleClick('/order')">
                            V10/USDT >
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default ({
    name: '',
    components: {},
    props: {},
    setup (props, ctx) {
        const store = useStore()
        const router = useRouter()
        const isLogin = computed(() => store.state._user.customerInfo)
        const handleClick = (url) => {
            switch (url) {
                case '/order':
                    router.push({
                        path: '/order',
                        query: {
                            name: 'V10/USDT',
                            symbolId: 368,
                            tradeType: 5
                        }
                    })
                    break
                case '/noticeDetail':
                    router.push({
                        path: '/noticeDetail',
                        query: {
                            id: 40,
                            type: 'notice'
                        }
                    })
                    break
                case '/depositChoose':
                    router.push({
                        path: '/depositChoose',
                        query: {
                            type: 2
                        }
                    })
                    break
                default:
                    router.push({ path: url })
            }
        }
        const whyList = [
            { id: 1, img: require('../../../images/business/buyUSDT/why1.png'), label: 'Financial security', desc: 'Direct cooperation with UnionBank, funds are held in a separate account' },
            { id: 2, img: require('../../../images/business/buyUSDT/why2.png'), label: 'Strictly regulated', desc: 'Audited by Certik, licensed by CEZA & FinCEN' },
            { id: 3, img: require('../../../images/business/buyUSDT/why3.png'), label: 'Comprehensive risk control', desc: 'KYC , AML, delayed withdrawal and more to avoid illicit funds' },
            { id: 4, img: require('../../../images/business/buyUSDT/why4.png'), label: 'Simple and convenient', desc: 'Easy to buy crypto with a user-friendly interface' }
        ]
        return {
            isLogin,
            handleClick,
            whyList
        }
    }
})

</script>

<style lang='scss' scoped>
.buy {
    color: #111;
    background-color: #FFF;
    @include globalFont();
    .tips {
        height: 45px;
        background: #EBB650;
        font-size: 14px;
        font-weight: 500;
        line-height: 45px;
        text-align: center;
        cursor: pointer;
    }
    .bestPlatform {
        height: 395px;
        text-align: center;
        background-image: url('../../../images/business/buyUSDT/pcbg.png');
        padding-top: 64px;
        .title {
            font-size: 48px;
            font-weight: bold;
            line-height: 72px;
        }
        .h2 {
            font-size: 28px;
            line-height: 42px;
            font-weight: 400;
            color: #333;
        }
        .btn-wrap {
            margin: auto;
            margin-top: 58px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            width: 560px;
            .btn {
                width: 260px;
                height: 58px;
                background: #FFF;
                border-radius: 12px;
                font-weight: 600;
                font-size: 16px;
                line-height: 58px;
                cursor: pointer;
                text-align: center;
                color: #0062FF;
                border: 2px solid rgba(0, 0, 0, 0.1);
                &:first-child {
                    margin-right: 40px;
                    background: #0062FF;
                    color: #FFF;
                    border: 0;
                }
            }
            .toV10 {
                flex: 1;
                color: #333;
                font-size: 14px;
                font-weight: 600;
                color: #333;
                margin-top: 16px;
                text-align: left;
            }
            .links {
                cursor: pointer;
                &:hover {
                    color: #0062FF;
                }
            }
        }
    }
    .tobuy {
        padding-bottom: 65px;
        .step {
            margin-top: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            .arrow {
                height: 6px;
            }
            .step-item {
                width: 353px;
                text-align: center;
                .desc {
                    display: block;
                    margin-top: 16px;
                    font-size: 20px;
                    font-weight: 600;
                    line-height: 30px;
                }
            }
        }
    }
    .buying {
        background-color: #F2F4F8;
        padding-bottom: 64px;
        .triangle {
            .top {
                margin: 48px 0;
            }
            .black {
                font-weight: 600;
                font-size: 16px;
                margin-left: 8px;
            }
            .center {
                margin-bottom: 72px;
                .leftImg {
                    margin-right: 240px;
                    margin-left: 16px;
                }
                .rightImg {
                    margin-right: 16px;
                }
            }
            .bottom {
                align-items: flex-start;
                .arrow {
                    text-align: center;
                    margin: 0 48px;
                    &-img {
                        width: 120px;
                        margin-top: 25px;
                    }
                }
                .grey {
                    display: block;
                    margin-top: 32px;
                }
                .fcc {
                    width: 144px;
                }
            }
            .grey {
                color: #666;
                font-size: 16px;
                font-weight: 600;
                text-align: right;
            }
        }
    }
    .why {
        width: 1280px;
        .step {
            margin-top: 48px;
            padding: 0 32px;
            justify-content: space-between;
            align-items: baseline;
        }
        .item {
            text-align: center;
            width: 300px;
            .label {
                font-size: 14px;
                font-weight: 600;
                color: #333;
                line-height: 21px;
                margin-top: 24px;
            }
            .desc {
                font-weight: 400;
                color: #666;
                margin-top: 8px;
                text-align: center;
            }
        }
    }
    .increase {
        &-cont {
            margin-top: 80px;
            text-align: center;
            .desc {
                width: 100%;
                margin-top: 5px;
                font-weight: 600;
                color: #333;
                font-size: 30px;
            }
            .name {
                font-size: 16px;
                font-weight: 400;
                margin-left: 8px;
                line-height: 42px;
            }
            .gary {
                font-size: 15px;
                font-weight: 400;
                color: #666;
            }
            .usdt {
                font-size: 30px;
                font-weight: 600;
                color: #333;
            }
            .percent {
                color: #0062FF;
                font-weight: 600;
                font-size: 14px;
            }
            .more {
                margin-top: 40px;
                margin-right: 90px;
                font-size: 16px;
                font-weight: 600;
                color: #333;
                .link {
                    cursor: pointer;
                    margin-left: 16px;
                }
            }
        }
        .increaseLeft {
            width: 42px;
        }
        .increaseRight {
            display: block;
            width: 100%;
        }
    }
    .cont_titel {
        font-size: 48px;
        font-weight: bold;
        line-height: 72px;
        text-align: center;
        padding-top: 48px;
    }
    .bgc-whit { // 内容模块
        padding-bottom: 64px;
        max-width: 1280px;
        margin: 0 auto;
    }
    .fcc {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
