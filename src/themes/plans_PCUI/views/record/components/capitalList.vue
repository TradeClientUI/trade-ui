<template>
    <list
        v-bind='$attrs'
        ref='listRef'
        :liabilities-type='1'
        :request-api='queryCapitalFlowList'
        :request-params='newParams'
    >
        <template #filter>
            <flowFilter :trade-type='tradeType' :value='businessType' @change='onChange' />
        </template>
        <template #default='{ list }'>
            <div v-for='item in list' :key='item.id' class='li'>
                <div class='block'>
                    <div class='left'>
                        <span class='currency'>
                            {{ item.currency }}
                        </span>
                        <span class='businessType'>
                            {{ item.businessType1Name }}
                        </span>
                        <span class='time'>
                            {{ formatTime(item.createTime) }}
                        </span>
                    </div>
                    <div class='right'>
                        <span class='balance'>
                            {{ item.amount > 0 ? '+ '+item.amount : item.amount.replace('-','- ') }}
                        </span>
                        <span class='amountAfter'>
                            {{ $t('common.balance') }} {{ item.amountAfter }}
                        </span>
                    </div>
                </div>
            </div>
        </template>
    </list>
</template>

<script>
import list from './list'
import { queryCapitalFlowList } from '@/api/user'
import { useI18n } from 'vue-i18n'
import flowFilter from './flowFilter'
import { computed, ref, unref } from 'vue'
import { useRoute } from 'vue-router'

export default {
    components: { list, flowFilter },
    setup (props) {
        const route = useRoute()
        const { tradeType } = route.query
        const { tm } = useI18n({ useScope: 'global' })
        const flowSubCategory = tm(`fund.flowSubCategory.${tradeType}`)
        const formatTime = (val) => {
            return window.dayjs(val).format('YYYY/MM/DD HH:mm:ss')
        }

        const listRef = ref(null)
        const refresh = () => {
            unref(listRef) && unref(listRef).refresh()
        }

        const requestParams = ref({
            startTime: window.dayjs(window.dayjs().subtract(7, 'day').format('YYYY/MM/DD')).valueOf(),
            endTime: window.dayjs().endOf('day').valueOf()
        })
        const setParams = (params) => {
            requestParams.value = params || {}
        }

        const businessType = ref('')
        const onChange = value => {
            businessType.value = value
            refresh()
        }

        const newParams = computed(() => {
            if (businessType.value) {
                return {
                    ...unref(requestParams),
                    businessType: businessType.value
                }
            }

            return unref(requestParams)
        })

        return {
            setParams,
            refresh,
            formatTime,
            queryCapitalFlowList,
            flowSubCategory,
            newParams,
            onChange,
            businessType,
            tradeType,
            listRef
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.li {
    width: 100%;
    margin-bottom: rem(20px);
    padding: rem(38px) rem(30px);
    white-space: nowrap;
    background-color: var(--contentColor);
    border-radius: rem(10px);
    .block {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 0 0 rem(30px) 0;
        &:last-child {
            margin: 0;
        }
        .time {
            margin-top: rem(15px);
            color: var(--placeholdColor);
            font-weight: 400;
            font-size: rem(20px);
            line-height: rem(22px);
        }
        .label {
            color: var(--minorColor);
            font-weight: 500;
            font-size: rem(24px);
            line-height: rem(26px);
        }
        .num {
            margin-top: rem(13px);
            color: var(--normalColor);
            font-weight: 400;
            font-size: rem(24px);
        }
        .left {
            display: flex;
            flex-direction: column;
            .currency {
                color: var(--color);
                font-weight: 500;
                font-size: rem(30px);
                line-height: rem(32px);
            }
            .businessType {
                margin-top: rem(15px);
            }
        }
        .right {
            display: flex;
            flex-direction: column;
            text-align: right;
            .balance {
                color: var(--color);
                font-weight: 400;
                font-size: rem(34px);
                line-height: rem(36px);
            }
            .amountAfter {
                margin-top: rem(15px);
                color: var(--placeholdColor);
                font-weight: 400;
                font-size: rem(20px);
                line-height: rem(22px);
            }
        }
    }
}

</style>
