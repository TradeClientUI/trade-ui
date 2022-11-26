<template>
    <div class='imgsg' :style='data.styleObj'>
        <a v-if='data.href' href='javascript:;' @click='openUrl(data)'>
            <img alt='' class='img' :src='data.src || placeholder' />
        </a>
        <img v-else alt='' class='img' :src='data.src || placeholder' />
        <slot></slot>
    </div>
</template>

<script>
const placeholder = require('./placeholder.png')
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
    data () {
        return {
            placeholder: placeholder
        }
    },
}
</script>

<style lang="scss" >
.imgsg {
    position: relative;
    overflow: hidden;
    a {
        display: block;
    }
    .img {
        display: block;
        width: 100%;
    }
}
</style>
