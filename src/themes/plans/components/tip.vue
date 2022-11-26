<template>
    <div class='tips'>
        <i v-if='icon' class='icon' :class='[icon]'></i>
        <p v-if='title' class='title'>{{ title }}</p>
        <slot>
            {{ content }}
        </slot>
    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        icon: {
            type: [String, Boolean],
            default: 'icon_tishi'
        },

    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.tips {
    position: relative;
    margin-top: rem(20px);
    padding-left: rem(70px);
    font-size: rem(26px);
    .icon {
        position: absolute;
        top: rem(2px);
        left: rem(30px);
        font-size: rem(30px);
        vertical-align: -2px;
    }
}
</style>
