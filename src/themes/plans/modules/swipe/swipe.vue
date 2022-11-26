<template>
    <div class='wrapper' :style='data.styleObj'>
        <van-swipe :autoplay='data.loop ? (data.autoplay || 3000) : 0' :loop='data.loop'>
            <van-swipe-item v-for='(item, index) in dataList' :key='index'>
                <ImgComp :data='item' @openUrl="$emit('openUrl', $event)" />
            </van-swipe-item>
        </van-swipe>
        <slot></slot>
    </div>
</template>

<script>
import ImgComp from '../img/img.vue'
export default {
    components: {
        ImgComp,
    },
    props: {
        data: {
            type: Object,
            default: function () {
                return {
                    href: '',
                    src: '',
                    target: '',
                }
            }
        },
    },
    computed: {
        dataList () {
            const len = this.data?.items?.length ?? 0
            if (!len) return [{ src: '' }]
            return this.data.items
        }
    },
    watch: {
        data (newval) {
            console.log(newval)
        }
    }

}
</script>

<style lang="scss" >

</style>
