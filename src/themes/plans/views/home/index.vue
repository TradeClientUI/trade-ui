<template>
    <div class='page-wrap'>
        <div class='banner'>
            <van-swipe :autoplay='3000' class='my-swipe' indicator-color='white'>
                <van-swipe-item>
                    <router-link to='fundProductList'>
                        <img alt='' :src='require("../../images/banner/h5banner5-"+ lang +".jpg")' srcset='' />
                    </router-link>
                </van-swipe-item>
                <van-swipe-item>
                    <router-link to='fundProductList'>
                        <img alt='' :src='require("../../images/banner/h5banner3-"+ lang +".png")' srcset='' />
                    </router-link>
                </van-swipe-item>
            </van-swipe>
        </div>

        <div v-if='!customerInfo' class='reg-wrap'>
            <div class='input-wrap'>
                <input v-model='regVal' :placeholder="$t('home.emailOrPhone')" type='text' />
            </div>
            <div class='btn' @click='start'>
                {{ $t('home.getStarted') }}
            </div>
        </div>

        <FundDesc />

        <div class='product-wrap'>
            <h1>{{ $t('home.marketTrend') }}</h1>

            <div class='list'>
                <div class='header'>
                    <span>{{ $t('trade.symbol') }}</span>
                    <span>{{ $t('trade.positionLastPrice') }}</span>
                    <span>{{ $t('trade.upDown') }} </span>
                </div>
                <ul class='content'>
                    <li v-for='item in productList' :key='item.symbolKey' class='product' @click='openProduct(item)'>
                        <currency-icon class='icon' :currency='item.baseCurrency' :size='36' />
                        <div class='symbol'>
                            <p class='symbol-name'>
                                <span class='sn-text'>
                                    {{ item.symbolName }}
                                </span>
                                <span v-if='item.etf' class='etf'>
                                    ETF
                                </span>
                            </p>

                            <p class='symbol-code'>
                                {{ item.symbolCode }}
                            </p>
                        </div>
                        <div class='price'>
                            <p class='cur-price' :class='item.cur_color'>
                                {{ item.cur_price }}
                            </p>
                        </div>
                        <div class='price'>
                            <p class='up-down' :class='item.upDownColor'>
                                {{ item.upDownWidth }}
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
            <router-link class='view-more' to='/quote'>
                {{ $t('common.viewMore') }}
                <van-icon name='arrow' />
            </router-link>
        </div>

        <div class='portfolio'>
            <p class='t1'>
                {{ $t('home.portfolioCreate.text1') }}
            </p>
            <!-- <p class='t2'>
                Start your first trade with these easy steps.
            </p> -->
            <div class='img-wrap'>
                <img alt='' class='pro-img' src='/images/portfolio-section.png' srcset='' />
            </div>
            <ul class='pro-list'>
                <li class='pro-item'>
                    <img alt='' class='icon-img' src='/images/threeStep_img2.png' srcset='' />
                    <p class='t3'>
                        {{ $t('home.portfolioCreate.text2') }}
                    </p>
                    <p class='t4'>
                        {{ $t('home.portfolioCreate.text3') }}
                    </p>
                </li>
                <li class='pro-item'>
                    <img alt='' class='icon-img' src='/images/threeStep_img3.png' srcset='' />
                    <p class='t3'>
                        {{ $t('home.portfolioCreate.text4') }}
                    </p>
                    <p class='t4'>
                        {{ $t('home.portfolioCreate.text5') }}
                    </p>
                </li>
                <li class='pro-item'>
                    <img alt='' class='icon-img' src='/images/threeStep_img4.png' srcset='' />
                    <p class='t3'>
                        {{ $t('home.portfolioCreate.text6') }}
                    </p>
                    <p class='t4'>
                        {{ $t('home.portfolioCreate.text7') }}
                    </p>
                </li>
            </ul>
            <router-link v-if='!customerInfo' class='start-btn' to='/register'>
                {{ $t('home.getStarted') }}
            </router-link>
        </div>

        <Portfolio />

        <!-- 信息流 屏蔽-->
        <!-- <div class='news-wrap'>
            <News :data='newsData' />
        </div> -->

        <!-- why模块 -->
        <div class='why-wrap'>
            <div class='descBarTitle'>
                {{ $t('home.why.text1') }}
            </div>
            <div class='descList'>
                <div class='row'>
                    <img alt='' class='icon' src='~@plans/images/moneyBox.png' />
                    <p class='descTitle'>
                        {{ $t('home.why.text2') }}
                    </p>
                    <p class='descContent'>
                        {{ $t('home.why.text3') }}
                    </p>
                </div>
                <div class='row'>
                    <img alt='' class='icon' src='~@plans/images/trafficLight.png' />
                    <p class='descTitle'>
                        {{ $t('home.why.text4') }}
                    </p>
                    <p class='descContent'>
                        {{ $t('home.why.text5') }}
                    </p>
                </div>
                <div class='row'>
                    <img alt='' class='icon' src='~@plans/images/lock.png' />
                    <p class='descTitle'>
                        {{ $t('home.why.text6') }}
                    </p>
                    <p class='descContent'>
                        {{ $t('home.why.text7') }}
                    </p>
                </div>
                <div class='row'>
                    <img alt='' class='icon' src='~@plans/images/check.png' />
                    <p class='descTitle'>
                        {{ $t('home.why.text8') }}
                    </p>
                    <p class='descContent'>
                        {{ $t('home.why.text9') }}
                    </p>
                </div>
            </div>
        </div>

        <div v-if='!customerInfo' class='registerFooter'>
            <div class='css-128y11d'>
                <div class='immediatelyText'>
                    {{ $t('home.getProfit') }}
                </div>
                <div class='css-1r4nzjd'>
                    <a id='buttom_cta_trade_now' class=' css-1alo8h7' data-bn-type='button' href='https://accounts.binance.com/zh-CN/register'>
                    </a>
                    <van-button block class='lijiRegister' type='primary' @click="$router.push('/register')">
                        {{ $t('home.toReg') }}
                    </van-button>
                </div>
            </div>
        </div>

        <!-- 页脚 -->
        <div class='footer-wrap'>
            <div class='menu'>
                <div class='main' @click="expand('about')">
                    <span>{{ $t('newHomeFooter.aboutus') }}</span>
                    <van-icon :name='aboutVis ? "minus" : "plus"' />
                </div>
                <div v-show='aboutVis' class='sub'>
                    <p class='link' @click='jumpUrl("about")'>
                        {{ $t('newHomeFooter.aboutus') }}
                    </p>
                </div>
            </div>
            <div class='menu'>
                <div class='main' @click="expand('product')">
                    <span>{{ $t('newHomeFooter.product') }}</span>
                    <van-icon :name='productVis ? "minus" : "plus"' />
                </div>
                <div v-show='productVis' class='sub'>
                    <p class='link' @click='jumpUrl("trading")'>
                        {{ $t('newHomeFooter.trading') }}
                    </p>
                    <p class='link' @click='jumpUrl("fund")'>
                        {{ $t('newHomeFooter.fund') }}
                    </p>
                </div>
            </div>
            <div class='menu'>
                <div class='main' @click="expand('service')">
                    <span>{{ $t('newHomeFooter.service') }}</span>
                    <van-icon :name='serviceVis ? "minus" : "plus"' />
                </div>
                <div v-show='serviceVis' class='sub'>
                    <!-- <p class='link' @click='jumpUrl("program")'>
                        {{ $t('newHomeFooter.program') }}
                    </p> -->
                    <p class='link' @click='jumpUrl("vip")'>
                        {{ $t('newHomeFooter.vip') }}
                    </p>
                    <p class='link' @click='jumpUrl("customer")'>
                        {{ $t('newHomeFooter.customer') }}
                    </p>
                </div>
            </div>
            <div class='menu'>
                <div class='main' @click="expand('help')">
                    <span>{{ $t('newHomeFooter.help') }}</span>
                    <van-icon :name='helpVis ? "minus" : "plus"' />
                </div>
                <div v-show='helpVis' class='sub'>
                    <p class='link' @click='jumpUrl("faqs")'>
                        {{ $t('newHomeFooter.faqs') }}
                    </p>
                    <p class='link' @click='jumpUrl("terms")'>
                        {{ $t('newHomeFooter.terms') }}
                    </p>
                    <p class='link' @click='jumpUrl("policy")'>
                        {{ $t('newHomeFooter.policy') }}
                    </p>
                </div>
            </div>
        </div>

        <div class='social'>
            <p class='nav-dt'>
                {{ $t('newHomeFooter.followus') }}
            </p>
            <ul class='community-box f-b-t'>
                <li class='box-item' @click='jumpUrl("fb")'>
                    <img alt='facebook' class='item-icon' src='../../images/home/facebook.png' />
                </li>
                <li class='box-item' @click='jumpUrl("ig")'>
                    <img alt='instagram' class='item-icon' src='../../images/home/instagram.png' />
                </li>
                <li class='box-item' @click='jumpUrl("twitter")'>
                    <img alt='twitter' class='item-icon' src='../../images/home/twitter.png' />
                </li>
                <li class='box-item' @click='jumpUrl("telegram")'>
                    <img alt='telegram' class='item-icon' src='../../images/home/telegram.png' />
                </li>
                <li class='box-item' @click='jumpUrl("yt")'>
                    <img alt='youtube' class='item-icon' src='../../images/home/youtube.png' />
                </li>
            </ul>

            <div class='langWrap'>
                <van-button block class='langBtn' plain type='primary' @click='langShow=true'>
                    <span>{{ langObj[lang] }}</span>
                    <span class='arrow icon_icon_arrow'></span>
                </van-button>
            </div>

            <div class='copyright'>
                Vitatoken © 2022
            </div>
        </div>

        <div v-if='privacyVis' class='privacy'>
            <div class='close-wrap'>
                <div class='close' @click='privacyVis=false'>
                    <svg class='icon-svg' height='10' viewBox='0 0 20 20' width='10' xmlns='http://www.w3.org/2000/svg'>
                        <g><polygon points='18.096 19.174 19.497 17.747 1.7 .286 .3 1.714' /><polygon points='19.497 1.714 18.096 .286 .3 17.747 1.7 19.174' /></g>
                    </svg>
                </div>
            </div>

            <div class='content'>
                {{ $t('home.privacy.text1') }}
                <a class='sc-AxiKw cJlLNA' color='light' href='https://www.vitatoken.io/site/privacy-policy' rel='noopener' target='_blank'>
                    {{ $t('home.privacy.text2') }}
                </a>
            </div>
            <div class='footer'>
                <span class='agree' @click='agree'>
                    {{ $t('home.privacy.agree') }}
                </span>
                <div class='close-btn' @click='privacyVis=false'>
                    {{ $t('home.privacy.close') }}
                </div>
            </div>
        </div>

        <div class='serviceIcon' @click='toService'>
            <!-- <img alt='' src='/images/serviceIcon.png' /> -->
            <i class='icon icon_xiaoxizhongxin'></i>
        </div>

        <LangPop v-model='langShow' />
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { setCookie, getCookie, isEmpty, localGet, localSet } from '@/utils/util'
import News from '@plans/modules/news/news.vue'
import LangPop from './components/langPop.vue'
import FundDesc from './components/fundDesc.vue'
import Portfolio from './components/portfolio.vue'
import { useStore } from 'vuex'
import currencyIcon from '@/components/currencyIcon.vue'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const store = useStore()
const { t } = useI18n({ useScope: 'global' })
const customerInfo = computed(() => store.state._user.customerInfo)

const langShow = ref(false)
const langObj = ref({
    'zh-CN': '简体中文',
    'en-US': 'English',
})
const regVal = ref('')
const lang = ref(getCookie('lang') || 'zh-CN')
const newsData = ref({ orgid: 1, newsArea: 1 })
const aboutVis = ref(false)
const serviceVis = ref(false)
const productVis = ref(false)
const helpVis = ref(false)
const privacyVis = ref(false)
const symbolKeys = ['368_5', '328_5', '329_5', '331_5', '332_5', '323_5'] // prd
// const symbolKeys = ['1_5', '21_5', '22_5', '23_5', '26_5', '28_5']
// const symbolKeys = ['1564_5', '706_5', '709_5', '714_5', '720_5', '717_5'] // pre
// uat 测试 1 、 21 、22、23、26、28

// 产品列表数据
const productList = symbolKeys.map(key => store.state._quote.productMap[key]).filter(elem => elem)

const start = () => {
    const param = regVal.value.includes('@') ? { email: regVal.value } : { mobile: regVal.value }
    router.push({
        path: 'register',
        query: param
    })
}

const expand = module => {
    if (module === 'product') {
        productVis.value = !productVis.value
    } else if (module === 'service') {
        serviceVis.value = !serviceVis.value
    } else if (module === 'help') {
        helpVis.value = !helpVis.value
    } else if (module === 'about') {
        aboutVis.value = !aboutVis.value
    }
}

// 底部nav跳转
const jumpUrl = (index) => {
    const lang = getCookie('lang') || 'zh-CN'
    let linkList = {}
    if (lang === 'zh-CN') {
        linkList = {
            trading: 'https://www.vitatoken.io/zh-CN/order?symbolId=364&tradeType=5',
            fund: 'https://www.vitatoken.io/zh-CN/fund',
            program: 'https://www.vitatoken.io/zh-CN/new1',
            vip: 'https://www.vitatoken.io/zh-CN/vip',
            customer: 'https://cs.vitatoken.io:443/im/text/1cayxu.html?lang=en',
            faqs: 'https://www.vitatoken.io/site/faqs',
            terms: 'https://www.vitatoken.io/site/terms-conditions',
            policy: 'https://www.vitatoken.io/site/privacy-policy',
            // abount: 'https://www.vitatoken.io/site/about-us'
        }
    } else {
        linkList = {
            trading: 'https://www.vitatoken.io/en-US/order?symbolId=364&tradeType=5',
            fund: 'https://www.vitatoken.io/en-US/fund',
            program: 'https://www.vitatoken.io/en-US/new1',
            vip: 'https://www.vitatoken.io/en-US/vip',
            customer: 'https://cs.vitatoken.io:443/im/text/1cayxu.html?lang=en',
            faqs: 'https://www.vitatoken.io/site/faqs',
            terms: 'https://www.vitatoken.io/site/terms-conditions',
            policy: 'https://www.vitatoken.io/site/privacy-policy',
            // abount: 'https://www.vitatoken.io/site/about-us'
        }
    }
    const community = {
        fb: 'https://www.facebook.com/Vitatoken-100578379186941',
        ig: 'https://www.instagram.com/vitatoken_official/',
        twitter: 'https://twitter.com/Vitatoken_',
        telegram: 'https://t.me/VitatokenEnglish',
        yt: 'https://www.youtube.com/channel/UCWrIoUETskxOU9zIVpba6Hg'
    }
    const symbolId = store.state._quote.productList.find(el => Number(el.tradeType) === 5 && el.symbolName)?.symbolId
    switch (index) {
        case 'trading':
            router.push({
                path: '/order',
                query: {
                    symbolId,
                    tradeType: 5
                }
            })
            break
        case 'fund':
            router.push({ path: '/fundProductList' })
            break
        case 'vip':
            if (customerInfo.value) {
                router.push({ path: '/assets' })
            } else {
                router.push({
                    path: '/register',
                    query: {
                        openAccountType: 1
                    }
                })
            }
            break
        case 'about':
            router.push('/about')
            break
        default:
            const newLinkList = { ...linkList, ...community }
            if (newLinkList[index]) {
                window.open(newLinkList[index])
            }
    }
}

const openProduct = (data) => {
    // router.push({ name: 'Order', query: { symbolId: data.symbolId, direction: 'buy' } })
    router.push(`/product?symbolId=${data.symbolId}&tradeType=${data.tradeType}`)
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

const agree = () => {
    localSet('privacyFlag', true)
    privacyVis.value = false
}

if (!localGet('privacyFlag')) {
    privacyVis.value = true
}

QuoteSocket.add_subscribe({ moduleId: 'home', symbolKeys })

</script>

<style lang="scss">
.descBarTitle {
    box-sizing: border-box;
    min-width: 0;
    // margin-top: 80px;
    padding-bottom: 10px;
    color: #1E2329;
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    text-align: center;
}
.descList {
    padding-top: 40px;
    padding-right: 16px;
    padding-bottom: 16px;
    padding-left: 16px;
    text-align: center;
    background: var(--contentColor);
    .row {
        margin-bottom: 40px;
    }
    .icon {
        width: 56px;
    }
    .descTitle {
        margin-bottom: 8px;
        padding-top: 10px;
        color: #1E2329;
        font-weight: 500;
        font-size: 20px;
        line-height: 28px;
    }
    .descContent {
        min-height: 1.2em;
        color: #474D57;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
    }
}
.registerFooter {
    padding: 40px 16px 16px;
    text-align: center;
    .immediatelyText {
        color: #1E2329;
        font-weight: 600;
        font-size: 24px;
        line-height: 32px;
        text-align: center;
    }
    .lijiRegister {
        height: 48px;
        margin-top: 24px;
        font-size: 16px;
        background-color: #0062FF;
        border-color: #0062FF;
        border-radius: rem(10px);
    }
}
.page-wrap {
    .banner {
        //background-image: linear-gradient(120deg, #84FAB0 0%, #8FD3F4 100%);
        img {
            width: 100%;
        }
    }
    .reg-wrap {
        padding: rem(50px) rem(30px) 0;
        .input-wrap {
            height: rem(76px);
            margin-bottom: 16px;
            line-height: rem(76px);
            background-color: #FFF;
            border: 1px solid transparent;
            border-color: var(--lineColor);
            border-radius: 4px;
            input {
                width: 100%;
                padding-left: rem(20px);
            }
        }
        .btn {
            width: 100%;
            height: rem(96px);
            margin-left: 0;
            color: #FFF;
            font-size: 16px;
            line-height: rem(96px);
            text-align: center;
            background-color: #0062FF;
            border-radius: rem(10px);
        }
    }
    .portfolio {
        margin-top: rem(40px);
        margin-bottom: rem(30px);
        padding: rem(60px) rem(30px);
        background: var(--contentColor);
        .t1 {
            color: #1E2329;
            font-weight: 600;
            font-size: 24px;
            line-height: 32px;
            text-align: center;
        }
        .t2 {
            margin-top: 8px;
            color: #474D57;
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
        }
        .img-wrap {
            margin-top: 40px;
            margin-bottom: 40px;
            text-align: center;
            .pro-img {
                width: 220px;
            }
        }
        .pro-list {
            text-align: center;
            .pro-item {
                margin-bottom: 40px;
                .icon-img {
                    width: rem(96px);
                    margin-bottom: 16px;
                }
                .t3 {
                    margin-bottom: 8px;
                    color: #1E2329;
                    font-weight: 500;
                    font-size: 20px;
                    line-height: 28px;
                }
                .t4 {
                    color: #474D57;
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 20px;
                }
            }
        }
        .start-btn {
            display: inline-block;
            width: 100%;
            color: #FFF;
            font-size: 16px;
            line-height: 48px;
            text-align: center;
            background-color: #0062FF;
            border-radius: 5px;
            cursor: pointer;
        }
    }
    .product-wrap {
        margin-top: rem(50px);
        padding: rem(60px) rem(30px);
        background: var(--contentColor);
        h1 {
            padding-bottom: 24px;
            font-size: 24px;
        }
        .list {
            .header {
                display: flex;
                margin: rem(20px) 0 rem(50px);
                color: var(--minorColor);
                >span {
                    flex: 1;
                    font-size: 12px;
                    text-align: right;
                    &:first-child {
                        flex: 2;
                        text-align: left;
                    }
                }
            }
            .content {
                .product {
                    display: flex;
                    align-items: center;
                    margin-bottom: rem(40px);
                    .icon {
                        width: rem(65px);
                        height: rem(65px);
                        margin-right: rem(20px);
                        img {
                            width: 100%;
                        }
                    }
                    .symbol {
                        .symbol-name {
                            width: rem(290px);
                            margin-bottom: rem(10px);
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            .sn-text {
                                display: inline-block;
                                margin-right: rem(10px);
                                overflow: hidden;
                                color: var(--color);
                                font-weight: bold;
                                font-size: rem(28px);
                                vertical-align: middle;
                            }
                            .etf {
                                display: inline-block;
                                padding: 0 rem(6px);
                                color: var(--primary);
                                font-size: rem(20px);
                                text-align: center;
                                vertical-align: middle;
                                background: none;
                                border: 1px solid var(--primary);
                                border-radius: rem(10px);
                            }
                        }
                        .symbol-code {
                            width: rem(320px);
                            overflow: hidden;
                            color: var(--minorColor);
                            font-size: rem(24px);
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                    }
                    .price {
                        flex: 1;
                        font-size: 14px;
                        .cur-price {
                            text-align: right;
                        }
                        .up-down {
                            font-weight: 500;
                            font-weight: bold;
                            text-align: right;
                        }
                    }
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }
        }
        .view-more {
            display: inline-block;
            margin-top: rem(60px);
            color: var(--minorColor);
            font-size: rem(24px);
        }
    }
    .why-wrap {
        margin: rem(50px) 0 0;
        padding: rem(50px) 0;
        background: var(--contentColor);
    }
    .footer-wrap {
        margin-top: rem(50px);
        padding: rem(30px);
        color: #FFF;
        font-size: rem(28px);
        background: #12161C;
        .menu {
            .main {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: rem(84px);
                font-weight: bold;
                font-size: rem(30px);
                line-height: rem(84px);
                .van-icon {
                    font-weight: bold;
                }
            }
            .sub {
                padding-bottom: 20px;
                .link {
                    position: relative;
                    padding: rem(15px) 0 rem(15px) 28px;
                    color: var(--normalColor);
                    &::before {
                        position: absolute;
                        top: 2px;
                        display: inline-block;
                        margin-left: -20px;
                        color: #959595;
                        font-size: 24px;
                        font-family: Arial, sans-serif;
                        content: '\2022';
                    }
                }
            }
        }
    }
}
.social {
    position: relative;
    padding: 0 rem(30px) rem(30px) rem(30px);
    color: rgb(234, 236, 239);
    background: rgb(18, 22, 28);
    .nav-dt {
        padding: rem(40px) 0;
        font-size: 16px;
        text-align: center;
    }
    .community-box {
        display: flex;
        justify-content: center;
        .box-item {
            display: inline-block;
            flex: 1;
            text-align: center;
            .icon-label {
                font-size: rem(20px);
            }
            .item-icon {
                margin-bottom: rem(10px);
            }
        }
    }
    .langWrap {
        margin: 10px 20%;
        .langBtn {
            height: 40px;
            color: #333;
            background: #999;
            border-color: #999;
        }
        .van-button__text {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }
    }
    .copyright {
        margin-top: rem(30px);
        padding-top: rem(30px);
        color: rgb(234, 236, 239);
        font-size: 14px;
        text-align: center;
        border-top: 1px solid #555;
    }
}
.privacy {
    position: sticky;
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
            font-size: 14px;
            white-space: nowrap;
            background-color: var(--primary);
            border: 1px solid var(--primary);
            border-radius: 4px;
            cursor: pointer;
        }
    }
}
.serviceIcon {
    position: fixed;
    right: 24px;
    bottom: 16px;
    z-index: 109;
    display: flex;
    align-items: center;
    justify-content: center;
    width: rem(80px);
    height: rem(80px);
    background: #0062FF;
    border-radius: 50%;
    .icon {
        color: #FFF;
        font-size: rem(40px);
    }
}
</style>
