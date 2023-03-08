<template>
    <div class='footer-nav'>
        <div class='auto-width'>
            <div class='footer-auto'>
                <div class='nav-left'>
                    <ul>
                        <!-- <li>
                            <h4 class='title'>
                                {{ $t('newHomeFooter.aboutus') }}
                            </h4>
                            <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("about")'>
                                    {{ $t('newHomeFooter.aboutus') }}
                                </a>
                            </p>
                            <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("fees")'>
                                    {{ $t('newHomeFooter.fees') }}
                                </a>
                            </p>
                        </li> -->
                        <li>
                            <h4 class='title'>
                                {{ $t('newHomeFooter.product') }}
                            </h4>
                            <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("trading")'>
                                    {{ $t('newHomeFooter.trading') }}
                                </a>
                            </p>
                            <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("fund")'>
                                    {{ $t('newHomeFooter.fund') }}
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
                            <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("vip")'>
                                    {{ $t('newHomeFooter.vip') }}
                                </a>
                            </p>
                            <p class='name'>
                                <a href='javascript:;' @click='jumpUrl("customer")'>
                                    {{ $t('newHomeFooter.customer') }}
                                </a>
                            </p>
                        </li>
                        <!-- <li>
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
                        </li> -->
                    </ul>
                </div>
                <div class='nav-right'>
                    <h4 class='title'>
                        {{ $t('newHomeFooter.followus') }}
                    </h4>
                    <ul>
                        <li @click='jumpUrl("fb")'>
                            <img class='icon' src='../images/home/facebook.png' />
                            <p class='name'>
                                Facebook
                            </p>
                        </li>
                        <li @click='jumpUrl("ig")'>
                            <img class='icon' src='../images/home/instagram.png' />
                            <p class='name'>
                                Instagram
                            </p>
                        </li>
                        <li @click='jumpUrl("twitter")'>
                            <img class='icon' src='../images/home/twitter.png' />
                            <p class='name'>
                                Twitter
                            </p>
                        </li>
                        <li @click='jumpUrl("telegram")'>
                            <img class='icon' src='../images/home/telegram.png' />
                            <p class='name'>
                                Telegram
                            </p>
                        </li>
                        <li @click='jumpUrl("yt")'>
                            <img class='icon' src='../images/home/youtube.png' />
                            <p class='name'>
                                Youtube
                            </p>
                        </li>
                    </ul>
                    <div class='lang-select' @click='openLangDialog'>
                        <span>
                            {{ currentLang.name }}
                        </span>
                        <i :class="['icon', 'icon_icon_arrow', { 'rotate': langDialogShow }]"></i>
                    </div>
                </div>
            </div>
            <div class='footer-last'>
                <p class='year'>
                    Trade Switcher © 2022
                </p>
            </div>
        </div>
    </div>
    <!-- 语言弹窗 -->
    <lang-dialog ref='langDialogRef' v-model='langDialogShow' />
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getCookie } from '@/utils/util.js'
import langDialog from './components/lang-dialog.vue'
import useMethods from '@planspc/hooks/useMethods'
export default {
    components: {
        langDialog
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

        // 底部nav跳转
        const jumpUrl = (index) => {
            const lang = getCookie('lang') || 'zh-CN'
            const linkList = {}

            const community = {
                fb: '',
                ig: '',
                twitter: '',
                telegram: '',
                yt: ''
            }
            switch (index) {
                case 'trading':
                    toOrderPriority(5)
                    break
                case 'fund':
                    router.push({ path: '/fund' })
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
                    router.push('/about')
                    break
                default:
                    const newLinkList = { ...linkList, ...community }
                    if (newLinkList[index]) {
                        window.open(newLinkList[index])
                    }
            }
        }

        return {
            jumpUrl,
            currentLang,
            langDialogRef,
            openLangDialog,
            langDialogShow
        }
    }
}
</script>

<style lang="scss" scoped>
.footer-nav {
    position: relative;
    min-width: 1200px;
    height: 380px;
    // background: #15191E;
    background: var(--bgColor);
    .footer-auto {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 90px;
    }
    .nav-left {
        ul {
            display: flex;
        }
        li {
            margin-right: 200px;
            &:last-of-type {
                margin-right: 0;
            }
            .title {
                margin-bottom: 20px;
                color: #9293A3;
                font-weight: 500;
                font-size: 20px;
            }
            .name {
                position: relative;
                margin-top: 10px;
                padding-left: 26px;
                color: var(--normalColor);
                &::before {
                    position: absolute;
                    top: -3px;
                    display: inline-block;
                    margin-left: -20px;
                    color: #959595;
                    font-size: 24px;
                    font-family: Arial, sans-serif;
                    line-height: 1;
                    content: '\2022';
                }
                a {
                    color: #515366;
                    font-size: 14px;
                    &:hover {
                        color: var(--primary);
                    }
                }
            }
        }
    }
    .nav-right {
        display: flex;
        flex-direction: column;
        align-items: center;
        .title {
            margin-bottom: 20px;
            color: #9293A3;
            font-weight: 500;
            font-size: 20px;
        }
        ul {
            display: flex;
            li {
                display: inline-flex;
                flex-direction: column;
                align-items: center;
                margin-right: 30px;
                cursor: pointer;
                &:last-of-type {
                    margin-right: 0;
                }
                .name {
                    margin-top: 10px;
                    color: #515366;
                    font-size: 14px;
                    &:hover {
                        color: var(--primary);
                    }
                }
            }
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
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    .year {
        color: #9293A3;
        font-size: 12px;
    }
}
</style>
