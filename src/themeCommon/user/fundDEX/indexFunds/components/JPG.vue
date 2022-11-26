<template>
    <div class='dynamic-case'>
        <div class='tokens'>
            <h2 class='title'>
                Underlying Tokens
            </h2>
            <div class='block'>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/625eed70097860ac6cf411e1_PUNK%20Logo.png' />
                    <span>PUNK</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/625eeefc59479cf2d2be2651_XMON%20Logo.png' />
                    <span>XMON</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/60f0395c25bf1a6b43c9b0c2_whale%201.svg' />
                    <span>WHALE</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/625d19ede2d159c488186a84_Socks%20Logo.png' />
                    <span>SOCKS</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/625d1bf0d7a6a49fc115076c_The%20Dog%20NFT%20Logo.png' />
                    <span>DOG</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/625d1e088827f82c0dcec9fc_ethereum-eth-logo.svg' />
                    <span>ETH</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/625d1fc737119ed7fe344462_Kanon%20Art%20Logo.png' />
                    <span>K21</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/625eedce3dbe126b1b04425c_ASH%20Logo.svg' />
                    <span>ASH</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/625eee1ef022b232080ad50c_JENNY%20Logo.png' />
                    <span>uJenny</span>
                </div>
            </div>
        </div>
        <div class='about'>
            <h2 class='title'>
                About
            </h2>
            <div class='block'>
                <van-collapse v-model='activeName' accordion>
                    <van-collapse-item name='1' title='Advantages'>
                        <div class='section'>
                            <p class='text'>
                                JPG provides a portfolio of leading NFT collections with the convenience and liquidity of a single index token.
                            </p>
                            <p class='text mb-space'>
                                Key advantages over holding individual NFTs include:
                            </p>
                            <div class='tick-list'>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>Broader diversification</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>Curation provided by the underlying protocols</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>Lower capital requirements</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>Higher entry and exit liquidity</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>Faster order fulfillment</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>Reduced transaction fees</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>Protocol governance provided by the JPG token</span>
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
