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
    <van-action-sheet v-model:show='actionSheetVisible' :actions='actionsList' @select='actionOnSelect' />
</template>

<script>
import { computed, reactive, toRefs, onMounted } from 'vue'
import { useStore } from 'vuex'
import { getAssetsList } from '@/api/base'

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
        const actionsList = computed(() => {
            store.state._base.wpCompanyInfo.currencyList.forEach(el => {
                el.name = el.code
            })
            return store.state._base.wpCompanyInfo.currencyList
        })

        const actionOnSelect = (item) => {
            emit('update:modelValue', item.code)
            state.actionSheetVisible = false
        }

        onMounted(() => {
            // 获取资产列表
            getAssetsList().then(res => {
                if (res.check()) {
                    res.data.map(el => {
                        el.name = el.code
                    })
                }
                state.actionsList = res.data
            })
        })

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
