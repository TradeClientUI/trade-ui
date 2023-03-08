<template>
    <div class='downloadVitatoken-module'>
        <h2 class='title'>
            {{ $t('homeJD.invest') }}
        </h2>
        <p class='h2'>
            {{ $t('homeJD.investKnow') }}
        </p>
        <img alt='computer' class='computer_icon' src='../../../images/home/new_version/computer_icon.png' />
        <div class='download-choose'>
            <!-- <a class='btn ios' :href="downloads['ios']">
                <img alt='' src='../../../images/home/new_version/apple_icon.png' />
                <p>{{ $t('homeJD.appleAppStore') }}</p>
            </a> -->
            <a class='btn android' :href="downloads['android']" target='_blank'>
                <img alt='' src='../../../images/home/new_version/apk_icon.png' />
                <p>{{ $t('homeJD.apkDownload') }}</p>
            </a>
            <a class='btn google' :href="downloads['google']" target='_blank'>
                <img alt='' src='../../../images/home/new_version/google_icon.png' />
                <p>{{ $t('homeJD.googleAppStore') }}</p>
            </a>
        </div>
        <div class='qrcode'>
            <img alt='qrcode' class='qrcode_img' src='/images/qrcode.png?key=new' />
            <p class='qrcode_text'>
                {{ $t('homeJD.investDownload') }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { localGet } from '@/utils/util'
const downloads = {
    'ios': '',
    'android': 'https://www.CATS.com/site/CATS.apk',
    'google': 'https://play.google.com/store/apps/details?id=com.CATS.app'
}
const theme = ref(localGet('invertColor'))
</script>

<style lang="scss" scoped>
.downloadVitatoken-module {
    margin: 0 auto;
    font-weight: 500;
    padding: 0 rem(32px);
    text-align: center;
    .title {
        font-size: rem(48px);
        padding: rem(96px) 0 rem(16px);
        text-align: center;
        font-weight: bold;
    }
    .h2 {
        text-align: center;
        font-size: rem(28px);
        line-height: rem(42px);
        font-weight: 400;
    }
    .computer_icon {
        width: 100%;
        margin-top: rem(96px);
    }
    .qrcode {
        display: flex;
        align-items: center;
        padding-bottom: rem(80px);
        .qrcode_img {
            width: rem(256px);
            border: 1px solid #FFF;
        }
        .qrcode_text {
            text-align: left;
            margin-left: rem(20px);
            color: var(--normalColor);
            font-weight: 600;
            font-size: rem(24px);
        }
    }
    .download-choose {
        display: flex;
        justify-content: space-between;
        padding: rem(40px) 0;
        width: 80%;
        margin: 0 auto;
        .btn {
            font-size: rem(24px);
            font-weight: 600;
            color: var(--color);
            line-height: rem(36px);
            img {
                height: rem(48px);
                margin-bottom: rem(28px);
            }
        }
    }
}
body.night {
    .downloadVitatoken-module {
        .download-choose img {
            filter: invert(1);
        }
    }
}
</style>
