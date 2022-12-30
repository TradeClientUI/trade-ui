<template>
    <div class='modulesWrapper'>
        <h3 class='title'>
            {{ $t('contract.curPosition') }}
        </h3>
        <div class='postionsBox'>
            <stockPositionList :position-list='positionList' />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import stockPositionList from './stockPositionList.vue'
const props = defineProps({
    type: {
        type: String,
        default: () => ''
    }
})
const store = useStore()
const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === 6))
const curAccount = computed(() => accountList.value.find(el => el.currency === props.type.toUpperCase()))

// 持仓列表数据
const positionList = computed(() => {
    const list = store.state._trade.positionList['6'] || []
    if (!curAccount.value) return list
    return list.filter(el => el.accountId === curAccount.value.accountId)
})

</script>

<style lang="scss" scoped>
.modulesWrapper {
    margin-top: 20px;
    padding: 22px;
    flex: 1;
    line-height: 1;
    background: var(--contentColor);
    border-radius: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    .title {
        font-size: 16px;
        font-weight: normal;
    }
    .postionsBox {
        margin-top: 20px;
        flex: 1;
    }
}
</style>
