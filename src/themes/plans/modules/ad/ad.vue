<template>
    <div class='BanderBanner' :style='data.styleObj'>
        <van-swipe :loop='false' :show-indicators='false' :width='300'>
            <van-swipe-item v-for='item in data.items' :key='item.src' class='item'>
                <a v-if='item.href' href='javascript:;' @click="$emit('openUrl',item)">
                    <img :src='item.src || "http://prewpadmin.cmfbl.com/wp-content/uploads/2021/07/minibanner2.png"' />
                </a>
                <img v-else :src='item.src' />
            </van-swipe-item>
        </van-swipe>
    </div>
</template>

<script>
export default {
    props: ['list', 'data'],
    setup (props) {
        return {}
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.BanderBanner {
    margin: 0 rem(30px);
    .item {
        padding-right: rem(30px);
    }
    img {
        width: 100%;
    }
}
</style>
