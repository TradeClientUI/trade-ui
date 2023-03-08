<template>
    <div class='chooseCATS-module'>
        <h2 class='title'>
            Choose CATS, choose wealth
        </h2>
        <ul class='list'>
            <li v-for='item in list' :key='item.id' class='item'>
                <img :alt='item.title' class='img_icon' :src='item.img' />
                <p class='img-title'>
                    {{ item.title }}
                </p>
                <div class='active-box'>
                    <div class='cont-info'>
                        <p class='active-title'>
                            {{ item.title }}
                        </p>
                        <p class='img-desc' v-html='item.desc'></p>
                    </div>
                </div>
            </li>
        </ul>
        <p class='more-btn' @click='toWhy'>
            View more
        </p>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
// 公告列表
const list = [
    {
        id: 1, img: require('../../../images/home/chooseImg.png'), title: 'Heading 1', desc: 'content content content content '
    },
    {
        id: 2, img: require('../../../images/home/chooseImg.png'), title: 'Heading 2', desc: 'content content content content '
    },
    {
        id: 3, img: require('../../../images/home/chooseImg.png'), title: 'Heading 3', desc: 'content content content content '
    },
    {
        id: 4, img: require('../../../images/home/chooseImg.png'), title: 'Heading 4', desc: 'content content content content '
    }
]
const router = useRouter()
// const handleClick = () => {
//     router.push('/fundV10/index')
// }
const toWhy = () => {
    router.push({
        path: '/about',
        query: {
            activeName: 'second'
        }
    })
}
</script>

<style lang="scss" scoped>
.chooseCATS-module {
    @include globalFont();
    @include pagePadding();
    font-weight: 500;
    .title {
        padding:80px 0 48px;
        line-height: 56px;
        text-align: center;
        font-size: 48px;
        font-weight: 700;
        color:#111;
    }
    .list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .item {
            flex:1;
            box-shadow: 0px 4px 15px 0px rgba(0,0,0,0.08);
            border-radius: 8px;
            position: relative;
            margin-right:48px;
            &:last-child {
                margin-right: 0;
            }
            .img_icon {
                display: block;
                width:100%;
                // height:348px;
            }
            .img-title {
                font-size: 16px;
                font-weight: 600;
                margin: 32px 0;
                color: #111;
                text-align: center;
            }
            .active-box {
                width:0;
                background:#fff;
                font-size: 16px;
                color: #111;
                line-height: 24px;
                border-radius: 8px;
                position: absolute;
                top: 0;
                bottom: 0;
                left:0;
                .cont-info {
                    // visibility:hidden;
                    opacity: 0;
                    // min-width:248px;
                    max-width: 100%;
                }
                .active-title {
                    font-size: 24px;
                    color: #111;
                    margin: 32px 0 24px;
                    text-align: center;
                    // text-decoration: underline;
                }
            }
            &:hover {
                cursor: pointer;
                .active-box {
                    right:0;
                    width:100%;
                    padding: 32px 24px;
                    transition:width .2s;
                    color: #111;
                    // display: block;
                    .cont-info {
                        opacity: 1;
                        // visibility: visible;
                        transition: opacity 1.6s;
                        color: #111;
                    }
                }
            }
        }
    }
    .more-btn {
        width: 140px;
        height: 44px;
        line-height: 44px;
        color:var(--primary);
        font-size: 16px;
        text-align: center;
        border-radius: 12px;
        border: 2px solid rgba(0,0,0,0.1);
        margin: 40px auto;
        &:hover {
            cursor: pointer;
            border-color: var(--primary);
        }
    }
}
</style>
