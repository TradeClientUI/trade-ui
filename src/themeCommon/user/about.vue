<template>
    <div class='page-wrap'>
        <div class='block'>
            <div class='section first-block'>
                <div class='left'>
                    <h1>{{ $t('aboutJD.aboutJD') }}</h1>
                    <p class='desc'>
                        {{ $t('aboutJD.aboutJDDesc') }}
                    </p>
                </div>
                <div class='right'>
                    <img v-if='logoUrl' :src='logoUrl' srcset='' />
                </div>
            </div>
        </div>
        <!-- <div class='block'>
            <div class='section second-block'>
                <div class='list-item'>
                    <div class='title'>
                        <img class='icon' src='/images/serviceIcon.png' />
                        <p class='title-main'>
                            Who We Are
                        </p>
                    </div>
                    <div class='desc'>
                        JDWilson是全球领先的在线交易经纪商平台，致力于为投资者提供轻松、简单的外汇、贵金属、加密货币等差价合约线上交易服务，受到毛里求斯FSC（监管号：C119023893）严格监管。平台专注于提升投资者交易的便捷性与安全性，并将不断革新技术与服务，始终为用户提供顶尖的流动性、强大稳定的交易平台、先进的交易体验与全方位的投资教学。陪伴用户成长，实现财富增值。
                    </div>
                </div>
                <div class='list-item'>
                    <div class='title'>
                        <img class='icon' src='/images/serviceIcon.png' />
                        <p class='title-main'>
                            Who We Are
                        </p>
                    </div>
                    <div class='desc'>
                        JDWilson是全球领先的在线交易经纪商平台，致力于为投资者提供轻松、简单的外汇、贵金属、加密货币等差价合约线上交易服务，受到毛里求斯FSC（监管号：C119023893）严格监管。平台专注于提升投资者交易的便捷性与安全性，并将不断革新技术与服务，始终为用户提供顶尖的流动性、强大稳定的交易平台、先进的交易体验与全方位的投资教学。陪伴用户成长，实现财富增值。
                    </div>
                </div>
                <div class='list-item'>
                    <div class='title'>
                        <img class='icon' src='/images/serviceIcon.png' />
                        <p class='title-main'>
                            Who We Are
                        </p>
                    </div>
                    <div class='desc'>
                        JDWilson是全球领先的在线交易经纪商平台，致力于为投资者提供轻松、简单的外汇、贵金属、加密货币等差价合约线上交易服务，受到毛里求斯FSC（监管号：C119023893）严格监管。平台专注于提升投资者交易的便捷性与安全性，并将不断革新技术与服务，始终为用户提供顶尖的流动性、强大稳定的交易平台、先进的交易体验与全方位的投资教学。陪伴用户成长，实现财富增值。
                    </div>
                </div>
            </div>
        </div> -->
        <div class='block'>
            <div class='section objectives-block'>
                <div class='list'>
                    <div class='list-item'>
                        <h1>{{ $t('aboutJD.vision') }}</h1>
                        <p class='desc'>
                            {{ $t('aboutJD.visionDesc') }}
                        </p>
                    </div>
                    <div class='list-item'>
                        <h1>{{ $t('aboutJD.target') }}</h1>
                        <p class='desc'>
                            {{ $t('aboutJD.targetDesc') }}
                        </p>
                    </div>
                    <div class='list-item'>
                        <h1>{{ $t('aboutJD.perspective') }}</h1>
                        <p class='desc'>
                            {{ $t('aboutJD.perspectiveDesc1') }}
                        </p>
                        <p class='desc'>
                            {{ $t('aboutJD.perspectiveDesc2') }}
                        </p>
                        <p class='desc'>
                            {{ $t('aboutJD.perspectiveDesc3') }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, computed, reactive, toRefs, ref, unref, onUnmounted } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const logoUrl = computed(() => {
    const theme = store.state.invertColor
    return theme === 'light' ? store.state.businessConfig?.pcuiLogoLight : store.state.businessConfig?.pcuiLogo
})
</script>

<style lang="scss" scoped>
.page-wrap {
    background: var(--contentColor);
    .section {
        width: 1200px;
        margin: 0 auto;
        @media (max-width: 768px) {
            padding: 0 15px;
            width: 100%;
        }
    }
    .block {
        padding: 30px;
        @media (max-width: 768px) {
            padding: 0;
        }
        &:nth-child(odd) {
            background: var(--contentColor);
        }
        &:nth-child(even) {
            background: var(--bgColor);
        }
    }
    .first-block {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-around;
        @media (max-width: 768px) {
            display: block;
            text-align: center;
            padding-top: 40px;
        }
        .left {
            flex: 1;
            margin-right: 50px;
            @media (max-width: 768px) {
                margin: 0;
            }
            h1 {
                margin-bottom: 15px;
                color: var(--primary);
                font-size: 35px;
            }
            .desc {
                line-height: 30px;
                font-size: 15px;
            }
        }
        .right {
            flex: 1;
            text-align: right;
            @media (max-width: 768px) {
                text-align: center;
                margin-top: 20px;
            }
            img {
                max-width: 300px;
            }
        }
    }
    .second-block {
        display: block;
        @media (max-width: 768px) {
            padding: 30px 15px;
        }
        .list-item {
            margin-bottom: 30px;
            .title {
                display: flex;
                align-items: center;
                .icon {
                    width: 30px;
                    margin-right: 10px;
                }
                .title-main {
                    font-size: 26px;
                    color: #EF5403;
                }
            }
            .desc {
                margin-left: 40px;
                margin-top: 10px;
                font-size: 16px;
                line-height: 28px;
                color: var(--normalColor);
            }
        }
    }
    .objectives-block {
        padding: 0 8%;
        margin-top: 20px;
        @media (max-width: 768px) {
            padding: 30px 15px;
        }
        h1 {
            color: var(--primary);
            margin-bottom: 15px;
        }
        .list-item {
            margin-bottom: 30px;
            h3 {
                margin-bottom: 5px;
            }
            .desc {
                font-size: 16px;
                line-height: 28px;
                color: var(--normalColor);
            }
        }
    }
}

</style>
