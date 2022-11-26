<template>
    <ul class='capitalList'>
        <li v-for='item in data' :key='item[valKey]' class='item'>
            <span class='title'>
                {{ item[titleKey] }}
            </span>
            <span class='value'>
                {{ item[valKey] }}
            </span>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        titleKey: {
            type: String,
            default: 'title'
        },
        valKey: {
            type: String,
            default: 'value'
        },
        data: {
            type: Array,
            default: []
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.capitalList {
    padding: rem(20px) rem(30px);
    font-size: rem(24px);
    .item {
        position: relative;
        display: flex;
        justify-content: space-between;
        height: rem(50px);
        line-height: rem(50px);
        &::before {
            position: absolute;
            top: 48%;
            left: 0;
            width: 100%;
            height: 1px;
            border-bottom: 1px dashed var(--placeholder);
            content: '';
        }
        .title,
        .value {
            position: relative;
            z-index: 1;
            padding: 0 rem(10px);
            background: #FFF;
        }
        .value {
            color: var(--primary);
            font-weight: bold;
        }
    }
}
</style>
