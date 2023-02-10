<template>
    <div class='full'>
        <div class='centerBox'>
            <div class='new-quick-module'>
                <h2 class='title' data-aos='fade-up'>
                    <span>{{ $t('homeJD.signalsTrade') }}</span>
                    <bannerWifi />
                </h2>
                <p class='banner-text' data-aos='fade-up' data-aos-delay='200'>
                    {{ $t('homeJD.signalsTradeDesc') }}
                </p>
                <banner-register />
            </div>
            <div class='full-right'>
                <img alt='computer' class='full-right-img' src='../../../images/home/new_version/banner-back.png' />
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import bannerRegister from './bannerRegister'
import bannerWifi from '@/themeCommon/components/signalWifi.vue'

export default {
    components: {
        bannerRegister,
        bannerWifi
    },
    setup (props, { emit }) {
        const router = useRouter()
        const registerAccount = ref('')
        // const context = useContext()

        const store = useStore()
        const isLogin = computed(() => store.state._user.customerInfo)
        // 去注册
        const goRegister = () => {
            const query = {}
            query[registerAccount.value.includes('@') ? 'email' : 'mobile'] = registerAccount.value
            router.push({ name: 'Register', query })
        }
        // 去公告详情
        const goNotice = (id) => {
            router.push({
                path: '/noticeDetail',
                query: {
                    id: id,
                    type: 'notice'
                }
            })
        }
        // 去入金
        const goDeposit = () => {
            router.push({
                path: '/depositChoose',
                query: {
                    tradeType: 1
                }
            })
        }
        // 去V10
        const goV10Detail = () => {
            router.push('/fundV10/index')
        }

        // 去视频地址
        const viewVideo = () => {
            emit('viewVideoHandle')
        }
        const linkTo = (url) => {
            if (url === '/order') {
                router.push({
                    path: '/order',
                    query: {
                        name: 'BTC/USDT',
                        symbolId: 328,
                        tradeType: 5
                    }
                })
            } else {
                router.push(url)
            }
        }
        // chart 元素
        const chartList = [
            { id: 1, height: '25px' },
            { id: 2, height: '36px' },
            { id: 3, height: '57px' },
            { id: 4, height: '42px' },
            { id: 5, height: '69px' },
            { id: 6, height: '102px' },
            { id: 7, height: '54px' },
            { id: 8, height: '77px' },
        ]

        // 右侧4个块的横线动画效果
        const rightBlockRef = ref(null)
        const animationLineActive = ref(1)
        // 动画结束
        const animationend = (index) => {
            // console.log('animationend', index)
            if (animationLineActive.value < 4) animationLineActive.value++
            else animationLineActive.value = 1
        }

        return {
            rightBlockRef,
            animationend,
            animationLineActive,
            registerAccount,
            goRegister,
            goDeposit,
            goNotice,
            goV10Detail,
            viewVideo,
            isLogin,
            chartList,
            linkTo
        }
    }
}
</script>

<style lang="scss" scoped>
.full {
    @include pagePadding();
    margin: auto;
    width: 100%;
    background: url('../../../images/home/new_version/top_banner_left.svg') left top no-repeat, url('../../../images/home/new_version/top_banner_right.svg') right bottom no-repeat;
    background-color: rgba(246, 250, 255, 1);
}
.centerBox {
    max-width: 1280px;
    justify-content: space-between;
    align-items: center;
    display: flex;
    margin: 0 auto;
    padding-bottom: 22px;
}
.new-quick-module {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 590px;
    margin-left: 32px;
    .title {
        font-size: 64px;
        font-weight: 700;
        color: #111;
        line-height: 80px;
        margin-bottom: 20px;
        padding-top: 46px;
        white-space: pre-line;
        position: relative;
        display: inline-flex;
        :deep(.wifi-symbol) {
            margin-top: -30px;
        }
    }
    .banner-text {
        color: #111;
        font-weight: 400;
        font-size: 24px;
        line-height: 28px;
        min-width: 510px;
    }
    .describe {
        font-size: 16px;
        color: var(--color);
        display: flex;
        align-items: center;
        font-weight: 600;
        .usdt-num {
            color: #E6B24F;
            font-size: 24px;
        }
        .active:hover {
            color: var(--primary);
            cursor: pointer;
        }
        .gift_img {
            width: 22px;
            margin-right: 16px;
        }
    }
    .learn-more {
        width: max-content;
        cursor: pointer;
        display: block;
        font-size: 16px;
        color: var(--primary);
        background: url('../../../images/home/new_version/video_icon.png') left center no-repeat;
        padding-left: 22px;
        font-weight: 600;
        margin-top: 40px;
    }
}
.full-right {
    .full-right-img {
        max-width: 100%;
        width: 480px;
        display: block;
    }
}
// 右侧四个方块 start
.right {
    height: 442px;
    column-count: 2;
    column-gap: 16px;
    margin: 56px 0;
    max-width: 464px;
    @include pagePadding();
    padding-left: 0 !important;
    .item1,
    .item2,
    .item3,
    .item4 {
        border-radius: 8px;
        background-color: #FFF;
        padding: 16px;
        break-inside: avoid;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: all 0.2s linear;
        &.active {
            box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.1);
            &::after {
                content: '';
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 4px;
                background: #EBB650;
                transform-origin: left;
                animation: animLine 5s linear;
            }
        }
        &:hover {
            box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.1);
            &::after {
                animation-play-state: paused;
            }
        }
        .item-title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
        }
        .item-desc {
            font-size: 12px;
            color: #666;
            font-weight: 400;
        }
        .icon-list {
            column-count: 4;
            &.column5 {
                column-count: 5;
            }
            .icon20 {
                height: 20px;
            }
            .icon24 {
                height: 24px;
                margin-top: 16px;
            }
        }
    }
    .item1 {
        margin-bottom: 16px;
        .icon-list {
            margin-top: 4px;
        }
    }
    .item2 {
        .center {
            width: 96px;
            display: block;
            margin: 16px auto 2px;
        }
        .icon20 {
            margin-top: 12px;
        }
    }
    .item3-wrap {
        min-width: 220px;
        padding-top: 40px;
        .item3 {
            margin-bottom: 16px;
            box-sizing: border-box;
        }
        .hr1 {
            width: 55px;
            height: 10px;
            background: #F5F7F8;
            margin-top: 14px;
        }
        .hr2 {
            width: 31px;
            height: 10px;
            background: #CFF5E5;
            margin-top: 4px;
        }
        .chart {
            display: flex;
            margin-top: 14px;
            justify-content: space-between;
            align-items: flex-end;
            .chart—item {
                width: 10px;
                max-width: 10px;
                background: #0062FF;
            }
        }
    }
    .item4 {
        min-width: 220px;
        .item-title {
            margin-bottom: 14px;
        }
        .icon20 {
            margin-bottom: 24px;
            height: 20px;
        }
        .icon-wrap {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
        }
        .icon-bottom {
            height: 14px;
        }
    }
} // 右侧四个方块 end

// 右侧四个方块的动画效果
@keyframes animLine {
    0% {
        transform: scaleX(0);
    }
    100% {
        transform: scaleX(1);
    }
}
body.night {
    .full {
        background: var(--contentColor);
    }
    .new-quick-module {
        .title,
        .banner-text {
            color: var(--mainColor);
        }
    }
}
</style>
