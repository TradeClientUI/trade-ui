<template>
    <div class='languageDiv'>
        中文<i class='lang-icon cn'></i>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.languageDiv {
    box-sizing: content-box;
    height: rem(50px);
    padding: 0 rem(16px);
    color: var(--minorColor);
    line-height: rem(50px);
    border: 1px solid var(--lineColor);
    border-radius: rem(10px);
    .lang-icon {
        position: relative;
        top: 2px;
        display: inline-block;
        width: 23px;
        height: 15px;
        margin-left: 6px;
        background-repeat: no-repeat;
        background-size: 100%;
    }
    .cn {
        background-image: url(~@public/images/cn.png);
    }
    .en {
        background-image: url(~@public/images/en.png);
    }
}
</style>
