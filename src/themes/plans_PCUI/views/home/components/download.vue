<template>
    <div class='download-module'>
        <div class='download-case auto-width'>
            <h3 class='title'>
                {{ $t('home.download.title') }}
            </h3>
            <p class='describe'>
                {{ $t('home.download.describe') }}
            </p>
            <div class='case'>
                <div class='case-left'>
                    <img src='@planspc/images/home/download-device.png' />
                </div>
                <div class='case-right'>
                    <div class='block-1'>
                        <img src='@planspc/images/home/download-code.png' />
                        <div class='text'>
                            <h4>{{ $t('home.download.tip1') }}</h4>
                            <p>{{ $t('home.download.tip2') }}</p>
                        </div>
                    </div>
                    <ul class='block-2'>
                        <li>
                            <img src='@planspc/images/home/download-icon1.png' />
                            <span>App Store</span>
                        </li>
                        <li>
                            <img src='@planspc/images/home/download-icon2.png' />
                            <span>Android</span>
                        </li>
                        <li>
                            <img src='@planspc/images/home/download-icon3.png' />
                            <span>Google Play</span>
                        </li>
                        <li>
                            <img src='@planspc/images/home/download-icon4.png' />
                            <span>Mac OS</span>
                        </li>
                        <li>
                            <img src='@planspc/images/home/download-icon5.png' />
                            <span>Windows</span>
                        </li>
                        <li>
                            <img src='@planspc/images/home/download-icon6.png' />
                            <span>API</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.download-module {
    height: 782px;
    margin-top: 90px;
    background: url('~@planspc/images/home/download-bg.png');
    background-size: cover;
    .download-case {
        padding-top: 90px;
        color: #fff;
        .title {
            @include font();
            font-size: 32px;
            font-weight: bold;
        }
        .describe {
            margin-top: 10px;
            font-size: 16px;
            color: #B7C0E7;
        }
        .case {
            display: flex;
            margin-top: 58px;
            .case-left {
                margin-right: 112px;
                img {
                    width: 625px;
                    height: 469px;
                }
            }
            .case-right {
                width: 380px;
                padding-top: 49px;
                .block-1 {
                    display: flex;
                    align-items: center;
                    height: 112px;
                    background: rgba(71, 127, 211, 0.15);
                    border: 1px solid #485AAE;
                    border-radius: 10px;
                    img {
                        width: 88px;
                        height: 88px;
                        margin-left: 12px;
                    }
                    .text {
                        padding: 0 25px;
                        h4 {
                            font-size: 16px;
                            font-weight: normal;
                            color: #fff;
                        }
                        p {
                            margin-top: 5px;
                            font-size: 14px;
                            color: #B7C0E7;
                        }
                    }
                }
                .block-2 {
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    li {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        width: 80px;
                        margin-right: 60px;
                        margin-top: 54px;
                        &:nth-of-type(3n) {
                            margin-right: 0;
                        }
                        img {
                            width: 30px;
                            height: 30px;
                        }
                        span {
                            margin-top: 18px;
                            font-size: 14px;
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
}
</style>
