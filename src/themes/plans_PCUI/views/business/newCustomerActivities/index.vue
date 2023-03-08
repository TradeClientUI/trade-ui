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
                    <img alt='' src='../../../images/business/newCustomerActivities/cont_1.png' />
                    <div class='welcome_cont'>
                        <p class='welcome_title'>
                            Welcome 1
                        </p>
                        <p class='welcome_rule'>
                            Rule: The first 100 people to complete each day receive 0.01 V10 (About 5 USDT)
                        </p>
                        <p class='welcome_text pointer'>
                            Step 1: Register a
                            <router-link class='link' to='/register'>
                                CATS Account
                                <i class='el-icon-arrow-right'></i>
                            </router-link>
                        </p>
                        <p class='welcome_text pointer'>
                            Step 2: Follow
                            <a class='link' href='https://www.facebook.com/CATS/' target='_blank'>
                                CATS Facebook account
                                <i class='el-icon-arrow-right'></i>
                            </a>
                        </p>
                        <p class='welcome_text pointer'>
                            Step 3: Follow
                            <a class='link' href='https://www.youtube.com/channel/UCWrIoUETskxOU9zIVpba6Hg' target='_blank'>
                                CATS YouTube account
                                <i class='el-icon-arrow-right'></i>
                            </a>
                        </p>
                        <p class='welcome_text pointer'>
                            Step 4: Follow
                            <a class='link' href='https://twitter.com/CATS_' target='_blank'>
                                CATS Twitter account
                                <i class='el-icon-arrow-right'></i>
                            </a>
                        </p>
                        <p class='welcome_text pointer'>
                            Step 5:
                            <a class='link' href='https://twitter.com/CATS_/status/1552551420070469632?s=20&t=vN-kLx3P6RfpFOeekgvFgA' target='_blank'>
                                Retweet and tag 3 of your best friends
                                <i class='el-icon-arrow-right'></i>
                            </a>
                        </p>
                        <p class='welcome_text pointer'>
                            Step 6: Fill in our
                            <a class='link' href='https://docs.google.com/forms/d/e/1FAIpQLScyh2Qi4JTcxBLKZGWbcikTQPvAqOnJ3jZhbfSkkQg-Acc7KA/viewform?usp=sf_link' target='_blank'>
                                google forms
                                <i class='el-icon-arrow-right'></i>
                            </a>
                        </p>
                    </div>
                </div>
                <div class='welcome'>
                    <img alt='' src='../../../images/business/newCustomerActivities/cont_2.png' />
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
                    <img alt='' src='../../../images/business/newCustomerActivities/cont_3.png' />
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
        <el-dialog
            v-model='showRules'
            :close-on-click-modal='true'
            custom-class='dialogRules'
            title=''
            width='560px'
            @close='showRules = false'
        >
            <template #title>
                <p class='dialogRules_title'>
                    Notes
                </p>
            </template>
            <div>
                <!-- <p class='title'>
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
        </el-dialog>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'

export default {
    setup () {
        const router = useRouter()
        const store = useStore()
        const customerInfo = computed(() => store.state._user.customerInfo)
        const showRules = ref(false)
        const goAssets = () => {
            // 游客去开户，登录去入金
            if (customerInfo.value) {
                router.push('/assets')
            } else {
                router.push('/register')
            }
        }

        const goV10 = () => {
            router.push('/fundV10/index')
        }
        const openUrl = (url) => {
            window.open(url)
        }

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
.actives {
    :deep(.dialogRules) {
        border-radius: 5px;
        .el-dialog__body {
            padding: 15px 30px;
        }
        .el-dialog__header {
            height: 73px;
            text-align: center;
            font-size: 30px;
            font-weight: 600;
            color: #FBFBFB;
            line-height: 73px;
            background-color: #EBB650;
            padding: 0;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }
        .el-dialog__headerbtn {
            top: 0;
            .el-icon-close {
                color: #FFF;
                font-size: 30px;
            }
        }
    }
    .h_bg {
        height: 540px;
        width: 100%;
        display: block !important;
        cursor: pointer;
        object-fit: cover;
    }
    .cont_bg {
        background-image: url('../../../images/business/newCustomerActivities/bg.png');
        background-size: cover;
        background-repeat: no-repeat;
    }
    .server_img {
        width: 50vh;
        max-width: 100%;
    }
    .cont {
        padding: 60px 15px;
        max-width: 1440px;
        margin: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .btn {
        height: 54px;
        width: 292px;
        line-height: 54px;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        border: 2px solid #0062FF;
        background-color: #0062FF;
        color: #FFF;
        margin: 20px;
        border-radius: 5px;
        transition: all 0.4s ease;
        box-shadow: 0 2px 18px 0 rgb(22 33 113 / 26%);
        cursor: pointer;
        &:hover {
            border: 2px solid #0062FF;
            background-color: #F1F1F1;
            color: #0062FF;
        }
    }
    .text {
        padding: 20px 0;
        font-size: 16px;
        font-weight: 600;
    }
    .f_bg {
        width: 100%;
        cursor: pointer;
    }
    .h1 {
        font-size: 30px;
        font-weight: 600;
        margin-bottom: 12px;
    }
    .title {
        height: 66px;
        font-size: 20px;
        font-weight: 600;
        color: #EBB650;
        line-height: 66px;
    }
    .desc {
        font-size: 14px;
        color: #333;
        line-height: 21px;
        margin-bottom: 12px;
        word-break: keep-all;
        &.center {
            text-align: center;
        }
    }
}
.welcome {
    display: flex;
    align-items: center;
    width: 1000px;
    margin: 60px auto 0;
    &_cont {
        margin-left: 40px;
    }
    &_title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 28px;
    }
    &_rule {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 20px;
    }
    &_text {
        font-size: 14px;
        margin-bottom: 20px;
        .el-icon-arrow-right {
            cursor: pointer;
        }
    }
    .el-icon-arrow-right {
        font-weight: bold;
        margin-left: 10px;
    }
}

</style>
