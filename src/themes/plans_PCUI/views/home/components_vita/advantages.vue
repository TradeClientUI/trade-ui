<!--加入基金的优势-->
<template>
    <div class='advantages-module'>
        <div class='module-cont'>
            <h2 class='title'>
                Benefits of crypto funds
            </h2>
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

const list1 = [
    { id: 1, imgDefault: require('../../../images/home/new_version/advantage3_default_icon.png'), textDefault: 'heading 1', imgActive: require('../../../images/home/new_version/advantage3_active_icon.png'), textActive: 'content 1 content 1 content 1 content 1 content 1' },
    { id: 2, imgDefault: require('../../../images/home/new_version/advantage3_default_icon.png'), textDefault: 'heading 2', imgActive: require('../../../images/home/new_version/advantage3_active_icon.png'), textActive: 'content 2 content 2 content 2 content 2 content 2' },
    { id: 3, imgDefault: require('../../../images/home/new_version/advantage3_default_icon.png'), textDefault: 'heading 3', imgActive: require('../../../images/home/new_version/advantage3_active_icon.png'), textActive: 'content 3 content 3 content 3 content 3 content 3' },
]
const list2 = [
    { id: 4, imgDefault: require('../../../images/home/new_version/advantage3_default_icon.png'), textDefault: 'heading 4', imgActive: require('../../../images/home/new_version/advantage3_active_icon.png'), textActive: 'content 4 content 4 content 4 content 4 content 4' },
    { id: 5, imgDefault: require('../../../images/home/new_version/advantage3_default_icon.png'), textDefault: 'heading 5', imgActive: require('../../../images/home/new_version/advantage3_active_icon.png'), textActive: 'content 5 content 5 content 5 content 5 content 5' },
    { id: 6, imgDefault: require('../../../images/home/new_version/advantage3_default_icon.png'), textDefault: 'heading 6', imgActive: require('../../../images/home/new_version/advantage3_active_icon.png'), textActive: 'content 6 content 6 content 6 content 6 content 6' },
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
    @include globalFont();
    font-weight: 500;
    background-color: #F2F4F8;
    @include pagePadding();
    .module-cont {
        @include pagePadding();
        padding-bottom: 64px !important;
        max-width: 1280px;
        margin: 0 auto;
        .title {
            color:#111;
            line-height: 56px;
            font-size: 48px;
            font-weight: 700;
            text-align: center;
            padding: 64px 0;
        }
        .list1,.list2 {
            display: flex;
            flex-wrap:wrap;
            .item {
                flex:1;
                border-right: 1px solid #eee;
                cursor: pointer;
                &:last-child {
                    border-right: none;
                }

                .default-box {
                    background: #fff;
                    text-align: center;
                    height:280px;
                    color:var(--color);
                    font-size: 20px;
                    font-weight: 600;
                    padding:80px 32px 0;
                    .img-icon {
                        display: block;
                        width: 48px;
                        margin: 0 auto 16px;
                    }
                }
                .active-box {
                    display: none;
                    height:280px;
                    padding: 32px;
                    background: #F2F4F8;;
                    color:#666;
                    line-height: 16px;
                    font-size: 14px;
                    .box-title {
                        color:#111;
                        font-size: 24px;
                        font-weight: 600;
                        line-height: 20px;
                        margin-bottom: 8px;
                    }
                    .img-icon {
                        display: block;
                        width: 72px;
                        margin-bottom: 16px;
                    }
                }
            }
            .active {
                flex:2;
                transition:flex .4s;
                .default-box {
                    display: none;
                }
                .active-box {
                    display: block;
                }
            }
        }
        .list-cont{
            padding: 8px;
            background: #FFFFFF;
        }
        .list1 {
            .item {
                border-bottom: 1px solid rgba(0,0,0,0.1);
                &:first-child {
                    .default-box,.active-box {
                        border-radius: 12px 0 0 0;
                    }
                }
                &:last-child {
                    .default-box,.active-box {
                        border-radius: 0 12px 0 0;
                    }
                }
            }

        }
        .list2 {
            .item {
                &:first-child {
                    .default-box,.active-box {
                        border-radius:0 0 0 12px;
                    }
                }
                &:last-child {
                    .default-box,.active-box {
                        border-radius: 0 0 12px 0;
                    }
                }
            }

        }
    }
}
</style>
