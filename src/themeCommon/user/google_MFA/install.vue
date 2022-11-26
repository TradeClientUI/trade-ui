<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' />
        <div class='bigIcon'>
            <i class='icon icon_shoujixiazai'></i>
        </div>
        <dl class='stepsContent'>
            <dt>{{ $t('mfa.installStepLabel') }}</dt>
            <dd>
                <p>{{ $t('mfa.step1') }}</p>
                <p class='alignRight'>
                    <a class='download' :href='downloadURL' target='_blank'>
                        {{ $t('mfa.downBtnText') }}
                        <span class='icon icon_zhiding1'></span>
                    </a>
                </p>
            </dd>
            <dd>
                <p>{{ $t('mfa.step2') }}</p>
            </dd>
            <dd>
                <p>{{ $t('mfa.step3') }}</p>
            </dd>
        </dl>

        <div class='footerBox'>
            <van-button block class='nobd' plain type='primary' @click="$router.push({ name:'MFA_secretKey' })">
                {{ $t('mfa.hasInstalled') }}
            </van-button>
        </div>
    </div>
</template>

<script setup>
import { isIOS } from 'vant/lib/utils'

const androidUrl = 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=zh&gl=US'
const iosUrl = 'https://apps.apple.com/cn/app/google-authenticator/id388497605'
const downloadURL = isIOS() ? iosUrl : androidUrl
</script>

<style lang="scss" scoped>
.page-wrap {
    width: 100%;
    height: 100%;
    margin-top: rem(110px);
    margin-bottom: rem(110px);
    overflow: auto;
    :deep(.topNav .main) {
        max-width: 100%;
    }
    .bigIcon {
        padding-top: rem(60px);
        color: var(--primary);
        font-size: rem(180px);
        text-align: center;
    }
    .stepsContent {
        margin: rem(50px) rem(30px) 0;
        line-height: 1.7;
        dt {
            padding-bottom: rem(20px);
            font-weight: bold;
            font-size: rem(30px);
        }
        dd {
            padding-bottom: rem(20px);
        }
        .download {
            position: relative;
            padding-right: rem(30px);
            color: var(--primary);
        }
        .icon_zhiding1 {
            position: absolute;
            right: 0;
            transform: rotate(180deg);
        }
    }
    .footerBox {
        position: absolute;
        bottom: rem(20px);
        left: 0;
        width: 100%;
        .nobd {
            background: none;
            border: 0;
        }
    }
}
</style>
