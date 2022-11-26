<template>
    <div class='textWrapper'>
        <van-cell>
            <!-- 使用 title 插槽来自定义标题 -->
            <template #title>
                <van-checkbox icon-size='14px'>
                    继续开户表示您已确认已满18周岁且已细读并同意《客户隐私保护政策、投资风险披露及免责声明》
                </van-checkbox>
            </template>
        </van-cell>

        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            default: () => {
                return {
                    agreement_html: '',

                }
            }
        },
    },
    computed: {
        // styleObject () {
        //     const data = this.data
        //     return Object.assign({}, data.styleObj, {
        //         color: data.color,
        //         fontSize: data.fontSize,
        //         textAlign: data.textAlign,
        //     })
        // },
        // content () {
        //     return this.matchVar(this.data.content)
        // }
    },
    methods: {
        // matchVar (content = '') {
        //     const reg = /\{\{(\w+)\}\}/
        //     const getters = this.$store.getters
        //     if (content && content.trim().match(reg)) {
        //         const res = content.trim().replace(reg, (match, f1) => {
        //             return getters[f1] ?? ''
        //         })
        //         console.log('matchVar', res)
        //         return res
        //     } else {
        //         return content
        //     }
        // }
    },
}
</script>

<style lang="scss" scoped>
.textWrapper {
    min-height: 10px;
}
</style>
