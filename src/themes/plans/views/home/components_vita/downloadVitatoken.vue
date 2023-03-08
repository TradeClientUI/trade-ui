<template>
    <div class='downloadCATS-module'>
        <h2 class='title'>
            Invest anywhere, anytime
        </h2>
        <p class='h2'>
            Various download methods and access channels to oversee your investment returns
        </p>
        <img alt='computer' class='computer_icon' src='../../../images/home/new_version/computer_icon.png' />
        <div class='download-choose'>
            <a class='btn ios' :href="downloads['ios']">
                <img alt='' src='../../../images/home/new_version/apple_icon.png' />
                <p>Apple App Store</p>
            </a>
            <a class='btn google' :href="downloads['google']">
                <img alt='' src='../../../images/home/new_version/apk_icon.png' />
                <p>Android</p>
            </a>
            <a class='btn android' :href="downloads['android']">
                <img alt='' src='../../../images/home/new_version/google_icon.png' />
                <p>Google Paly</p>
            </a>
        </div>
        <div class='qrcode'>
            <img alt='qrcode' class='qrcode_img' src='/images/qrcode.png' />
            <p class='qrcode_text'>
                Scan the QR code on iPhone and Android to download the app
            </p>
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
    margin:0 auto;
    @include globalFont();
    font-weight: 500;
    padding: 0 rem(32px);
    text-align: center;
    .title {
        font-size: rem(48px);
        padding: rem(96px) 0 rem(16px);
        text-align: center;
        font-weight: bold;
    }
    .h2{
        text-align: center;
        font-size: rem(28px);
        line-height: rem(42px);
        font-weight: 400;
    }
    .computer_icon{
        width: 100%;
        margin-top: rem(96px);
    }
    .qrcode{
        display: flex;
        align-items: center;
        padding-bottom: rem(80px);
        .qrcode_img{
            width:rem(256px);
        }
        .qrcode_text{
            text-align: left;
            margin-left: rem(20px);
            color: #666;
            font-weight: 600;
            font-size: rem(24px);
        }
    }
    .download-choose {
        display: flex;
        justify-content: space-between;
        padding: rem(40px) 0;
        .btn {
            font-size: rem(24px);
            font-weight: 600;
            color: #333333 ;
            line-height: rem(36px);
            img{
                height: rem(48px);
                margin-bottom: rem(28px);
            }
        }
    }
}
</style>
