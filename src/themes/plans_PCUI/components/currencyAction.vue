<template>
    <van-field
        v-model='modelValue'
        :input-align='inputAlign'
        :label='$t("bank.bankCurrency")'
        :placeholder='$t("register.accountCurrency")'
        readonly
        right-icon='arrow-down'
        type='text'
        @click='actionSheetVisible=true'
    />
    <!-- <van-cell
        arrow-direction='down'
        is-link
        title='账户币种'
        :value='modelValue'
        v-bind='$attrs'
        @click='actionSheetVisible=true'
    /> -->
    <van-action-sheet v-model:show='actionSheetVisible' :actions='actionsList' :round='false' @select='actionOnSelect' />
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
export default {
    props: {
        modelValue: String,
        inputAlign: {
            true: String,
            default: 'right'
        }
    },
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const store = useStore()
        const state = reactive({
            actionSheetVisible: false
        })
        const actionsList = computed(() => store.state._base.wpCompanyInfo.currencyList)
        const actionOnSelect = (item) => {
            emit('update:modelValue', item.code)
            state.actionSheetVisible = false
        }

        return {
            ...toRefs(state),
            actionsList,
            actionOnSelect,
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
