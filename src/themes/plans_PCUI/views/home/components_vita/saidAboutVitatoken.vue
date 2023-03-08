<template>
    <div class='saidAboutCATS-module'>
        <div class='module-cont'>
            <h2 class='title'>
                That's what they said about CATS
            </h2>
            <img class='coin_icon1' src='../../../images/home/new_version/coin_icon.png' />
            <img class='coin_icon2' src='../../../images/home/new_version/coin_icon.png' />
            <el-carousel ref='carousel' arrow='never' indicator-position='none' :interval='4000' @change='carouselChange'>
                <el-carousel-item v-for='item in list' :key='item.id'>
                    <p class='text'>
                        {{ item.desc }}
                    </p>
                </el-carousel-item>
            </el-carousel>
            <ul class='list'>
                <li v-for='item in list' :key='item.id' class='item' :class="{ 'active': curItem == item.id }" @click='carousel.setActiveItem(item.id)'>
                    <img class='left' :src='item.img' />
                    <div class='right'>
                        <p class='name'>
                            {{ item.name }}
                        </p>
                        <p>{{ item.label }}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const list = [
    {
        id: 0, img: require('../../../images/home/new_version/user1_img.png'), name: 'Johanna Jim', label: 'introduce content', desc: 'CATS is nice, It\'s worth your choice. CATS is nice, It\'s worth your choice. CATS is nice, It\'s worth your choice. CATS is nice, It\'s worth your choice.'
    },
    {
        id: 1, img: require('../../../images/home/new_version/user1_img.png'), name: 'Johanna Jim', label: 'introduce content', desc: 'CATS is nice, It\'s worth your choice. CATS is nice, It\'s worth your choice. CATS is nice, It\'s worth your choice. CATS is nice, It\'s worth your choice.'
    },
    {
        id: 2, img: require('../../../images/home/new_version/user1_img.png'), name: 'Johanna Jim', label: 'introduce content', desc: 'CATS is nice, It\'s worth your choice. CATS is nice, It\'s worth your choice. CATS is nice, It\'s worth your choice. CATS is nice, It\'s worth your choice.'
    }
]
const carousel = ref(null)
const curItem = ref(0)
const carouselChange = (index) => { // 轮播图切换事件
    curItem.value = index
}
</script>

<style lang="scss" scoped>
.saidAboutCATS-module {
    background: #242424;
    @include pagePadding();
    @include globalFont();
    .module-cont {
        padding: 48px 0 64px;
        font-weight: 500;
        max-width: 1280px;
        margin: 0 auto;
        color:#fff;
        position: relative;
        .title {
            margin-bottom: 120px;
            line-height: 80px;
            text-align: center;
            font-size: 48px;
            font-weight: 600;
        }
        .coin_icon1 {
            display: block;
            width:48px;
            position: absolute;
            top:150px;
            left:24px;
        }
        .coin_icon2 {
            transform: rotate(180deg);
            position: absolute;
            bottom:200px;
            right:24px;
        }
        .text {
            padding: 0 64px;
            text-align: center;
            font-size: 32px;
            font-weight: 400;
            height: 200px;
            margin-bottom:80px;
        }
        .list {
            display: flex;
            justify-content: space-between;
            align-items: center;
            @include pagePadding();
            .item {
                flex:1;
                border-radius: 52px;
                background: rgba(255,255,255,0.05);
                display: flex;
                align-items: center;
                padding: 24px 0 24px 34px;
                cursor: pointer;
                margin-right:104px;
                &:last-child {
                    margin-right: 0;
                }
                .left {
                    display: block;
                    width:60px;
                    height: 60px;
                    border-radius: 50%;
                    margin-right:8px;
                }
                .right {
                    font-size: 14px;
                    color: rgba(255,255,255,0.5);
                    .name {
                        color:#fff;
                        font-size: 20px;
                    }
                }
                &:hover {
                    .name {
                        font-size: 22px;
                    }
                }
            }
            .active {
                background: #fff;
                .right {
                    color: var(--color);
                    .name {
                        color:#111;
                        font-size: 20px;
                        font-weight: 600;
                        line-height: 24px;
                    }
                }
            }
        }
    }

}
</style>
