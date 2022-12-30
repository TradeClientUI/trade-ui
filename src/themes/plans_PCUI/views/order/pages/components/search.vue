<template>
    <section class='search-component'>
        <el-input v-model='searchValue' class='search-input' clearable :placeholder='$t("transRecords.searchPlaceholder")' @input='onSearch'>
            <template #prefix>
                <el-icon class='el-input__icon'>
                    <Search />
                </el-icon>
            </template>
        </el-input>
        <slot></slot>
    </section>
</template>

<script>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { ElInput, ElIcon } from 'element-plus'
import { Search } from '@element-plus/icons'
import { getSymbolList } from '@/api/trade'
import { debounce } from '@/utils/util'

export default {
    components: {
        [ElInput.name]: ElInput,
        [ElIcon.name]: ElIcon,
        Search
    },
    props: {
        tradeType: {
            type: [String, Number],
            default: ''
        }
    },
    emits: ['onSelect', 'onSearch'],
    setup (props, context) {
        const store = useStore()
        const searchValue = ref('')
        const onClick = product => {
            context.emit('onSelect', product)
        }

        // 搜索
        const onSearch = debounce((key) => {
            context.emit('onInput', key)
            if (key) {
                getSymbolList({ name: key, customerGroupId: store.getters.customerGroupId, tradeType: props.tradeType }).then(res => {
                    if (res.check()) {
                        context.emit('onSearch', res.data || [])
                    }
                })
            } else {
                context.emit('onSearch', [])
            }
        })

        watch(() => props.tradeType, () => {
            // 玩法更新，重置搜索
            searchValue.value = ''
            onSearch()
        })

        return {
            searchValue,
            onClick,
            onSearch
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.search-component {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    align-items: center;
    flex: 1;
    width: 100%;
    overflow: hidden;
    .search-input {
        width: 100%;
        height: 40px;
        padding: 0 10px;
        font-size: 12px;
        :deep {
            .el-input__inner {
                border-color: transparent;
                //background: var(--assistColor);
                &:focus {
                    border-color: var(--primary);
                }
            }
        }
    }
    .content {
        box-sizing: border-box;
        width: 100%;
        padding: 0;
        overflow-y: auto;
        .loading {
            margin-top: rem(50px);
        }
        .listWrap {
            display: flex;
            flex: 1;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            box-sizing: border-box;
            width: 100%;
            overflow-y: auto;
            color: var(--color);
            font-weight: 500;
            font-size: rem(30px);
            .li {
                width: 100%;
                height: rem(112px);
                padding: 0 rem(20px);
                line-height: rem(112px);
                text-indent: rem(30px);
                border-bottom: 1px solid var(--bgColor);
                &:last-child {
                    border-color: transparent;
                }
            }
        }
        .empty {
            padding: rem(50px) 0;
            text-align: center;
        }
    }
}
</style>
