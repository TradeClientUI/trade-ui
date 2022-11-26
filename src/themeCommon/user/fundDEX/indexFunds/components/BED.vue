<template>
    <div class='dynamic-case'>
        <div class='tokens'>
            <h2 class='title'>
                Underlying Tokens
            </h2>
            <div class='block'>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/610515116d463d2579d50c5e_weth%201.svg' />
                    <span>Wrapped ETH</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/610515116b2e2f51fab92bed_wrapped-bitcoin-wbtc-logo%201.svg' />
                    <span>Wrapped BTC</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/610515113a2930e63853a0b9_DPI_token_logo%201.svg' />
                    <span>DPI</span>
                </div>
            </div>
        </div>
        <div class='about'>
            <h2 class='title'>
                About
            </h2>
            <div class='block'>
                <van-collapse v-model='activeName' accordion>
                    <van-collapse-item name='1' title='Methodology'>
                        <div class='section'>
                            <p class='text'>
                                The BED index is meant to track crypto’s top 3 investable assets.
                            </p>
                            <div class='tick-list mb-space'>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span><b>Scope:</b> The index includes the top 3 investable assets with real usage and large capitalizations around the theme of blockchain: BTC, ETH, DeFi (DPI).</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span><b>Weighting:</b> Neutral construction, equal weight</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span><b>Rebalancing:</b> First Friday of every month</span>
                                </div>
                            </div>
                            <p class='text'>
                                The composition is:
                            </p>
                            <div class='tick-list'>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>33.3% Bitcoin</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>33.3% Ether</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>33.3% DPI</span>
                                </div>
                            </div>
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
