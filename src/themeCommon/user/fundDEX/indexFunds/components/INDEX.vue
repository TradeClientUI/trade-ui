<template>
    <div class='dynamic-case'>
        <div class='about'>
            <h2 class='title'>
                About
            </h2>
            <div class='block'>
                <van-collapse v-model='activeName' accordion>
                    <van-collapse-item name='1' title='What are the tokenomics of $INDEX?'>
                        <div class='section'>
                            <p class='text'>
                                $INDEX has a supply cap of 10,000,000 units that vest gradually over three years. Of the total supply, 70% was set aside for the community, liquidity providers and methodologists as follows:
                            </p>
                            <div class='tick-list'>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>1% was initially distributed to past holders and liquidity providers of $DPI</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>9% were allocated to a liquidity mining program that spanned 60 days from launch of Index Coop</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>7.5% were allocated to the Index Methodology Bounty, rewarded to Methodologists over 18 months ending June 2022</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>52.5% were allocated to the community treasury and vested over 3 years</span>
                                </div>
                            </div>
                            <p class='text'>
                                The remaining 30% were allocated to the two launch parties Index Coop: DeFi Pulse (2%) and Set Protocol (28%).
                            </p>
                        </div>
                    </van-collapse-item>
                </van-collapse>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// 当前展开的模块
const activeName = ref('1')
</script>

<style lang="scss" scoped>
@import '../../indexFundsDynamic.scss'
</style>
