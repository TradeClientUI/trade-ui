<template>
    <span class='icon'>
        <template v-if='value===1'>
            <i class='kicon icon_meiguoxian'></i>
        </template>
        <template v-else-if='value===2'>
            <i class='kicon icon_kxian'></i>
        </template>
        <template v-else-if='value===3'>
            <i class='kicon icon_kongxinkxiantu'></i>
        </template>
        <template v-else-if='value===4'>
            <i class='kicon icon_pingjunkxiantu'></i>
        </template>
        <template v-else-if='value===5'>
            <i class='kicon icon_xianxingtu'></i>
        </template>
        <template v-else-if='value===6'>
            <i class='kicon icon_mianjitu'></i>
        </template>
        <template v-else-if='value===7'>
            <i class='kicon icon_jizhunxian'></i>
        </template>
    </span>
</template>

<script>
export default {
    props: {
        value: {
            type: Number,
            default: 1
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.kicon{
    width: rem(50px);
    padding:0 rem(6px);
    font-size: rem(28px);
    &.icon_xianxingtu{
        font-size: rem(20px);
    }
}

</style>
