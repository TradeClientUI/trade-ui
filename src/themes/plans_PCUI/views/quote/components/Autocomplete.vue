<template>
    <div class='search-input'>
        <el-autocomplete
            v-model='state'
            :fetch-suggestions='querySearch'
            :placeholder='$t("transRecords.searchPlaceholder")'
            popper-class='quote-autocomplete'
            @select='gotoOrder'
        >
            <template #prefix>
                <el-icon class='el-input__icon'>
                    <Search />
                </el-icon>
            </template>
            <template #default='{ item }'>
                <div class='item'>
                    <div class='row'>
                        <span class='label'>
                            {{ item.name }}
                        </span>
                        <etfIcon v-if="productMap[item.id + '_' + tradeType].etf" class='etf-icon' />
                    </div>
                    <span class='star' @click.stop='addOptional(item)'>
                        <i v-if='isCollect(props.tradeType,item.id)' class='icon icon_hangqingliebiaoyijiazixuan'></i>
                        <i v-else class='icon icon_hangqingliebiaoweijiazixuan'></i>
                    </span>
                </div>
            </template>
        </el-autocomplete>
    </div>
</template>

<script setup>
import { ref, computed, unref, defineProps } from 'vue'
import { ElAutocomplete, ElIcon, ElMessage } from 'element-plus'
import etfIcon from '@planspc/components/etfIcon.vue'
import { Search } from '@element-plus/icons'
import { useStore } from 'vuex'
import { addCustomerOptional, removeCustomerOptional, getSymbolList } from '@/api/trade'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { debounce, localSet, localGet, isEmpty } from '@/utils/util'

const router = useRouter()
const store = useStore()
const { t } = useI18n({ useScope: 'global' })

const props = defineProps({
    tradeType: {
        type: String,
        default: ''
    }
})

const state = ref('')
const productMap = computed(() => store.state._quote.productMap)
const customerInfo = computed(() => store.state._user.customerInfo)

// 搜索
const querySearch = (queryString, cb) => {
    if (!queryString) {
        return cb([])
    }
    debounce(getSymbolList({ name: queryString, customerGroupId: store.getters.customerGroupId, tradeType: props.tradeType }).then(res => {
        if (res.check()) {
            cb(res.data.filter(e => unref(productMap)[e.id + '_' + unref(props.tradeType)]))
        }
    }))
}
const gotoOrder = (product) => {
    router.push({
        name: 'Order',
        query: {
            name: product?.name?.replace(/ /g, '_'),
            symbolId: product.id,
            tradeType: props.tradeType
        }
    })
}

/** 添加自选逻辑 */
const selfSymbolList = computed(() => store.state._user.selfSymbolList)
// const isCollect = (tradeType, symbolId) => selfSymbolList.value[tradeType]?.find(el => el.symbolId === parseInt(symbolId))

/** 添加自选逻辑 标星状态 */
const isCollect = (tradeType, symbolId) => {
    if (isEmpty(customerInfo.value)) {
        const newId = parseInt(symbolId) + '_' + tradeType
        if (localGet('localSelfSymbolList')) {
            if (JSON.parse(localGet('localSelfSymbolList')).find(el => el === newId)) {
                return true
            } else {
                return false
            }
        }
    } else {
        return selfSymbolList.value[tradeType]?.find(el => el.symbolId === parseInt(symbolId))
    }
}

const addOptional = ({ id: symbolId, tradeType = props.tradeType }) => {
    if (customerInfo.value) {
        if (isCollect(tradeType, symbolId)) {
            removeCustomerOptional({ symbolList: [symbolId], tradeType }).then(res => {
                if (res.check()) {
                    store.dispatch('_user/queryCustomerOptionalList')
                    ElMessage.success(t('trade.removeOptionalOk'))
                }
            }).catch(err => {
            })
        } else {
            addCustomerOptional({ symbolList: [symbolId], tradeType }).then(res => {
                if (res.check()) {
                    // 手动修改optional值
                    store.commit('_user/Update_optional', 1)
                    store.dispatch('_user/queryCustomerOptionalList')
                    ElMessage.success(t('trade.addOptionalOk'))
                }
            }).catch(err => {
            })
        }
    } else {
        // 未登录 缓存到本地
        var localSelfSymbolList = localGet('localSelfSymbolList') ? JSON.parse(localGet('localSelfSymbolList')) : []
        const newId = symbolId + '_' + tradeType
        if (localSelfSymbolList.find(el => el === newId)) {
            localSelfSymbolList.map((it, index) => {
                if (it === newId) {
                    localSelfSymbolList.splice(index, 1)
                    ElMessage.success(t('trade.removeOptionalOk'))
                }
            })
        } else {
            localSelfSymbolList.push(newId)
            ElMessage.success(t('trade.addOptionalOk'))
        }
        store.dispatch('_user/queryLocalCustomerOptionalList', localSelfSymbolList)
    }
}
/** 添加自选逻辑 */

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.search-input {
    flex: 0 0 220px;
    height: 40px;
    :deep {
        .el-autocomplete {
            display: flex;
            width: 100%;
            height: 100%;
        }
        .el-input__inner {
            background: var(--assistColor);
            border-color: transparent;
            &:focus {
                border-color: var(--el-input-focus-border, var(--primary));
            }
        }
        .el-input__prefix {
            top: 2px;
        }
    }
}

</style>

<style lang="scss">
.quote-autocomplete {
    .el-autocomplete-suggestion {
        --el-text-color-regular: var(--color);
        li {
            line-height: 1;
        }
        li:hover {
            background-color: var(--bgColor);
        }
        .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 0;
            .etf-icon {
                margin-top: 2px;
            }
        }
    }
}
</style>
