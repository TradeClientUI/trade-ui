<template>
    <div class='downloadCATS-module'>
        <h2 class='title'>
            Invest anywhere, anytime
        </h2>
        <div class='module-cont'>
            <div class='left'>
                <p class='left-title'>
                    Various download methods and access channels to oversee your investment returns
                </p>
                <div class='download'>
                    <div class='qrcode-box'>
                        <img alt='qrcode' class='qrcode_img' src='/images/qrcode.png?t=2' />
                        <p>Scan the QR code on iPhone and Android to download the app</p>
                    </div>
                    <div class='download-choose'>
                        <a class='btn ios' :href="downloads['ios']">
                            Apple App Store
                        </a>
                        <a class='btn google' :href="downloads['google']">
                            Google App Store
                        </a>
                        <a class='btn android' :href="downloads['android']">
                            APK Download
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
    'android': '',
    'google': ''
}
</script>

<style lang="scss" scoped>
.downloadCATS-module {
    @include globalFont();
    @include pagePadding();
    font-weight: 500;
    .title {
        text-align: center;
        color:#111;
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
            flex:1;
            &-title {
                font-size: 20px;
                color:#111;
                line-height: 24px;
                font-weight: 600;
            }
            .download {
                margin-top:28px;
                display: flex;
                justify-content: space-between;
                .qrcode-box {
                    font-size: 12px;
                    color:var(--color);
                    .qrcode_img {
                        display: block;
                        width: 128px;
                        // border:1px dashed #666;
                        margin-bottom: 10px;
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
                        color:var(--color);
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
            flex:1;
            display: flex;
            justify-content: flex-end;
            .computer_icon {
                display: block;
                width:520px;
                margin-top:32px;
            }
        }

    }
}
</style>
