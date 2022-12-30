<template>
    <van-dropdown-menu class='menu'>
        <van-dropdown-item v-model='accountModel' :options='options' @change='onChange' />
    </van-dropdown-menu>
</template>

<script setup>
import { computed, defineEmits, ref, defineProps } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const props = defineProps({
    accountId: {
        type: String
    }
})

const emit = defineEmits(['change'])
const { t } = useI18n({ useScope: 'global' })
const accountModel = ref(props.accountId)

const store = useStore()

const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === 6))

const options = computed(() => {
    const accountOptions = accountList.value.map(el => {
        return {
            text: el.currency,
            value: el.accountId.toString()
        }
    })

    return [
        { text: t('trade.accountAll'), value: '0' },
        ...accountOptions
    ]
})

const onChange = (value) => {
    emit('change', value)
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.menu {
    height: rem(48px);
    margin-left: rem(20px);
    padding: 0 rem(27px) 0 rem(6px);
    background: var(--contentColor);
    border-radius: rem(6px);
    :deep(.van-dropdown-menu__title) {
        color: var(--normalColor);
    }
    :deep(.van-dropdown-menu__bar) {
        height: 100%;
        box-shadow: none;
    }
    :deep(.van-dropdown-menu__title--active) {
        color: var(--primary);
    }
    :deep(.van-dropdown-item__icon) {
        color: var(--primary);
    }
}
</style>
