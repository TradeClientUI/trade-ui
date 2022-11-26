<template>
    <van-dropdown-menu class='menu'>
        <van-dropdown-item v-model='flowType' :options='flowTypes' @change='onChange' />
    </van-dropdown-menu>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

export default {
    emits: ['change'],
    props: {
        value: {
            type: [String, Number],
            default: ''
        },
        tradeType: {
            type: [String, Number],
            default: ''
        }
    },
    setup (props, context) {
        const { t, tm } = useI18n({ useScope: 'global' })
        const flowCategories = tm(`fund.flowCategories.${props.tradeType}`)
        const flowTypes = [
            {
                text: t('common.all'),
                value: ''
            }
        ]
        flowTypes.push(...Object.keys(flowCategories).map(key => ({
            text: flowCategories[key],
            value: key
        })))

        const flowType = computed({
            get: () => props.value || flowTypes[0].value,
            set () {}
        })

        const onChange = (value) => {
            context.emit('change', value)
        }

        return {
            flowType,
            flowTypes,
            onChange
        }
    }
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
