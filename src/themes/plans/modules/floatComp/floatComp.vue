<template>
    <div class='float-content'>
        <a v-if='data.href' class='link' href='javascript:;' @click='openUrl(data)'>
            <img alt='' class='img' :src='data.src || placeholder' />
        </a>
        <a v-else class='link' target='_blank'>
            <img alt='' :src='placeholder' srcset='' />
        </a>
    </div>
</template>

<script>
const placeholder = require('./floatComp.png')
export default {
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
    setup (props) {
        const h5Preview = process.env.VUE_APP_h5Preview
        const position = h5Preview ? 'static' : 'fixed'
        return {
            placeholder,
            position
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.float-content{
    position: v-bind(position)!important;;
    bottom: rem(300px);
    background: none!important;
    z-index: 9999;
    width: rem(96px);
    height: rem(96px);
    right: rem(30px);
    float: right;
    .link{
        display: inline-block;
        img{
            width: 100%;
        }
    }

}
</style>
