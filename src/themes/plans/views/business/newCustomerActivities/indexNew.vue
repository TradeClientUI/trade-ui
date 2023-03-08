<template>
    <div class='active'>
        <div class='banner'>
            <p class='h1'>
                New users exclusive
            </p>
            <p class='desc'>
                First deposit ≥100 USDT to get 150 USDT reward
            </p>
            <img alt='' class='banner_img' src='../../../images/business/newCustomerActivities/banner_photo_h5.png' />
            <div class='race'>
                <van-swipe :autoplay='3000' class='my-swipe' :height='92' :show-indicators='false' vertical>
                    <van-swipe-item>
                        <span>86****12 got 15U reward</span>
                        <span>86****01 got 35U reward</span>
                    </van-swipe-item>
                    <van-swipe-item>
                        <span>86****32 got 25U reward</span>
                        <span>86****03 got 10U reward</span>
                    </van-swipe-item>
                    <van-swipe-item>
                        <span>86****15 got 25U reward</span>
                        <span>86****26 got 45U reward</span>
                    </van-swipe-item>
                    <van-swipe-item>
                        <span>86****33 got 45U reward</span>
                        <span>86****21 got 85U reward</span>
                    </van-swipe-item>
                    <van-swipe-item>
                        <span>86****98 got 10U reward</span>
                        <span>86****07 got 15U reward</span>
                    </van-swipe-item>
                    <van-swipe-item>
                        <span>86****61 got 45U reward</span>
                        <span>86****55 got 10U reward</span>
                    </van-swipe-item>
                    <van-swipe-item>
                        <span>86****76 got 20U reward</span>
                        <span>86****87 got 25U reward</span>
                    </van-swipe-item>
                    <van-swipe-item>
                        <span>86****43 got 30U reward</span>
                    </van-swipe-item>
                </van-swipe>
            </div>
        </div>
        <div class='btn-wrap'>
            <p class='btn' @click="handleClick(isLogin?'Deposit':'Login')">
                {{ isLogin?'Deposit':'Login' }}
            </p>
            <p class='btn' @click="handleClick(isLogin?'Trade':'Register')">
                {{ isLogin?'Trade':'Register' }}
            </p>
        </div>
        <div class='explain cont'>
            <p class='h1'>
                Activity:
                <br />
                From now on to 2022-09-30 23:59 (UTC)
            </p>
            <p class='btn' @click='showRules = true'>
                View Rules
            </p>
            <div class='notes'>
                <p class='h1'>
                    Notes：
                </p>
                <ul class='rules'>
                    <li>
                        Deposit has to be done <strong>within 30 minutes</strong> after registration.
                    </li>
                </ul>
            </div>
            <ul class='tables'>
                <li class='header item'>
                    <span>Time</span>
                    <span>Task</span>
                    <span>Reward</span>
                </li>
                <li v-for='i in 30' :key='i' class='item'>
                    <span>Day{{ i }}</span>
                    <span v-if='i == 1'>
                        Deposit ≥ 100 USDT
                    </span>
                    <span v-else>
                        Trade spot or V10 at least once
                    </span>
                    <span>5 USDT</span>
                </li>
            </ul>
        </div>
        <div class='why cont'>
            <p class='h1'>
                Why choose CATS
            </p>
            <div class='icons'>
                <div class='item'>
                    <img alt='' src='../../../images/business/newCustomerActivities/1.png' />
                    <p>Explore spot or V10</p>
                </div>
                <div class='item'>
                    <img alt='' src='../../../images/business/newCustomerActivities/2.png' />
                    <p>Explore funds in DeFi</p>
                </div>
                <div class='item'>
                    <img alt='' src='../../../images/business/newCustomerActivities/3.png' />
                    <p>Licensed by __placeholder & FinCEN</p>
                </div>
                <div class='item'>
                    <img alt='' src='../../../images/business/newCustomerActivities/4.png' />
                    <p>Audited by __placeholder</p>
                </div>
            </div>
        </div>
        <van-popup v-model:show='showRules' closeable round>
            <div class='popup'>
                <p class='title'>
                    Notes
                </p>
                <div class='popup_cont'>
                    <p class='desc'>
                        1. Deposit has to be done within 30 minutes after registration.
                    </p>
                    <p class='desc'>
                        2. Only the first 10 people who complete depositing task every day are eligible for the activity.
                    </p>
                    <p class='desc'>
                        3. Daily tasks can only be completed once a day, and the activity ends when the previous day's task is not completed.
                    </p>
                    <p class='desc'>
                        4. Rewards will be sent on the second working day after completing the daily task.
                    </p>
                    <p class='desc'>
                        5. To withdraw rewards for new user tasks, you need to complete KYC.
                    </p>
                    <p class='desc'>
                        6. During the campaign, if any cheating behaviors are found, CATS will consider canceling your qualification and may freeze your account according to the situation.
                    </p>
                    <p class='desc'>
                        7. CATS reserves all rights to the campaign, including but not limited to adjusting, interpreting, and terminating the campaign at any time without prior notice.
                    </p>
                    <p class='desc'>
                        Warning: Cryptocurrency trading is risky, so please be cautious and aware of the risks involved. CATS is not responsible for any guarantee, compensation, etc. for any of your transactions.
                    </p>
                </div>
            </div>
        </van-popup>
        <NewFooter />
    </div>
</template>

<script>
import { computed, ref } from 'vue'
import NewFooter from '../../../layout/layoutBottom'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

export default ({
    name: '',
    components: {
        NewFooter
    },
    props: {},
    setup (props, ctx) {
        const store = useStore()
        const route = useRoute()
        const wapisLogin = computed(() => store.state._user.customerInfo)
        const appisLogin = route.query.isLogin
        const isLogin = wapisLogin.value || appisLogin

        const symbolId = store.state._quote.productList.find(el => Number(el.tradeType) === 5 && el.symbolName)?.symbolId
        const router = useRouter()
        const showRules = ref(false)
        const { isUniapp } = route.query
        const handleClick = (type) => {
            switch (type) {
                case 'Login': {
                    if (isUniapp && uni) {
                        return uni.postMessage({
                            data: {
                                action: 'message',
                                type: 'activity_login',
                                params: {}
                            }
                        })
                    } else {
                        router.push('/login')
                    }
                    break
                }
                case 'Register': {
                    if (isUniapp && uni) {
                        return uni.postMessage({
                            data: {
                                action: 'message',
                                type: 'activity_register',
                                params: {}
                            }
                        })
                    } else {
                        router.push('/register')
                    }
                    break
                }
                case 'Trade': {
                    if (isUniapp && uni) {
                        return uni.postMessage({
                            data: {
                                action: 'message',
                                type: 'activity_trade',
                                params: {}
                            }
                        })
                    } else {
                        router.push({
                            path: '/order',
                            query: {
                                symbolId,
                                tradeType: 5
                            }
                        })
                    }
                    break
                }
                case 'Deposit': {
                    if (isUniapp && uni) {
                        return uni.postMessage({
                            data: {
                                action: 'message',
                                type: 'activity_deposit',
                                params: {}
                            }
                        })
                    } else {
                        router.push({
                            path: '/assets'
                        })
                    }
                    break
                }
            }
        }
        return {
            isLogin,
            handleClick,
            showRules
        }
    },
})
</script>

<style lang="scss" scoped>
.active {
    color: #333;
    .banner {
        padding: rem(80px) rem(28px) rem(56px);
        background-color: #FFF;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
        border-radius: 0 0 rem(40px) rem(40px);
        .h1 {
            font-size: rem(48px);
            font-weight: 600;
            line-height: rem(72px);
        }
        .desc {
            font-size: rem(30px);
            font-weight: 500;
            color: #999;
            line-height: rem(48px);
        }
        .banner_img {
            margin: rem(20px) auto;
        }
        .race {
            width: 1200px;
            background: #F5F5F5;
            height: rem(92px);
            overflow: hidden;
            border-radius: 5px;
            padding: 0 24px;
            .van-swipe-item {
                display: flex;
                justify-content: space-between;
                font-size: rem(24px);
                font-weight: 500;
                line-height: rem(92px);
            }
        }
    }
    .btn-wrap {
        padding: rem(80px) rem(28px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        .btn {
            width: rem(300px);
            background: #0062FF;
            border-radius: rem(10px);
            font-weight: 500;
            font-size: rem(32px);
            line-height: rem(48px);
            color: #FFF;
            cursor: pointer;
            padding: rem(24px) 0;
            text-align: center;
        }
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
        margin: rem(80px) auto;
        border-radius: rem(10px);
        transition: all 0.4s ease;
        box-shadow: 0 2px 18px 0 rgb(22 33 113 / 26%);
        &:hover {
            border: rem(2px) solid #0062FF;
            background-color: #F1F1F1;
            color: #0062FF;
        }
    }
    .cont {
        background-color: #FFF;
        padding: rem(80px) 0;
        width: 100%;
        margin: 0 auto rem(80px);
        border-radius: rem(40px);
        .h1 {
            font-size: rem(48px);
            font-weight: 500;
            line-height: rem(38px);
            text-align: center;
        }
    }
    .explain {
        .h1 {
            font-size: rem(32px);
        }
        .notes {
            margin-top: rem(32px);
            padding: 0 rem(28px);
            line-height: rem(38px);
            .h1 {
                text-align: left;
                line-height: rem(48px);
            }
            .rules {
                color: #999;
                strong {
                    color: #333;
                }
            }
        }
        .tables {
            margin-top: rem(40px);
            .item {
                display: grid;
                grid-template-columns: 1fr 4fr 1fr;
                line-height: rem(84px);
                height: rem(84px);
                font-size: rem(28px);
                padding: 0 rem(28px);
                &.header {
                    background: #F5F5F5;
                    height: rem(108px);
                    line-height: rem(108px);
                    color: #999;
                }
                &:not(:first-child) {
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                }
                span {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
    }
    .why {
        .icons {
            display: flex;
            flex-direction: column;
            padding-top: rem(72px);
        }
        .item {
            text-align: center;
            font-size: rem(32px);
            font-weight: 500;
            &:not(:last-child) {
                margin-bottom: rem(56px);
            }
            img {
                margin-bottom: rem(24px);
            }
        }
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
}

</style>
