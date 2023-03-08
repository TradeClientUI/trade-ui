
<template>
    <div class='about'>
        <h1 class='title'>
            {{ $t('aboutUs.title') }}
        </h1>
        <div class='introduce'>
            <div class='right'>
                <h3 class='text'>
                    {{ $t('aboutUs.introduce') }}
                </h3>
                <div class='video'>
                    <!-- <iframe
                        allowfullscreen='true'
                        border='0'
                        frameborder='no'
                        framespacing='0'
                        height='390'
                        scrolling='no'
                        src='https://www.Cats.io/site/V10.mp4'
                        width='754'
                    >
                    </iframe> -->
                </div>
            </div>
        </div>
        <h3 class='title'>
            {{ $t('aboutUs.servicesTitle') }}
        </h3>
        <h1 class='title'>
            {{ $t('aboutUs.visionsTitle') }}
        </h1>
        <div class='future'>
            <span class='text'>
                {{ $t('aboutUs.visionsTextCell1') }}
            </span>
            <span class='text'>
                {{ $t('aboutUs.visionsTextCell2') }}
            </span>
            <span class='text'>
                {{ $t('aboutUs.visionsTextCell3') }}
            </span>
            <span class='text'>
                {{ $t('aboutUs.visionsTextCell4') }}
            </span>
            <span class='text'>
                {{ $t('aboutUs.visionsTextCell5') }}
            </span>
            <span class='text'>
                {{ $t('aboutUs.visionsTextCell6') }}
            </span>
            <span class='text'>
                {{ $t('aboutUs.visionsTextCell7') }}
            </span>
        </div>
    </div>
</template>

<script>
import { getCookie } from '@/utils/util.js'
import { computed } from 'vue'
export default {
    setup () {
        const lang = getCookie('lang') || 'zh-CN'

        const videoHeight = computed(() => {
            if (lang === 'zh-CN') return 360
            else return 350
        })

        return {
            videoHeight,
        }
    }
}
</script>

<style lang="scss" scoped>
.about{
    color: rgba(51,51,51,0.85);
    background: #FFFFFF;
    .title{
        font-size: 32px;
        text-align: center;
        font-weight: 500;
        padding-top: 60px;
    }
    .introduce{
        width: 1200px;
        display: flex;
        display: -webkit-flex;
        box-shadow: 0px 2px 15px 0px rgba(1,26,108,0.08);
        margin: 24px auto 0px auto;
        padding: 24px;
        border-radius: 8px;
        .left_img{
            width: 374px;
            height: 538px;
        }
        .right{
            margin-left: 24px;
            display:flex;
            display: -webkit-flex;
            flex-wrap: wrap;
        .text{
            font-size: 14px;
            letter-spacing: 0;
            line-height: 28px;
            font-weight: 400;
        }
        .video {
            width: 755px;
            padding-top: 5px;
            border-radius: 8px;
            background: #000;
            video {
                margin: 5px auto 0;
            }
        }
        }
    }
    .service{
        width: 546px;
        margin: 20px auto 0;
        .left_img {
            display: block;
            width: 546px;
            height: auto;
        }
        .shape{
            width: 151.4px;
            height: 174.39px;
            background: #FFFFFF;
            border: 4px solid rgba(255,255,255,1);border: 2px solid rgba(1,26,108,1);
            border: 4px solid rgba(255,255,255,1);border: 2px solid rgba(1,26,108,1);
            &1{
                transform: rotate(133deg);
            }
        }
    }
    .future{
        margin-top: 24px;
        padding-bottom: 50px;
        .text{
            display:block;
            text-align: center;
            font-size: 14px;
            letter-spacing: 0;
            line-height: 40px;
            font-weight: 400;
        }
    }
}
</style>
