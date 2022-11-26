<template>
    <centerViewDialog>
        <div class='pageWrap'>
            <LayoutTop :back='true' :menu='false'>
                <template #right>
                    <router-link class='right-title' to='/assets/depositRecord'>
                        {{ $t('deposit.depositRecord') }}
                    </router-link>
                </template>
            </LayoutTop>
            <div class='wrap'>
                <p class='header-text'>
                    {{ $t('deposit.selectAmount') }}
                </p>
                <div class='amount-list'>
                    <div v-for='(item,index) in amountList' :key='index' class='amount-item' :class='{ active: currIndex === index }' @click='checkAmount(index,item)'>
                        <p class='t1'>
                            {{ item.amount }} {{ checkedType.accountCurrency }}
                        </p>
                        <p v-if='item.describe' class='t2'>
                            {{ item.describe }}
                        </p>
                    </div>
                    <div class='amount-item' :class='{ active: currIndex === 99 }' @click='openOtherMoney'>
                        {{ $t('deposit.otherAmount') }}
                    </div>
                </div>
                <div v-show='otherAmountVis' class='other-money'>
                    <input v-model='amount' class='input-amount' :placeholder='$t("deposit.inputAmount")' type='number' />
                    <span class='label-amount'>
                        {{ checkedType.accountCurrency }}
                    </span>
                </div>
                <div v-if='PayTypes.length > 0' class='pay-wrap'>
                    <p class='bw-t'>
                        {{ $t('deposit.selectPayMethods') }}
                    </p>
                    <div v-if='checkedType' class='pay-item'>
                        <el-popover v-model:visible='typeShow' placement='bottom' trigger='click' :width='480'>
                            <template #reference>
                                <div class='pay-type'>
                                    <img alt='' :src='checkedType.imgUrl || require("@/assets/payment_icon/" + checkedType.paymentType + ".png")' srcset='' />
                                    <span class='pay-name'>
                                        {{ checkedType.alias || checkedType.paymentTypeAlias || checkedType.paymentType }}
                                    </span>
                                    <van-icon name='arrow-down' />
                                </div>
                            </template>
                            <div class='pay-list'>
                                <div v-for='(item,index) in payTypesSortEnable' :key='index' class='pay-type' @click='choosePayType(item)'>
                                    <img alt='' :src='item.imgUrl || require("@/assets/payment_icon/" + item.paymentType + ".png")' srcset='' />
                                    <span class='pay-name'>
                                        {{ item.alias || item.paymentTypeAlias || item.paymentType }}
                                    </span>
                                    <van-icon v-if='item.checked' class='icon-success' color='#53C51A' name='success' />
                                </div>
                                <div v-for='(item,index) in payTypesSortDisable' :key='index' class='pay-type' @click='choosePayType(item)'>
                                    <img alt='' :src='item.imgUrl || require("@/assets/payment_icon/" + item.paymentType + ".png")' srcset='' />
                                    <span class='pay-name'>
                                        {{ item.alias || item.paymentTypeAlias || item.paymentType }}
                                    </span>
                                    <van-icon v-if='item.checked' class='icon-success' color='#53C51A' name='success' />
                                </div>
                            </div>
                        </el-popover>

                        <div v-if='paymentTypes.length > 1' class='currency-wrap'>
                            <van-radio-group v-model='currencyChecked' @change='changePayCurrency'>
                                <van-radio v-for='(item,index) in paymentTypes' :key='index' class='currency-radio' icon-size='20px' :name='item'>
                                    {{ item }}
                                </van-radio>
                            </van-radio-group>
                        </div>

                        <div class='notice'>
                            <div class='left-val'>
                                <span class='label'>
                                    {{ $t('deposit.depositTime') + $t('common.colon') }}
                                </span>
                                <div class='left-time'>
                                    <p v-for='(item,index) in resultTimeMap[checkedType.id]' :key='index'>
                                        {{ item }}
                                    </p>
                                </div>
                            </div>
                            <span class='right-val'>
                                {{ $t('deposit.amountLimit') + $t('common.colon') }}  {{ checkedType.singleLowAmount }}-{{ checkedType.singleHighAmount }} {{ checkedType.accountCurrency }}
                            </span>
                        </div>
                    </div>
                </div>
                <div v-else class='pay-type no-data'>
                    {{ $t('deposit.noPayPassway') }}
                </div>

                <div class='pay-info'>
                    <div class='pi-item'>
                        {{ $t('deposit.expectPay') }} {{ computeExpectedpay || '--' }} {{ currencyChecked }}
                    </div>
                    <div class='pi-item'>
                        {{ $t('deposit.expectInBank') }} {{ amount && checkedType ? parseFloat(amount) - parseFloat(computeFee) : '--' }} {{ amount ? checkedType.accountCurrency : '' }}
                    </div>
                    <div class='line'></div>
                    <!-- <div class='pi-item'>
                        赠送金额 {{ presentAmount || '--' }} {{ checkedType.accountCurrency }}
                    </div> -->
                    <div class='pi-item'>
                        {{ $t('common.fee') }} {{ computeFee }} {{ checkedType.accountCurrency }}
                    </div>
                </div>
            </div>
        </div>

        <van-button block class='next-btn' :disabled='btnDisabled' type='primary' @click='next'>
            <span>{{ $t('common.nextStep') }}</span>
        </van-button>

        <van-dialog
            v-model:show='despositVis'
            :cancel-button-text='$t("deposit.denyText")'
            class-name='desposit-dialog'
            :confirm-button-text='$t("deposit.agreeText")'
            :show-cancel-button='true'
            @cancel='onCancel'
            @confirm='onConfirm'
        >
            <h4>{{ $t('deposit.payConfirm') }}</h4>
            <p class='title'>
                {{ $t('deposit.payConfirmTips') }}
            </p>
        </van-dialog>

        <van-popup v-model:show='appendVis' class='append-popup' position='right' :style="{ height: '100%',width: '500px' }">
            <div class='append-wrap'>
                <p class='title'>
                    {{ $t('deposit.appendFiled') }}
                </p>
                <van-cell-group inset>
                    <van-field
                        v-for='(item,key) in checkedType.extend'
                        :key='key'
                        v-model='appendMap[key].value'
                        :data='item'
                        :label='item[lang]'
                        label-width='70'
                        :placeholder='$t("common.input")+ item[lang]'
                        required='true'
                    />
                </van-cell-group>
                <van-button class='confirm-btn' size='large' type='primary' @click='handleAppendField'>
                    {{ $t('common.sure') }}
                </van-button>
            </div>
        </van-popup>
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import { reactive, computed, toRefs, onBeforeUnmount, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { queryPayType, queryDepositExchangeRate, handleDesposit, checkKycApply, queryDepositProposal, judgeIsAlreadyDeposit } from '@/api/user'
import { getListByParentCode } from '@/api/base'
import { useStore } from 'vuex'
import { Toast, Dialog } from 'vant'
import { isEmpty, sessionGet, getCookie } from '@/utils/util'
import { mul } from '@/utils/calculation'
import { useI18n } from 'vue-i18n'

export default {
    components: {
        centerViewDialog
    },
    setup (props) {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const { currency, accountId, tradeType } = route.query
        const rightAction = {
            title: t('deposit.depositRecord')
        }

        const state = reactive({
            amountList: [],
            currencyChecked: '',
            otherAmountVis: false,
            currIndex: '',
            amount: '',
            typeShow: false,
            PayTypes: [],
            checkedType: '',
            rateConfig: '',
            presentAmount: 5,
            despositVis: false,
            btnDisabled: false,
            resultTimeMap: {},
            paymentTypes: [],
            appendVis: false,
            lang: getCookie('lang'),
            appendMap: {},
            paramsExtens: {}
        })

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const onlineServices = computed(() => store.state._base.wpCompanyInfo?.onlineService)
        // 获取存款配置数据
        const depositData = computed(() => store.state._base.wpCompanyInfo?.depositData)
        // 获取wp配置的支付通道图标
        const paymentIconList = computed(() => store.state._base.wpCompanyInfo.paymentIconList)

        // 计算存款手续费
        const computeFee = computed(() => {
            if (state.amount >= state.checkedType.singleLowAmount && state.amount <= state.checkedType.singleHighAmount) {
                // feeType  1：固定金额手续费 2：百分比手续费
                if (Number(state.checkedType.feeType === 1)) {
                    return state.checkedType.fee
                } else if (Number(state.checkedType.feeType === 2)) {
                    return mul(state.amount, (state.checkedType.fee))
                }
            }
            return 0
        })

        // 计算预计支付金额
        const computeExpectedpay = computed(() => {
            // 计算方式：存款金额 * 汇率

            return state.rateConfig.exchangeRate ? mul(state.amount, state.rateConfig.exchangeRate) : '--'
        })

        // 处理支付通道排序
        const payTypesSortEnable = computed(() => {
            if (state.PayTypes.length > 0) {
                const temp = state.PayTypes.filter(item => item.timeRangeFlag && item.openTime)
                temp.forEach(item => {
                    if (state.checkedType.paymentTypeAlias === item.paymentTypeAlias) {
                        item.checked = true
                    }
                })
                return temp
            }
            return []
        })

        // 不在当前时间的支付通道
        const payTypesSortDisable = computed(() => {
            if (state.PayTypes.length > 0) {
                const temp = state.PayTypes.filter(item => !item.timeRangeFlag && item.openTime)
                temp.forEach(item => {
                    if (state.checkedType.paymentTypeAlias === item.paymentTypeAlias) {
                        item.checked = true
                    }
                })
                return temp
            }
            return []
        })

        // 判断sessionStorage 里面有没有保存proposalNo，有则弹窗提醒
        if (sessionStorage.getItem('proposalNo')) {
            state.despositVis = true
        }

        const onConfirm = () => {
            // 请求存款提案
            const proposalNo = sessionGet('proposalNo')
            if (proposalNo) {
                const params = {
                    customerNo: customInfo.value.customerNo,
                    proposalNo,
                    tradeType,
                    accountId
                }
                queryDepositProposal(params).then(res => {
                    if (res.check()) {
                        if (Number(res.data.paymentStatus) === 2) {
                            router.push('/assets')
                        } else {
                            Dialog.alert({
                                title: t('common.tip'),
                                message: t('deposit.despositFail'),
                                confirmButtonText: t('deposit.toRecord'),
                            }).then(() => {
                                router.push('/assets/depositRecord')
                            })
                        }
                        sessionStorage.removeItem('proposalNo')
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }

        const onCancel = () => {
            sessionStorage.removeItem('proposalNo')
            state.despositVis = false
        }

        const checkAmount = (index, item) => {
            state.otherAmountVis = false
            state.currIndex = index
            state.amount = item.amount
            state.presentAmount = item.present
        }

        const toDespositList = () => {
            router.push({
                path: '/assets/depositRecord'
            })
        }

        // 切换不同链支付通道
        const changePayCurrency = (val) => {
            state.currencyChecked = val
            getDepositExchangeRate()
        }

        // 切换支付方式
        const choosePayType = (item) => {
            state.checkedType = item
            state.appendMap = state.checkedType.extend
            setPaymentList(state.checkedType)
            payTypesSortEnable.value && payTypesSortEnable.value.map(item => {
                item.checked = false
            })
            payTypesSortDisable.value && payTypesSortDisable.value.map(item => {
                item.checked = false
            })
            item.checked = true
            state.typeShow = false
        }

        const openOtherMoney = () => {
            state.otherAmountVis = true
            state.currIndex = 99
            state.presentAmount = ''
        }

        // 获取支付通道
        const getPayTypes = () => {
            const params = {
                customerNo: customInfo.value.customerNo,
                customerGroupId: customInfo.value.customerGroupId,
                clientType: 'mobile',
                accountId,
                tradeType,
                accountCurrency: currency,
            }
            queryPayType(params).then(res => {
                if (res.check()) {
                    if (res.data && res.data.length > 0) {
                        if (res.data.length > 0) {
                            res.data.forEach(el => {
                                if (paymentIconList.value[el.paymentCode + '_' + el.paymentType]) {
                                    el.alias = paymentIconList.value[el.paymentCode + '_' + el.paymentType][state.lang].alias || ''
                                    el.imgUrl = paymentIconList.value[el.paymentCode + '_' + el.paymentType][state.lang].imgUrl || require('@/assets/payment_icon/default.png')
                                } else {
                                    el.imgUrl = require('@/assets/payment_icon/default.png')
                                }
                            })
                            state.PayTypes = res.data
                        }

                        // 处理时区时间
                        handleShowTime()
                    }
                } else {
                    state.btnDisabled = true
                    Toast(res.msg)
                }
            }).catch(err => {

            })
        }

        // 获取存款货币对汇率
        const getDepositExchangeRate = async () => {
            if (state.currencyChecked) {
                const param = {
                    customerNo: customInfo.value.customerNo,
                    accountId,
                    tradeType,
                    accountCurrency: currency,
                    paymentCurrency: state.currencyChecked.split('-').length > 1 ? state.currencyChecked.split('-')[0] : state.currencyChecked
                }
                queryDepositExchangeRate(param).then(res => {
                    if (res.check()) {
                        state.rateConfig = res.data
                    } else {
                        Toast(res.msg)
                    }
                }).catch(err => {
                })
            }
        }

        const handleShowTime = () => {
            if (state.PayTypes.length > 0) {
                const todayStr = window.dayjs().format('YYYY-MM-DD')
                const tomorrowStr = window.dayjs().add(1, 'day')

                state.PayTypes.forEach(payItem => {
                    const openTime = payItem.openTime
                    // console.log('排序前的时间', payItem.openTime)
                    let openTimeList
                    if (!isEmpty(openTime)) {
                        openTimeList = openTime.split(',')

                        openTimeList.forEach(item => {
                            state.resultTimeMap[payItem.id] = [].concat(state.resultTimeMap[payItem.id])
                            const nowDate = window.dayjs()
                            const [start, end] = item.split('-')
                            const startLocal = window.dayjs.utc(`${todayStr} ${start}`).local()
                            const endLocal = window.dayjs.utc(`${todayStr} ${end}`).local()

                            if ((startLocal.isAfter(todayStr, 'day') && endLocal.isAfter(todayStr, 'day')) || (startLocal.isBefore(tomorrowStr, 'day') && endLocal.isBefore(tomorrowStr, 'day'))) {
                                state.resultTimeMap[payItem.id].push(startLocal.format('HH:mm') + '-' + endLocal.format('HH:mm'))
                            } else if (endLocal.format('HH:mm') === '00:00') {
                                state.resultTimeMap[payItem.id].push(startLocal.format('HH:mm') + '-24:00')
                            } else {
                                state.resultTimeMap[payItem.id].push(startLocal.format('HH:mm') + '-23:59')
                                state.resultTimeMap[payItem.id].push('00:00-' + endLocal.format('HH:mm'))
                            }

                            // 判断当前时间是否在设置的存款时间内
                            if (nowDate.isBetween(startLocal, endLocal)) {
                                payItem.timeRangeFlag = true
                                state.checkedType = payItem
                                state.appendMap = state.checkedType.extend
                            }
                        })

                        // console.log('转换时区后的时间', state.resultTimeMap[payItem.id])

                        // 重新排序
                        const newTimeList = [] // 排序并筛选后的时间列表
                        state.resultTimeMap[payItem.id].filter(el => el).forEach(item => {
                            if (item.split('-')[0] === '00:00') {
                                newTimeList.unshift(item)
                            } else {
                                newTimeList.push(item)
                            }
                        })

                        // console.log('排序后的时间', newTimeList)

                        // 处理时间重叠情况,如果第一段的结束时间和第二段开始时间相差一分钟则合并
                        const finalTimeResult = []
                        for (let index = 0; index < newTimeList.length; index++) {
                            const el = newTimeList[index]
                            if (!isEmpty(el)) {
                                const start = el.split('-')[0]
                                const end = el.split('-')[1]
                                const nextStart = newTimeList[index + 1] && newTimeList[index + 1].split('-')[0]
                                const nextEnd = newTimeList[index + 1] && newTimeList[index + 1].split('-')[1]
                                if (window.dayjs(`${todayStr} ${end}`).add(1, 'minute').isSame(window.dayjs(`${todayStr} ${nextStart}`))) {
                                    finalTimeResult.push(start + '-' + nextEnd)
                                    index++
                                } else {
                                    finalTimeResult.push(start + '-' + end)
                                }
                            }
                        }

                        state.resultTimeMap[payItem.id] = finalTimeResult
                    }
                })

                if (isEmpty(state.checkedType)) {
                    state.checkedType = state.PayTypes[0]
                    state.appendMap = state.checkedType.extend
                    state.PayTypes[0].checked = true
                }
                setPaymentList(state.checkedType)
            }
        }

        const setPaymentList = (payItem) => {
            if (payItem.channelConvertRate) {
                state.rateConfig = {}
                state.currencyChecked = ''
                return
            }

            state.paymentTypes = []
            if (payItem.paymentCurrency === 'USDT') {
                getChainList()
            } else {
                const splitCurrency = state.checkedType.paymentCurrency.split(',')
                if (splitCurrency.length >= 1) {
                    state.paymentTypes = splitCurrency
                }
            }

            state.currencyChecked = state.paymentTypes[0]
            getDepositExchangeRate()
        }

        const next = () => {
            if (!state.amount) {
                return Toast(t('deposit.selectAmount'))
            }
            if (Number(state.amount) < Number(state.checkedType.singleLowAmount)) {
                return Toast(t('deposit.amountMinTips') + `${state.checkedType.singleLowAmount}`)
            }
            if (Number(state.amount > Number(state.checkedType.singleHighAmount))) {
                return Toast(t('deposit.amountMaxTips') + `${state.checkedType.singleHighAmount}`)
            }

            // 判断是否需要填写补充资料
            if (!checkAllComplete()) {
                state.appendVis = true
                return
            }

            handleDeposit()
        }

        // 补充资料是否全部填写完成
        const checkAllComplete = () => {
            let flag = true
            const extend = state.checkedType.extend
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

        // 创建存款提案
        const handleDeposit = () => {
            const params = {
                tradeType,
                customerNo: customInfo.value.customerNo,
                accountId,
                customerGroupId: customInfo.value.customerGroupId,
                depositRateSerialNo: state.rateConfig.depositRateSerialNo,
                paymentCurrency: state.checkedType.paymentCurrency === 'USDT' ? 'USDT' : state.currencyChecked,
                accountCurrency: state.rateConfig.accountCurrency,
                exchangeRate: state.rateConfig.exchangeRate,
                paymentChannelCode: state.checkedType.paymentCode,
                paymentChannelType: state.checkedType.paymentType,
                paymentChannelClientType: 'mobile',
                depositAmount: state.amount,
                country: customInfo.value.country,
                channelCode: customInfo.value.utmSource,
                depositFrom: 'H5',
                callbackUrl: window.location.protocol + '//' + window.location.host + '/assets/depositCb',
                blockchainName: (state.currencyChecked && state.currencyChecked.split('-').length > 1) ? state.currencyChecked.split('-')[1] : ''
            }

            if (!isEmpty(state.paramsExtens)) {
                params.extend = JSON.stringify(state.paramsExtens)
            }

            handleDesposit(params).then(res => {
                if (res.check()) {
                    if (res.data.browserOpenUrl) {
                        sessionStorage.setItem('proposalNo', res.data.proposalNo)
                        window.open(res.data.browserOpenUrl, '_blank')
                    }
                } else {
                    Toast(res.msg)
                }
            }).catch(err => {

            })
        }

        // 计算存款时间
        const computeTime = (val) => {
            if (!isEmpty(val)) {
                // 0 点时的时间戳
                const time = (window.dayjs(new Date(new Date(new Date().toLocaleDateString()).getTime()))).valueOf()
                if (Number(val) === 1440) {
                    return '24:00'
                } else {
                    return window.dayjs(time + val * 60 * 1000).format('HH:mm')
                }
            }
        }

        // 检查是否需要KYC认证
        const checkKyc = () => {
            checkKycApply({
                businessCode: 'cashin',
                openAccountType: customerInfo.value.openAccountType
            }).then(res => {
                if (res.check()) {
                    if (Number(res.data) !== 2) {
                        return Dialog.alert({
                            title: t('common.tip'),
                            confirmButtonText: Number(res.data) === 1 ? t('common.goLook') : t('login.goAuthenticate'),
                            message: Number(res.data) === 2 ? t('deposit.KYCReviewing') : t('deposit.needKYC'),
                        }).then(() => {
                            router.replace({
                                path: '/assets/authForm',
                                query: {
                                    businessCode: 'cashin'
                                }
                            })
                        })
                    }
                    getPayTypes()
                }
            }).catch(err => {
                console.log(err)
            })
        }

        // 重置币种为虚拟币的时候 获取链列表
        const getChainList = () => {
            state.paymentTypes = []
            getListByParentCode({ parentCode: 'USDT' }).then(res => {
                if (res.check() && res.data.length > 0) {
                    res.data.forEach(item => {
                        state.paymentTypes.push(item.parentCode + '-' + item.code)
                    })
                    state.currencyChecked = state.paymentTypes[0]
                    getDepositExchangeRate()
                }
            })
        }

        // 补充资料确定事件
        const handleAppendField = () => {
            const extend = state.checkedType.extend
            for (const key in extend) {
                if (Object.hasOwnProperty.call(extend, key)) {
                    const element = extend[key]
                    if (!isEmpty(element.regex)) {
                        const valueReg = new RegExp(element.regex)
                        if (!valueReg.test(state.appendMap[key]?.value)) {
                            return Toast(`${extend[key][state.lang]}` + t('register.incorrectlyFormed'))
                        }
                    }
                    if (isEmpty(state.appendMap[key]?.value)) {
                        return Toast(t('deposit.allInputRequire'))
                    }
                    state.paramsExtens[key] = state.appendMap[key]?.value
                }
            }

            handleDeposit()
        }

        store.dispatch('_user/findCustomerInfo', false).then(res => {
            if (res.check()) {
                if (Number(customInfo.value.deposit) === 0) {
                    state.btnDisabled = true
                    return Dialog.confirm({
                        title: t('common.tip'),
                        message: t('deposit.serviceTips1'),
                        confirmButtonText: t('common.serivce'),
                        cancelButtonText: t('common.close')
                    }).then(() => {
                        if (onlineServices.value) { location.href = onlineServices.value }
                    }).catch(() => {
                    // on cancel
                    })
                } else {
                    // 检测存款是否需要kyc
                    checkKyc()
                }
            }
        })

        // 设置存款数据
        const setAmountList = () => {
            judgeIsAlreadyDeposit({
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo,
                accountId
            }).then(res => {
                const arr = []
                const isDeposit = res.data
                let data = {}
                // 已存款
                if (isDeposit) {
                    data = depositData.value.isAlready ? depositData.value['already'] : depositData.value['default']
                } else {
                    // 未存款
                    data = depositData.value.isNot ? depositData.value['not'] : depositData.value['default']
                }
                // 处理存款数据
                for (const key in data) {
                    const item = data[key]
                    if (item.amount) {
                        arr.push({
                            amount: item.amount,
                            describe: item[state.lang]?.describe
                        })
                    }
                }
                // 没有存款数据默认选择其它金额
                if (arr.length === 0) {
                    state.currIndex = 99
                    state.otherAmountVis = true
                } else {
                    state.currIndex = 0
                    state.amount = arr[0].amount
                }
                state.amountList = arr
            })
        }

        onBeforeUnmount(() => {
            sessionStorage.removeItem('proposalNo')
        })

        onMounted(() => {
            // 设置存款金额数据
            setAmountList()
        })

        return {
            ...toRefs(state),
            rightAction,
            checkAmount,
            toDespositList,
            choosePayType,
            openOtherMoney,
            getDepositExchangeRate,
            next,
            computeTime,
            onCancel,
            onConfirm,
            computeFee,
            handleShowTime,
            computeExpectedpay,
            payTypesSortEnable,
            payTypesSortDisable,
            onlineServices,
            changePayCurrency,
            handleAppendField
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.right-title {
    color: var(--primary);
    font-size: 12px;
}
.pageWrap {
    margin-top: 42px;
    background-color: var(--contentColor);
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: rem(40px) rem(30px);
    }
    .wrap {
        background-color: var(--contentColor);
        .header-text {
            padding: rem(46px) rem(30px) rem(40px) rem(30px);
            color: var(--color);
            font-size: rem(32px);
        }
        .amount-list {
            display: flex;
            flex-flow: row wrap;
            flex-wrap: wrap;
            align-content: flex-start;
            align-items: center;
            justify-content: space-between;
            padding: 0 rem(30px);
            .amount-item {
                display: flex;
                flex: 1;
                flex-basis: rem(30px);
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 47%;
                min-width: 47%;
                max-width: 47%;
                height: rem(84px);
                margin-bottom: rem(30px);
                color: var(--color);
                text-align: center;
                border: rem(2px) solid var(--placeholdColor);
                border-radius: rem(10px);
                cursor: pointer;
                .t1 {
                    font-size: rem(28px);
                }
                .t2 {
                    font-size: rem(20px);
                }
                &.active {
                    color: var(--focusColor);
                    border: rem(2px) solid var(--focusColor);
                }
            }
        }
        .other-money {
            display: flex;
            margin-top: rem(32px);
            padding: 0 rem(30px) rem(35px) rem(30px);
            border-bottom: solid 1px var(--lineColor);
            .input-amount {
                flex: 1;
            }
            .label-amount {
                color: var(--color);
                font-size: rem(28px);
            }
        }
        .pay-wrap {
            padding: 0 rem(30px);
            border-top: solid rem(20px) var(--bgColor);
            .bw-t {
                color: var(--color);
                font-size: rem(32px);
                line-height: rem(80px);
            }
            .notice {
                display: flex;
                justify-content: space-between;
                line-height: rem(80px);
                .left-val {
                    display: flex;
                    //align-items: center;
                    color: var(--normalColor);
                    .label{

                    }
                    .left-time {
                        padding: rem(16px) 0;
                        p {
                            line-height: rem(40px);
                        }
                    }
                }
                .right-val {
                    color: var(--normalColor);
                }
            }
        }
    }
    .pay-info {
        padding: rem(20px) rem(30px);
        background-color: var(--contentColor);
        border-top: solid rem(20px) var(--bgColor);
        .pi-item {
            flex: 0 0 50%;
            color: var(--normalColor);
            font-size: rem(28px);
            line-height: rem(60px);
        }
        .line {
            width: 100%;
            height: 1px;
            background-color: var(--lineColor);
        }
    }
}
.pay-type {
    display: flex;
    align-items: center;
    justify-content: center;
    border: rem(2px) solid var(--lineColor);
    border-radius: rem(4px);
    cursor: pointer;
    .pay-name {
        flex: 1;
        color: var(--color);
    }
    img {
        width: rem(55px);
        height: rem(55px);
        margin: rem(20px) rem(30px);
    }
    .van-icon {
        margin-right: rem(20px);
    }
    &.no-data {
        line-height: rem(80px);
    }
}
.currency-wrap {
    padding: rem(30px) 0 0 rem(30px);
    border: solid 1px var(--lineColor);
    border-top: none;
    .currency-radio {
        margin-bottom: rem(20px);
        :deep(.van-radio__label) {
            color: var(--color);
        }
    }
}
.pay-list .pay-type {
    border-color: var(--lineColor);
    border-style: solid;
    border-width: 0 0 1px;
}
.next-btn {
    flex-shrink: 0;
    background: var(--bgColor);
    border-color: var(--lineColor);
    span {
        color: var(--color);
        font-size: rem(34px);
    }
}

</style>

<style lang="scss">
@import '@/sass/mixin.scss';
.desposit-dialog {
    padding: rem(30px) rem(30px) 0 rem(30px);
    text-align: center;
    .van-icon-info-o {
        font-size: rem(60px);
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
.pay-warpper {
    background-color: var(--bgColor);
    .van-action-sheet__header {
        color: var(--color);
    }
}
.append-popup {
    background-color: var(--bgColor);
    .append-wrap {
        text-align: center;
        //padding: 0 rem(30px);
        background-color: var(--contentColor);
        .title {
            padding: rem(60px) 0;
            color: var(--color);
            font-size: rem(32px);
            text-align: center;
        }
        .confirm-btn {
            width: 80%;
            margin: rem(50px) auto;
        }
    }
}
</style>
