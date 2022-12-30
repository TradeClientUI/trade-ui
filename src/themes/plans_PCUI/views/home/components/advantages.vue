<!--加入基金的优势-->
<template>
    <div class='advantages-module'>
        <div class='module-cont'>
            <div class='title-warp'>
                <h2 class='title' data-aos='fade-up' data-aos-delay='200'>
                    {{ $t('homeJD.whyTradeCFDs') }}
                </h2>
                <p class='title-label' data-aos='fade-up' data-aos-delay='400'>
                    {{ $t('homeJD.whyTradeCFDsDesc') }}
                </p>
            </div>
            <div class='list-cont'>
                <ul class='list1' @mouseleave='mouseleaveHandle'>
                    <li v-for='item in list1' :key='item.id' class='item' :class="['item'+item.id, { 'active': active == item.id }]" @mouseenter='mouseenterHandle(item.id)'>
                        <div class='default-box'>
                            <img class='img-icon' :src='item.imgDefault' />
                            <p>{{ item.textDefault }}</p>
                        </div>
                        <div class='active-box'>
                            <img class='img-icon' :src='item.imgActive' />
                            <p class='box-title'>
                                {{ item.textDefault }}
                            </p>
                            <p v-if='showDesc == item.id'>
                                {{ item.textActive }}
                            </p>
                        </div>
                    </li>
                </ul>
                <ul class='list2' @mouseleave='mouseleaveHandle'>
                    <li v-for='item in list2' :key='item.id' class='item' :class="['item'+item.id, { 'active': active == item.id }]" @mouseenter='mouseenterHandle(item.id)'>
                        <div class='default-box'>
                            <img class='img-icon' :src='item.imgDefault' />
                            <p>{{ item.textDefault }}</p>
                        </div>
                        <div class='active-box'>
                            <img class='img-icon' :src='item.imgActive' />
                            <p class='box-title'>
                                {{ item.textDefault }}
                            </p>
                            <p v-if='showDesc == item.id'>
                                {{ item.textActive }}
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
const list1 = [
    { id: 1, imgDefault: require('../../../images/home/new_version/advantage1_default_icon.png'), textDefault: t('homeJD.leverage'), imgActive: require('../../../images/home/new_version/advantage1_active_icon.png'), textActive: t('homeJD.leverageDesc') },
    { id: 2, imgDefault: require('../../../images/home/new_version/advantage2_default_icon.png'), textDefault: t('homeJD.longOrShort'), imgActive: require('../../../images/home/new_version/advantage2_active_icon.png'), textActive: t('homeJD.longOrShortDesc') },
    { id: 3, imgDefault: require('../../../images/home/new_version/advantage3_default_icon.png'), textDefault: t('homeJD.globeMarkets'), imgActive: require('../../../images/home/new_version/advantage3_active_icon.png'), textActive: t('homeJD.globeMarketsDesc') },
]
const list2 = [
    { id: 4, imgDefault: require('../../../images/home/new_version/advantage4_default_icon.png'), textDefault: t('homeJD.portfolio'), imgActive: require('../../../images/home/new_version/advantage4_active_icon.png'), textActive: t('homeJD.portfolioDesc') },
    { id: 5, imgDefault: require('../../../images/home/new_version/advantage5_default_icon.png'), textDefault: t('homeJD.24hours'), imgActive: require('../../../images/home/new_version/advantage5_active_icon.png'), textActive: t('homeJD.24hoursDesc') },
    { id: 6, imgDefault: require('../../../images/home/new_version/advantage6_default_icon.png'), textDefault: t('homeJD.liquidity'), imgActive: require('../../../images/home/new_version/advantage6_active_icon.png'), textActive: t('homeJD.liquidityDesc') },
]
const active = ref(1)
const showDesc = ref(1) // 显示描述文案
const mouseenterHandle = (id) => {
    active.value = id
    // 等元素变宽之后显示文案  元素变宽动画时长是0.4s
    setTimeout(() => {
        showDesc.value = id
    }, 350)
}
const mouseleaveHandle = () => {
    // active.value = 1
    // setTimeout(function () {
    //     showDesc.value = 1
    // }, 350)
}
</script>

<style lang="scss" scoped>
.advantages-module {
    font-weight: 500;
    background-color: #F2F4F8;
    @include pagePadding();
    .module-cont {
        @include pagePadding();
        padding-bottom: 64px !important;
        max-width: 1280px;
        margin: 0 auto;
        .title-warp {
            padding: 64px 0;
            .title {
                text-align: center;
                color: var(--mainColor);
                font-size: 48px;
                line-height: 56px;
                font-weight: 700;
            }
            .title-label {
                text-align: center;
                color: var(--color);
                font-size: 16px;
                line-height: 20px;
                margin-top: 16px;
            }
        }
        .list1,
        .list2 {
            display: flex;
            flex-wrap: wrap;
            .item {
                flex: 1;
                border-right: 1px solid #EEE;
                cursor: pointer;
                &:last-child {
                    border-right: none;
                }
                .default-box {
                    // background: #FFF;
                    text-align: center;
                    height: 280px;
                    color: var(--color);
                    font-size: 20px;
                    font-weight: 600;
                    padding: 80px 32px 0;
                    .img-icon {
                        display: block;
                        width: 48px;
                        margin: 0 auto 16px;
                    }
                }
                .active-box {
                    display: none;
                    height: 280px;
                    padding: 32px;
                    background: #F2F4F8;
                    color: var(--normalColor);
                    line-height: 20px;
                    font-size: 14px;
                    .box-title {
                        color: var(--mainColor);
                        font-size: 24px;
                        font-weight: 600;
                        line-height: 20px;
                        margin-bottom: 20px;
                    }
                    .img-icon {
                        display: block;
                        width: 72px;
                        margin-bottom: 16px;
                    }
                }
            }
            .active {
                flex: 2;
                transition: flex 0.4s;
                .default-box {
                    display: none;
                }
                .active-box {
                    display: block;
                }
            }
        }
        .list-cont {
            padding: 8px;
            background: var(--contentColor);
            min-height: 560px;
        }
        .list1 {
            .item {
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                &:first-child {
                    .default-box,
                    .active-box {
                        border-radius: 12px 0 0;
                    }
                }
                &:last-child {
                    .default-box,
                    .active-box {
                        border-radius: 0 12px 0 0;
                    }
                }
            }
        }
        .list2 {
            .item {
                &:first-child {
                    .default-box,
                    .active-box {
                        border-radius: 0 0 0 12px;
                    }
                }
                &:last-child {
                    .default-box,
                    .active-box {
                        border-radius: 0 0 12px;
                    }
                }
            }
        }
    }
}
body.night {
    .advantages-module {
        background-color: var(--bgColor);
        .module-cont {
            .list1,
            .list2 {
                .item {
                    border-right-color: var(--bgColor);
                    .active-box {
                        background-color: var(--bgColor);
                    }
                    .img-icon {
                        filter: invert(1);
                    }
                }
            }
        }
    }
}
</style>
