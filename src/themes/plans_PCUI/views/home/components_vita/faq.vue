<template>
    <div class='faq-module'>
        <h2 class='title'>
            <span class='text'>
                FAQs
            </span>
        </h2>
        <el-collapse v-model='activeName' accordion>
            <el-collapse-item name='1'>
                <template #title>
                    Where is CATS based?
                </template>
                <div class='desc'>
                    content content content content content content content content content content content content content content content.
                </div>
            </el-collapse-item>
            <el-collapse-item name='2'>
                <template #title>
                    What products does CATS provide?
                </template>
                <div class='desc'>
                    Not only provide spot transactions, but also provide CeFi & DeFi funds. We support different fund managers to list funds on the platform, which allow users to purchase funds as needed. More functions and supports are coming soon.
                </div>
            </el-collapse-item>
            <el-collapse-item name='3'>
                <template #title>
                    What is the transaction fee?
                </template>
                <div class='desc'>
                    For spot trading, charge 0.15%. For CeFi fund V10 trading, subscription fee 0.2%, redemption fee 2.5%, management fee 3%. For DeFi funds, we don't charge any service fees.
                </div>
            </el-collapse-item>
            <el-collapse-item name='4'>
                <template #title>
                    How to contact CATS customer service team?
                </template>
                <div class='desc'>
                    You may contact our customer service team through our website or app. Please note that our team WILL NOT ask you for your account password or pin. Never trust any call from someone claimed to be an employee from CATS.
                </div>
            </el-collapse-item>
            <el-collapse-item name='5'>
                <template #title>
                    Why should I choose CATS to trade?
                </template>
                <div class='desc'>
                    content content content content content content content content content content content content content content content.
                </div>
            </el-collapse-item>
        </el-collapse>
        <!-- <p class='more-btn' @click="$router.push('/faqs')">
            View all
        </p> -->
    </div>
</template>

<script setup>
import { ref } from 'vue'

const activeName = ref('1')
</script>

<style lang="scss">
.faq-module {
    .el-collapse {
        border:none;
    }
    .el-collapse-item {
        border: 1px solid rgba(0,0,0,0.1);
        margin-bottom: 32px;
        border-radius: 16px;
         &:last-child{
            margin-bottom: 0px;
        }
    }
    .el-collapse-item__content{
        padding-bottom: 24px;
        margin: 0 48px;
    }
    .el-collapse-item__header {
        color: #111;
        font-size: 20px;
        font-weight: 600;
        background: url('../../../images/home/new_version/wenhao_icon.png') 24px center no-repeat;
        padding-left: 48px;
        height: 78px;
        padding-right:20px;
        border:none;
        &.is-active{
            height: 70px;
        }
    }
    .is-active {
        color: #111;
        font-weight: 600;
    }
    .el-collapse-item__arrow.is-active {
        color:var(--primary);
    }
    .el-collapse-item__wrap {
        border:none;
        border-radius:0 0 16px 16px;
    }
}

</style>

<style lang="scss" scoped>
.faq-module {
    // @include pagePadding();
    @include globalFont();
    width: 886px;
    margin: auto;
    margin-bottom: 8px;
    padding-bottom: 64px;
    font-weight: 500;
    .title {
        text-align: center;
        color:var(--color);
        font-size: 32px;
        line-height: 38px;
        font-weight: 600;
        margin-bottom: 32px;
        margin-top:48px;
        border-bottom: 2px solid rgba(0,0,0,0.1);
        .text {
            position: relative;
            display: inline-block;
            padding-bottom: 8px;
        }
    }
    .desc {
        color:var(--color);
        font-size: 16px;
        font-weight: 400;
        line-height: 30px;
    }
    .more-btn {
        width: 140px;
        height: 44px;
        line-height: 44px;
        color:var(--primary);
        font-size: 16px;
        text-align: center;
        border-radius: 12px;
        border: 2px solid rgba(0,0,0,0.1);
        margin: 40px auto;
        &:hover {
            cursor: pointer;
            border-color: var(--primary);
        }
    }
}
</style>
