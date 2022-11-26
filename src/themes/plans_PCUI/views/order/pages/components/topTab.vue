<template>
    <el-tabs v-model:active='active' class='tabs' :model-value='active' @tab-click='updataActive'>
        <el-tab-pane v-for='(item, index) in list' :key='index' class='tab' :label='item.title' :name='String(index)' />
    </el-tabs>
</template>

<script>
import { ElTabs, ElTabPane } from 'element-plus'
export default {
    name: 'Tab',
    components: {
        [ElTabs.name]: ElTabs,
        [ElTabPane.name]: ElTabPane
    },
    emits: ['update:modelValue', 'tabClick'],
    props: {
        type: {
            type: String,
            default: 'line'
        },
        background: {
            type: String,
            default: '#fff'
        },
        color: {
            type: String,
            default: '#477FD3'
        },
        titleActiveColor: {
            type: String,
            default: '#477FD3'
        },
        titleInactiveColor: {
            type: String,
            default: '#333'
        },
        border: {
            type: Boolean,
            default: false
        },
        list: {
            type: Array,
            default: function () {
                return []
            }
        },
        modelValue: {
            type: [String, Number],
            default: 0
        }
    },
    data () {
        return {
            active: 0
        }
    },

    watch: {
        modelValue () {
            this.active = this.modelValue
        },
        list: {
            deep: true,
            handler () {
                this.$refs.tabs && this.$refs.tabs.resize()
            }
        }
    },
    created () {
        this.active = this.modelValue
    },
    methods: {
        updataActive (data) {
            this.$emit('update:modelValue', data.paneName)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';

.tabs {
    box-sizing: border-box;
    width: 100%;
    padding: 0 rem(20px);
}
.tabs {
    margin: 16px 0 0 0;
    :deep{
        .el-tabs__nav-wrap::after, .el-tabs__active-bar{
            display: none;
        }
        .el-tabs__header{
            margin: 0;
        }
        .el-tabs__nav-prev, .el-tabs__nav-next {
            line-height: 32px;
        }
        .el-tabs__item{
            @include hover();
            height: 32px;
            line-height: 32px;
            padding: 0 11px!important;
            background: var(--assistColor);
            color: var(--color);
            border-radius: 4px;
            margin: 0 0 0 8px;
            color: var(---color);
            font-weight: 400;
            &.is-active{
                color: var(--primary);
                font-weight: bold;
            }
        }
    }
}
</style>
