<template>
    <div class='downloadPage-wrap auto-width'>
        <div class='block'>
            <h2>{{ $t('download.title') }}</h2>
            <h4>{{ $t('download.subTitle') }}</h4>
            <div class='content'>
                <div class='btn-wrap'>
                    <a class='btn' :href="downloads['ios']">
                        <svg class='icon-svg' fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                            <path clip-rule='evenodd' d='M15.69 1.979c.133 1.148-.345 2.28-1.046 3.112-.73.818-1.9 1.444-3.037 1.364-.15-1.105.428-2.28 1.073-2.997.73-.814 1.997-1.437 3.01-1.48zm3.64 6.17c-.135.076-2.231 1.27-2.208 3.698.026 2.94 2.707 3.912 2.739 3.923-.015.068-.42 1.402-1.424 2.757-.84 1.192-1.72 2.358-3.116 2.379-.665.014-1.113-.167-1.58-.356-.488-.198-.996-.403-1.79-.403-.843 0-1.374.212-1.886.417-.442.177-.87.348-1.474.372-1.33.047-2.347-1.273-3.217-2.455-1.738-2.412-3.092-6.8-1.277-9.785.88-1.464 2.484-2.407 4.197-2.432.755-.015 1.48.261 2.114.504.485.185.918.35 1.273.35.312 0 .733-.158 1.224-.343.773-.292 1.72-.648 2.683-.552.659.018 2.536.246 3.745 1.923l-.003.002z' fill='#76808F' fill-rule='evenodd' />
                        </svg>
                        <span>{{ $t('download.ios') }}</span>
                    </a>
                    <a class='btn' :href="downloads['android']">
                        <svg class='icon-svg' fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M17.543 14.1a1 1 0 01-.997-.997 1 1 0 01.997-.997 1 1 0 01.997.997 1 1 0 01-.997.997zm-11.05 0a1 1 0 01-.996-.997 1 1 0 01.997-.997 1 1 0 01.997.997.993.993 0 01-.997.997zM17.9 8.082l1.994-3.458a.409.409 0 00-.155-.567.409.409 0 00-.567.156l-2.022 3.503a12.354 12.354 0 00-5.14-1.098c-1.857 0-3.594.394-5.14 1.098L4.848 4.213a.419.419 0 00-.568-.156.419.419 0 00-.155.567l1.994 3.458C2.689 9.948.348 13.423 0 17.52h24c-.32-4.107-2.67-7.583-6.1-9.44z' fill='#76808F' />
                        </svg>
                        <span>{{ $t('download.android') }}</span>
                    </a>
                </div>
                <div class='qr-code'>
                    <div class='code-img'>
                        <img alt='' src='/images/qrcode.png' />
                    </div>
                    <p class='tip'>
                        {{ $t('download.downloadTip') }}
                    </p>
                </div>
            </div>
        </div>
        <div class='block'>
            <img alt='' class='img-download' src='/images/download.png' srcset='' />
        </div>
    </div>
</template>

<script setup>
// 下载地址
const downloads = {
    'ios': 'https://www.Cats.io/site/v10-trade.app',
    'android': 'https://www.Cats.io/site/v10-trade.apk'
}
</script>

<style lang="scss">
.downloadPage-wrap {
    display: flex;
    padding: rem(50px) rem(30px);
    .block {
        flex: 1;
    }
    .img-download {
        width: 450px;
        height: 430px;
    }
    h2 {
        box-sizing: border-box;
        min-width: 0;
        margin: 0;
        color: var(--color);
        font-weight: 600;
        font-size: 28px;
        line-height: 36px;
    }
    h4 {
        box-sizing: border-box;
        min-width: 0;
        margin-top: 10px;
        margin-bottom: 32px;
        color: var(--minorColor);
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
    }
    .content {
        display: flex;
        justify-content: flex-start;
        padding-top: 80px;
        .btn-wrap {
            margin-right: rem(30px);
            .btn {
                display: flex;
                align-items: center;
                width: rem(300px);
                height: rem(100px);
                margin-right: 16px;
                margin-bottom: 16px;
                padding-top: 8px;
                padding-right: 16px;
                padding-bottom: 8px;
                padding-left: 16px;
                background-color: #1E2329;
                border-radius: 4px;
                cursor: pointer;
                opacity: 0.8;
                .icon-svg {
                    width: rem(48px);
                    margin-right: rem(20px);
                    path {
                        fill: #FFF;
                    }
                }
                >span {
                    color: #FFF;
                    font-size: rem(24px);
                    opacity: 0.8;
                }
            }
        }
        .qr-code {
            .code-img {
                display: inline-block;
                box-sizing: border-box;
                width: rem(248px);
                min-width: 0;
                margin: 0;
                padding: 4px;
                line-height: 0;
                background-color: rgb(24, 26, 32);
                border: 8px solid rgb(94, 102, 115);
                border-radius: 8px;
                img {
                    width: 100%;
                }
            }
            .tip {
                box-sizing: border-box;
                min-width: 0;
                margin: 12px 0 0;
                color: rgb(112, 122, 138);
                font-weight: 400;
                font-size: 12px;
                line-height: 16px;
                text-align: center;
            }
        }
    }
}
</style>
