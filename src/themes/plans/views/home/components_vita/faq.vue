<template>
    <div class='faq-module'>
        <div class='title'>
            <span class='underline'>
                FAQs
            </span>
        </div>
        <van-collapse v-model='activeName' accordion>
            <van-collapse-item name='1'>
                <template #title>
                    <img alt='' class='icon' src='../../../images/home/new_version/faq.png' />
                    <span class='collapse-title'>
                        Where is CATS based?
                    </span>
                </template>
                <div class='desc'>
                    content content content content content content content content content content content.
                </div>
            </van-collapse-item>
            <van-collapse-item name='2'>
                <template #title>
                    <img alt='' class='icon' src='../../../images/home/new_version/faq.png' />
                    <span class='collapse-title'>
                        What products does CATS provide?
                    </span>
                </template>
                <div class='desc'>
                    Not only provide spot transactions, but also provide CeFi & DeFi funds. We support different fund managers to list funds on the platform, which allow users to purchase funds as needed. More functions and supports are coming soon.
                </div>
            </van-collapse-item>
            <van-collapse-item name='3'>
                <template #title>
                    <img alt='' class='icon' src='../../../images/home/new_version/faq.png' />
                    <span class='collapse-title'>
                        What is the transaction fee?
                    </span>
                </template>
                <div class='desc'>
                    For spot trading, charge 0.15%. For CeFi fund V10 trading, subscription fee 0.2%, redemption fee 2.5%, management fee 3%. For DeFi funds, we don’t charge any service fees.
                </div>
            </van-collapse-item>
            <van-collapse-item name='4'>
                <template #title>
                    <img alt='' class='icon' src='../../../images/home/new_version/faq.png' />
                    <span class='collapse-title'>
                        How to contact CATS customer service team?
                    </span>
                </template>
                <div class='desc'>
                    You may contact our customer service team through our website or app. Please note that our team WILL NOT ask you for your account password or pin. Never trust any call from someone claimed to be an employee from CATS.
                    operation.
                </div>
            </van-collapse-item>
            <van-collapse-item name='5'>
                <template #title>
                    <img alt='' class='icon' src='../../../images/home/new_version/faq.png' />
                    <span class='collapse-title'>
                        Why should I choose CATS to trade?
                    </span>
                </template>
                <div class='desc'>
                    content content content content content content content content content content content content content.
                </div>
            </van-collapse-item>
        </van-collapse>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const activeName = ref('1')
</script>

<style lang="scss" scoped>
.faq-module {
    padding: 0 rem(32px);
    :deep(.van-collapse-item){
        border: rem(2px) solid rgba(0,0,0,0.1);
        border-radius: rem(32px);
        overflow: hidden;
        margin-bottom: rem(40px);
        &:last-child{
            margin-bottom: rem(80px);
        }
        .van-cell{
            line-height: rem(38px);
            height: rem(144px);
            display: flex;
            align-items: center;
            padding: 0 rem(48px);
            &::after{
                display: none;
            }
        }
        .van-cell__title{
            color: #111111;
            font-size: rem(32px);
            font-weight: 600;
            display: flex;
            align-items: center;
        }
        .van-icon-arrow{
            font-size: rem(48px);
        }
        .van-collapse-item__content{
            padding: 0 rem(60px) rem(50px);
        }

    }
    .title {
        font-size: rem(48px);
        padding-top: rem(80px);
        margin-bottom: rem(20px);
        text-align: center;
        font-weight: 600;
        border-bottom: rem(4px) solid rgba(0,0,0,0.1);
        .underline{
            height: rem(92px);
            display: inline-block;
            // border-bottom: rem(2px) solid #111111;
        }
    }
    .icon{
        margin-right: rem(32px);
        width: rem(28px);
        display: block;
    }
    .desc {
        color: #666666;
        font-size: rem(28px);
        font-weight:400;
        line-height: rem(33px);
    }
}
</style>
