<template>
    <div class='footer-nav' :class='[$route.name]'>
        <div>
            <canvas id='canvas' ref='canvasRef'></canvas>
            <div class='footer-auto'>
                <div class='nav-left'>
                    <ul>
                        <li>
                            <h4 class='title'>
                                {{ $t('newHomeFooter.aboutus') }}
                            </h4>
                            <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("notice")'>
                                    {{ $t('route.noticeTitle') }}
                                </a>
                            </p>
                            <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("about")'>
                                    {{ $t('newHomeFooter.aboutus') }}
                                </a>
                            </p>
                        </li>
                        <li>
                            <h4 class='title'>
                                {{ $t('newHomeFooter.product') }}
                            </h4>
                            <!-- <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("trading")'>
                                    {{ $t('route.trade') }}
                                </a>
                            </p> -->
                            <p v-for='(item, index) in categoryList' :key='index' class='name'>
                                <a href='javascript:;' @click='jumpUrl("trading")'>
                                    {{ item.title }}
                                </a>
                            </p>
                        </li>
                        <li>
                            <h4 class='title'>
                                {{ $t('newHomeFooter.service') }}
                            </h4>
                            <!-- <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("program")'>
                                    {{ $t('newHomeFooter.program') }}
                                </a>
                            </p> -->
                            <!-- <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("buyUSDT")'>
                                    {{ $t('JG_HomeFooter.buyUSDT') }}
                                </a>
                            </p> -->
                            <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("customer")'>
                                    {{ $t('newHomeFooter.customer') }}
                                </a>
                            </p>
                            <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("fees")'>
                                    {{ $t('newHomeFooter.fees') }}
                                </a>
                            </p>
                        </li>
                        <li>
                            <h4 class='title'>
                                {{ $t('newHomeFooter.help') }}
                            </h4>
                            <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("faqs")'>
                                    {{ $t('newHomeFooter.faqs') }}
                                </a>
                            </p>
                            <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("terms")'>
                                    {{ $t('newHomeFooter.terms') }}
                                </a>
                            </p>
                            <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("policy")'>
                                    {{ $t('newHomeFooter.policy') }}
                                </a>
                            </p>
                        </li>
                    </ul>
                </div>
                <div class='nav-right'>
                    <h4 class='title'>
                        {{ $t('newHomeFooter.followus') }}
                    </h4>
                    <ul>
                        <li @click='jumpUrl("telegram")'>
                            <img class='icon' src='../../images/home/telegram.png' />
                        </li>
                        <li @click='jumpUrl("fb")'>
                            <img class='icon' src='../../images/home/facebook.png' />
                        </li>
                        <li @click='jumpUrl("twitter")'>
                            <img class='icon' src='../../images/home/twitter.png' />
                        </li>
                        <li @click='jumpUrl("yt")'>
                            <img class='icon' src='../../images/home/youtube.png' />
                        </li>
                        <li @click='jumpUrl("tiktok")'>
                            <img class='icon icon-tiktok' src='../../images/home/tiktok.png' />
                        </li>
                    </ul>

                    <!-- <div class='lang-select' @click='openLangDialog'>
                        <span>
                            {{ currentLang.name }}
                        </span>
                        <i :class="['icon', 'icon_icon_arrow', { 'rotate': langDialogShow }]"></i>
                    </div> -->
                </div>
            </div>
            <div class='footer-last'>
                <p class='risk'>
                    <span class='red'>
                        {{ $t('newHomeFooter.riskWarning') }}:
                    </span>
                    <span>{{ $t('newHomeFooter.risk') }}</span>
                </p>
                <p class='year' v-html="$t('newHomeFooter.copyRight')"></p>
            </div>
        </div>
    </div>
    <!-- 语言弹窗 -->
    <!-- <lang-dialog ref='langDialogRef' v-model='langDialogShow' /> -->
</template>

<script>
import { ref, computed, unref, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getCookie } from '@/utils/util.js'
import langDialog from '../../layout/components/lang-dialog.vue'
import useMethods from '@planspc/hooks/useMethods'
import Wave from '../../utils/wave'
import { useI18n } from 'vue-i18n'

export default {
    components: {
    },
    setup () {
        const store = useStore()
        const router = useRouter()

        const { toOrderPriority } = useMethods()

        // 用户信息
        const customerInfo = computed(() => store.state._user.customerInfo)
        // 语言列表
        const langActions = store.state.supportLanguages
        // 当前语言
        const currentLang = langActions.find(el => el.val === getCookie('lang'))
        // 组件ref
        const langDialogRef = ref(null)
        // 是否显示语言弹窗
        const langDialogShow = ref(false)

        // 打开语言弹窗
        const openLangDialog = () => {
            langDialogRef.value.open()
        }

        const { t } = useI18n({ useScope: 'global' })
        const categoryList = ref([
            { title: t('newHomeFooter.forex') },
            { title: t('newHomeFooter.gold') },
            { title: t('newHomeFooter.crude') },
            { title: t('newHomeFooter.cryptocurrency') }
        ])
        // 底部nav跳转
        const jumpUrl = (index) => {
            const lang = getCookie('lang') || 'zh-CN'
            let linkList = {}
            if (lang === 'zh-CN') {
                linkList = {
                    trading: 'https://www.vitatoken.io/zh-CN/order?symbolId=692&tradeType=1',
                    fund: 'https://www.vitatoken.io/zh-CN/fund',
                    program: 'https://www.vitatoken.io/zh-CN/new1',
                    vip: 'https://www.vitatoken.io/zh-CN/vip',
                    customer: store.state._base.wpCompanyInfo.onlineService,
                    // faqs: 'https://www.vitatoken.io/site/faqs',
                    // terms: 'https://www.vitatoken.io/site/terms-conditions',
                    // policy: 'https://www.vitatoken.io/site/privacy-policy',
                    // about: 'https://www.vitatoken.io/site/about-us'
                    // fees: 'https://vitatoken.io/site/Fees.pdf'
                }
            } else {
                linkList = {
                    trading: 'https://www.vitatoken.io/en-US/order?symbolId=692&tradeType=1',
                    fund: 'https://www.vitatoken.io/en-US/fund',
                    program: 'https://www.vitatoken.io/en-US/new1',
                    vip: 'https://www.vitatoken.io/en-US/vip',
                    customer: store.state._base.wpCompanyInfo.onlineService,
                    // faqs: 'https://www.vitatoken.io/site/faqs',
                    // terms: 'https://www.vitatoken.io/site/terms-conditions',
                    // policy: 'https://www.vitatoken.io/site/privacy-policy',
                    // about: 'https://www.vitatoken.io/site/about-us'
                    // fees: 'https://vitatoken.io/site/Fees.pdf'
                }
            }
            const community = {
                fb: 'https://www.facebook.com/profile.php?id=100088996032867',
                twitter: 'https://twitter.com/MagnaMarkets',
                telegram: 'https://t.me/magnamarket',
                yt: 'https://www.youtube.com/channel/UC8Stt_tYcUqHZKdPrLQuGhw',
                tiktok: 'https://tiktok.com/@officialMagnaMarkets'
            }
            switch (index) {
                case 'trading':
                    toOrderPriority(1)
                    break
                case 'fund':
                    router.push({ path: '/earning' })
                    break
                case 'fees':
                    router.push({ path: '/fees' })
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
                    router.push('/aboutus')
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
                case 'referral':
                    router.push('/openAccount')
                    break
                case 'award':
                    router.push('/transaction')
                    break
                case 'registerFund':
                    router.push('/fundV10/join')
                    break
                case 'newActivities':
                    router.push('/newCustomerActivities')
                    break
                case 'notice':
                    router.push('/notice')
                    break
                case 'V10':
                    router.push('/fundV10/index')
                    break
                case 'WhyFunds':
                    router.push({ path: '/WhyFunds' })
                    break
                case 'buyUSDT':
                    router.push('/buyUSDT')
                    break
                case 'customer':
                    router.push('/service')
                    break
                default:
                    const newLinkList = { ...linkList, ...community }
                    if (newLinkList[index]) {
                        window.open(newLinkList[index])
                    }
            }
        }

        // 跳转板块
        const jumpQuote = (categoryType) => {
            router.push({
                path: '/quote',
                query: {
                    categoryType
                }
            })
        }

        const toAbout = () => {
            router.push({
                path: '/about',
                query: {
                    activeName: 'second'
                }
            })
        }

        const waveRef = ref(null)

        onMounted(() => {
            var cvs = document.getElementById('canvas')
            if (cvs && cvs.getContext) {
                waveRef.value = new Wave({
                    canvas: cvs,
                    color: 'rgba(238, 238, 238, .05)'
                })
                waveRef.value.setSpeed(0.03)
                waveRef.value.setNoise(0.5)
                waveRef.value.start()
            }
        })

        onUnmounted(() => {
            if (unref(waveRef)) {
                waveRef.value.stop()
            }
        })

        return {
            jumpUrl,
            currentLang,
            langDialogRef,
            openLangDialog,
            langDialogShow,
            toAbout,
            jumpQuote,
            categoryList
        }
    }
}
</script>

<style lang="scss" scoped>
.footer-nav {
    @include pagePadding();
    position: relative;
    // height: 380px;
    // background: #242424;
    background: #191E24;
    margin-top: 8px;
    &.Home,
    &.Order,
    &.Assets {
        margin-top: 0;
    }
    .footer-auto {
        @include pagePadding();
        max-width: 1280px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        padding-top: 40px !important;
        position: relative;
    }
    .nav-left {
        ul {
            display: flex;
        }
        li {
            padding: 0 32px;
            &:last-of-type {
                margin-right: 0;
            }
            .title {
                margin-bottom: 24px;
                color: #FFF;
                font-weight: 500;
                font-size: 16px;
            }
            .name {
                position: relative;
                margin-top: 12px;
                color: #999;
                // &::before {
                //     position: absolute;
                //     top: -3px;
                //     display: inline-block;
                //     margin-left: -20px;
                //     color: #959595;
                //     font-size: 24px;
                //     font-family: Arial, sans-serif;
                //     line-height: 1;
                //     content: '\2022';
                // }
                a {
                    color: #999;
                    font-size: 14px;
                    font-weight: 400;
                    line-height: 16px;
                    &:hover {
                        color: var(--primary);
                    }
                }
            }
        }
    }
    .nav-right {
        .title {
            margin-bottom: 24px;
            color: #FFF;
            font-weight: 500;
            font-size: 16px;
        }
        ul {
            display: flex;
            margin: 16px 0;
            li {
                align-items: center;
                margin-right: 28px;
                cursor: pointer;
                &:hover {
                    opacity: 0.8;
                }
                &:last-of-type {
                    margin-right: 0;
                }
                .icon {
                    width: 24px;
                    height: auto;
                    display: block;
                    &.icon-tiktok {
                        border: 1px solid #999;
                        border-radius: 100%;
                        padding: 4px;
                    }
                }
            }
        }
        .item-row2 {
            justify-content: center;
            margin: 0;
        }
    }
}
.lang-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 170px;
    height: 36px;
    margin-top: 20px;
    padding: 0 20px;
    color: #1E2329;
    background: #F8F8F8;
    border: 1px solid #E6E6E6;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        opacity: 0.9;
    }
    span {
        font-size: 14px;
    }
    .icon {
        color: #707A8A;
        font-size: 10px;
        transform: scale(0.9);
        transition: 0.2s;
        &.rotate {
            transform: rotate(180deg);
        }
    }
}
.footer-last {
    margin-top: 90px;
    width: 100%;
    border-top: 1px solid rgba(255, 255, 255, 0.04);
    padding: rem(35px) 0;
    .risk {
        color: #666;
        font-size: 12px;
        line-height: 24px;
        text-align: center;
        width: 80%;
        margin: 0 auto;
        margin-bottom: 15px;
        .red {
            color: red;
        }
    }
    .year {
        // position: absolute;
        // bottom: 40px;
        // left: 50%;
        // transform: translateX(-50%);
        color: #666;
        font-size: 12px;
        text-align: center;
        line-height: 30px;
    }
}
#canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
}
</style>
