<template>
    <div class='page-wrap'>
        <router-view />
        <!-- 页面内容 -->
        <div class='page-content'>
            <div v-if='!loading' class='payment-module'>
                <div class='payment-module-left'>
                    <p class='title'>
                        {{ $t('deposit.selectRechargeWay') }}
                    </p>
                    <div :class="{ 'payment-list': true, 'payment-list-many': paymentList.length > 3 }">
                        <template v-if='paymentList.length > 0'>
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
                            </ul>
                            <div class='line'></div>
                        </template>
                        <van-empty
                            v-else-if='paymentList.length === 0 && !loading'
                            :description="$t('deposit.noneChannel')"
                            image='/images/empty.png'
                        />
                    </div>
                    <!-- 直充 -->
                    <direct-module v-if='rechargeType === 1' />
                    <!-- 兑汇 -->
                    <exchange-module v-if='rechargeType === 2' />
                </div>
                <!-- 相关问题 -->
                <div v-if='rechargeType' class='payment-module-right'>
                    <answer-explain />
                </div>
            </div>
            <!-- 购买记录 -->
            <div v-if='!loading' class='record-module'>
                <deposit-record ref='depositRecordRef' :currency='currency' :type='rechargeType' />
            </div>
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
import answerExplain from './components/answer-explain.vue'
import depositRecord from './components/deposit-record.vue'

export default {
    components: {
        exchangeModule,
        directModule,
        answerExplain,
        depositRecord
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
                state.currency = ''
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
                    let index = data.findIndex(el => el.id === paymentId)
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
@import '@/sass/mixin.scss';
.page-content {
    min-height: 800px;
}
.payment-module {
    display: flex;
    justify-content: center;
    width: 1080px;
    margin: 50px auto 0;
}
.payment-module-left,
.payment-module-right {
    background: var(--contentColor);
    border: 1px solid var(--lineColor);
    border-radius: rem(16px);
}
.payment-module-left {
    padding: 30px 70px;
    width: 55%;
    .title {
        line-height: 1;
        margin-bottom: 16px;
        font-size: 18px;
        color: var(--color);
    }
}
.payment-module-right {
    flex: 1;
    padding: 30px 70px;
    margin-left: 50px;
}
.payment-list {
    ul {
        display: flex;
        flex-wrap: wrap;
        border: 1px solid var(--lineColor);
        border-radius: rem(16px);
    }
    li {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: calc(100% / 3);
        height: 72px;
        box-sizing: border-box;
        position: relative;
        border-right: 1px solid var(--lineColor);
        transition: all 0.12s ease 0s;
        cursor: pointer;
        &:hover {
            background: var(--primaryBg);
        }
        &:first-of-type {
            &::after {
                border-radius: rem(16px) 0 0 rem(16px);
            }
        }
        &:nth-of-type(3) {
            &::after {
                border-radius: 0 rem(16px) rem(16px) 0;
            }
        }
        &:nth-of-type(3n) {
            border-right: none;
        }
        &:nth-of-type(4n) {
            &::before {
                content: '';
                width: 300%;
                height: 1px;
                background: var(--lineColor);
                position: absolute;
                top: 0;
                left: 0;
            }
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
    .empty-li {
        border-left: none !important;
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
        border-top: 1px dashed var(--lineColor);
    }
}
.payment-list-many {
    li {
        &:first-of-type {
            &::after {
                border-radius: rem(16px) 0 0 0;
            }
        }
        &:nth-of-type(3n) {
            &::after {
                border-bottom-right-radius: rem(16px);
            }
        }
        &:nth-of-type(3) {
            &::after {
                border-bottom-right-radius: 0;
            }
        }
    }
}
.record-module {
    width: 1080px;
    margin: 50px auto;
    &:deep {
        .header-case {
            border-radius: rem(16px) rem(16px) 0 0;
        }
        .el-table {
            .el-table__body-wrapper {
                min-height: auto;
            }
        }
    }
}
</style>

<style>
.header-nav.DepositChoose {
    margin-bottom: 0;
}
</style>
