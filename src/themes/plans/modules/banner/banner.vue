<template>
    <div>
        <van-swipe :autoplay='3000' class='m-banner' lazy-render>
            <van-swipe-item v-for='item in list' :key='item.img'>
                <a v-if='item.href' href='javascript:;' @click='openUrl(item.href)'>
                    <img :src='item.img' />
                </a>
                <img v-else :src='item.img' />
            </van-swipe-item>
        </van-swipe>
    </div>
</template>

<script>
export default {
    props: ['list'],
    setup () {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
.m-banner {
    img {
        width: 100%;
    }
}
</style>
