<template>
    <van-field
        v-model='modelValue'
        class='field'
        :input-align='inputAlign'
        :label='$t("bank.bankCurrency")'
        :placeholder='$t("bank.inputBankCurrency")'
        readonly
        required
        right-icon='arrow-down'
        type='text'
        @click='openDialog'
    />
    <van-action-sheet v-model:show='actionSheetVisible' :actions='list' :round='false' @select='actionOnSelect' />
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { Toast } from 'vant'

export default {
    props: {
        modelValue: String,
        inputAlign: {
            true: String,
            default: 'right'
        },
        // 列表数据
        list: {
            type: Array,
            default: () => []
        }
    },
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            // 是否显示弹窗
            actionSheetVisible: false
        })

        // 打开弹窗
        const openDialog = () => {
            if (props.list.length === 0) {
                return Toast(t('bank.bankCountryTip'))
            }
            state.actionSheetVisible = true
        }

        // 点击选择
        const actionOnSelect = (item) => {
            emit('update:modelValue', item.code)
            state.actionSheetVisible = false
        }

        return {
            ...toRefs(state),
            openDialog,
            actionOnSelect
        }
    }
}
</script>

<style lang="scss" scoped>
.field {
    &:deep {
        .van-cell__value {
            cursor: pointer;
        }
        .van-field__control {
            cursor: pointer;
        }
    }
}
</style>
