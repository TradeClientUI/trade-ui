<template>
    <div class='actives'>
        <img alt='' class='h_bg' src='../../../images/business/newCustomerActivities/banner-1.jpg' @click='goAssets' />
        <div class='cont_bg'>
            <div class='cont'>
                <p class='h1'>
                    Welcome Activity
                </p>
                <p class='text'>
                    Time: UTC+0, From now on — August 31, 2022 23:59
                </p>
                <p class='btn' @click='showRules = true'>
                    View Notes
                </p>
                <div class='welcome'>
                    <img alt='' class='img' src='../../../images/business/newCustomerActivities/cont_1.png' />
                    <div class='welcome_cont'>
                        <p class='welcome_title'>
                            Welcome 1
                        </p>
                        <p class='welcome_rule'>
                            Rule: The first 100 people to complete each day receive 0.01 V10 (About 5 USDT)
                        </p>
                        <p class='welcome_text'>
                            Step 1: Register a
                            <router-link class='link' to='/register'>
                                CATS Account
                                <van-icon class='icon' name='arrow' />
                            </router-link>
                        </p>
                        <p class='welcome_text pointer'>
                            Step 2: Follow
                            <a class='link' href='https://www.facebook.com/Cats/' target='_blank'>
                                CATS Facebook account
                                <van-icon class='icon' name='arrow' />
                            </a>
                        </p>
                        <p class='welcome_text pointer'>
                            Step 3: Follow
                            <a class='link' href='https://www.youtube.com/channel/UCWrIoUETskxOU9zIVpba6Hg' target='_blank'>
                                CATS YouTube Account
                                <van-icon class='icon' name='arrow' />
                            </a>
                        </p>
                        <p class='welcome_text pointer'>
                            Step 4: Follow
                            <a class='link' href='https://twitter.com/Vitatoken_' target='_blank'>
                                CATS Twitter Account
                                <van-icon class='icon' name='arrow' />
                            </a>
                        </p>
                        <p class='welcome_text pointer'>
                            Step 5:
                            <a class='link' href='https://twitter.com/Vitatoken_/status/1552551420070469632?s=20&t=vN-kLx3P6RfpFOeekgvFgA' target='_blank'>
                                Retweet and tag 3 of your best friends
                                <van-icon class='icon' name='arrow' />
                            </a>
                        </p>
                        <p class='welcome_text pointer'>
                            Step 6: Fill in our
                            <a class='link' href='https://docs.google.com/forms/d/e/1FAIpQLScyh2Qi4JTcxBLKZGWbcikTQPvAqOnJ3jZhbfSkkQg-Acc7KA/viewform?usp=sf_link' target='_blank'>
                                google forms
                                <van-icon class='icon' name='arrow' />
                            </a>
                        </p>
                    </div>
                </div>
                <div class='welcome'>
                    <img alt='' class='img' src='../../../images/business/newCustomerActivities/cont_2.png' />
                    <div class='welcome_cont'>
                        <p class='welcome_title'>
                            Welcome 2
                        </p>
                        <p class='welcome_rule'>
                            Rule: The first 100 people to complete each day receive 0.01 V10 (About 5 USDT)
                        </p>
                        <p class='welcome_text'>
                            Step 1: Register a CATS Account
                        </p>
                        <p class='welcome_text'>
                            Step 2: Fund more than 50 USDT in 24H
                        </p>
                        <p class='welcome_text'>
                            Step 3: Get V10 for free
                        </p>
                    </div>
                </div>
                <div class='welcome'>
                    <img alt='' class='img' src='../../../images/business/newCustomerActivities/cont_3.png' />
                    <div class='welcome_cont'>
                        <p class='welcome_title'>
                            Welcome 3
                        </p>
                        <p class='welcome_rule'>
                            Rule: No Transaction fee for V10 trading
                        </p>
                    </div>
                </div>
                <img alt='' class='f_bg' src='../../../images/business/newCustomerActivities/banner-2.png' @click='goV10' />
                <p class='text'>
                    V10 crypto index fund reflects the overall trend in cryptocurrency with asset transparency.
                </p>
            </div>
        </div>
        <van-popup v-model:show='showRules' closeable round>
            <div class='popup'>
                <p class='title'>
                    Notes
                </p>
                <div class='popup_cont'>
                    <!-- <p class='popup_title'>
                        Notes:
                    </p> -->
                    <p class='desc center'>
                        * Each customer can only get V10 for free once
                    </p>
                    <p class='desc'>
                        1. If CATS finds that the customer is trading irregularly during the campaign period, it has the right to stop the customer's trading and cancel the reward qualification.
                    </p>
                    <p class='desc'>
                        2. Clients are responsible for any fees incurred in the process.
                    </p>
                    <p class='desc'>
                        3. Contact our online customer service if you have questions about the campaign.
                    </p>
                    <p class='desc'>
                        4. CATS reserves the right, at its sole discretion, to modify, change or cancel this posting at any time and for any reason without prior notice.
                    </p>
                    <p class='desc'>
                        5. Warning: Cryptocurrency trading is risky, so please be cautious and aware of the risks involved. CATS is not responsible for any guarantee, compensation, etc. for any of your transactions.
                    </p>
                    <p class='desc'>
                        6. CATS reserves the right to modify or cancel this campaign at any point. If any part of the terms and conditions is unclear, we reserve the right to interpret it when deemed appropriate. Participating in the event means you agree to the terms and conditions.
                    </p>
                </div>
            </div>
        </van-popup>
        <NewFooter />
    </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { computed, ref, onMounted } from 'vue'
import NewFooter from '../../../layout/layoutBottom'

export default {
    components: {
        NewFooter
    },
    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const customerInfo = computed(() => store.state._user.customerInfo)
        const showRules = ref(false)
        const { isApp } = route.query
        const goAssets = () => {
            if (isApp && uni) {
                return uni.postMessage({
                    data: {
                        action: 'message',
                        type: 'activity_banner'
                    }
                })
            }
            // 游客去开户，登录去入金
            if (customerInfo.value) {
                router.push('/assets')
            } else {
                router.push('/register')
            }
        }
        const openUrl = (url) => {
            window.open(url)
        }
        const goV10 = () => {
            if (isApp && uni) {
                return uni.postMessage({
                    data: {
                        action: 'message',
                        type: 'activity_v10'
                    }
                })
            }
            router.push('/fundV10/index')
        }
        onMounted(() => {
            // app隐藏头部和底部导航栏
            if (isApp) {
                document.querySelector('.nav-wrap').style.display = 'none'
                document.querySelector('#nav-footer').style.display = 'none'
            }
        })

        return {
            goAssets,
            goV10,
            showRules,
            openUrl
        }
    }
}
</script>

<style lang="scss" scoped>

.h_bg {
    width: 100%;
    display: block !important;
}
.server_img {
    width: 50vh;
    max-width: 100%;
}
.cont {
    padding: rem(80px) rem(30px);
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.h1 {
    font-size: rem(48px);
    font-weight: 600;
    margin-bottom: rem(64px);
}
.btn {
    height: rem(108px);
    width: rem(584px);
    line-height: rem(108px);
    text-align: center;
    font-size: rem(32px);
    font-weight: 600;
    border: rem(2px) solid #0062FF;
    background-color: #0062FF;
    color: #FFF;
    font-weight: 600;
    margin: rem(80px);
    border-radius: rem(10px);
    transition: all 0.4s ease;
    box-shadow: 0 2px 18px 0 rgb(22 33 113 / 26%);
    &:hover {
        border: rem(2px) solid #0062FF;
        background-color: #F1F1F1;
        color: #0062FF;
    }
}
.text {
    font-size: rem(32px);
    font-weight: 500;
    line-height: rem(48px);
    text-align: center;
    margin-top: rem(40px);
}
:deep(.van-popup__close-icon) {
    color: #FFF;
}
.popup {
    width: 95vw;
    .desc {
        font-size: rem(28px);
        color: #333;
        line-height: rem(40px);
        margin-bottom: rem(40px);
        &.center {
            text-align: center;
        }
    }
    .title {
        padding: rem(32px);
        text-align: center;
        font-size: rem(48px);
        font-weight: 600;
        color: #FBFBFB;
        background-color: #EBB650;
    }
    &_cont {
        max-height: rem(800px);
        overflow: scroll;
        padding: rem(30px);
    }
    &_title {
        height: rem(40px);
        font-size: rem(40px);
        font-weight: 600;
        color: #EBB650;
        line-height: rem(40px);
        margin-bottom: rem(56px);
        margin-top: rem(16px);
    }
}
.f_bg {
    width: 100%;
}
.welcome {
    // display: flex;
    // align-items: center;
    width: 100%;
    margin: 0 auto rem(60px);
    &_cont {
        margin-left: rem(20px);
    }
    &_title {
        font-size: rem(40px);
        font-weight: 500;
        margin-bottom: rem(56px);
        text-align: center;
    }
    &_rule {
        font-size: rem(32px);
        font-weight: 500;
        margin-bottom: rem(48px);
    }
    &_text {
        font-size: rem(28px);
        margin-bottom: rem(40px);
        .icon {
            float: right;
        }
    }
    .img {
        display: block;
        height: rem(256px);
        margin: auto;
    }
}
</style>
