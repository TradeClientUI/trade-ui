<template>
    <div v-show='!isUniapp' id='nav-footer'>
        <div class='footer-wrap'>
            <div class='menu'>
                <div class='main' @click="expand('aboutus')">
                    <span>{{ $t('newHomeFooter.aboutus') }}</span>
                    <van-icon :name='aboutVis ? "minus" : "plus"' />
                </div>
                <div v-show='aboutVis' class='sub'>
                    <p class='link' @click='jumpUrl("notice")'>
                        {{ $t('route.noticeTitle') }}
                    </p>
                    <p class='link' @click='jumpUrl("aboutus")'>
                        {{ $t('newHomeFooter.aboutus') }}
                    </p>
                </div>
            </div>
            <div class='menu'>
                <div class='main' @click="expand('product')">
                    <span>{{ $t('newHomeFooter.product') }}</span>
                    <van-icon :name='productVis ? "minus" : "plus"' />
                </div>
                <!-- <div v-show='productVis' class='sub'>
                    <p class='link' @click='jumpUrl("trading")'>
                        {{ $t('route.trade') }}
                    </p>
                </div> -->
                <div v-show='productVis' class='sub'>
                    <p v-for='(item, index) in categoryList' :key='index' class='link' @click='toTrade(item)'>
                        {{ item.title }}
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
                    <!-- <p class='link' @click='jumpUrl("buyUSDT")'>
                        {{ $t('JG_HomeFooter.buyUSDT') }}
                    </p> -->
                    <p v-if='onlineService' class='link' @click='goService'>
                        {{ $t('newHomeFooter.customer') }}
                    </p>
                    <p class='link' @click='jumpUrl("fees")'>
                        {{ $t('newHomeFooter.fees') }}
                    </p>
                </div>
            </div>
        </div>
        <div class='social'>
            <p class='nav-dt'>
                {{ $t('newHomeFooter.followus') }}
            </p>
            <ul class='community-box f-b-t'>
                <li class='box-item' @click='jumpUrl("telegram")'>
                    <img alt='telegram' class='item-icon' src='../images/home/telegram.png' />
                </li>
                <li class='box-item' @click='jumpUrl("fb")'>
                    <img alt='facebook' class='item-icon' src='../images/home/facebook.png' />
                </li>
                <li class='box-item' @click='jumpUrl("twitter")'>
                    <img alt='twitter' class='item-icon' src='../images/home/twitter.png' />
                </li>
                <li class='box-item' @click='jumpUrl("yt")'>
                    <img alt='youtube' class='item-icon' src='../images/home/youtube.png' />
                </li>
                <li class='box-item' @click='jumpUrl("ins")'>
                    <img alt='instagram' class='item-icon' src='../images/home/instagram.png' />
                </li>
            </ul>
            <div class='risk'>
                <span class='red'>
                    {{ $t('newHomeFooter.riskWarning') }}:
                </span>
                <span>{{ $t('newHomeFooter.risk') }}</span>
            </div>
            <div class='copyright' v-html="$t('newHomeFooter.copyRight')"></div>
        </div>
    </div>
</template>

<script setup>
import LangPop from '@plans/components/langPop.vue'
import { getCookie } from '@/utils/util'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
const store = useStore()
const route = useRoute()
const router = useRouter()
const customerInfo = computed(() => store.state._user.customerInfo)
const onlineService = computed(() => store.state._base.wpCompanyInfo?.onlineService)

const isUniapp = route.query.isUniapp || route.query.isApp
const langObj = ref({
    'zh-CN': '简体中文',
    'en-US': 'English',
})
const lang = ref(getCookie('lang') || 'zh-CN')
const aboutVis = ref(false)
const serviceVis = ref(false)
const productVis = ref(false)
const helpVis = ref(false)
const activeVis = ref(false)

const expand = module => {
    if (module === 'product') {
        productVis.value = !productVis.value
    } else if (module === 'service') {
        serviceVis.value = !serviceVis.value
    } else if (module === 'help') {
        helpVis.value = !helpVis.value
    } else if (module === 'aboutus') {
        aboutVis.value = !aboutVis.value
    } else if (module === 'active') {
        activeVis.value = !activeVis.value
    }
}

const { t } = useI18n({ useScope: 'global' })
const categoryList = ref([
    { title: t('newHomeFooter.forex'), value: 'FX' },
    { title: t('newHomeFooter.gold'), value: 'Metal' },
    { title: t('newHomeFooter.crude'), value: 'Energy' },
    { title: t('newHomeFooter.cryptocurrency'), value: 'cryptocurrency' }
])
// 底部nav跳转
const jumpUrl = (index) => {
    const lang = getCookie('lang') || 'zh-CN'
    const linkList = {}
    const community = {
        fb: '',
        twitter: '',
        telegram: '',
        yt: '',
        tiktok: '',
        ins: ''
    }
    const symbolId = store.state._quote.productList.find(el => Number(el.tradeType) === 5 && el.symbolName)?.symbolId
    switch (index) {
        case 'fees':
            router.push({ path: '/fees' })
            break
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
            router.push({ path: '/earning' })
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
        case 'aboutus':
            router.push('aboutus')
            break
        case 'faqs':
            router.push('/faqs')
            break
        case 'policy':
            router.push('/privacy-policy')
            break
        case 'terms':
            router.push('/terms-conditions')
            break
        case 'registerFund':
            router.push('/fundV10/join')
            break
        case 'newActivities':
            router.push('/newCustomerActivities')
            break
        case 'referral':
            router.push('/openAccount')
            break
        case 'award':
            router.push('/transaction')
            break
        case 'notice':
            router.push('/msg')
            break
        case 'V10':
            router.push('/fundV10/index')
            break
        case 'whyFunds':
            router.push({ path: '/whyFunds' })
            break
        case 'buyUSDT':
            router.push('/buyUSDT')
            break
        default:
            const newLinkList = { ...linkList, ...community }
            if (newLinkList[index]) {
                window.open(newLinkList[index])
            }
    }
}
// 跳转指定标签类的产品到交易页面
const toTrade = (item) => {
    const curLabel = item.value
    const productList = store.state._quote.productList
    const findProduct = productList.find(el => el.labels.split('.').includes(curLabel))
    if (findProduct) {
        const { symbolKey, symbolCode, symbolId, tradeType } = findProduct
        store.commit('_quote/Update_productActivedID', symbolKey)
        router.push(`/order?name=${symbolCode}&symbolId=${symbolId}&tradeType=${tradeType}`)
    } else {
        const { symbolCode, symbolId, tradeType } = store.getters.productActived
        router.push(`/order?name=${symbolCode}&symbolId=${symbolId}&tradeType=${tradeType}`)
    }
}

const toAbout = () => {
    router.push({
        path: '/aboutus',
        query: {
            activeName: 'second'
        }
    })
}
</script>

<style lang="scss" scoped>
#nav-footer {
    background: #242424;
}
.footer-wrap {
    padding: rem(80px) rem(32px) rem(24px);
    color: #333;
    font-size: rem(28px);
    .menu {
        .main {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: rem(48px);
            line-height: rem(48px);
            font-weight: 600;
            font-size: rem(32px);
            color: #FFF;
            margin-bottom: rem(40px);
            .van-icon {
                font-weight: bold;
            }
        }
        .sub {
            padding-bottom: rem(40px);
            .link {
                position: relative;
                color: #999;
                line-height: rem(58px);
                padding-left: rem(22px);
                &::before {
                    position: absolute;
                    display: inline-block;
                    margin-left: rem(-20px);
                    color: #AAA;
                    content: '\2022';
                }
            }
        }
    }
}
.social {
    position: relative;
    padding: 0 rem(60px);
    .nav-dt {
        font-size: rem(32px);
        text-align: center;
        font-weight: 600;
        line-height: rem(48px);
        margin-bottom: rem(64px);
        color: #FFF;
    }
    .community-box {
        display: flex;
        justify-content: space-between;
        .box-item {
            .item-icon {
                margin-bottom: rem(80px);
                width: rem(48px);
                &.item-icon-tiktok {
                    border: 1px solid #999;
                    border-radius: 100%;
                    padding: 4px;
                }
            }
        }
    }
    .langWrap {
        margin: 10px 20%;
        .langBtn {
            height: 40px;
            color: #999;
            background: #F3F3F3;
            border-color: #F3F3F3;
        }
        :deep(.van-button__text) {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }
    }
    .risk,
    .copyright {
        line-height: rem(40px);
        color: #999;
        font-size: rem(24px);
        text-align: center;
        padding-bottom: rem(28px);
    }
    .risk {
        .red {
            color: red;
        }
        text-align: left;
        margin-bottom: 15px;
    }
}
</style>
