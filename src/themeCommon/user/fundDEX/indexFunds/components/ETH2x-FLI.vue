<template>
    <div class='dynamic-case'>
        <div class='tokens'>
            <h2 class='title'>
                Underlying Tokens
            </h2>
            <div class='block'>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/6102a7c83cbd9d109754b8b5_compound-ether-ceth-logo%201.svg' />
                    <span>cETH</span>
                </div>
                <div class='product'>
                    <img src='https://assets.website-files.com/60d237b6ea65be721ff4bbfa/6102a8c68c5b2346958c0791_usd-coin-usdc-logo%201.svg' />
                    <span>USDC</span>
                </div>
                <div class='platform'>
                    <span>Debt & Collateral is accessed via</span>
                    <div class='box'>
                        <svg fill='none' viewBox='0 0 188 42' xmlns='http://www.w3.org/2000/svg'>
                            <g clip-path='url(#clip0)'>
                                <path clip-rule='evenodd' d='M184.552 23.8877C184.552 21.4317 183.107 19.5826 180.827 19.5826C178.546 19.5826 177.099 21.4317 177.099 23.8877C177.099 26.3436 178.546 28.1927 180.827 28.1927C183.112 28.1974 184.552 26.3483 184.552 23.8877ZM184.441 17.9345V11.5003C184.441 11.0754 184.725 10.7065 185.135 10.5991L188.544 9.6886V31.4611H184.762V29.6122C183.811 30.9988 182.104 31.8113 179.967 31.8113C175.58 31.8113 173.01 28.2861 173.01 23.8924C173.01 19.4986 175.58 15.9734 179.967 15.9734C182.099 15.9687 183.662 16.8932 184.441 17.9345ZM161.174 16.3142V18.1633C161.868 16.8605 163.426 15.964 165.678 15.964C169.317 15.964 171.251 18.3919 171.251 22.006V31.4611H167.152V22.4729C167.152 20.7079 166.402 19.4939 164.582 19.4939C162.591 19.4939 161.495 20.764 161.495 22.7904V31.4611H157.396V16.3142H161.174ZM147.812 31.8113C143.395 31.8113 140.938 29.9017 140.938 24.9895V16.3142H145.037V25.0457C145.037 27.1561 145.988 28.1366 147.807 28.1366C149.626 28.1366 150.578 27.1514 150.578 25.0457V16.3142H154.677V24.9849C154.686 29.9017 152.228 31.8113 147.812 31.8113ZM127.404 23.8877C127.404 26.6051 129.078 28.1927 131.242 28.1927C133.406 28.1927 135.08 26.6005 135.08 23.8877C135.08 21.1748 133.406 19.5826 131.242 19.5826C129.083 19.5826 127.404 21.1702 127.404 23.8877ZM131.246 31.8113C126.396 31.8113 123.304 28.1974 123.304 23.8924C123.304 19.5874 126.392 15.9734 131.246 15.9734C136.097 15.9734 139.189 19.5874 139.189 23.8924C139.184 28.1974 136.097 31.8113 131.246 31.8113ZM110.81 23.8877C110.81 26.3436 112.256 28.1927 114.537 28.1927C116.817 28.1927 118.263 26.3436 118.263 23.8877C118.263 21.4317 116.817 19.5826 114.537 19.5826C112.256 19.5826 110.81 21.4317 110.81 23.8877ZM110.927 29.8455V36.1443C110.927 36.5692 110.642 36.9381 110.232 37.0454L106.827 37.942V16.3142H110.61V18.1633C111.561 16.7765 113.268 15.964 115.404 15.964C119.792 15.964 122.362 19.4892 122.362 23.8831C122.362 28.2767 119.792 31.8019 115.404 31.8019C113.263 31.8113 111.706 30.8868 110.927 29.8455ZM94.6505 22.8464V31.4611H90.5511V22.4729C90.5511 20.7967 89.9449 19.4939 88.1259 19.4939C86.2186 19.4939 85.1785 20.736 85.1785 22.7624V31.4658H81.0792V16.3142H84.8614V18.1633C85.5562 16.8605 87.0581 15.964 89.2219 15.964C91.2739 15.964 92.7431 16.7718 93.6106 18.1025C94.9396 16.627 96.4694 15.964 98.6333 15.964C102.271 15.964 104.118 18.4808 104.118 22.006V31.4611H100.018V22.4729C100.018 20.7967 99.4122 19.4939 97.5932 19.4939C95.6579 19.4939 94.6505 20.736 94.6505 22.8464ZM67.4006 23.8877C67.4006 26.6051 69.0749 28.1927 71.2387 28.1927C73.4027 28.1927 75.077 26.6005 75.077 23.8877C75.077 21.1748 73.4027 19.5826 71.2387 19.5826C69.0749 19.5826 67.4006 21.1702 67.4006 23.8877ZM71.2387 31.8113C66.3885 31.8113 63.2966 28.1974 63.2966 23.8924C63.2966 19.5874 66.3838 15.9734 71.2387 15.9734C76.0936 15.9734 79.181 19.5874 79.181 23.8924C79.181 28.1974 76.089 31.8113 71.2387 31.8113ZM42.0254 21.1702C42.0254 14.7547 46.442 10.501 52.3321 10.501C57.4436 10.501 61.487 13.536 62.2658 18.5368H57.7607C57.1544 15.964 55.0745 14.5166 52.3321 14.5166C48.5779 14.5166 46.47 17.1173 46.47 21.1655C46.47 25.2137 48.5779 27.8144 52.3321 27.8144C55.0745 27.8144 57.1544 26.367 57.7607 23.7942H62.2658C61.487 28.795 57.4436 31.8299 52.3321 31.8299C46.442 31.8393 42.0254 27.5903 42.0254 21.1702Z' fill='#848484' fill-rule='evenodd' />
                                <path clip-rule='evenodd' d='M1.68359 32.7332C0.638925 32.0934 0 30.9543 0 29.7309V22.8998C0 22.6383 0.0699554 22.3863 0.200539 22.1622C0.60628 21.4617 1.50637 21.2237 2.20592 21.6345L17.6055 30.6227C18.5056 31.1503 19.0606 32.1123 19.0606 33.1581V40.2366C19.0606 40.5588 18.9718 40.8809 18.804 41.1564C18.2957 41.9876 17.2137 42.249 16.3835 41.7401L1.68359 32.7332ZM24.6383 19.7621C25.5383 20.2897 26.0933 21.2517 26.0933 22.2975V36.6599C26.0933 37.0849 25.8648 37.4771 25.4964 37.6826L22.1245 39.583C22.0825 39.6063 22.0359 39.625 21.9893 39.639V31.664C21.9893 30.632 21.4483 29.6749 20.5622 29.1426L7.03751 21.0415V12.0393C7.03751 11.7778 7.10747 11.5257 7.23805 11.3016C7.64378 10.6012 8.54389 10.363 9.24343 10.7739L24.6383 19.7621ZM31.3774 9.15373C32.2821 9.67667 32.8371 10.6479 32.8371 11.6938V32.6726C32.8371 33.1021 32.5992 33.4989 32.2215 33.7044L29.0267 35.432V20.8267C29.0267 19.7949 28.4859 18.8423 27.6045 18.31L13.7812 10.0082V1.46822C13.7812 1.20674 13.8512 0.954605 13.9771 0.730482C14.3828 0.0301025 15.2829 -0.208026 15.9825 0.198194L31.3774 9.15373Z' fill='#848484' fill-rule='evenodd' />
                            </g>
                            <defs>
                                <clipPath id='clip0'>
                                    <rect fill='white' height='42' width='188' />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        <div class='about'>
            <h2 class='title'>
                About
            </h2>
            <div class='block'>
                <van-collapse v-model='activeName' accordion>
                    <van-collapse-item name='1' title='Initial Parameter'>
                        <div class='section'>
                            <div class='tick-list'>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>Underlying Asset: ETH</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>Target Leverage Ratio: 2</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>DeFi Lending Protocol: Compound</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>Maximum Leverage Ratio: 2.3</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>Minimum Leverage Ratio: 1.7</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>Recentering Speed: 5%</span>
                                </div>
                            </div>
                        </div>
                    </van-collapse-item>
                    <van-collapse-item name='2' title='Advantages'>
                        <div class='section'>
                            <p class='text'>
                                ETH2X-FLI has several key advantages over Legacy Leveraged Tokens:
                            </p>
                            <div class='tick-list'>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>Zero slippage via composable entry and exit.</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>Unique Index algorithm reduces rebalancing needs by an order of magnitude.</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>Emergency deleveraging possible during Black Swan events for additional fund safety.</span>
                                </div>
                                <div class='tick-item'>
                                    <van-icon class='passed' name='passed' />
                                    <span>The token must be a bearer instrument. None of the following will be included in the index:Wrapped tokens. Tokenized derivatives. Synthetic assets. Tokens that are tied to physical assets. Tokens that represent claims on other tokens.</span>
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
