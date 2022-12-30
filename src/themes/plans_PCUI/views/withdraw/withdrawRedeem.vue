<template>
    <centerViewDialog>
        <div class='pageWrap'>
            <Loading :show='loading' />
            <!-- 头部导航 -->
            <LayoutTop>
                <template #right>
                    <span @click='rightClick'>
                        {{ rightAction.title }}
                    </span>
                </template>
            </LayoutTop>
            <div class='wrap'>
                <p class='header-text'>
                    {{ $t('withdrawMoney.moneyName') }}
                </p>
                <div class='field-wrap'>
                    <input v-model='amount' :placeholder='amountPlaceholder' type='number' @change='changeAmount' @input='changeAmount' />
                    <button class='get-btn' plain round size='small' @click='getAll'>
                        {{ $t('withdrawMoney.allBtn') }}
                    </button>
                </div>
                <div class='money-info'>
                    <div class='row'>
                        <span>{{ $t('withdrawMoney.canName') }}</span>
                        <span>{{ withdrawAmount }} {{ accountCurrency?.currency }}</span>
                    </div>
                    <div class='row'>
                        <span>{{ $t('withdrawMoney.serviceName') }}</span>
                        <span>{{ fee }} {{ accountCurrency?.currency }}</span>
                    </div>
                    <div class='row'>
                        <span>{{ $t('withdrawMoney.predictName') }}</span>
                        <span>{{ computePre }} {{ currency }}</span>
                    </div>
                    <div class='row'>
                        <span>{{ $t('withdrawCoin.minus') }}</span>
                        <span>{{ minusCount }}  {{ accountCurrency?.currency }}</span>
                    </div>
                </div>
                <!-- 收款地址 -->
                <div class='receipt-address'>
                    <p class='name'>
                        {{ $t('withdrawMoney.receiptAddress') }}
                    </p>
                    <div class='box'>
                        <input v-model='receiptAddress' :placeholder="$t('withdrawMoney.inputReceiptAddress')" />
                        <a v-if='receiptAddress' class='van-icon van-icon-clear' href='javascript:;' @click="receiptAddress = ''"></a>
                    </div>
                </div>
                <div class='fund'>
                    <p class='bw-t'>
                        {{ $t('common.fundPwd') }}
                    </p>
                    <div class='fund-input'>
                        <InputComp
                            v-model='pwd'
                            class='input-comp'
                            clear
                            :label="$t('common.inputFundPwd')"
                            :max-length='6'
                            pwd
                        />
                        <router-link v-if='Number(customInfo.assertPassStatus) === 1' class='href' to='/assets/setFundPwd'>
                            {{ $t('login.goSet') }}
                        </router-link>
                        <span v-else class='href' @click='goFundForgot'>
                            {{ $t('login.forgotFundPwd') }}
                        </span>
                    </div>
                </div>
                <div v-if='googleCodeVis' class='field-google'>
                    <p class='bw-t'>
                        {{ $t('common.googleCode') }}
                    </p>
                    <googleVerifyCode @getGooleVerifyCode='getGooleVerifyCode' />
                </div>
            </div>
        </div>

        <van-button block class='confirm-btn' type='primary' @click='confirm'>
            <span>{{ $t('withdraw.confirm') }}</span>
        </van-button>
    </centerViewDialog>

    <!-- 提交成功弹窗 -->
    <van-dialog v-model:show='withdrawSuccess' :confirm-button-text="$t('common.sure')" :show-cancel-button='false' @confirm='$router.push("/assets")'>
        <div class='add-success'>
            <i class='icon_success'></i>
            <p class='title'>
                {{ $t('withdraw.successText') }}
            </p>
            <p class='content'>
                {{ $t('withdraw.moneySuccessMsg') }}
            </p>
        </div>
    </van-dialog>

    <!-- 取款时间弹窗 -->
    <van-dialog v-model:show='timeShow' :title="$t('withdraw.hint')">
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
                    </p><br />
                </div>
            </div>
        </div>
    </van-dialog>

    <!-- 补充资料弹窗 -->
    <van-popup v-model:show='appendVis' class='append-popup' position='right' :style="{ height: '100%', width: '80%' }">
        <div class='append-wrap'>
            <p class='title'>
                {{ $t('deposit.appendFiled') }}
            </p>
            <van-cell-group inset>
                <van-field
                    v-for='(item, key) in extend'
                    :key='key'
                    v-model='item.value'
                    :data='item'
                    :label='item[lang]'
                    label-width='80'
                    :placeholder="$t('common.input') + item[lang]"
                    :required='true'
                />
            </van-cell-group>
            <van-button class='btn' size='large' type='primary' @click='handleAppendField'>
                {{ $t('common.sure') }}
            </van-button>
        </div>
    </van-popup>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import googleVerifyCode from '@/themeCommon/components/googleVerifyCode.vue'
import {
    reactive,
    computed,
    toRefs,
    onBeforeMount
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Toast, Dialog } from 'vant'
import { isEmpty, debounce, getCookie } from '@/utils/util'
import { useStore } from 'vuex'
import {
    handleWithdraw,
    queryWithdrawConfig,
    queryWithdrawRate,
    computeWithdrawFee,
    checkKycApply,
    getWithdrawMethodList,
    findCustomerExtend,
    saveCustomerExtend
} from '@/api/user'
import { useI18n } from 'vue-i18n'
import InputComp from '@/components/form/input'
import md5 from 'js-md5'

export default {
    components: {
        centerViewDialog,
        InputComp,
        googleVerifyCode
    },
    setup (props) {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const router = useRouter()
        const route = useRoute()

        const { currency, accountId, tradeType, currentTab } = route.query

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
        const googleCodeVis = computed(() => customInfo.value.googleId > 0)
        const onlineServices = computed(() => store.state._base.wpCompanyInfo?.onlineService)
        // 账户币种
        const { value: accountCurrency } = computed(() => store.state._user.customerInfo.accountList.find(el => el.accountId === Number(accountId)))

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

        const state = reactive({
            lang: getCookie('lang') || 'zh-CN', // 当前语言
            rightAction: { // 头部导航栏右侧
                title: t('withdraw.moneyRecordText'),
                path: '/assets/withdrawRecord?withdrawType=1'
            },
            withdrawAmount: '0.00', // 可提金额
            amountPlaceholder: t('withdrawMoney.moneyPlaceholder'), // 提现金额输入框提示
            amount: '', // 提现金额
            fee: '--', // 手续费
            computePre: '--', // 预计到账
            minusCount: '--', // 账户减扣
            singleHighAmount: 0, // 最高可提金额
            singleLowAmount: 0, // 最低可提金额
            loading: false,
            show: false,
            withdrawRate: null,
            withdrawConfig: '',
            fun: null,
            withdrawSuccess: false,
            withdrawCurrency: '',
            timeShow: false,
            withdrawTimeConfigMap: {}, // 处理后的时区
            appendVis: false, // 是否显示补充资料弹窗
            extend: {}, // 需要补充资料的数据
            paramsExtens: {}, // 补充完整的资料数据
            pwd: '',
            googleCode: '',
            defaultReceiptAddress: '', // 默认收款地址
            receiptAddress: '' // 收款地址
        })

        // 初始化数据
        const init = () => {
            state.amount = ''
            state.fee = '--'
            state.computePre = '--'
            state.minusCount = '--'
        }

        // 导航栏右侧标题点击跳转
        const rightClick = () => {
            router.push(state.rightAction.path)
        }

        // 跳转到忘记资金密码页面
        const goFundForgot = () => {
            router.push({
                name: 'Forgot',
                query: {
                    type: 'fund'
                }
            })
        }

        // 获取取款手续费
        const getWithdrawFee = debounce(() => {
            const amount = parseFloat(state.amount)
            if (!state.withdrawRate) return
            if (state.amount === '') {
                return init()
            }
            if (!amount) {
                return Toast(t('withdrawMoney.hint_1'))
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
                // companyId: customInfo.value.companyId,
                // customerNo: customInfo.value.customerNo,
                // customerGroupId: customInfo.value.customerGroupId,
                // country: customInfo.value.country,
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

        const openSheet = () => {
            state.show = true
        }

        // 全部取出
        const getAll = () => {
            state.amount = state.withdrawConfig.withdrawAmount
            // 获取取款手续费
            getWithdrawFee()
        }

        // 改变取款金额
        const changeAmount = () => {
            // 获取取款手续费
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
            })
        }

        const getGooleVerifyCode = val => {
            state.googleCode = val
        }

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
                        if (customInfo.value.openAccountType === 0) {
                            router.replace({
                                path: '/assets/authentication',
                                query: {
                                    businessCode: 'withdraw'
                                }
                            })
                        } else {
                            router.replace({
                                path: '/businessKYC'
                            })
                        }
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
                                    tradeType,
                                    accountId,
                                    currency: accountCurrency.currency
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

        // 获取提现方式
        const getWithdrawMethods = () => {
            getWithdrawMethodList({
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo,
                customerGroupId: customInfo.value.customerGroupId,
                customerId: customInfo.value.id,
                country: customInfo.value.country,
                tradeType,
                accountId
            }).then(res => {
                if (res.check()) {
                    res.data.map(elem => {
                        if (elem.withdrawMethod === currentTab) {
                            state.extend = elem.extend
                        }
                    })
                }
            })
        }

        // 补充资料是否全部填写完成
        const checkAllComplete = () => {
            let flag = true
            const extend = state.extend
            for (const key in extend) {
                if (Object.hasOwnProperty.call(extend, key)) {
                    const element = extend[key]
                    if (isEmpty(element.value)) {
                        flag = false
                    }
                }
            }
            return flag
        }

        // 补充资料确定事件
        const handleAppendField = () => {
            const extend = state.extend
            for (const key in extend) {
                if (Object.hasOwnProperty.call(extend, key)) {
                    const element = extend[key]
                    if (isEmpty(element.value)) {
                        return Toast(t('deposit.allInputRequire'))
                    }
                    if (!isEmpty(element.regex)) {
                        const valueReg = new RegExp(element.regex)
                        if (!valueReg.test(element.value)) {
                            return Toast(`${element[state.lang]}` + t('register.incorrectlyFormed'))
                        }
                    }
                    state.paramsExtens[key] = element.value
                }
            }
            state.appendVis = false

            // 创建取款提案
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
            if (isEmpty(state.receiptAddress)) {
                return Toast(t('withdrawMoney.inputReceiptAddress'))
            }
            if (!state.pwd) {
                return Toast(t('common.inputFundPwd'))
            }
            if (googleCodeVis.value && isEmpty(state.googleCode)) {
                return Toast(t('common.inputGoogleCode'))
            }
            // 判断是否需要填写补充资料
            if (!isEmpty(state.extend) && !checkAllComplete()) {
                state.appendVis = true
                return
            }

            // 发起提现
            launchHandleWithdraw()
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
                bankAccountName: (state.extend['last_name'][state.lang]) + (state.extend['first_name'][state.lang]),
                bankName: '法币钱包',
                bankCardNo: state.receiptAddress,
                withdrawType: 1,
                withdrawMethod: currentTab,
                tradeType,
                fundPwd: md5(state.pwd),
                googleCode: state.googleCode
            }
            if (!isEmpty(state.paramsExtens)) {
                params.extend = JSON.stringify(state.paramsExtens)
            }
            handleWithdraw(params).then(res => {
                state.loading = false
                // 保存用户扩展信息
                keepCustomerExtend()
                if (res.check()) {
                    state.amount = ''
                    state.withdrawSuccess = true
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // 查询用户扩展信息
        const getCustomerExtend = () => {
            findCustomerExtend({
                type: 1
            }).then(res => {
                if (res.check()) {
                    state.defaultReceiptAddress = res.data
                    state.receiptAddress = res.data
                }
            })
        }

        // 保存用户扩展信息
        const keepCustomerExtend = () => {
            if (state.defaultReceiptAddress === state.receiptAddress) return
            saveCustomerExtend({
                type: 1,
                value: state.receiptAddress
            })
        }

        onBeforeMount(() => {
            // 获取提现方式
            getWithdrawMethods()
            // 获取取款限制配置
            getWithdrawConfig()
            // 获取取款汇率
            getWithdrawRate()
            // 查询用户扩展信息
            getCustomerExtend()
            store.commit('_user/Update_account', accountId)
        })

        return {
            ...toRefs(state),
            rightClick,
            openSheet,
            getAll,
            goFundForgot,
            changeAmount,
            confirm,
            currency,
            customInfo,
            getWithdrawFee,
            timeList,
            onlineServices,
            isEmpty,
            accountCurrency,
            handleAppendField,
            googleCodeVis,
            getGooleVerifyCode
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    padding-top: rem(90px);
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
            color: var(--color);
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
                cursor: pointer;
            }
        }
        .money-info {
            margin-top: rem(20px);
            .row {
                display: flex;
                justify-content: space-between;
                margin-bottom: rem(12px);
                &:last-of-type {
                    margin-bottom: 0;
                }
                span {
                    color: var(--minorColor);
                    font-size: rem(24px);
                }
            }
        }
        .receipt-address {
            margin-top: rem(50px);
            .name {
                color: var(--color);
                font-size: rem(28px);
            }
            .box {
                display: flex;
                align-items: center;
                width: 100%;
                height: rem(90px);
                padding: 0 rem(25px);
                margin-top: rem(15px);
                background-color: var(--bgColor);
                border: 1px solid var(--lineColor);
                border-radius: rem(5px);
                input {
                    flex: 1;
                    height: 100%;
                }
                .van-icon-clear {
                    margin-left: rem(20px);
                    color: var(--minorColor);
                    font-size: rem(36px);
                }
            }
        }
        .fund,
        .field-google {
            margin-top: rem(30px);
            .bw-t {
                color: var(--color);
                font-size: rem(28px);
            }
            .fund-input {
                display: flex;
                align-items: center;
                .input-comp {
                    flex: 1;
                }
                .href {
                    color: var(--primary);
                    vertical-align: middle;
                    cursor: pointer;
                }
            }
        }
        .field-google :deep() {
            .paste {
                display: none;
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
</style>

<style lang="scss">

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
// 补充资料弹窗
.append-popup {
    .append-wrap {
        text-align: center;
        .title {
            padding: rem(60px) 0;
            color: var(--color);
            font-size: rem(32px);
            text-align: center;
        }
        .btn {
            width: 80%;
            margin: rem(50px) auto;
        }
    }
}

@import '@/sass/mixin.scss';
</style>
