<template>
    <div class='trade-wrap'>
        <h2 class='h2title'>
            Explore funds in DeFi
        </h2>
        <div class='fundIndex'>
            <div
                :class="['item', { 'active': fundIndex === 1 }]"
                @click='fundIndex = 1 '
                @mouseenter='showPopoverEarning = true'
                @mouseleave='showPopoverEarning = false'
            >
                <span>Earning </span>
            </div>
            <div :class="['item', { 'active': fundIndex === 2 }]" @click='fundIndex = 2'>
                <span>Index Funds</span>
            </div>
        </div>
        <!-- Earning -->
        <template v-if='fundIndex == 1'>
            <trade-earning />
        </template>
        <!-- indexFunds header -->
        <template v-if='fundIndex == 2'>
            <trade-funds />
        </template>
        <p class='more'>
            <span class='link' @click='more'>
                {{ $t('JG_newHome.viewMore') }}
                <van-icon class='icon' name='arrow' />
            </span>
        </p>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import tradeEarning from './tradeEarning.vue'
import tradeFunds from './tradeFunds.vue'
const fundIndex = ref(1) // 显示产品类型 1：earning  2:indexFunds
const showPopoverEarning = ref(false)
const router = useRouter()
// 查看更多
const more = () => {
    fundIndex.value === 1 ? router.push('/earning') : router.push('/indexFunds')
}
</script>

<style lang="scss" scoped>
.trade-wrap{
    margin-top: rem(8px);
    background: var(--contentColor);
    padding: rem(60px) 0;
    .h2title{
        font-family: "Microsoft Yahei";
        font-size: rem(48px);
        font-weight: bold;
        text-align: center;
        padding-bottom: rem(64px);
    }
}
.fundIndex{
    height: 50px;
    border-bottom: 1px solid var(--lineColor);
    padding: 0 rem(30px);
    .item {
        display: inline-flex;
        align-items: center;
        height: 100%;
        margin-right: 15px;
        color: var(--minorColor);
        cursor: pointer;
        .svg-icon {
            width: 20px;
            height: 20px;
        }
        span {
            margin-left: 5px;
            font-size: rem(28px);
            font-weight: bold;
        }
    }
    .active {
        color: #0062ff;
        border-bottom: 3px solid #0062ff;
    }
    @media (max-width: 768px) {
        display: flex;
        align-items: center;
    }
    .popover{
        left: 0;
        width: rem(150px);
    }
}
.more {
    text-align: right;
    margin-top: rem(28px);
    margin-right: rem(30px);
    .van-icon {
        font-weight: bold;
    }
    .link {
        font-size: rem(28px);
        font-weight: bold;
        cursor: pointer;
        color: #0062ff;
        display: inline-flex;
    }
}
</style>
