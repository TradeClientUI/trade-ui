<template>
    <div class='page-wrap'>
        <router-view />
        <div class='page-content'>
            <!-- 左侧模块 -->
            <div class='left-module module'>
                <!-- 基金产品列表 -->
                <fundList ref='fundListRef' @select='selectFund' />
            </div>
            <!-- 中间模块 -->
            <div class='middle-module module'>
                <!-- 基金内容 -->
                <fundContent v-if='fund?.fundId' :fund='fund' />
            </div>
            <!-- 右侧模块 -->
            <div class='right-module module'>
                <!-- 基金交易 -->
                <fundDeal v-if='fund?.fundId' :key='fundDealKey' :fund='fund' />
            </div>
        </div>
        <!-- 申购记录、赎回记录、资产 -->
        <div class='record-content'>
            <userRecord ref='userRecordRef' />
        </div>
        <!-- 资产 -->
        <van-sticky class='assetsSticky' :offset-bottom='0' position='bottom'>
            <assetsModule />
        </van-sticky>
    </div>
</template>

<script setup>
import { ref, provide, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useFund } from './hooks.js'
import fundList from './components/fundList.vue'
import fundContent from './components/fundContent.vue'
import fundDeal from './components/fundDeal.vue'
import userRecord from './components/userRecord.vue'
import assetsModule from './components/assetsModule.vue'

const store = useStore()
// 用户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 基金详情信息
const fundInfo = computed(() => store.state._quote.fundInfo)
// 组件ref
const fundListRef = ref(null)
const userRecordRef = ref(null)
// 当前基金产品
const fund = ref({})
// 基金交易组件key值
const fundDealKey = ref('')
// 获取基金净值等数据
const { getFundValue } = useFund()

// 申购或赎回后更新列表数据
provide('updateRecord', (value) => {
    switch (value) {
        // 更新申购记录
        case 'apply':
            userRecordRef.value.getApplyRecord()
            break
        // 更新赎回记录
        case 'redeem':
            userRecordRef.value.getRedeemRecord()
            break
    }
})

// 选择基金产品
const selectFund = item => {
    fund.value = item
    if (fund.value.fundId !== item.fundId) {
        fundDealKey.value = Date.now()
    }
    getFundValue(item.fundId).then(() => {
        fund.value = Object.assign({}, fund.value, fundInfo.value)
    })
}

onMounted(() => {
    // 获取账户资产
    if (customerInfo.value) {
        store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: 5 })
    }
})
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.page-wrap {
    font-size: 14px;
    padding: 8px;
    background: var(--bgColor);
}
.page-content {
    display: flex;
    min-width: 1200px;
    height: 960px;
    .module {
        overflow-y: auto;
    }
    .left-module {
        width: 360px;
        margin-right: 8px;
        background: var(--contentColor);
        border-radius: 10px;
    }
    .middle-module {
        flex: 1;
        margin-right: 8px;
        border-radius: 10px;
    }
    .right-module {
        width: 360px;
        background: var(--contentColor);
        border-radius: 10px;
    }
}
.record-content {
    margin-top: 8px;
}
.assetsSticky {
    :deep(.van-sticky--fixed) {
        box-shadow: 0 0 10px rgba(0,0,0,.15);
        background-color: var(--bgColor);
    }
}

@media screen and (max-width: 1560px) {
    .page-content{
        .left-module,.right-module{
            width: 320px;
        }
    }
}
</style>
