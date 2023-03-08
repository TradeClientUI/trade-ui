<template>
    <div class='active'>
        <div class='banner'>
            <div class='left'>
                <p class='h1'>
                    New users exclusive
                </p>
                <p class='desc'>
                    First deposit ≥100 USDT to get 150 USDT reward
                </p>
            </div>
            <img alt='' class='right' src='../../../images/business/newCustomerActivities/banner_photo_pc.png' />
            <div class='race'>
                <van-swipe :autoplay='3000' class='my-swipe' :height='54' :show-indicators='false' vertical>
                    <van-swipe-item>
                        <span>86****12 got 15U reward</span>
                        <span>86****01 got 35U reward</span>
                        <span>86****32 got 25U reward</span>
                    </van-swipe-item>
                    <van-swipe-item>
                        <span>86****03 got 10U reward</span>
                        <span>86****15 got 25U reward</span>
                        <span>86****26 got 45U reward</span>
                    </van-swipe-item>
                    <van-swipe-item>
                        <span>86****33 got 45U reward</span>
                        <span>86****21 got 85U reward</span>
                        <span>86****98 got 10U reward</span>
                    </van-swipe-item>
                    <van-swipe-item>
                        <span>86****07 got 15U reward</span>
                        <span>86****61 got 45U reward</span>
                        <span>86****55 got 10U reward</span>
                    </van-swipe-item>
                    <van-swipe-item>
                        <span>86****76 got 20U reward</span>
                        <span>86****87 got 25U reward</span>
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
                Activity:&nbsp; From now on to 2022-09-30 23:59 (UTC)
            </p>
            <p class='btn' @click='showRules = true'>
                View Rules
            </p>
            <div class='notes'>
                <p class='h2'>
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
                        Deposit ≥ 100 USDT ( or equivalent value in different assets )
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
        </el-dialog>
    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default ({
    name: '',
    components: {},
    props: {},
    setup (props, ctx) {
        const store = useStore()
        const isLogin = computed(() => store.state._user.customerInfo)
        const symbolId = store.state._quote.productList.find(el => Number(el.tradeType) === 5 && el.symbolName)?.symbolId
        const router = useRouter()
        const showRules = ref(false)
        const handleClick = (type) => {
            if (type === 'Login') {
                router.push('/login')
            } else if (type === 'Register') {
                router.push('/register')
            } else if (type === 'Trade') {
                router.push({
                    path: '/order',
                    query: {
                        symbolId,
                        tradeType: 5
                    }
                })
            } else if (type === 'Deposit') {
                router.push({
                    path: '/assets'
                })
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
        padding: 68px 0;
        background-color: #FFF;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
        .left {
            width: 678px;
            .h1 {
                font-size: 48px;
                font-weight: bold;
            }
            .desc {
                font-size: 30px;
                font-weight: 400;
                color: #999;
            }
        }
        .race {
            width: 1200px;
            margin-top: 90px;
            background: #F5F5F5;
            height: 54px;
            overflow: hidden;
            border-radius: 5px;
            padding: 0 24px;
            .van-swipe-item {
                display: flex;
                justify-content: space-between;
                font-size: 20px;
                font-weight: 500;
                line-height: 54px;
            }
        }
    }
    .btn-wrap {
        padding: 60px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        .btn {
            width: 250px;
            background: #0062FF;
            border-radius: 5px;
            font-weight: 500;
            font-size: 20px;
            line-height: 30px;
            color: #FFF;
            cursor: pointer;
            padding: 12px 0;
            text-align: center;
            &:first-child {
                margin-right: 240px;
            }
        }
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
        margin: 20px auto;
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
    .cont {
        background-color: #FFF;
        padding: 60px 24px;
        width: 1200px;
        margin: 0 auto 60px;
        border-radius: 20px;
        .h1 {
            font-size: 30px;
            font-weight: 600;
            text-align: center;
        }
    }
    .explain {
        .notes {
            margin-top: 32px;
            .h2 {
                font-size: 20px;
                font-weight: 500;
                margin-bottom: 12px;
            }
            .rules {
                color: #999;
                strong {
                    color: #333;
                }
            }
        }
        .tables {
            margin-top: 20px;
            .item {
                display: grid;
                grid-template-columns: 1fr 2fr 1fr;
                line-height: 48px;
                font-size: 16px;
                padding-left: 14px;
                &.header {
                    background: #F5F5F5;
                    line-height: 60px;
                    color: #999;
                }
                &:not(:first-child) {
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                }
            }
        }
    }
    .why {
        .icons {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 48px;
        }
        .item {
            text-align: center;
            font-size: 20px;
            font-weight: 500;
            img {
                margin-bottom: 12px;
            }
        }
    }
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
}
</style>
