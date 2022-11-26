<template>
    <!-- 订单类型 -->
    <div class='typeBar'>
        <van-row class='cellBar' justify='space-between' type='flex'>
            <van-col>
                {{ title }}
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
.typeBar{
    margin-top: 16px;
    .cellBar {
    // align-items: center;
    color: var(--minorColor);
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

        padding: 6px 12px;
        color: var(color);
        font-size: rem(24px);
        line-height: 1;
        text-align: center;
        background: var(--assistColor);
        border-radius: 4px;
        cursor: pointer;
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
}

</style>
