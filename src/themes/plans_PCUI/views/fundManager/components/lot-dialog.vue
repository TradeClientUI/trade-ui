<template>
    <div class='dialog-layer'>
        <el-dialog
            v-model='show'
            :before-close='close'
            :close-on-click-modal='false'
            :title="type==='preview' ? $t('fundManager.ransom.preview') : $t('fundManager.ransom.confirmLot')"
            width='520px'
        >
            <p v-if="type==='confirm'" class='p'>
                {{ $t('fundManager.ransom.totalLot') }}:
                {{ calcData.sharesTotal }}
                {{ calcData.currencyShares }}
            </p>
            <p v-if="type==='confirm'" class='p'>
                {{ $t('fundManager.ransom.totalMoney') }}：
            </p>
            <el-table v-if="type==='preview'" v-loading='isLoading' border :cell-style="{ background:'none' }" :data='tableData'>
                <el-table-column align='center' :label='$t("fundManager.ransom.totalMoney") '>
                    <template #default='scope'>
                        <span>{{ scope.row.value }}{{ scope.row.currency }}</span>
                    </template>
                </el-table-column>
                <el-table-column align='center' :label='$t("fundManager.ransom.ableBalance")'>
                    <template #default='scope'>
                        <span>{{ scope.row.balance }}{{ scope.row.currency }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-table v-else v-loading='isLoading' border :cell-style="{ background:'none' }" :data='tableData'>
                <el-table-column align='center' :label=' $t("fundManager.ransom.RedeemAssets")'>
                    <template #default='scope'>
                        <span>{{ scope.row.currency }}</span>
                    </template>
                </el-table-column>
                <el-table-column align='center' :label='$t("contract.amount")'>
                    <template #default='scope'>
                        <span>{{ scope.row.value }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <template #footer v-if='!isLoading'>
                <button v-loading='isSubmit' class='confirm-btn' @click='onConfirm'>
                    {{ $t('confirm') }}
                </button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { getFundRedeemMoney, confirmFundRedeem } from '@/api/fund'
import { ref, unref, computed, defineEmits, defineProps, defineExpose } from 'vue'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'

const props = defineProps({
    type: String
})
const emit = defineEmits(['confirm'])
const store = useStore()
const { t } = useI18n({ useScope: 'global' })

// 用户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 是否显示弹窗
const show = ref(false)
// 是否加载中
const isLoading = ref(false)
// 是否提交中
const isSubmit = ref(false)
// 基金产品id集合
const ids = ref([])
// 列表数据
const tableData = ref([])
const calcData = ref({})

// 获取基金产品赎回总金额
const queryFundRedeemMoney = () => {
    isLoading.value = true
    getFundRedeemMoney({
        fundIdList: ids.value,
        checkTag: props.type === 'confirm'
    }).then(res => {
        isLoading.value = false
        if (res.check()) {
            isSubmit.value = false
            show.value = true
            const { data } = res
            if (props.type === 'confirm') {
                tableData.value = Object.keys(data.redeemAssetMap).map(key => ({ currency: key, value: data.redeemAssetMap[key] }))
            } else {
                tableData.value = Object.keys(data.redeemAssetMap).map(key => {
                    const curAsset = customerInfo.value.accountList.find(el => el.currency === key && el.tradeType === 5)
                    const result = {
                        currency: key,
                        value: data.redeemAssetMap[key],
                        balance: curAsset.balance
                    }

                    return result
                })
            }
            calcData.value = data
        }
    })
}
// 打开弹窗
const open = (list = []) => {
    ids.value = list
    // 获取基金产品赎回总金额
    queryFundRedeemMoney()
}
// 关闭弹窗
const close = () => {
    show.value = false
}
// 点击确定
const onConfirm = () => {
    if (props.type === 'preview') {
        show.value = false
        return false
    }
    if (isSubmit.value) return
    isSubmit.value = true
    confirmFundRedeem({
        fundIdList: ids.value
    }).then(res => {
        if (res.check()) {
            show.value = false
            Toast(t('c.handleSuccess'))
            emit('confirm')
        } else {
            isSubmit.value = false
        }
    }).catch(() => {
        isSubmit.value = false
    })
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>
.question {
    position: relative;
    top: 2px;
    margin-left: 2px;
    font-size: 16px;
    cursor: pointer;
}
.dialog-layer {
    .confirm-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 320px;
        height: 48px;
        margin: 0 auto;
        color: #FFF;
        font-size: 16px;
        background: var(--primary);
        border-radius: 24px;
        cursor: pointer;
        &:hover {
            opacity: 0.9;
        }
    }
    .p {
        padding: 5px 0;
    }
}
</style>
