<template>
    <van-cell
        arrow-direction='down'
        is-link
        :title='$t("register.accountType")'
        :value='currentAction?.name'
        v-bind='$attrs'
        @click='actionSheetVisible=true'
    />
    <van-action-sheet v-model:show='actionSheetVisible' :actions='actionsList' @select='actionOnSelect' />
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
export default {
    props: {
        modelValue: [String, Number]
    },
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const store = useStore()
        const state = reactive({
            actionSheetVisible: false
        })
        const actionsList = computed(() => store.state._base.wpCompanyInfo.tradeTypeList)
        const currentAction = computed(() => actionsList.value.find(el => el.id == props.modelValue))
        const actionOnSelect = (item) => {
            emit('update:modelValue', item.id)
            state.actionSheetVisible = false
        }

        return {
            ...toRefs(state),
            actionsList,
            currentAction,
            actionOnSelect,
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
