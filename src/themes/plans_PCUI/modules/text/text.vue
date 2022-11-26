<template>
    <div class='textWrapper' :style='styleObject'>
        {{ content || $t('modules.defaultContent') }}
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
                    content: '',
                    color: '',
                    fontSize: '',
                }
            }
        },
    },
    computed: {
        styleObject () {
            const data = this.data
            return Object.assign({}, data.styleObj, {
                color: data.color,
                fontSize: data.fontSize,
                textAlign: data.textAlign,
                fontWeight: data.fontWeight,
            })
        },
        content () {
            return this.matchVar(this.data.content)
        }
    },
    methods: {
        matchVar (content = '') {
            const reg = /\{\{(\w+)\}\}/
            const getters = this.$store.getters
            if (content && content.trim().match(reg)) {
                const res = content.trim().replace(reg, (match, f1) => {
                    return getters[f1] ?? ''
                })
                console.log('matchVar', res)
                return res
            } else {
                return content
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.textWrapper {
    min-height: 10px;
}
</style>
