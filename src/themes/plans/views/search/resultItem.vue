<template>
    <div class='searchResultItem'>
        <div class='product' @click='toProduct'>
            <div class='name'>
                <span>{{ product.symbolName }}</span>
            </div>
            <div class='block'>
                <span class='symbol-code'>
                    {{ product.symbolCode }}
                </span>
            </div>
        </div>
        <div v-if='$store.state._user.customerInfo' class='optional'>
            <i
                class='icon_zixuan1'
                :class="{ 'icon_zixuan2':inSelfSymbolList, 'loading':toggleSelfimg }"
                @click.stop='toggleSelf(product, $event)'
            ></i>
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { localGet, localSet } from '@/utils/util'
export default {
    props: ['product'],
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            toggleSelfimg: false
        })
        const inSelfSymbolList = computed(() => {
            const list = store.getters.userSelfSymbolList || []
            return list.find(el => el.symbolId === props.product.symbolId)
        })
        const toggleSelf = () => {
            modifyOptional()
        }

        // 进入产品详情
        const toProduct = () => {
            const symbolId = props.product.symbolId
            const localList = JSON.parse(localGet('searchProducts')) || []
            if (localList.indexOf(symbolId) === -1) localList.push(symbolId)
            localSet('searchProducts', JSON.stringify(localList))
            router.push({ name: 'Product', query: { symbolId } })
        }

        // 添加/删除自选
        const modifyOptional = () => {
            state.toggleSelfimg = true
            const action = inSelfSymbolList.value ? '_user/removeCustomerOptionals' : '_user/addCustomerOptionals'
            store.dispatch(action, [props.product.symbolId]).then(res => {
                state.toggleSelfimg = false
            }).catch(err => {
                state.toggleSelfimg = false
            })
        }
        return {
            ...toRefs(state),
            inSelfSymbolList,
            toggleSelf,
            toProduct,
            modifyOptional,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.searchResultItem {
    display: flex;
    align-items: center;
    height: rem(124px);
    padding: 0 rem(32px);
    line-height: 1.3;
    border-bottom: 1px solid var(--lineColor);
    &:hover {
        background-color: var(--bgColor);
    }
    .product {
        flex: 1;
    }
    .name {
        color: var(--color);
        font-size: rem(34px);
        line-height: rem(36px);
    }
    .block {
        padding-top: 3px;
        color: var(--minorColor);
        font-size: rem(20px);
        line-height: rem(36px);
    }
    .optional {
        width: rem(48px);
        height: rem(124px);
        color: var(--minorColor);
        font-size: rem(33px);
        line-height: rem(124px);
        .icon_zixuan2 {
            color: var(--primary);
        }
        .loading {
            position: relative;
            &::before {
                position: absolute;
                animation: loading 0.6s linear infinite;
            }
        }
        .zoomIn {
            position: relative;
            &::before {
                position: absolute;
                animation: zoomIn 0.6s linear forwards;
            }
        }
    }
}
</style>
