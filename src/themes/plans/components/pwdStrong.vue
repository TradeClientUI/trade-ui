<template>
    <div>
        <ul class='line' :class="['level'+levelNum]">
            <li class='item'></li>
            <li class='item'></li>
            <li class='item'></li>
            <li class='item'></li>
        </ul>
        <!-- <p>{{ text }}</p> -->
    </div>
</template>

<script>
export default {
    props: {
        levelNum: {
            type: Number,
            required: true,
        },
    },
}
</script>

<style lang="scss" >
@import '@/sass/mixin.scss';
.line {
    display: grid;
    grid-column-gap: 5px;
    grid-template-columns: repeat(4, 1fr);
    width: 100%;
    margin-top: rem(10px);
    &.level0 .item:first-of-type {
        background: var(--warn);
    }
    &.level1 .item:first-of-type {
        background: var(--warn);
    }
    &.level2 .item:not(:nth-of-type(n+3)) {
        background: var(--warn);
    }
    &.level3 .item:not(:nth-of-type(n+4)) {
        background: #FFD060;
    }
    &.level4 .item {
        background: #9C0;
    }
    .item {
        height: 2px;
        background: var(--lineColor);
    }
}
</style>
