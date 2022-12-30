<template>
    <van-cell @click='openRange'>
        <template #title>
            <div class='rangeWrap' :name='6'>
                <span class='field' :class='{ placeholder: !rangeText[0] }'>
                    {{ rangeText[0] ? rangeText[0] : $t("common.startDay") }}
                </span>
                <span class='field' :class='{ placeholder: !rangeText[1] }'>
                    {{ rangeText[1] ? rangeText[1] : $t("common.endDay") }}
                </span>
            </div>
        </template>
        <template #default>
            <van-icon v-if='showIcon' class='van-dropdown-item__icon' :color='primaryColor' name='success' />
        </template>
    </van-cell>
    <van-calendar
        ref='calendarRef'
        v-model:show='showCalendar'
        :allow-same-day='true'
        :color='primaryColor'
        :max-date='maxDate'
        :max-range='180'
        :min-date='minDate'
        position='left'
        :round='false'
        :show-mark='false'
        teleport='body'
        type='range'
        @confirm='onRangeConfirm'
    />
</template>

<script>
import { ref, unref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import Base from '@/store/modules/base'

export default {
    props: {
        isSelected: {
            type: Boolean,
            default: false
        }
    },
    emits: ['change'],
    setup (props, context) {
        const showIcon = computed(() => props.isSelected)
        const primaryColor = computed(() => Base.state.wpCompanyInfo.themeColor)
        watch(() => unref(showIcon), (val) => {
            if (!val) {
                range.value = []
                unref(calendarRef) && unref(calendarRef).reset()
            }
        })
        // 自定义时间范围
        const range = ref([])
        // 自定义时间显示
        const rangeText = computed(() => unref(range).map(e => window.dayjs(e).format('YYYY-MM-DD')))

        // 日历控件Ref
        const calendarRef = ref(null)
        const minDate = new Date(2020, 0, 1)
        const maxDate = new Date()
        // 日历控件显隐
        const showCalendar = ref(false)

        // 打开自定义时间弹框
        const openRange = () => {
            showCalendar.value = true
        }

        // 确定时间
        const onRangeConfirm = (value) => {
            showCalendar.value = false
            const startTime = window.dayjs(value[0]).valueOf('day')
            const endTime = window.dayjs(value[1]).endOf('day').valueOf()
            if (range.value[0] === startTime && range.value[1] === endTime) {
                // 数据没有变化，不作响应
                return
            }
            range.value = [startTime, endTime]
            context.emit('change', unref(range))
        }

        return {
            showIcon,
            rangeText,
            calendarRef,
            showCalendar,
            minDate,
            maxDate,
            openRange,
            onRangeConfirm,
            primaryColor
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.rangeWrap {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    height: rem(43px);
    line-height: rem(43px);
    white-space: nowrap;
    .field {
        width: 100px;
        text-align: center;
        border: 1px solid var(--lineColor);
        border-radius: rem(6px);
        &:first-child {
            margin-right: rem(30px);
        }
        &.placeholder {
            color: var(--placeholdColor);
        }
    }
}
</style>
