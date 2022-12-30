<template>
    <div class='fund-module'>
        <h2 class='title'>
            {{ $t('funds.title') }}
        </h2>
        <p class='by'>
            By <span>MagnaMarkets</span> Crypto Exchange
        </p>
        <p class='subTitle'>
            {{ $t('funds.subTitle') }}
        </p>
        <div class='fund-tabs'>
            <i :class="['switch card-icon icon_doufukuai', { 'active': fundModel === 'card' }]" @click="fundModel = 'card'"></i>
            <i :class="['switch list-icon icon_liebiao', { 'active': fundModel === 'list' }]" @click="fundModel = 'list'"></i>
        </div>
        <!-- 卡片模式 -->
        <div v-if="fundModel === 'card'" class='card-case'>
            <fund-card
                v-for='(item, index) in fundProductList'
                :key='index'
                :fund='item'
                :index='index'
            />
        </div>
        <!-- 列表模式 -->
        <fund-list v-if="fundModel === 'list'" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFund } from '../hooks.js'
import fundCard from './fund-card.vue'
import fundList from './fund-list.vue'

// 基金产品列表
const { fundProductList } = useFund()
// 基金展示模式 card:卡片 list:表格
const fundModel = ref('card')
</script>

<style lang='scss' scoped>
.fund-module {
    padding-bottom: 60px;
    .title {
        text-align: center;
        padding-top: 80px;
        margin-bottom: 4px;
        font-size: 40px;
        font-weight: 700;
        letter-spacing: 0.15px;
        color: var(--mainColor);
    }
    .by {
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        color: var(--mainColor);
        span {
            color: #EBB650;
        }
    }
    .subTitle {
        text-align: center;
        margin: 16px 0;
        font-size: 16px;
        font-weight: 400;
        color: var(--mainColor);
    }
}
.fund-tabs {
    display: flex;
    justify-content: center;
    .switch {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 48px;
        height: 48px;
        line-height: 1;
        margin: 16px;
        color: var(--mainColor);
        background: var(--contentColor);
        border-radius: 10px;
        box-shadow: 3px 3px 20px rgb(0 0 0 / 9%);
        transition: all 0.2s ease-in-out;
        cursor: pointer;
        &.card-icon {
            font-size: 32px;
        }
        &.list-icon {
            font-size: 36px;
        }
        &.active {
            color: var(--primary);
            border: 1px solid var(--primary);
        }
        &:hover {
            color: var(--primary);
            border: 1px solid var(--primary);
            transform: scale(1.05);
        }
    }
}
.card-case {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}
</style>
