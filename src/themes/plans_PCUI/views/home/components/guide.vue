<template>
    <div class='guide-module auto-width'>
        <ul class='guide-ul'>
            <li v-for='(item, index) in list' :key='index' @click='onItem(item)'>
                <img :src='item.url' />
            </li>
        </ul>
    </div>
</template>

<script setup>
import { getCookie } from '@/utils/util.js'

// 当前语言
const lang = getCookie('lang')
// 列表数据
const list = [
    {
        url: require('@planspc/images/' + lang + '/guide-1.png'),
        link: 'https://www.Cats.io/site/about-us'
    },
    {
        url: require('@planspc/images/' + lang + '/guide-2.png'),
        link: 'https://www.Cats.io/site/v10'
    },
    {
        url: require('@planspc/images/' + lang + '/guide-3.png'),
        link: 'https://www.Cats.io/site/tutorial'
    },
    {
        url: require('@planspc/images/' + lang + '/guide-4.png'),
        link: 'https://cs.Cats.io/im/text/1cayxu.html?lang=en'
    }
]
// 点击列表项
const onItem = (item) => {
    window.open(item.link)
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.guide-module {
    margin-top: 50px;
    .guide-ul {
        display: flex;
        li {
            width: 270px;
            height: 142px;
            margin: 0 15px;
            cursor: pointer;
            &:last-of-type {
                margin-right: 0;
            }
            img {
                display: block;
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>
