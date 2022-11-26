<template>
    <div class='dialog-layer'>
        <el-dialog
            v-model='show'
            :before-close='close'
            :close-on-click-modal='false'
            :title='data.symbolName'
            width='500px'
        >
            <div v-if='show' class='body-module'>
                <div class='title'>
                    {{ $t('trade.modifyMargin') }}
                </div>
                <div class='box'>
                    <div class='switch' @click='onSwitch'>
                        <i class='el-icon-sort'></i>
                        <span>{{ operType ? $t('trade.raise') : $t('trade.reduce') }}</span>
                    </div>
                    <view class='line' />
                    <input
                        v-model='amount'
                        :placeholder="$t('trade.modifyAmount')"
                        type='number'
                    />
                    <button class='all' @click='onAll'>
                        {{ $t('c.all') }}
                    </button>
                </div>
                <div class='tip'>
                    <span v-if='operType'>
                        {{ $t('trade.maxRaise') }}：{{ accountInfo.available }} {{ accountInfo.currency }}
                    </span>
                    <span v-else>
                        {{ $t('trade.maxReduce') }}：{{ positionData.canReduceMargin }} {{ accountInfo.currency }}
                    </span>
                </div>
            </div>
            <template #footer>
                <button v-loading='isSubmit' class='handle-btn' @click='onConfirm'>
                    {{ $t('confirm') }}
                </button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { isEmpty } from '@/utils/util.js'
import { pow } from '@/utils/calculation.js'
import { Toast, Dialog } from 'vant'

// api
import { updateOccupyTheMargin } from '@/api/user'

export default {
    setup () {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            // 是否显示弹窗
            show: false,
            // 持仓数据
            data: {},
            // 调整类型 true:追加 false:减少
            operType: true,
            // 调整的金额
            amount: '',
            // 按钮提交状态
            isSubmit: false
        })
        // 账户列表
        const accountList = computed(() => store.state._user.customerInfo?.accountList)
        // 账户信息
        const accountInfo = computed(() => accountList.value.find(el => Number(el.tradeType) === Number(state.data.tradeType)))
        // 持仓数据
        const positionData = computed(() => store.state._trade.positionList[state.data.tradeType]?.find(item => item.positionId === state.data.positionId))

        // 打开弹窗
        const open = (row) => {
            state.data = row
            state.operType = true
            state.amount = ''
            state.isSubmit = false
            state.show = true
            store.dispatch('_user/findCustomerInfo', false)
            queryPositionList()
        }

        // 关闭弹窗
        const close = () => {
            state.show = false
        }

        // 点击切换
        const onSwitch = () => {
            state.operType = !state.operType
        }

        // 点击全部
        const onAll = () => {
            state.amount = state.operType ? accountInfo.value.available : positionData.value.canReduceMargin
        }

        // 确定调整保证金
        const onConfirm = () => {
            // 参数验证
            if (isEmpty(state.amount) || parseFloat(state.amount) === 0) {
                Toast(t('trade.enterMarginAmount'))
            }
            if (parseFloat(state.amount) < 0) {
                Toast(t('trade.enterMarginAmountTip'))
            }

            submitData()
        }

        // 发起调整保证金请求
        const submitData = () => {
            const data = state.data
            const margin = state.operType ? parseFloat(state.amount) : -parseFloat(state.amount)
            const occupyTheMargin = margin * pow(10, data.openAccountDigits)
            const params = {
                tradeType: data.tradeType,
                accountId: accountInfo.value.accountId,
                positionId: data.positionId,
                accountDigits: data.openAccountDigits,
                occupyTheMargin,
                orderId: data.orderId,
                remark: '',
                resp: ''
            }
            state.isSubmit = true
            updateOccupyTheMargin(params).then(res => {
                state.isSubmit = false
                if (res.check()) {
                    state.show = false
                    Toast(t('c.handleSuccess'))
                } else {
                    Dialog.alert({
                        title: t('common.tip'),
                        message: res.msg,
                    })
                }
            }).catch(res => {
                state.isSubmit = false
                Toast(res.msg)
            }).finally(() => {
                queryPositionList()
            })
        }

        // 获取持仓列表
        const queryPositionList = () => {
            const data = state.data
            store.dispatch('_trade/queryPositionPage', {
                tradeType: data.tradeType,
                sortFieldName: 'openTime',
                sortType: 'desc'
            })
        }

        return {
            ...toRefs(state),
            positionData,
            accountInfo,
            open,
            close,
            onSwitch,
            onAll,
            onConfirm
        }
    }
}
</script>

<style lang="scss" scoped>
.body-module {
    .title {
        color: var(--minorColor);
    }
    .box {
        display: flex;
        align-items: center;
        background: var(--assistColor);
        height: 50px;
        margin-top: 15px;
        border-radius: 3px;
        .switch {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 70px;
            cursor: pointer;
            i {
                margin-right: 5px;
                font-size: 14px;
                transform: rotate(90deg);
            }
            span {
                font-size: 14px;
            }
        }
        .line {
            background: var(--lineColor);
            width: 1px;
            height: 40px;
        }
        input {
            flex: 1;
            height: 100%;
            padding: 0 20px;
            font-size: 14px;
        }
        .all {
            margin-right: 20px;
            font-size: 14px;
            color: var(--primary);
            background: none;
            cursor: pointer;
        }
    }
    .tip {
        margin-top: 10px;
        color: var(--minorColor);
        font-size: 14px;
    }
}
.handle-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--primary);
    width: 100%;
    height: 48px;
    font-size: 16px;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
}
</style>
