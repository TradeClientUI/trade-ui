<template>
    <div class='dynamic-case'>
        <div class='tokens'>
            <h2 class='title'>
                Underlying Tokens
            </h2>
            <div class='block'>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/61d5ac1f17dc6b5adb28615e_convex_logo_whitebackground.svg' />
                    <span>Convex Finance</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/61d5923d3d46aa557416db35_Maple%20Logo.png' />
                    <span>Maple Finance</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/61d58521d5afb74636f118cc_Fei%20Protocol.svg' />
                    <span>Tribe</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/61d5864840066dbff60bb168_Tokemak%20Logo.jpeg' />
                    <span>Tokemak</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/61d581e38debd1f85088fca3_Olympus%20DAO%20Logo.jpeg' />
                    <span>Olympus DAO</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/61d58f81d9093dd34c1d7bf1_Logo.svg' />
                    <span>Ribbon Finance</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/61d58a030f9a0741d78b3ca6_dydx-icon.svg' />
                    <span>DYDX</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/61d58e4d5d26e37bed413782_Perpetual%20Protocol%20Logo.svg' />
                    <span>Perpetual Protocol</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/61d58ac3161c44857319b1af_Reflexer%20Finance%20Logo.png' />
                    <span>Reflexer Finance</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/625072265dd5c41bac17d2cd_frax-share-fxs-logo.svg' />
                    <span>Frax Share</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/61d585a6dc9dc7537fd28095_Alchemix%20Logo.png' />
                    <span>Alchemix</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/61d591c165a5ad01d5944bcf_Dopex%20Logo.png' />
                    <span>Dopex</span>
                </div>
            </div>
        </div>
        <div class='about'>
            <h2 class='title'>
                About
            </h2>
            <div class='block'>
                <van-collapse v-model='activeName' accordion>
                    <van-collapse-item name='1' title='Methodology and Component Selection'>
                        <div class='section'>
                            <p class='text'>
                                GMI’s initial constitution selection criteria begins with the 367 assets behind Coingecko’s DeFi Filter. From there several further screens are applied:
                            </p>
                            <div class='tick-list'>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>Market Cap: &gt;$30m, &lt;$5b</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>ERC20</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>Ethereum Prioritized Roadmap</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>DeFi Appropriate: Application or protocol facilitates or aids in the facilitation of financial products or services such as exchange, borrow/lend, derivatives, yield, etc. As opposed to application themes that fall outside of DeFi (e.g. keeper bot systems, oracles, staking services, MEV, bridges, etc)</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>Compound, Aave, or other money-market interest-bearing collateral tokens</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>Assets are not synthetically issued</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>noDPI: Assets are not in common with DPI</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>Traction: Relative to application category</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>Secondary Market Liquidity</span>
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
