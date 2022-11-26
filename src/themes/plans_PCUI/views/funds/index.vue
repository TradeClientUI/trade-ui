<template>
    <div class='page-wrap'>
        <router-view />
        <div class='page-content'>
            <!-- 侧边栏 -->
            <div class='page-side'>
                <side-bar @select='selectFund' />
            </div>
            <!-- 主体内容 -->
            <div id='page-main' class='page-main'>
                <div class='page-module'>
                    <!-- 基金模块 -->
                    <fund-module v-if="showModel === 'fundModule'" />
                    <!-- 基金详情 -->
                    <fund-detail v-if="showModel === 'fundDetail'" :key='fundId' />
                    <!-- 基金记录 -->
                    <fund-record v-if="showModel === 'fundRecord'" />
                    <!-- 现货成交记录 -->
                    <trans-records v-if="showModel === 'transRecords'" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, provide } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useFund } from './hooks.js'
import { QuoteSocket } from '@/plugins/socket/socket'
import { batchMarketPerformance } from '@/api/trade'
import sideBar from './components/side-bar.vue'
import fundModule from './components/fund-module.vue'
import fundDetail from './components/fund-detail.vue'
import fundRecord from './components/fund-record.vue'
import transRecords from './components/transRecords.vue'

const store = useStore()
const route = useRoute()
// 用户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 产品列表
const productList = computed(() => store.state._quote.productList)
// 当前显示的模块 fundModule:基金模块 fundDetail:基金详情 fundRecod:基金记录 transRecords:现货成交记录
const showModel = ref('fundModule')
// 当前申购赎回记录选中
const fundRecordAcitve = ref('')
// 当前基金详情交易模块选中
const dealActive = ref('')
// 基金api
const { getFundList, fundProductList } = useFund()
// 当前选择的基金id
const fundId = ref(Number(route.query.fundId) || '')
// 当前选择的基金产品
const fund = computed(() => fundProductList.value.find(el => el.fundId === fundId.value))
// 当前选择的基金产品索引
const fundIndex = computed(() => fundProductList.value.findIndex(el => el.fundId === fundId.value))
// 当前基金列表对应的产品
const curProductList = computed(() => {
    const result = []
    fundProductList.value.map(fund => {
        const list = productList.value.filter(product => Number(product.tradeType) === 5 && product.baseCurrency === fund.shareTokenCode)
        let elem = list.find(product => product.profitCurrency === 'USDT')
        if (!elem) elem = list[0]
        if (elem) {
            result.push(elem)
        } else {
            result.push({})
        }
    })
    return result
})
// 当前选中基金对应产品
const curProduct = computed(() => {
    let result = {}
    if (fund.value) {
        const list = productList.value.filter(product => Number(product.tradeType) === 5 && product.baseCurrency === fund.value.shareTokenCode)
        let elem = list.find(product => product.profitCurrency === 'USDT')
        if (!elem) elem = list[0] || {}
        result = elem
    }
    return result
})
// 基金列表基金净值数据
const netValueArrs = ref([])
// 基金列表市场价格数据
const marketPriceArrs = ref([])
// 基金列表接口定时器
const fundTimer = ref(null)
// 最新的基金净值
const sharesNet = ref('')

// 批量获取市场表现走势图
const batchMarketPerformanceData = () => {
    const fundIds = (fundProductList.value.map(el => el.fundId))
    batchMarketPerformance({
        fundIds: fundIds.toString(),
        days: 36,
        type: 1
    }).then(res => {
        const { data } = res
        const valueArrs = []
        const priceArrs = []
        fundIds.map(fundId => {
            const valueArr = []
            const priceArr = []
            data[fundId].map(elem => {
                elem.columnList.map(sub => {
                    if (elem.type === 2) {
                        valueArr.push(Number(sub.value))
                    }
                    if (elem.type === 1) {
                        priceArr.push(Number(sub.value))
                    }
                })
            })
            valueArrs.push(valueArr)
            priceArrs.push(priceArr)
        })
        netValueArrs.value = valueArrs
        marketPriceArrs.value = priceArrs
    })
}

// 选择基金
const selectFund = (value, active) => {
    const model = value ? 'fundDetail' : 'fundModule'
    fundId.value = value
    sharesNet.value = ''
    changeShowModel(model, active)
}

// 改变当前显示的模块
const changeShowModel = (model, active) => {
    showModel.value = model
    sharesNet.value = ''
    if (model === 'fundDetail') {
        dealActive.value = active || ''
    }
    if (model === 'fundRecord') {
        fundRecordAcitve.value = active || ''
    }
    // 设置滚动条距离
    document.getElementById('page-main').scrollTop = 0
}

provide('fundId', fundId)
provide('fundIndex', fundIndex)
provide('netValueArrs', netValueArrs)
provide('marketPriceArrs', marketPriceArrs)
provide('curProductList', curProductList)
provide('curProduct', curProduct)
provide('dealAcitve', dealActive)
provide('fundRecordAcitve', fundRecordAcitve)
provide('selectFund', selectFund)
provide('changeShowModel', changeShowModel)
provide('sharesNet', sharesNet)
provide('updateSharesNet', (value) => {
    sharesNet.value = value
})

onMounted(() => {
    document.body.style.overflow = 'hidden'
    // 有基金id默认显示基金详情模块
    if (fundId.value) {
        showModel.value = 'fundDetail'
    }
    // 获取基金产品列表数据
    getFundList({ name: '', isRealTime: true }).then(() => {
        // 发起行情订阅
        const productKeys = []
        curProductList.value.map(product => {
            if (product.symbolId) {
                productKeys.push(`${product.symbolId}_${product.tradeType}`)
            }
        })
        QuoteSocket.send_subscribe(productKeys)

        // 批量获取市场表现走势图
        batchMarketPerformanceData()
    })
    // 定时获取基金产品列表数据
    fundTimer.value = setInterval(() => {
        getFundList({ name: '', isRealTime: true })
    }, 10000)
    // 获取用户资产数据
    if (customerInfo.value) {
        store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: 5 })
    }
})
onUnmounted(() => {
    document.body.style.overflow = 'visible'
    // 取消行情订阅
    QuoteSocket.cancel_subscribe()
    // 清除基金接口定时器
    clearInterval(fundTimer.value)
})
</script>

<style lang='scss' scoped>
.page-wrap {
    line-height: 1.5;
    background: var(--bgColor);
}
.page-content {
    display: flex;
    height: calc(100vh - 64px);
    overflow: hidden;
}
.page-side {
    width: 300px;
    background: var(--contentColor);
    box-shadow: 3px 3px 20px rgb(0 0 0 / 9%);
    overflow-y: auto;
}
.page-main {
    display: flex;
    flex: 1;
    padding: 16px 32px;
    overflow-y: auto;
}
.page-module {
    flex: 1;
    min-width: 800px;
    margin: 0 auto;
}
</style>
