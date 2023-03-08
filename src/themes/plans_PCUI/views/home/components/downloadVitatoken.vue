<template>
    <div class='downloadVitatoken-module'>
        <h2 class='title' data-aos='fade-up'>
            {{ $t('homeJD.invest') }}
        </h2>
        <div class='module-cont'>
            <div class='left'>
                <p class='left-title'>
                    {{ $t('homeJD.investKnow') }}
                </p>
                <div class='download'>
                    <div class='qrcode-box'>
                        <img alt='qrcode' class='qrcode_img' src='/images/qrcode.png?key=new' />
                        <p class='download-text'>
                            {{ $t('homeJD.investDownload') }}
                        </p>
                    </div>
                    <div class='download-choose'>
                        <!-- <a class='btn ios' :href="downloads['ios']">
                            {{ $t('homeJD.appleAppStore') }}
                        </a> -->
                        <a class='btn google' :href="downloads['google']" target='_blank'>
                            {{ $t('homeJD.googleAppStore') }}
                        </a>
                        <a class='btn android' :href="downloads['android']" target='_blank'>
                            {{ $t('homeJD.apkDownload') }}
                        </a>
                    </div>
                </div>
            </div>
            <div class='right'>
                <img alt='computer' class='computer_icon' src='../../../images/home/new_version/computer_icon.png' />
            </div>
        </div>
    </div>
</template>

<script setup>
const downloads = {
    'ios': '',
    'android': 'https://www.CATS.com/site/CATS.apk',
    'google': 'https://play.google.com/store/apps/details?id=com.CATS.app'
}
</script>

<style lang="scss" scoped>
.downloadVitatoken-module {
    @include pagePadding();
    font-weight: 500;
    .title {
        text-align: center;
        color: var(--mainColor);
        font-size: 48px;
        line-height: 56px;
        font-weight: 700;
        padding: 48px 0;
    }
    .module-cont {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 64px;
        @include pagePadding();
        .left {
            flex: 1;
            &-title {
                font-size: 20px;
                color: var(--mainColor);
                line-height: 24px;
                font-weight: 600;
            }
            .download {
                margin-top: 28px;
                display: flex;
                justify-content: space-between;
                .qrcode-box {
                    font-size: 12px;
                    color: var(--color);
                    .qrcode_img {
                        display: block;
                        width: 128px;
                        border: 1px solid #FFF;
                        margin-bottom: 10px;
                    }
                    .download-text {
                        font-size: 14px;
                        text-align: center;
                    }
                }
                .download-choose {
                    .btn {
                        width: 180px;
                        height: 40px;
                        line-height: 40px;
                        padding-left: 48px;
                        display: block;
                        font-size: 14px;
                        font-weight: 400;
                        color: var(--color);
                        border-radius: 8px;
                        border: 1px solid var(--color);
                        margin-bottom: 20px;
                        &:hover {
                            font-weight: 600;
                        }
                    }
                    .ios {
                        background: url('../../../images/home/new_version/apple_icon.png') 16px center no-repeat;
                    }
                    .google {
                        background: url('../../../images/home/new_version/google_icon.png') 16px center no-repeat;
                    }
                    .android {
                        background: url('../../../images/home/new_version/apk_icon.png') 16px center no-repeat;
                    }
                }
            }
        }
        .right {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            .computer_icon {
                display: block;
                width: 540px;
                margin-top: 32px;
            }
        }
    }
}
body.night {
    .downloadVitatoken-module {
        .module-cont .left .download .download-choose .btn {
            filter: brightness(100);
        }
    }
}
</style>
