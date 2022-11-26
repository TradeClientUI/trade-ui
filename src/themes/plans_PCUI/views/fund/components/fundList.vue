<template>
    <div class='fund-content'>
        <div class='fund-search'>
            <el-input
                v-model='searchValue'
                class='search-input'
                clearable
                :placeholder='$t("transRecords.searchPlaceholder")'
                @input='inputHandler'
            >
                <template #prefix>
                    <el-icon class='el-input__icon'>
                        <Search />
                    </el-icon>
                </template>
            </el-input>
        </div>
        <!-- 有数据 -->
        <div v-if='fundProductList.length > 0' class='fund-module'>
            <div class='fund-header'>
                <span class='col-1'>
                    {{ $t('fundInfo.fundIcon') }}
                </span>
                <span class='col-2'>
                    {{ $t('fundInfo.realtimeJZ') }}
                </span>
                <span class='col-3'>
                    {{ $t('fundInfo.dayUpDown') }}
                </span>
            </div>
            <div class='fund-list'>
                <div
                    v-for='(item, index) in fundProductList'
                    :key='index'
                    :class="{ 'item': true, 'active': item.fundId === fund.fundId }"
                    @click='selectFund(item)'
                >
                    <CurrencyIcon :currency='item.shareTokenCode' size='32' />
                    <div class='col-1'>
                        <div class='row'>
                            <span class='name'>
                                {{ item.fundName }}
                            </span>
                            <span class='type'>
                                {{ item.operationMode === 1 ? $t('fundInfo.operationModeValue1') : $t('fundInfo.operationModeValue2') }}
                            </span>
                        </div>
                    </div>
                    <div class='col-2'>
                        <p :class='jz'>
                            {{ item.netValue }}
                        </p>
                        <p class='currency'>
                            {{ item.currencyCode }}
                        </p>
                    </div>
                    <div class='col-3'>
                        <p :class='change'>
                            {{ item.netValueChangeQuote }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 无数据 -->
        <van-empty v-else :description='$t("common.noData")' image='/images/empty.png' />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineEmits } from 'vue'
import { Search } from '@element-plus/icons'
import CurrencyIcon from '@/components/currencyIcon.vue'
import { useFund } from '../hooks.js'
import { debounce } from '@/utils/util'
import { useRoute } from 'vue-router'

const emits = defineEmits(['select'])
const route = useRoute()

// 搜索内容
const searchValue = ref('')
// 获取基金产品列表
const { getFundList, fundProductList } = useFund()
// 当前选中基金
const fund = ref('')
// 定时器
let timer = null

// 选择基金产品
const selectFund = (item) => {
    fund.value = item
    emits('select', item)
}

// 输入事件，防抖
const inputHandler = debounce(() => {
    getProductList()
}, 500)

// 获取基金产品列表数据
const getProductList = () => {
    getFundList({ name: searchValue.value, isRealTime: true }).then(() => {
        if (fundProductList.value.length > 0) {
            let findFund = ''
            if (route.query.fundId) {
                findFund = fundProductList.value.find(el => el.fundId === parseInt(route.query.fundId))
            }
            if (!fund.value) {
                fund.value = findFund || fundProductList.value[0]
            }
            emits('select', fund.value)
        }
    })
}

onMounted(() => {
    getProductList()
    timer = setInterval(() => {
        getProductList()
    }, 10000)
})

onUnmounted(() => {
    // 清空定时器
    clearInterval(timer)
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.fund-search {
    padding: 0 16px;
    margin-top: 16px;
}
.fund-module {
    .fund-header {
        display: flex;
        align-items: center;
        margin: 10px 0;
        font-size: 12px;
        color: var(--minorColor);
        padding: 0 16px;
        .col-1 {
            flex: 1;
        }
        .col-2 {
            width: 80px;
            text-align: right;
            margin-right: 10px;
        }
        .col-3 {
            width: 80px;
            text-align: right;
        }
    }
    .fund-list {
        @media screen and (max-width: 1560px){
            font-size: 12px;
        }
        .item {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 8px 16px;
            margin-bottom: 6px;
            &:last-of-type {
                margin-bottom: 0;
            }
            &:hover {
                background: var(--primaryAssistColor);
            }
            &.active {
                background: var(--primaryAssistColor);
            }
            .col-1 {
                flex: 1;
                margin-left: 8px;
                .row {
                    display: inline-flex;
                    flex-direction: column;
                    align-items: start;
                    .name {
                        font-size: 14px;
                    }
                    .type {
                        display: inline-block;
                        font-size: 12px;
                        color: var(--primary);
                        height: 18px;
                        line-height: 16px;
                        border: 1px solid var(--primary);
                        padding: 0 4px;
                        border-radius: 4px;
                        background: none;
                    }
                }
            }
            .col-2 {
                width: 80px;
                text-align: right;
                margin-right: 10px;
                .currency {
                    color: var(--normalColor);
                }
            }
            .col-3 {
                align-self: flex-start;
                width: 80px;
                text-align: right;
            }
            .up {
                color: var(--riseColor);
            }
            .down {
                color: var(--fallColor);
            }
        }
    }
}
</style>
