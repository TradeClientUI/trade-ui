<template>
    <div class='page-wrap'>
        <LayoutTop />
        <div class='payment-module'>
            <div v-if='(paymentList.length > 0)' class='payment-list'>
                <p class='title'>
                    {{ $t('deposit.selectRechargeWay') }}
                </p>
                <ul>
                    <li
                        v-for='(item, index) in paymentList'
                        :key='index'
                        :class="{ 'active': paymentInfo.id === item.id }"
                        @click='switchPayment(item)'
                    >
                        <img class='img' :src='item.imgUrl' />
                        <p class='name'>
                            {{ item.alias || item.paymentTypeAlias || item.paymentType }}
                        </p>
                    </li>
                    <li v-if='paymentList.length % 2 !== 0' class='empty-li'></li>
                </ul>
                <div class='line'></div>
            </div>
            <van-empty
                v-else-if='paymentList.length === 0 && !loading'
                :description="$t('deposit.noneChannel')"
                image='/images/empty.png'
            />
        </div>

        <div v-if='rechargeType' class='handle-module'>
            <!-- 直充 -->
            <direct-module v-if='rechargeType === 1' />
            <!-- 汇兑 -->
            <exchange-module v-else />
            <!-- 充值记录 -->
            <deposit-record-module ref='depositRecordRef' :currency='currency' :type='rechargeType.toString()' />
            <!-- 相关问题 -->
            <answer-explain />
        </div>
    </div>
</template>

<script>
import { computed, ref, reactive, toRefs, onMounted, provide } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { localGet, localRemove } from '@/utils/util'
import { checkKyc, checkCustomerDeposit, getPayTypes } from '@/hooks/deposit'
import exchangeModule from './components/exchange-module.vue'
import directModule from './components/direct-module.vue'
import depositRecordModule from './components/deposit-record-module.vue'
import answerExplain from './components/answer-explain.vue'

export default {
    components: {
        exchangeModule,
        directModule,
        depositRecordModule,
        answerExplain
    },
    setup () {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            // 页面加载状态
            loading: true,
            // 通道列表
            paymentList: [],
            // 当前选择的账户币种
            currency: ''
        })
        // 颜色变量
        const style = computed(() => store.state.style)
        // 组件ref
        const depositRecordRef = ref(null)
        // 当前选择的通道
        const paymentInfo = ref({})
        // 当前充值方式 1:直充 2.汇兑
        const rechargeType = ref('')

        // 切换支付通道
        const switchPayment = (item) => {
            if (item.id !== paymentInfo.value.id) {
                rechargeType.value = item.paymentCode === 'coin_mdpay' ? 1 : 2
                paymentInfo.value = item
            }
        }

        // 更新充值记录数据
        const updateRecord = (currency) => {
            if (currency) {
                state.currency = currency
            } else {
                depositRecordRef.value.refresh()
            }
        }

        onMounted(() => {
            // 检查是否需要KYC认证
            checkKyc()
            // 验证客户是否可存款
            checkCustomerDeposit()
            // 获取所有支付通道列表
            getPayTypes().then(data => {
                state.loading = false
                if (data.length > 0) {
                    const paymentId = localGet('paymentId')
                    let index = data.findIndex(el => el.id === Number(paymentId))
                    index = index !== -1 ? index : 0
                    const item = data[index]
                    rechargeType.value = item.paymentCode === 'coin_mdpay' ? 1 : 2
                    state.paymentList = data
                    paymentInfo.value = item
                    localRemove('paymentId')
                }
            }).catch(() => {
                state.loading = false
            })
        })

        // 传递数据给子组件
        provide('rechargeType', rechargeType)
        provide('paymentInfo', paymentInfo)
        provide('updateRecord', updateRecord)

        return {
            ...toRefs(state),
            rechargeType,
            paymentInfo,
            style,
            depositRecordRef,
            switchPayment
        }
    }
}
</script>

<style lang="scss" scoped>
.page-wrap {
    overflow: auto;
    padding-top: rem(110px);
}
.payment-module {
    width: rem(690px);
    margin: rem(30px) auto;
    .title {
        margin-bottom: rem(16px);
        font-size: rem(32px);
        color: var(--color);
    }
}
.payment-list {
    padding: rem(50px) rem(30px);
    border-radius: rem(16px);
    background: var(--contentColor);
    border: 1px solid var(--lineColor);
    ul {
        display: flex;
        flex-wrap: wrap;
        border: 1px solid var(--lineColor);
        border-radius: rem(16px);
        overflow: hidden;
    }
    li {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 50%;
        height: rem(144px);
        box-sizing: border-box;
        position: relative;
        border-top: 1px solid var(--lineColor);
        transition: all 0.12s ease 0s;
        &:nth-of-type(even) {
            border-left: 1px solid var(--lineColor);
        }
        &:nth-of-type(1) {
            border-top: none;
            &::after {
                border-top-left-radius: rem(16px);
            }
        }
        &:nth-of-type(2) {
            border-top: none;
            &::after {
                border-top-right-radius: rem(16px);
            }
        }
        &:nth-last-of-type(1) {
            &::after {
                border-bottom-right-radius: rem(16px);
            }
        }
        &:nth-last-of-type(2) {
            &::after {
                border-bottom-left-radius: rem(16px);
            }
        }
        .img {
            width: rem(56px);
            height: rem(56px);
            margin-bottom: rem(8px);
        }
        .name {
            @include ellipsis();
            font-size: rem(28px);
            font-weight: bold;
            color: var(--color);
        }
    }
    .active {
        background: var(--primaryBg);
        &::after {
            content: '';
            width: calc(100% - 2px);
            height: calc(100% - 2px);
            border: 1px solid var(--primary);
            position: absolute;
            top: 0;
            left: 0;
        }
    }
    .line {
        margin-top: rem(40px);
        margin-bottom: rem(10px);
        border-top: 1px dashed var(--lineColor);
    }
}
.handle-module {
    padding: 0 rem(30px);
    margin-bottom: rem(30px);
}
</style>
