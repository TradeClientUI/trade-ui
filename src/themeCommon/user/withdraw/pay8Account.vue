<template>
    <div class='pageWrap'>
        <Loading :show='loading' />
        <!-- 头部导航 -->
        <Top
            back
            left-icon='arrow-left'
            :right-action='rightAction'
            :show-center='true'
            @rightClick='rightClick'
        />
        <div class='wrap'>
            <p class='header-text'>
                {{ $t('withdrawMoney.moneyName') }}
            </p>
            <div class='field-wrap'>
                <input
                    v-model='amount'
                    :placeholder='amountPlaceholder'
                    type='number'
                    @change='changeAmount'
                    @input='changeAmount'
                />
                <button class='get-btn' plain round size='small' @click='getAll'>
                    {{ $t('withdrawMoney.allBtn') }}
                </button>
            </div>
            <div class='total-block'>
                <p class='row'>
                    <span class='name'>
                        {{ $t('withdrawMoney.canName') }}
                    </span>
                    <span class='value'>
                        {{ withdrawAmount }}
                        <b>{{ accountCurrency?.currency }}</b>
                    </span>
                </p>
                <p class='row'>
                    <span class='name'>
                        {{ $t('withdrawMoney.serviceName') }}
                    </span>
                    <span class='value'>
                        {{ fee }}
                        <b>{{ accountCurrency?.currency }}</b>
                    </span>
                </p>
                <p class='row'>
                    <span class='name'>
                        {{ $t('withdrawMoney.predictName') }}
                    </span>
                    <span class='value'>
                        {{ computePre }}
                        <b>{{ currency }}</b>
                    </span>
                </p>
                <p class='row'>
                    <label class='name'>
                        {{ $t('withdrawCoin.minus') }}
                    </label>
                    <span class='value'>
                        {{ minusCount }}
                        <b>{{ accountCurrency.currency }}</b>
                    </span>
                </p>
            </div>
            <!-- 收款账号信息 -->
            <div class='receipt-info'>
                <h4 class='title'>
                    {{ $t('pay8Account.title') }}
                </h4>
                <div class='box'>
                    <input v-model='name' :placeholder="$t('pay8Account.inputName')" type='text' />
                    <van-icon v-if='name' class='clear' name='clear' @click="name = ''" />
                </div>
                <div class='box'>
                    <input v-model='account' :placeholder='inputAccount' type='text' />
                    <van-icon v-if='account' class='clear' name='clear' @click="account = ''" />
                </div>
                <div class='box'>
                    <span class='area'>
                        +63
                    </span>
                    <input v-model='phone' :placeholder="$t('common.inputPhone')" type='text' />
                    <van-icon v-if='phone' class='clear' name='clear' @click="phone = ''" />
                </div>
            </div>
        </div>
    </div>
    <!-- 确定按钮 -->
    <van-button block class='confirm-btn' type='primary' @click='confirm'>
        <span>{{ $t('withdraw.confirm') }}</span>
    </van-button>

    <!-- 取款时间弹窗 -->
    <van-dialog v-model:show='timeShow' :confirm-button-text="$t('common.sure')" :title="$t('withdraw.hint')">
        <div class='time-wrap'>
            <h4>{{ $t('withdraw.timeHint') }} </h4>
            <p v-if='timeList.length > 0'>
                {{ $t('withdraw.timeName') }}:
            </p>
            <div v-if='timeList.length > 0' class='flex'>
                <div class='time-text'>
                    <p v-for='(item,index) in timeList' :key='index' class='time-text-flex'>
                        <span class='time-label'>
                            {{ item.weekDay }}:
                        </span>
                        <span class='time-val'>
                            {{ item.openTimeLocal.toString() }}
                        </span>
                    </p>
                    <br />
                </div>
            </div>
        </div>
    </van-dialog>
    <!-- 资金密码弹窗 -->
    <DialogFundPwd v-model:show='fundPwdVis' @confirmWithdraw='confirmWithdraw' />
    <!-- 提交成功弹窗 -->
    <van-dialog v-model:show='withdrawSuccess' class-name='add-success' :confirm-button-text="$t('common.sure')" :show-cancel-button='false' @confirm='$router.push("/assets")'>
        <i class='icon_success'></i>
        <p class='title'>
            {{ $t('withdraw.successText') }}
        </p>
        <p class='content'>
            {{ $t('withdraw.moneySuccessMsg') }}
        </p>
    </van-dialog>
</template>

<script>
// vue
import { reactive, computed, toRefs, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
// vant
import { Toast, Dialog } from 'vant'
// components
import Top from '@/components/top'
import DialogFundPwd from '@/themeCommon/components/dialogFundPwd'
// utils
import md5 from 'js-md5'
import { isEmpty, debounce, getCookie, localGet, localSet } from '@/utils/util'
// api
import {
    checkKycApply,
    handleWithdraw,
    queryWithdrawConfig,
    queryWithdrawRate,
    computeWithdrawFee,
    queryPayWithdrawBankList
} from '@/api/user'

export default {
    components: {
        Top,
        DialogFundPwd
    },
    setup (props) {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const router = useRouter()
        const route = useRoute()

        const { currentTab, currency, accountId, tradeType } = route.query
        const weekdayMap = {
            1: t('weekdayMap.1'),
            2: t('weekdayMap.2'),
            3: t('weekdayMap.3'),
            4: t('weekdayMap.4'),
            5: t('weekdayMap.5'),
            6: t('weekdayMap.6'),
            7: t('weekdayMap.7')
        }

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        // 联系客服地址
        const onlineServices = computed(() => store.state._base.wpCompanyInfo?.onlineService)
        // 账户币种
        const { value: accountCurrency } = computed(() => store.state._user.customerInfo.accountList.find(el => el.accountId === Number(accountId)))
        // 取款时间列表数据
        const timeList = computed(() => {
            const timeConfigList = state.withdrawTimeConfigMap
            const tempList = []
            if (!isEmpty(timeConfigList)) {
                for (const key in timeConfigList) {
                    if (Object.hasOwnProperty.call(timeConfigList, key)) {
                        const item = timeConfigList[key]
                        if (!isEmpty(item.openTimeLocal)) {
                            tempList.push({
                                weekDay: weekdayMap[item.weekDay],
                                openTimeLocal: item.openTimeLocal
                            })
                        }
                    }
                }
            }
            return tempList
        })

        // 收款信息缓存数据
        const receiptInfo = JSON.parse(localGet(customInfo.value.customerNo + '-' + currentTab))
        const state = reactive({
            // 页面加载状态
            loading: false,
            // 当前语言
            lang: getCookie('lang') || 'zh-CN',
            // 头部导航栏右侧
            rightAction: {
                title: t('withdraw.moneyRecordText'),
                path: '/withdrawRecord?withdrawType=1'
            },
            // 是否显示提现时间弹窗
            timeShow: false,
            // 处理后的时区
            withdrawTimeConfigMap: {},
            // 可提金额
            withdrawAmount: '0.00',
            // 提现金额输入框提示
            amountPlaceholder: t('withdrawMoney.moneyPlaceholder'),
            // 提现金额
            amount: '',
            // 手续费
            fee: '',
            // 预计到账
            computePre: '',
            // 账户减扣
            minusCount: '',
            // 最高可提金额
            singleHighAmount: 0,
            // 最低可提金额
            singleLowAmount: 0,
            // 提现汇率
            withdrawRate: null,
            // 提现配置
            withdrawConfig: '',
            // 提现币种
            withdrawCurrency: '',
            // 是否显示提现成功弹窗
            withdrawSuccess: false,
            // 是否显示资金密码弹窗
            fundPwdVis: false,
            // 输入的资金密码
            fundPwd: '',
            // 输入的谷歌验证码
            googleCode: '',
            // 姓名
            name: receiptInfo?.name || '',
            // 注册账号
            account: receiptInfo?.account || '',
            // 手机号
            phone: receiptInfo?.phone || '',
            // 注册账号提示
            inputAccount: t('pay8Account.inputAccount', { name: currentTab === 'GCash' ? 'GCash' : 'Maya' }),
            // 提现通道
            channel: {}
        })

        // 重置数据
        const reset = () => {
            state.amount = ''
            state.fee = '--'
            state.computePre = '--'
            state.minusCount = '--'
        }

        // 导航栏右侧标题点击跳转
        const rightClick = () => {
            router.push(state.rightAction.path)
        }

        // 时区转换
        const transferUtc = () => {
            const todayStr = window.dayjs().format('YYYY-MM-DD')
            state.withdrawConfig.withdrawTimeConfigList.forEach(el => {
                el.openTimeLocal = []
                state.withdrawTimeConfigMap[el.weekDay] = {
                    weekDay: el.weekDay,
                    openTime: el.openTime,
                    openTimeLocal: []
                }
            })

            // 处理跨天逻辑
            for (const key in state.withdrawTimeConfigMap) {
                if (Object.hasOwnProperty.call(state.withdrawTimeConfigMap, key)) {
                    const el = state.withdrawTimeConfigMap[key]
                    if (!isEmpty(el.openTime)) {
                        const timeRange = el.openTime.split(',')
                        if (timeRange.length > 0) {
                            timeRange.forEach(timeRangeItem => {
                                const [start, end] = timeRangeItem.split('-')
                                const startLocal = window.dayjs.utc(`${todayStr} ${start}`).local()
                                const endLocal = window.dayjs.utc(`${todayStr} ${end}`).local()

                                // 第二天
                                const weekDay = key < 7 ? Number(key) + 1 : 1
                                let elNext = state.withdrawTimeConfigMap[weekDay]

                                if (!elNext) {
                                    elNext = {
                                        openTimeLocal: [],
                                        weekDay
                                    }
                                    state.withdrawTimeConfigMap[weekDay] = elNext
                                }

                                if (startLocal.isAfter(todayStr, 'day')) {
                                    elNext.openTimeLocal.push(startLocal.format('HH:mm') + '-' + endLocal.format('HH:mm'))
                                } else if (endLocal.format('HH:mm') === '00:00') {
                                    el.openTimeLocal.push(startLocal.format('HH:mm') + '-24:00')
                                } else if (endLocal.isAfter(todayStr, 'day')) {
                                    elNext.openTimeLocal.unshift('00:00-' + endLocal.format('HH:mm'))
                                    el.openTimeLocal.push(startLocal.format('HH:mm') + '-23:59')
                                } else if (el.openTime !== '00:00-00:00' || el.openTime !== '') {
                                    el.openTimeLocal.push(startLocal.format('HH:mm') + '-' + endLocal.format('HH:mm'))
                                }
                            })
                        }
                    }
                }
            }

            // 处理时间合并
            for (const key in state.withdrawTimeConfigMap) {
                if (Object.hasOwnProperty.call(state.withdrawTimeConfigMap, key)) {
                    const el = state.withdrawTimeConfigMap[key]
                    if (Array.isArray(el.openTimeLocal)) {
                        el.openTimeLocal.forEach((time, index) => {
                            const start = el.openTimeLocal[0].split('-')[0]

                            const end = time.split('-')[1]
                            const nextStart = el.openTimeLocal[index + 1] && el.openTimeLocal[index + 1].split('-')[0]
                            const nextEnd = el.openTimeLocal[index + 1] && el.openTimeLocal[index + 1].split('-')[1]

                            if (window.dayjs(`${todayStr} ${end}`).add(1, 'minute').isSame(window.dayjs(`${todayStr} ${nextStart}`)) ||
                                end === nextStart
                            ) {
                                el.openTimeLocal = start + '-' + nextEnd
                            }
                        })
                    }
                }
            }
        }

        // 查询第三方取款银行列表（pay8）
        const queryBankList = () => {
            queryPayWithdrawBankList({
                withdrawMethod: currentTab,
                withdrawType: 1
            }).then(res => {
                if (res.check() && res.data.length > 0) state.channel = res.data[0]
            })
        }

        // 获取取款手续费
        const getWithdrawFee = debounce(() => {
            const amount = parseFloat(state.amount)
            if (!state.withdrawRate) return
            if (!amount) {
                return reset()
            }
            if (amount < state.singleLowAmount) {
                return Toast(`${t('withdrawMoney.hint_3')}${state.singleLowAmount}`)
            }
            if (amount > state.singleHighAmount) {
                return Toast(`${t('withdrawMoney.hint_4')}${state.singleHighAmount}`)
            }

            const params = {
                accountId,
                accountCurrency: accountCurrency.currency,
                amount: state.amount.toString(),
                tradeType,
                withdrawCurrency: currency,
                withdrawType: 1,
                withdrawMethod: currentTab,
                withdrawRateSerialNo: state.withdrawRate.withdrawRateSerialNo
            }
            computeWithdrawFee(params).then(res => {
                if (res.check()) {
                    const { data } = res
                    state.fee = data.withdrawFee
                    state.computePre = data.finalAmount
                    state.minusCount = data.amount
                }
            })
        }, 1000)

        // 全部取出
        const getAll = () => {
            state.amount = state.withdrawConfig.withdrawAmount
            getWithdrawFee()
        }

        // 改变取款金额
        const changeAmount = () => {
            getWithdrawFee()
        }

        // 获取取款汇率
        const getWithdrawRate = () => {
            const params = {
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo,
                accountId,
                tradeType,
                accountCurrency: accountCurrency.currency,
                withdrawCurrency: currency,
                withdrawType: 1
            }
            queryWithdrawRate(params).then(res => {
                if (res.check()) {
                    state.withdrawRate = res.data
                }
            })
        }

        // 获取取款限制配置
        const getWithdrawConfig = () => {
            const params = {
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo,
                accountId,
                customerGroupId: customInfo.value.customerGroupId,
                accountCurrency: accountCurrency.currency,
                withdrawCurrency: currency,
                country: customInfo.value.country,
                withdrawType: 1,
                withdrawMethod: currentTab,
                tradeType
            }

            queryWithdrawConfig(params).then(res => {
                state.loading = false
                if (res.check()) {
                    const { data } = res
                    state.withdrawConfig = data
                    state.withdrawAmount = data.withdrawAmount
                    state.singleHighAmount = data.withdrawAmountConfig.singleHighAmount
                    state.singleLowAmount = data.withdrawAmountConfig.singleLowAmount

                    if (!res.data.customerGroupEnable) {
                        return Dialog.confirm({
                            title: t('withdraw.hint'),
                            message: t('withdraw.withdrawLimitHint'),
                            confirmButtonText: t('withdraw.contact'),
                            cancelButtonText: t('withdraw.close')
                        }).then(() => {
                            if (onlineServices.value) { location.href = onlineServices.value }
                        })
                    } else {
                        // 检测取款是否需要kyc
                        checkKyc()
                    }

                    // 时区转换
                    transferUtc()
                } else {
                    Toast(res.msg)
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // kyc验证
        const checkKyc = () => {
            state.loading = true
            checkKycApply({
                businessCode: 'withdraw',
                openAccountType: customInfo.value.openAccountType
            }).then(res => {
                state.loading = false
                if (Number(res.data) !== 2) {
                    return Dialog.alert({
                        title: t('withdraw.hint'),
                        confirmButtonText: Number(res.data) === 1 ? t('withdraw.kycBtn_1') : t('withdraw.kycBtn_2'),
                        message: Number(res.data) === 2 ? t('withdraw.kycMsg_1') : t('withdraw.kycMsg_2'),
                    }).then(() => {
                        router.replace({
                            name: 'Authentication',
                            query: {
                                businessCode: 'withdraw'
                            }
                        })
                    })
                } else {
                    if (!state.withdrawConfig.accountActiveEnable) {
                        return Dialog.confirm({
                            title: t('withdraw.hint'),
                            message: t('withdraw.activateMsg'),
                            confirmButtonText: t('withdraw.activateBtn')
                        }).then(() => {
                            router.replace({
                                path: '/depositChoose',
                                query: {
                                    accountId,
                                    currency: accountCurrency.currency,
                                    tradeType
                                }
                            })
                        }).catch(() => {
                            // on cancel
                        })
                    }

                    if (!state.withdrawConfig.timeEnable) {
                        state.timeShow = true
                        return
                    }

                    if (!state.withdrawConfig.amountEnable) {
                        return Toast(t('withdrawMoney.hint_6'))
                    }

                    if (!state.withdrawConfig.hourIn24Enable) {
                        return Toast(t('withdrawMoney.hint_7') + state.withdrawConfig.withdrawBaseConfig.maxCount + t('withdrawMoney.unit'))
                    }
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // 获取资金密码
        const confirmWithdraw = (val) => {
            state.fundPwd = val[0]
            state.googleCode = val[1] ? val[1] : ''
            // 发起提现
            launchHandleWithdraw()
        }

        // 点击确定提现
        const confirm = () => {
            const amount = parseFloat(state.amount)
            const withdrawAmount = parseFloat(state.withdrawAmount)
            const amountDigitsLength = state.amount.toString().split('.')[1] ? state.amount.toString().split('.')[1].length : 0
            if (!amount) {
                return Toast(t('withdrawMoney.hint_1'))
            }
            if (amount < parseFloat(state.singleLowAmount)) {
                return Toast(`${t('withdrawMoney.hint_3')}${state.singleLowAmount}`)
            }
            if (amount > parseFloat(state.singleHighAmount)) {
                return Toast(`${t('withdrawMoney.hint_4')}${state.singleHighAmount}`)
            }
            if (amountDigitsLength > accountCurrency.digits) {
                return Toast(t('withdraw.withdrawDigitsTip'))
            }
            if (amount > withdrawAmount) {
                return Toast(t('withdrawMoney.hint_5'))
            }
            if (isEmpty(state.name)) {
                return Toast(t('pay8Account.inputName'))
            }
            if (isEmpty(state.account)) {
                return Toast(t(state.inputAccount))
            }
            if (isEmpty(state.phone)) {
                return Toast(t('common.inputPhone'))
            }

            // 判断资金密码
            state.fundPwdVis = true
        }

        // 创建取款提案
        const launchHandleWithdraw = () => {
            state.loading = true
            const params = {
                accountId,
                accountCurrency: accountCurrency.currency,
                withdrawCurrency: currency,
                amount: state.amount,
                rate: state.withdrawRate.exchangeRate,
                withdrawRateSerialNo: state.withdrawRate.withdrawRateSerialNo,
                bankAccountName: state.name,
                bankName: state.channel.name,
                bankCardNo: state.account,
                withdrawType: 1,
                withdrawMethod: currentTab,
                tradeType,
                fundPwd: md5(state.fundPwd),
                googleCode: state.googleCode,
                extend: JSON.stringify({ 'phone': '+63' + state.phone, 'bankCode': state.channel.code })
            }
            handleWithdraw(params).then(res => {
                state.loading = false
                // 缓存收款信息
                localSet(customInfo.value.customerNo + '-' + currentTab, JSON.stringify({
                    name: state.name,
                    account: state.account,
                    phone: state.phone
                }))
                if (res.check()) {
                    state.amount = ''
                    state.withdrawSuccess = true
                }
            }).catch(err => {
                state.loading = false
            })
        }

        onMounted(() => {
            // 设置当前accountId
            store.commit('_user/Update_account', accountId)
            // 重置数据
            reset()
            // 获取取款限制配置
            getWithdrawConfig()
            // 获取取款汇率
            getWithdrawRate()
            // 查询第三方取款银行列表（pay8）
            queryBankList()
        })

        return {
            ...toRefs(state),
            currentTab,
            rightClick,
            getAll,
            changeAmount,
            confirm,
            currency,
            customInfo,
            getWithdrawFee,
            timeList,
            onlineServices,
            isEmpty,
            accountCurrency,
            confirmWithdraw
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    background: var(--contentColor);
    .empty {
        height: rem(20px);
        background-color: var(--bgColor);
    }
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: rem(40px) rem(30px);
    }
    .pageTitle {
        margin-bottom: rem(10px);
        font-weight: normal;
        font-size: rem(50px);
    }
    .wrap {
        padding: 0 rem(30px);
        .header-text {
            margin-top: rem(46px);
            margin-bottom: rem(73px);
            color: var(--normalColor);
            font-size: rem(28px);
        }
        .field-wrap {
            display: flex;
            padding-bottom: rem(18px);
            border-bottom: solid 1px var(--lineColor);
            input {
                flex: 1;
            }
            .get-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: rem(168px);
                height: rem(60px);
                font-size: rem(24px);
                line-height: rem(60px);
                background-color: var(--primaryAssistColor);
                border: 1px solid var(--lineColor);
                border-radius: rem(30px);
            }
        }
        .total-block {
            margin-top: rem(30px);
            .row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: rem(20px);
                font-size: rem(24px);
                .name {
                    color: var(--minorColor);
                }
                .value {
                    display: inline-flex;
                    align-items: center;
                    color: var(--normalColor);
                    b {
                        min-width: rem(80px);
                        text-align: right;
                        font-weight: normal;
                    }
                }
            }
        }
    }
}
.confirm-btn {
    position: absolute;
    bottom: 0;
    height: rem(104px);
    background: var(--bgColor);
    border-color: var(--lineColor);
    span {
        color: var(--color);
        font-weight: bold;
        font-size: rem(30px);
    }
}

// 收款账号信息
.receipt-info {
    margin-top: rem(80px);
    .title {
        margin-bottom: rem(20px);
        font-size: rem(28px);
        font-weight: normal;
        color: var(--normalColor);
    }
    .box {
        display: flex;
        align-items: center;
        height: rem(90px);
        margin-bottom: rem(20px);
        padding: 0 rem(25px);
        background: var(--bgColor);
        border-radius: rem(10px);
        .area {
            width: rem(60px);
            line-height: 1;
        }
        input {
            flex: 1;
            height: 100%;
            font-size: rem(26px);
        }
        .clear {
            margin-left: rem(20px);
            font-size: rem(36px);
            color: var(--minorColor);
        }
    }
}

// 取款时间弹窗
.time-wrap {
    padding: 0 rem(30px);
    font-size: rem(28px);
    h4 {
        margin: rem(15px) 0;
    }
    .flex {
        display: flex;
        .time-text {
            flex: 1;
            .time-text-flex {
                display: flex;
                margin-top: rem(10px);
                .time-label {
                    flex: 1;
                }
                .time-val {
                    flex: 3;
                }
            }
        }
    }
}

// 提交成功弹窗
.add-success {
    padding: rem(30px) rem(30px) 0 rem(30px);
    text-align: center;
    .icon_success {
        color: var(--success);
        font-size: rem(96px);
    }
    .title {
        line-height: rem(80px);
    }
    .content {
        margin: rem(20px) 0;
        color: var(--minorColor);
        font-size: rem(28px);
    }
}
</style>
