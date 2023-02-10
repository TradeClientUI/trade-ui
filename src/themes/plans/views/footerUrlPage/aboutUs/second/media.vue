<template>
    <div class='media'>
        <van-swipe :autoplay='3000' class='my-swipe'>
            <van-swipe-item>
                <div class='step'>
                    <img alt='' class='top-logo' src='../../../../images/home/logo/11.png' />
                    <a class='more' href='https://finance.yahoo.com/news/vitatoken-launched-worlds-first-cryptocurrency-052300053.html'>
                        Know more >
                    </a>
                    <div class='flex'>
                        <div class='left'>
                            <h2 class='title'>
                                Vitamin is vital, just like MagnaMarkets
                            </h2>
                            <span>
                                MagnaMarkets' mission is to make crypto journey easier. We provide a crypto funds platform that allows fund managers, users and us to achieve a win-win situation.
                            </span>
                        </div>
                        <img alt='' class='right-img' src='../../../../images/aboutus/media1.png' />
                    </div>
                </div>
            </van-swipe-item>
            <van-swipe-item>
                <div class='step'>
                    <img alt='' class='top-logo' src='../../../../images/home/logo/12.png' />
                    <a class='more' href='https://apnews.com/press-release/globe-newswire/c2709643c12b4ab46b448a368bb85558'>
                        Know more >
                    </a>
                    <div class='flex flex-wrap'>
                        <p class='item'>
                            <img alt='' src='../../../../images/aboutus/media2-1.png' />
                            <span>
                                1.You can buy popular cryptocurrencies
                            </span>
                        </p>
                        <p class='item'>
                            <img alt='' src='../../../../images/aboutus/media2-2.png' />
                            <span>
                                2.You can buy well-classified and rated fund
                            </span>
                        </p>
                        <p class='item'>
                            <img alt='' src='../../../../images/aboutus/media2-3.png' />
                            <span>
                                3.You can create, manage and grow your fund
                            </span>
                        </p>
                        <p class='item'>
                            <img alt='' src='../../../../images/aboutus/media2-4.png' />
                            <span>
                                4.More functions are coming soon
                            </span>
                        </p>
                    </div>
                </div>
            </van-swipe-item>
            <van-swipe-item>
                <div class='step'>
                    <img alt='' class='top-logo' src='../../../../images/home/logo/13.png' />
                    <a class='more' href='https://www.bloomberg.com/press-releases/2022-10-14/vitatoken-launched-the-world-s-first-cryptocurrency-fund-trading-platform'>
                        Know more >
                    </a>
                    <div class='flex'>
                        <div class='left'>
                            <h2 class='title'>
                                Easy and simple
                            </h2>
                            <span>
                                Instead of picking from 20k+ cryptocurrencies, just buy vetted crypto funds, including DeFi theme fund, Metaverse theme fund, NFT theme fund, and more.
                            </span>
                        </div>
                        <img alt='' class='right-img' src='../../../../images/aboutus/media3.png' />
                    </div>
                </div>
            </van-swipe-item>
            <van-swipe-item>
                <div class='step'>
                    <img alt='' class='top-logo' src='../../../../images/home/logo/14.png' />
                    <a class='more' href='https://www.coinspeaker.com/vitatoken-launched-worlds-first-cryptocurrency-fund-trading-platform/'>
                        Know more >
                    </a>
                    <div class='flex'>
                        <div class='left'>
                            <h2 class='title'>
                                Open and transparent
                            </h2>
                            <span>
                                Underlying asset addresses and transaction records of the fund are displayed to ensure that funds will not be misappropriated, such as the V10 index fund.
                            </span>
                        </div>
                        <img alt='' class='right-img' src='../../../../images/aboutus/media4.png' />
                    </div>
                </div>
            </van-swipe-item>
            <van-swipe-item>
                <div class='step'>
                    <img alt='' class='top-logo' src='../../../../images/home/logo/16.png' />
                    <a class='more' href='https://www.benzinga.com/pressreleases/22/10/g29264360/vitatoken-launched-the-worlds-first-cryptocurrency-fund-trading-platform'>
                        Know more >
                    </a>
                    <div class='flex'>
                        <div class='left'>
                            <h2 class='title'>
                                Asset safety, UnionBank escrow money
                            </h2>
                            <span>
                                Total market capitalization of the Fund reached 2.85B, more and more people are choosing MagnaMarkets.
                            </span>
                        </div>
                        <img alt='' class='right-img' src='../../../../images/aboutus/media5.png' />
                    </div>
                </div>
            </van-swipe-item>
        </van-swipe>
    </div>
</template>

<script setup>
</script>

<style lang='scss' scoped>
.media {
    .step {
        background-image: url('../../../../images/aboutus/mediabg.png');
        background-size: 100% 100%;
        position: relative;
        .more {
            position: absolute;
            line-height: rem(120px);
            right: rem(30px);
            color: #0062FF;
        }
        .top-logo {
            height: rem(120px);
        }
        .flex {
            display: flex;
            align-items: center;
            padding-left: rem(50px);
            padding-right: rem(10px);
            &.flex-wrap {
                height: rem(360px);
                flex-wrap: wrap;
                .item {
                    width: 50%;
                    display: flex;
                    align-items: center;
                    font-size: rem(28px);
                    color: #999;
                }
                img {
                    width: rem(67px);
                    margin: 0 rem(20px);
                }
            }
        }
        .left {
            font-size: rem(28px);
            color: #999;
            height: rem(360px);
            .title {
                color: #333;
                font-size: rem(40px);
                font-weight: 500;
                margin-bottom: rem(20px);
            }
        }
        .right-img {
            height: rem(155px);
        }
    }
    .my-swipe {
        padding-bottom: rem(20px);
        :deep(.van-swipe__indicators) {
            bottom: 0;
            .van-swipe__indicator {
                background: #DDD;
            }
            .van-swipe__indicator--active {
                background: #0062FF;
            }
        }
    }
}
</style>
