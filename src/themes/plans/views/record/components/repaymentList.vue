<template>
    <list
        v-bind='$attrs'
        ref='listRef'
        :request-api='queryLiabilitiesWaterByPage'
        :request-params='params'
    >
        <template #default='{ list }'>
            <div v-for='item in list' :key='item.id' class='li'>
                <div class='block'>
                    <div class='left'>
                        <span class='currency'>
                            {{ item.currency }}
                        </span>
                        <span class='time'>
                            {{ formatTime(item.createTime) }}
                        </span>
                    </div>
                    <div class='right'>
                        <span class='balance'>
                            {{ item.liabilities }}
                        </span>
                    </div>
                </div>
                <div class='block'>
                    <div class='left'>
                        <span class='label'>
                            {{ $t("record.repaymentAmount") }}
                        </span>
                        <span class='num'>
                            {{ item.liabilitiesPrincipal }}
                        </span>
                    </div>
                    <div class='right'>
                        <span class='label'>
                            {{ $t("trade.swap_2") }}
                        </span>
                        <span class='num'>
                            {{ item.interest }}
                        </span>
                    </div>
                </div>
            </div>
        </template>
    </list>
</template>

<script>
import list from './list'
import { queryLiabilitiesWaterByPage } from '@/api/user'
import { computed, ref, unref } from 'vue'
import { useRoute } from 'vue-router'
export default {
    components: { list },
    setup (props) {
        const formatTime = (val) => {
            return window.dayjs(val).format('YYYY/MM/DD HH:mm:ss')
        }
        const route = useRoute()
        const { accountId } = route.query
        const requestParams = ref({
            startTime: window.dayjs(window.dayjs().subtract(7, 'day').format('YYYY/MM/DD')).valueOf(),
            endTime: window.dayjs().endOf('day').valueOf()
        })
        const setParams = (params) => {
            requestParams.value = params || {}
        }

        const listRef = ref(null)

        const refresh = () => {
            unref(listRef) && unref(listRef).refresh()
        }

        const params = computed(() => {
            return {
                accountId,
                liabilitiesType: 2,
                ...requestParams.value
            }
        })
        return {
            listRef,
            requestParams,
            setParams,
            refresh,
            formatTime,
            params,
            queryLiabilitiesWaterByPage
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
            .time {
                margin-top: rem(15px);
                color: var(--placeholdColor);
                font-weight: 400;
                font-size: rem(20px);
                line-height: rem(22px);
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
        }
    }
}
</style>
