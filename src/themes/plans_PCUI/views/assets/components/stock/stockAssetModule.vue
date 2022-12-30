<template>
    <div class='modulesWrapper'>
        <div class='assets-header'>
            <el-tabs
                v-model='activeName'
                type='card'
                @tab-click='tabChange'
            >
                <el-tab-pane :label='$t("assets.overview")' name='overview' />
                <el-tab-pane :label='$t("assets.stock.USD")' name='usd' />
                <el-tab-pane :label='$t("assets.stock.HKD")' name='hkd' />
            </el-tabs>
            <div class='assets-handle'>
                <button v-if='$store.state._base.plans.length>1' class='btn' @click='goTransfer'>
                    {{ $t('trade.transfer') }}
                </button>
                <div class='record-link' @click='goRecord'>
                    <i class='icon_zijinjilu'></i>
                    <span>{{ $t('trade.fundRecord') }}</span>
                </div>
            </div>
        </div>

        <AssetByOverview v-if="activeName==='overview'" :type='activeName' />
        <AssetBySub v-else :type='activeName' />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import AssetByOverview from './assetByOverview.vue'
import AssetBySub from './assetBySub.vue'

const props = defineProps({
    modelValue: {
        type: String,
        default: 'overview'
    }
})
const emit = defineEmits(['update:modelValue'])
const router = useRouter()
const store = useStore()
const activeName = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val)
})
const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === 6))
const userAccount = computed(() => store.state._user.accountAssets[6] || {})
const curAccount = computed(() => accountList.value.find(el => el.currency === activeName.value.toUpperCase()) || {})

// 跳转到划转页面
const goTransfer = () => {
    router.push({
        path: '/assets/transfer',
        query: {
            tradeType: '6'
        }
    })
}

// 跳转到资金记录页面
const goRecord = () => {
    const accountId = curAccount.value?.accountId || 0
    router.push({
        path: '/assets/record',
        query: {
            accountId: accountId,
            tradeType: '6'
        }
    })
}

// 获取持仓列表数据
const queryPositionList = (currency) => {
    const account = accountList.value?.find(el => el.currency.toLowerCase() === currency.toLowerCase()) || {}
    store.dispatch('_trade/queryPositionPage', {
        tradeType: 6,
        accountId: account.accountId,
        sortFieldName: 'openTime',
        sortType: 'desc'
    }).then(res => {
        const productKeys = []
        const { data } = res
        if (data) {
            data.map(elem => {
                productKeys.push(elem.symbolId + '_' + elem.tradeType)
            })
        }
    })
}

// 切换股票账户tab
const tabChange = (e) => {
    const { paneName } = e
    queryPositionList(paneName)
}
</script>

<style lang="scss" scoped>
@import '../../assets.scss';
.modulesWrapper {
    padding: 22px;
    line-height: 1;
    background: var(--contentColor);
    border-radius: 10px;
    position: relative;
}
.assets-header {
    position: relative;
    padding: 5px 0 0;
    .assets-handle {
        position: absolute;
        top: -2px;
        right: 0;
    }
}
</style>
