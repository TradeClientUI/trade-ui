<template>
    <div class='notice' :style='data.styleObj'>
        <van-notice-bar :background='$style.contentColor' color='#666' left-icon='volume-o' :scrollable='false'>
            <van-swipe
                :autoplay='3000'
                class='notice-swipe'
                :show-indicators='false'
                style='height: 20px;'
                vertical
            >
                <van-swipe-item v-for='(item, index) in data.items' :key='index'>
                    <span v-if='item?.href?.name' class='swipe-text' @click="$emit('openUrl',item)">
                        {{ item.text }}
                    </span>
                    <span v-else class='swipe-text'>
                        {{ item.text }}
                    </span>
                </van-swipe-item>
            </van-swipe>
        </van-notice-bar>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: [String, Object],
            default: function () {
                return {}
            }
        },
    },
    created () {
        window.notice = this
        console.log(process.env.VUE_APP_h5Preview)
    },
    methods: {
        // 预览时使用
        refresh () {
            const notice = this.$refs.notice
            notice.reset()
            notice.start()
            console.log('refresh')
        },
        pageTo (name) {
            this.$router.push(name)
        }
    },
}
</script>

<style lang="scss" scoped>
:deep(.notice-swipe) {
    overflow: hidden;
    .swipe-text {
        color: var(--color);
        display: inline-block;
        width: 100%;
        overflow: hidden;
        /* 文本不会换行 */
        white-space: nowrap;
        /* 当文本溢出包含元素时，以省略号表示超出的文本 */
        text-overflow: ellipsis;
    }
}
.notice{
    :deep(.van-notice-bar){
        border-radius: rem(10px);
    }
    :deep(.van-icon-volume-o){
        color: var(--warn);
    }
}

</style>
