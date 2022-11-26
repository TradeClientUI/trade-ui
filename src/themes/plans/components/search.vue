<template>
    <section class='search-component'>
        <van-search
            v-model='searchValue'
            :action-text='$t("common.cancel")'
            class='search-input'
            clearable
            :placeholder='$t("search.keywords")'
            show-action
            @cancel='onCancel'
        />
        <div v-if='searchValue' class='content'>
            <template v-if='searchResult.length'>
                <div class='listWrap'>
                    <transitionList>
                        <div v-for='item in searchResult' :key='item.symbolKey' class='list-item li' @click='() => onClick(item)'>
                            {{ item.symbolName }}
                        </div>
                    </transitionList>
                </div>
            </template>
            <div v-else class='empty'>
                {{ $t('c.noData') }}
            </div>
        </div>
        <slot v-else></slot>
    </section>
</template>

<script>
import { ref, computed, unref } from 'vue'
import { useStore } from 'vuex'
import transitionList from './transitionList'

export default {
    components: {
        transitionList,
    },
    props: {
        tradeType: {
            type: [String, Number],
            default: ''
        }
    },
    emits: ['cancel', 'select'],
    setup (props, context) {
        const store = useStore()
        const productList = computed(() => store.state._quote.productList)
        // 搜索值
        const searchValue = ref('')
        // 搜索结果
        const searchResult = computed(() => {
            const value = unref(searchValue)
            if (!value) return []

            const result = unref(productList)
                .filter(e => {
                    if (String(e.tradeType) !== String(props.tradeType)) {
                        return
                    }

                    const searchContent = (e.symbolName || '') + (e.symbolCode || '')
                    return searchContent.toLowerCase().includes(value.toLowerCase())
                })

            return result
        })

        const onCancel = () => {
            context.emit('cancel')
        }

        const onClick = product => {
            context.emit('select', product)
        }

        const reset = () => {
            searchValue.value = ''
        }

        return {
            searchValue,
            onCancel,
            searchResult,
            onClick,
            reset
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
    width: 100%;
    overflow: hidden;
    .search-input {
        width: 100%;
        padding: 0 0 0 rem(30px);
        background: var(--contentColor);
        :deep(.van-cell){
            background: var(--bgColor);
            border-radius: rem(10px);
        }
        :deep(.van-search__content) {
            padding-left: 0;
            border-radius: rem(10px);

        }
        :deep(.van-search__action) {
            padding: 0 rem(30px);
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
