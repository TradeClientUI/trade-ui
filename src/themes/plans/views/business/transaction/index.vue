<template>
    <div class='transaction'>
        <div class='banner'>
            <p class='title'>
                Trade to win awards
            </p>
            <p class='h1'>
                1800 USDT bonus
            </p>
            <img alt='' class='img' src='../../../images/business/transaction/banner.png' />
        </div>
        <div class='cont-box'>
            <p class='h1'>
                Weekly awards
            </p>
            <div class='Weekly'>
                <div class='item'>
                    <p class='h2'>
                        Win 200 USDT
                    </p>
                    <p class='h3'>
                        Time: 9.1-9.7
                    </p>
                    <span class='cont'>
                        Take the quotation of
                        <a class='links' href='https://www.vitatoken.io/en-US/order?name=V10/USDT&symbolId=368&tradeType=5' target='_blank'>
                            V10/USDT
                        </a>
                        at 00:00 on September 8 as the winning number
                    </span>
                </div>
                <div class='item'>
                    <p class='h2'>
                        Win 200 USDT
                    </p>
                    <p class='h3'>
                        Time: 9.8-9.14
                    </p>
                    <span class='cont'>
                        Take the quotation of
                        <a class='links' href='https://www.vitatoken.io/en-US/order?name=V10/USDT&symbolId=368&tradeType=5' target='_blank'>
                            V10/USDT
                        </a>
                        at 00:00 on September 15 as the winning number
                    </span>
                </div>
                <div class='item'>
                    <p class='h2'>
                        Win 200 USDT
                    </p>
                    <p class='h3'>
                        Time: 9.8-9.14
                    </p>
                    <span class='cont'>
                        Take the quotation of
                        <a class='links' href='https://www.vitatoken.io/en-US/order?name=V10/USDT&symbolId=368&tradeType=5' target='_blank'>
                            V10/USDT
                        </a>
                        at 00:00 on September 22 as the winning number
                    </span>
                </div>
                <div class='item'>
                    <p class='h2'>
                        Win 200 USDT
                    </p>
                    <p class='h3'>
                        Time: 9.22-9.28
                    </p>
                    <span class='cont'>
                        Take the quotation of
                        <a class='links' href='https://www.vitatoken.io/en-US/order?name=V10/USDT&symbolId=368&tradeType=5' target='_blank'>
                            V10/USDT
                        </a>
                        at 00:00 on September 29 as the winning number
                    </span>
                </div>
            </div>
            <div class='monthly'>
                <p class='h1'>
                    Monthly award
                </p>
                <div>
                    <span class='h2'>
                        Win 1000 USDT
                    </span>
                    <span class='h3'>
                        Time: 9.1-9.30
                    </span>
                </div>
                <div class='cont'>
                    Take the quotation of
                    <a class='links' href='https://www.vitatoken.io/en-US/order?name=V10/USDT&symbolId=368&tradeType=5' target='_blank'>
                        V10/USDT
                    </a>
                    at 00:00 on October 1 as the winning number
                </div>
            </div>
            <div class='participate'>
                <p class='h1'>
                    How to participate
                </p>
                <p class='h3'>
                    Step 1:
                    <a class='links' href='https://www.vitatoken.io/en-US/register' target='_blank'>
                        Register an account
                    </a>
                    and deposit.
                </p>
                <p class='h3'>
                    Step 2: Trade spot or V10 to get order number as lottery number.
                </p>
                <p class='h3'>
                    Step 3: Lottery number that matches the most consecutive numbers in the winning number is the winner.
                </p>
                <p class='h3'>
                    Step 4: Tweet about the event on Twitter, tag 3 of your friends and
                    <a class='links' href='https://twitter.com/Vitatoken_' target='_blank'>
                        @Vitatoken_
                    </a>
                    .
                </p>
                <p class='h3'>
                    For example: There is a transaction on September 9, the order number is 5724373,which can participate in the secend weekly and September award pool.
                </p>
                <p class='btn'>
                    <a href='javascript:;' @click='showRules = true'>
                        View rules
                    </a>
                </p>
            </div>
        </div>
        <!-- <div class='cont-box'>
            <p class='h1'>
                Winners’ feelings
            </p>
            <ul class='stripe'>
                <li>
                    <span>Time:9.1-9.7</span>
                    <span>Winner said:************</span>
                    <span>Link:************</span>
                </li>
                <li>
                    <span>Time:9.8-9.14</span>
                    <span>Winner said:************</span>
                    <span>Link:************</span>
                </li>
                <li>
                    <span>Time:9.15-9.21</span>
                    <span>Winner said:************</span>
                    <span>Link:************</span>
                </li>
                <li>
                    <span>Time:9.22-9.28</span>
                    <span>Winner said:************</span>
                    <span>Link:************</span>
                </li>
                <li>
                    <span>Time:9.1-9.30</span>
                    <span>Winner said:************</span>
                    <span>Link:************</span>
                </li>
            </ul>
        </div> -->
        <van-popup v-model:show='showRules' closeable round>
            <div class='popup'>
                <p class='title'>
                    Activity Rules
                </p>
                <div class='popup_cont'>
                    <p class='desc'>
                        Activity period: 00:00 on September 1,2022 to 23:59 on September 30,2022 (UTC+0)
                    </p>
                    <p class='desc'>
                        Target audience: All deposited users can participate
                    </p>
                    <p class='popup_title'>
                        Reward Structure:
                    </p>
                    <van-row class='table'>
                        <van-col class='th' :span='6'>
                            Date
                        </van-col>
                        <van-col class='th' :span='12'>
                            Criteria
                        </van-col>
                        <van-col class='th' :span='6'>
                            Rewards
                        </van-col>
                        <van-col class='td' :span='6'>
                            9.1-9.7
                        </van-col>
                        <van-col class='td' :span='12'>
                            Trade and Lottery numbers can match the most consecutive numbers in the wining number
                        </van-col>
                        <van-col class='td' :span='6'>
                            200 USDT
                        </van-col>
                        <van-col class='td' :span='6'>
                            9.8-9.14
                        </van-col>
                        <van-col class='td' :span='12'>
                            Trade and Lottery numbers can match the most consecutive numbers in the wining number
                        </van-col>
                        <van-col class='td' :span='6'>
                            200 USDT
                        </van-col>
                        <van-col class='td' :span='6'>
                            9.15-9.21
                        </van-col>
                        <van-col class='td' :span='12'>
                            Trade and Lottery numbers can match the most consecutive numbers in the wining number
                        </van-col>
                        <van-col class='td' :span='6'>
                            200 USDT
                        </van-col>
                        <van-col class='td' :span='6'>
                            9.22-9.28
                        </van-col>
                        <van-col class='td' :span='12'>
                            Trade and Lottery numbers can match the most consecutive numbers in the wining number
                        </van-col>
                        <van-col class='td' :span='6'>
                            200 USDT
                        </van-col>
                        <van-col class='td' :span='6'>
                            9.1-9.30
                        </van-col>
                        <van-col class='td' :span='12'>
                            Trade and Lottery numbers can match the most consecutive numbers in the wining number
                        </van-col>
                        <van-col class='td' :span='6'>
                            1000 USDT
                        </van-col>
                    </van-row>
                    <p class='popup_title'>
                        Please note:
                    </p>
                    <p class='desc'>
                        The wining number are quotation of V10/USDT at 00:00 on September 8, September 15, September 22, September 29 and October 1 respectively.
                    </p>
                    <p class='popup_title'>
                        Terms and Conditions:
                    </p>
                    <p class='desc'>
                        1. All spot and V10 order number are lottery numbers.
                    </p>
                    <p class='desc'>
                        2. Winners have to tweet about the event on Twitter , tag 3 of your friends and @Vitatoken_.
                    </p>
                    <p class='desc'>
                        3. Rewards will be sent within 2 working days after the tweet.
                    </p>
                    <p class='desc'>
                        4. During the campaign, if any cheating behaviors are found, MagnaMarkets will consider canceling your qualification and may freeze your account according to the situation.
                    </p>
                    <p class='desc'>
                        5. MagnaMarkets reserves the right to modify or cancel this campaign at any point.
                    </p>
                    <p class='desc'>
                        Warning: Cryptocurrency trading is risky, so please be cautious and aware of the risks involved. MagnaMarkets is not responsible for any guarantee, compensation, etc. for any of your transactions.
                    </p>
                </div>
            </div>
        </van-popup>
        <NewFooter />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import NewFooter from '../../../layout/layoutBottom'

const showRules = ref(false)
</script>

<style  lang="scss" scoped>
.transaction {
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
        .table {
            border-radius: rem(10px);
            overflow: hidden;
            border: rem(2px) solid #EBB650;
            margin-bottom: rem(40px);
            .th {
                font-size: rem(32px);
                color: #F6F6F6;
                font-weight: 500;
                height: rem(112px);
                line-height: rem(112px);
                background: #EBB650;
                padding-left: rem(8px);
            }
            .td {
                padding-left: rem(8px);
                padding-top: rem(8px);
                border: rem(2px) solid #EBB650;
                font-size: rem(28px);
                color: rgba(51, 51, 51, 0.8);
                border-top: 0;
                &.van-col {
                    border-left: 0;
                }
            }
        }
    }
}
.banner {
    background-color: #FFF;
    border-radius: 0 0 rem(40px) rem(40px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: rem(516px);
    .img {
        height: rem(320px);
    }
    .title {
        font-size: rem(48px);
        font-weight: bold;
    }
    .h1 {
        color: #999;
        padding-top: 0;
        font-size: rem(32px);
    }
}
.h1 {
    font-size: rem(48px);
    font-weight: 500;
    text-align: center;
    padding-top: rem(80px);
}
.h2 {
    font-size: rem(32px);
    font-weight: 500;
}
.h3 {
    font-size: rem(28px);
    font-weight: 400;
    color: #999;
}
.links {
    color: #0062FF;
}
.cont-box {
    width: 100%;
    border-radius: rem(40px);
    background-color: #FFF;
    margin-top: rem(80px);
}
.Weekly {
    display: flex;
    flex-direction: column;
    .item {
        padding: rem(56px) rem(28px) 0;
        text-align: center;
        .cont {
            background: rgba(0, 98, 255, 0.03);
            border-radius: rem(10px);
            width: 100%;
            display: block;
            font-size: rem(32px);
            color: rgba(51, 51, 51, 0.8);
            padding: 12px;
        }
        .h3 {
            margin: rem(14px) 0;
        }
    }
}
.monthly {
    text-align: center;
    .h2 {
        margin-right: rem(28px);
        margin-top: rem(56px);
        display: inline-block;
    }
    .h3,
    .h2 {
        font-size: rem(32px);
        font-weight: 500;
    }
    .cont {
        padding: rem(24px) 0;
        background: rgba(0, 98, 255, 0.03);
        border-radius: rem(10px);
        font-size: rem(32px);
        margin: rem(14px)  rem(28px) 0;
    }
}
.participate {
    padding: 0 rem(28px);
    margin-bottom: rem(80px);
    .h1 {
        margin-bottom: rem(40px);
    }
    .h3 {
        margin-top: rem(14px);
    }
    .btn {
        padding-bottom: rem(88px);
        margin-top: rem(48px);
        font-size: rem(32px);
        font-weight: 500;
        text-align: center;
        a {
            color: #0062FF;
        }
    }
}
.stripe {
    padding: rem(56px)  rem(28px) rem(80px);
    margin-bottom: rem(80px);
    li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: rem(28px);
        font-size: rem(24px);
        font-weight: 400;
        &:nth-child(odd) {
            background: rgba(245, 245, 245, 0.5);
        }
        span {
            &:first-child {
                min-width: rem(156px);
            }
        }
    }
}
</style>
