<template>
    <!-- 订单类型 -->
    <div class='typeBar'>
        <van-row class='cellBar' justify='space-between' type='flex'>
            <van-col>
                <p class='title'>
                    {{ title }}
                </p>
            </van-col>
            <van-col class='radioGroup'>
                <button
                    v-for='(btn,i) in btnList'
                    :key='i'
                    class='btn'
                    :class="{ 'active':modelValue==btn.val }"
                    @click='setType(btn.val)'
                >
                    {{ btn.title }}
                </button>
            </van-col>
        </van-row>
    </div>
</template>

<script>
export default {
    props: ['title', 'modelValue', 'btnList'],
    emits: ['update:modelValue', 'selected'],
    methods: {
        setType (val) {
            this.$emit('update:modelValue', val)
            this.$emit('selected', val)
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.cellBar {
    // align-items: center;
    color: var(--normalColor);
    .titleCol {
        width: rem(150px);
        padding-top: rem(20px);
    }
    .radioGroup {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        justify-content: flex-end;
    }
}
.btn {
    height: rem(40px);
    margin-bottom: rem(10px);
    padding: 0 rem(15px);
    color: var(color);
    font-size: rem(24px);
    line-height: 1;
    text-align: center;
    background: var(--assistColor);
    border-radius: rem(6px);
    &.active {
        color: var(--primary);
        background: var(--primaryAssistColor);
    }
    &+.btn {
        margin-left: rem(20px);
    }
    &:disabled {
        opacity: 0.5;
    }
}
</style>
