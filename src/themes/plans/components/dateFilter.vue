<template>
    <van-dropdown-menu class='menu'>
        <van-dropdown-item ref='dropdownItemRef' v-model='dateModel' :options='dateOption' @change='onDateChange'>
            <template #title v-if='context.slots.title'>
                <slot name='title'></slot>
            </template>
            <template #title v-else-if='showTitleIcon'>
                <span class='icon iconfont icon_paixu'></span>
            </template>
            <template #default>
                <!-- 自定义时间 -->
                <dateRange :is-selected='dateModel === 5' @change='onRangeChange' />
            </template>
        </van-dropdown-item>
    </van-dropdown-menu>
</template>

<script>
import { ref, unref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import dateRange from './dateRange'
export default {
    components: {
        dateRange
    },
    emits: ['change'],
    props: {
        showTitleIcon: {
            type: Boolean,
            default: false
        }
    },
    setup (props, context) {
        const { t } = useI18n({ useScope: 'global' })
        const dateOption = computed(() => [
            // { text: t('common.all'), value: '' },
            { text: t('common.curToday'), value: 1 },
            { text: t('common.curWeek'), value: 2 },
            { text: t('common.curMonth'), value: 3 },
            { text: t('common.curThreeMonth'), value: 4 },
        ])

        const getTime = (type) => {
            return window.dayjs().startOf(type).valueOf()
        }

        const period = {
            1: getTime('day'),
            2: window.dayjs(window.dayjs().subtract(7, 'day').format('YYYY/MM/DD')).valueOf(),
            3: window.dayjs(window.dayjs().subtract(1, 'month').format('YYYY/MM/DD')).valueOf(),
            4: window.dayjs(window.dayjs().subtract(3, 'month').format('YYYY/MM/DD')).valueOf()
        }
        // 下拉菜单Ref
        const dropdownItemRef = ref(null)
        // 下拉菜单的值
        const dateModel = ref(2)
        // 监听下拉菜单变化
        const onDateChange = (value) => {
            const startTime = period[value]
            const endTime = window.dayjs().endOf('day').valueOf()
            context.emit('change', startTime ? [startTime, endTime] : null)
        }

        const onRangeChange = value => {
            dateModel.value = 5
            context.emit('change', value)
        }

        return {
            dateModel,
            dateOption,
            onDateChange,
            dropdownItemRef,
            onRangeChange,
            context
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.menu {
    // :deep(.van-dropdown-menu__title) {
    //     &::after {
    //         display: none;
    //     }
    // }
    :deep(.van-dropdown-menu__bar) {
        box-shadow: none;
    }
    :deep(.van-dropdown-menu__title--active) {
        color: var(--primary);
    }
    :deep(.van-dropdown-item__icon) {
        color: var(--primary);
    }
    .icon_paixu {
        color: var(--normalColor);
    }
}
</style>
