<template>
    <div class='selectWrap' @click='openActionSheet'>
        <span class='selectval'>
            {{ selected && selected[text] }}
            <van-icon v-if='showSelect' name='arrow-down' />
        </span>
    </div>
    <van-action-sheet
        v-if='actions && actions.length'
        v-model:show='show'
        :actions='actions'
        @select='onSelect'
    />
</template>

<script>

export default {
    props: {
        modelValue: {
            type: [String, Number],
            default: ''
        },
        label: {
            type: String,
            default: ''
        },
        actions: {
            type: Array,
            default: new Array(0)
        },
        text: {
            type: String,
            default: 'name'
        },
        value: {
            type: String,
            default: 'value'
        },
        showSelect: {
            type: Boolean,
            default: true
        }
    },
    emits: ['update:modelValue', 'select'],
    data () {
        return {
            show: false,
        }
    },
    computed: {
        selected () {
            const field = this.value
            return this.actions.find(el => el[field] === this.modelValue)
        }
    },
    methods: {
        // 打开弹窗
        openActionSheet () {
            if (this.showSelect) this.show = true
        },

        onSelect (item, index) {
            this.$emit('select', item, index)
            this.$emit('update:modelValue', item[this.value])
            this.show = false
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.selectWrap {
    position: relative;
    align-items: center;
    width: 100%;
    .icon_arrow-down {
        position: absolute;
        top: rem(25px);
        right: rem(10px);
    }
}
.selectval {
    position: relative;
    display: block;
    height: rem(75px);
    padding: 0 rem(20px) 0 rem(5px);
    overflow: hidden;
    font-size: rem(26px);
    line-height: rem(75px);
    white-space: nowrap;
    text-overflow: ellipsis;
    // border-radius: rem(10px);
    // border: 1px solid var(--bdColor);
    // &:not(:disabled){
    //     @include active();
    // }
}
</style>
