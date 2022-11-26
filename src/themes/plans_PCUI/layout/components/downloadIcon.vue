<template>
    <el-popover
        placement='bottom'
        trigger='hover'
        :width='180'
    >
        <template #reference>
            <i class='icon icon_xiazai' :title="$t('header.download')"></i>
        </template>
        <div class='download-dialog'>
            <img src='/images/qrcode.png' />
            <!-- <div ref='qrCode' class='qrcode'></div> -->
            <p class='tip'>
                {{ $t('download.downloadTip') }}
            </p>
            <p class='line'></p>
            <button class='handle-btn' @click='toDownload'>
                {{ $t('download.moreDownload') }}
            </button>
        </div>
    </el-popover>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { localGet } from '@/utils/util.js'
import QRCode from 'qrcodejs2'

const router = useRouter()
// 二维码对象
const qrCode = ref(null)

// 创建二维码
const creatQrCode = () => {
    setTimeout(() => {
        qrCode.value.innerHTML = ''
        new QRCode(qrCode.value, {
            text: 'https://play.google.com/store/apps/details?id=uni.UNI8B7D0E0',
            width: 160,
            height: 160,
            colorDark: localGet('invertColor') === 'light' ? '#000000' : '#ffffff',
            colorLight: localGet('invertColor') === 'light' ? '#ffffff' : '#000000',
            correctLevel: QRCode.CorrectLevel.H
        })
    }, 100)
}

// 跳转到下载页面
const toDownload = () => {
    router.push({ path: '/download' })
}

onMounted(() => {
    // 创建二维码
    // creatQrCode()
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.icon {
    font-size: 16px;
    color: #D6DAE1;
    cursor: pointer;
}
.download-dialog {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 140px;
    padding: 5px 0;
    margin: 0 auto;
    img, .qrcode {
        display: block;
        width: 140px;
        height: 140px;
    }
    .tip {
        text-align: center;
        line-height: 14px;
        margin-top: 10px;
        font-size: 12px;
        color: var(--color);
        word-break: break-word;
        overflow-wrap: break-word;
    }
    .line {
        width: 100%;
        height: 1px;
        margin-top: 5px;
        margin-bottom: 10px;
        background: var(--lineColor);
        transform: scaleY(.5);
    }
    .handle-btn {
        @include hover();
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 6px 0;
        font-size: 12px;
        color: #fff;
        background: var(--primary);
        cursor: pointer;
    }
}
</style>
