<template>
    <div class='backgroundImg' :style='styleObject'></div>
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
                background: 'url(' + data.src + ') no-repeat center',
            })
        },
    },
    setup () {
        return {}
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.backgroundImg{
    background-position: center;
}
</style>
