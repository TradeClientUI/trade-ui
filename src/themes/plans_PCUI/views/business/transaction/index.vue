<template>
    <div class='transaction'>
        <div class='banner'>
            <div class='left'>
                <p class='title'>
                    Trade to win awards
                </p>
                <p class='h1'>
                    1800 USDT bonus
                </p>
            </div>
            <img alt='' class='right' src='../../../images/business/transaction/banner.png' />
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
                        <a class='links' href='https://www.Cats.io/en-US/order?name=V10/USDT&symbolId=368&tradeType=5' target='_blank'>
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
                        <a class='links' href='https://www.Cats.io/en-US/order?name=V10/USDT&symbolId=368&tradeType=5' target='_blank'>
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
                        <a class='links' href='https://www.Cats.io/en-US/order?name=V10/USDT&symbolId=368&tradeType=5' target='_blank'>
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
                        <a class='links' href='https://www.Cats.io/en-US/order?name=V10/USDT&symbolId=368&tradeType=5' target='_blank'>
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
                    <a class='links' href='https://www.Cats.io/en-US/order?name=V10/USDT&symbolId=368&tradeType=5' target='_blank'>
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
                    <a class='links' href='https://www.Cats.io/en-US/register' target='_blank'>
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
        <el-dialog
            v-model='showRules'
            :close-on-click-modal='true'
            custom-class='dialogRules'
            title=''
            width='950px'
            @close='showRules = false'
        >
            <template #title>
                <p class='dialogRules_title'>
                    Activity Rules
                </p>
            </template>
            <div>
                <p class='desc'>
                    Activity period: 00:00 on September 1,2022 to 23:59 on September 30,2022 (UTC+0)
                </p>
                <p class='desc'>
                    Target audience: All deposited users can participate
                </p>
                <p class='desc_title'>
                    Reward Structure:
                </p>
                <el-row class='table'>
                    <el-col class='th' :span='4'>
                        Date
                    </el-col>
                    <el-col class='th' :span='16'>
                        Criteria
                    </el-col>
                    <el-col class='th' :span='4'>
                        Rewards
                    </el-col>
                    <el-col class='td' :span='4'>
                        9.1-9.7
                    </el-col>
                    <el-col class='td' :span='16'>
                        Trade and Lottery numbers can match the most consecutive numbers in the wining number
                    </el-col>
                    <el-col class='td' :span='4'>
                        200 USDT
                    </el-col>
                    <el-col class='td' :span='4'>
                        9.8-9.14
                    </el-col>
                    <el-col class='td' :span='16'>
                        Trade and Lottery numbers can match the most consecutive numbers in the wining number
                    </el-col>
                    <el-col class='td' :span='4'>
                        200 USDT
                    </el-col>
                    <el-col class='td' :span='4'>
                        9.15-9.21
                    </el-col>
                    <el-col class='td' :span='16'>
                        Trade and Lottery numbers can match the most consecutive numbers in the wining number
                    </el-col>
                    <el-col class='td' :span='4'>
                        200 USDT
                    </el-col>
                    <el-col class='td' :span='4'>
                        9.22-9.28
                    </el-col>
                    <el-col class='td' :span='16'>
                        Trade and Lottery numbers can match the most consecutive numbers in the wining number
                    </el-col>
                    <el-col class='td' :span='4'>
                        200 USDT
                    </el-col>
                    <el-col class='td' :span='4'>
                        9.1-9.30
                    </el-col>
                    <el-col class='td' :span='16'>
                        Trade and Lottery numbers can match the most consecutive numbers in the wining number
                    </el-col>
                    <el-col class='td' :span='4'>
                        1000 USDT
                    </el-col>
                </el-row>
                <p class='desc_title'>
                    Please note:
                </p>
                <p class='desc'>
                    The wining number are quotation of V10/USDT at 00:00 on September 8, September 15, September 22, September 29 and October 1 respectively.
                </p>
                <p class='desc_title'>
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
                    4. During the campaign, if any cheating behaviors are found, CATS will consider canceling your qualification and may freeze your account according to the situation.
                </p>
                <p class='desc'>
                    5. CATS reserves the right to modify or cancel this campaign at any point.
                </p>
                <p class='desc'>
                    Warning: Cryptocurrency trading is risky, so please be cautious and aware of the risks involved. CATS is not responsible for any guarantee, compensation, etc. for any of your transactions.
                </p>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const showRules = ref(false)
</script>

<style  lang="scss" scoped>
.transaction {
    padding-bottom: 52px;
    :deep(.el-overlay-dialog) {
        overflow-y: scroll;
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
        .desc_title {
            height: 66px;
            font-size: 20px;
            font-weight: 600;
            color: #EBB650;
            line-height: 66px;
        }
        .table {
            border: 1px solid #EBB650;
            .el-col {
                border: 1px solid #EBB650;
                padding-left: 4px;
            }
        }
    }
}
.banner {
    height: 540px;
    background-color: #FFF;
    display: flex;
    align-items: center;
    justify-content: center;
    .right {
        height: 260px;
        margin-left: 213px;
    }
    .title {
        font-size: 48px;
        font-weight: bold;
    }
    .h1 {
        color: #999;
        padding-top: 10px;
    }
}
.h1 {
    font-size: 30px;
    font-weight: 500;
    text-align: center;
    padding-top: 60px;
}
.h2 {
    font-size: 20px;
    font-weight: 500;
}
.h3 {
    font-size: 16px;
    font-weight: 400;
    color: #999;
}
.links {
    color: #0062FF;
}
.cont-box {
    width: 1200px;
    border-radius: 20px;
    background-color: #FFF;
    margin: 60px auto 0;
}
.Weekly {
    display: flex;
    .item {
        padding: 28px 28px 0;
        text-align: center;
        &:not(:last-child) {
            margin-right: 40px;
        }
        .cont {
            background: rgba(0, 98, 255, 0.03);
            border-radius: 5px;
            width: 100%;
            display: block;
            font-size: 16px;
            color: rgba(51, 51, 51, 0.8);
            padding: 12px;
        }
        .h3 {
            margin: 14px 0;
        }
    }
}
.monthly {
    text-align: center;
    .h2 {
        margin-right: 28px;
        margin-top: 28px;
        display: inline-block;
    }
    .cont {
        padding: 14px 0;
        background: rgba(0, 98, 255, 0.03);
        border-radius: 5px;
        font-size: 16px;
        margin: 14px 28px 0;
    }
}
.participate {
    padding: 0 28px;
    .h1 {
        margin-bottom: 28px;
    }
    .h3 {
        margin-top: 12px;
    }
    .btn {
        padding-bottom: 60px;
        margin-top: 32px;
        font-size: 20px;
        color: #0062FF;
        font-weight: 500;
        text-align: center;
    }
}
.stripe {
    padding: 28px;
    li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px;
        font-size: 16px;
        font-weight: 400;
        &:nth-child(odd) {
            background: rgba(245, 245, 245, 0.5);
        }
        span {
            &:first-child {
                min-width: 120px;
            }
        }
    }
}
</style>
