<template>
    <div class='floatTip'>
        <slot></slot>
    </div>
</template>

<script>
export default {
    setup () {
        return {}
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.floatTip {
    position: absolute;
    top: -14px;
    left: 0;
    width: 100%;
    height: 30px;
    color: var(--warn);
    line-height: 30px;
    text-align: center;
    background: #FFF0E2;
}
</style>
