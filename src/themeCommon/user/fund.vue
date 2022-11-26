<template>
    <Top back show-center />
    <div class='page-wrap'>
        <div class='header'>
            <div class='header-info'>
                <p class='t1'>
                    {{ $t('fund.marginLevel') }}
                </p>
                <p class='t2' :class='computMargin'>
                    {{ accountInfo.marginRadio ?accountInfo.marginRadio+'%' : '--' }}
                </p>
            </div>
            <div class='progress'>
                <div class='p-val' :class='computMargin' :style="'width:' + perfent + '%'"></div>
            </div>
        </div>

        <div class='annulus-wrap'>
            <p class='a-title'>
                <span class='t1'>
                    {{ $t('fund.capitialComponents') }}
                </span>
                <span class='t2'>
                    ({{ $t('common.unit') + $t('common.colon') + mainAccount.currency }})
                </span>
            </p>
            <div id='annulus' class='annulus'>
                {{ $t('common.loading') }}
            </div>
            <div class='infos'>
                <div class='item'>
                    <p class='label'>
                        {{ $t('common.yk') }}
                    </p>
                    <p class='val profit' :class="computePrice(accountInfo.profitLoss) > 0 ? 'riseColor' : 'fallColor'">
                        {{ computePrice(accountInfo.profitLoss) }}
                    </p>
                </div>
                <div class='item'>
                    <p class='label'>
                        {{ $t('common.balance') }}
                    </p>
                    <p class='val balance'>
                        {{ computePrice(accountInfo.balance) }}
                    </p>
                </div>
                <div class='item'>
                    <p class='label'>
                        {{ $t('fund.acceptAmount') }}
                    </p>
                    <p class='val'>
                        {{ computePrice(mainAccount.withdrawAmount ) }}
                    </p>
                </div>
                <div class='item'>
                    <p class='label'>
                        {{ $t('fund.maginable') }}
                    </p>
                    <p class='val'>
                        {{ computePrice(accountInfo.availableMargin) }}
                    </p>
                </div>
                <div class='item'>
                    <p class='label'>
                        {{ $t('fund.accupyMargin') }}
                    </p>
                    <p class='val'>
                        {{ computePrice(accountInfo.occupyMargin) }}
                    </p>
                </div>
            </div>
        </div>
        <van-button class='desposit-btn' type='primary' @click='toDesposit'>
            <span>{{ $t('common.deposit') }}</span>
        </van-button>
    </div>
</template>

<script>
import Top from '@/components/top'
import { toRefs, reactive, onMounted, computed, onUpdated, onBeforeMount, getCurrentInstance } from 'vue'
import { createTorus } from '@/plugins/createTorus'
import { useStore } from 'vuex'
import { getArrayObj, priceFormat, isEmpty } from '@/utils/util'
import { useRouter } from 'vue-router'
import { divide } from '@/utils/calculation'
import { useI18n } from 'vue-i18n'

export default {
    components: {
        Top
    },
    setup (props) {
        const router = useRouter()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const internalInstance = getCurrentInstance()
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const perfent = computed(() => {
            return accountInfo.value.marginRadio >= 100 ? 100 : accountInfo.value.marginRadio
        })

        const accountInfo = computed(() => store.state._user.accountAssets)
        const mainAccount = getArrayObj(customInfo.value.accountList, 'accountId', customInfo.value.accountId)

        // 计算保证金水平区间
        const computMargin = computed(() => {
            // 强平水平	预警水平
            if (!isEmpty(customInfo.value) && !isEmpty(accountInfo.value)) {
                const [forceLevel, earlyWarningLevel] = [parseFloat(customInfo.value.forceLevel), parseFloat(customInfo.value.earlyWarningLevel)]
                const marginRadio = divide(accountInfo.value.marginRadio, 100) * 1

                if (marginRadio > earlyWarningLevel) {
                    return 'success'
                } else if (marginRadio <= earlyWarningLevel && marginRadio > forceLevel) {
                    return 'warning'
                } else if (marginRadio <= forceLevel) {
                    return 'fail'
                }
            }
        })

        const toDesposit = () => {
            router.push('/deposit')
        }

        const computePrice = (price,) => {
            return price === '' ? '--' : price
        }

        const netWorth = computed(() => {
            if (!isEmpty(accountInfo.value) && !isEmpty(customInfo.value.digits)) {
                return accountInfo.value.netWorth
            }
        })

        onUpdated(() => {
            if (accountInfo.value) {
                const earnest = accountInfo.value.occupyMargin

                const netWorthPercent = divide(netWorth.value, parseFloat(netWorth.value + earnest))
                const earnestPercent = divide(earnest, parseFloat(netWorth.value + earnest))

                createTorus({
                    id: 'annulus',
                    width: 220,
                    height: 220,
                    r: 80,
                    arcWidth: 15,
                    label: t('common.jz'),
                    text: netWorth.value || '--',
                    data: [
                        { color: '#3894FF', percent: 0.5, text: t('common.nthItem', 1) },
                        { color: '#51C31C', percent: 0.2, text: t('common.nthItem', 2) },
                        { color: '#51C31C', percent: 0.3, text: t('common.nthItem', 2) },
                    ]
                })
            }
        })

        onBeforeMount(() => {
            internalInstance.appContext.config.globalProperties.$findCustomerInfo()
        })

        return {
            toDesposit,
            perfent,
            computePrice,
            netWorth,
            computMargin,
            accountInfo,
            mainAccount,
            customInfo
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    flex: 1;
    overflow: auto;
    background-color: var(--bgColor);
    .header {
        padding: rem(30px);
        background-color: #FFF;
        .header-info {
            display: flex;
            justify-content: space-between;
            .t1 {
                color: var(--color);
                font-size: rem(28px);
            }
            .t2 {
                color: #52C41A;
                font-size: rem(50px);
                &.success {
                    color: #51C417;
                }
                &.fail {
                    color: #E55160;
                }
                &.warning {
                    color: #FF731A;
                }
            }
        }
        .progress {
            position: relative;
            width: 100%;
            height: rem(10px);
            margin-top: rem(20px);
            background: var(--bgColor);
            border-radius: rem(20px);
            .p-val {
                position: absolute;
                height: rem(10px);
                background-color: #52C41A;
                border-radius: rem(20px);
                &.success {
                    background-color: #51C417;
                }
                &.fail {
                    background-color: #E55160;
                }
                &.warning {
                    background-color: #FF731A;
                }
            }
        }
    }
    .annulus-wrap {
        // width: 200px;
        // margin: 0 auto;
        margin-top: rem(20px);
        background-color: #FFF;
        .a-title {
            margin-bottom: rem(20px);
            padding-top: rem(40px);
            padding-left: rem(30px);
            color: var(--color);
            .t1 {
                font-size: rem(36px);
            }
            .t2 {
                font-size: rem(24px);
            }
        }
        .annulus {
            height: rem(440px);
            line-height: rem(440px);
            text-align: center;
        }
        .ring-svg {
            margin: 0 auto;
            text {

            }
        }
        .infos {
            justify-content: space-between;
            margin-top: rem(20px);
            padding: 0 rem(30px);
            overflow: hidden;
            .item {
                float: left;
                width: 33.3%;
                margin-bottom: rem(70px);
                text-align: center;
                .label {
                    color: var(--color);
                    font-size: rem(24px);
                }
                .val {
                    margin-top: rem(23px);
                    font-weight: bold;
                    font-size: rem(34px);
                    &.profit {
                        //color: var(--success);
                    }
                    &.loss {
                        color: var(--fallColor);
                    }
                    &.balance {
                        color: var(--riseColor);
                    }
                }
            }
        }
    }
    .desposit-btn {
        position: absolute;
        bottom: 0;
        width: 100%;
        background: var(--lineColor);
        border-color: var(--lineColor);
        span {
            color: var(--focusColor);
            font-size: rem(34px);
        }
    }
}
.arc-item {
    transition: r ease-in 0.25s, stroke-dasharray ease-in 0.25s;
}

</style>
