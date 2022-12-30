import {
    checkKycApply,
    queryAllPayType,
    queryDepositExchangeRate,
    handleDesposit,
    queryDepositProposal,
    getCryptoBlockchainInfo,
    getBindRechargeAddress,
    applyRechargeBindAddress
} from '@/api/user'
import { getListByParentCode } from '@/api/base'
import { watch, watchEffect, computed, ref, unref, reactive, onMounted, onUnmounted, inject, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Toast, Dialog } from 'vant'
import { isEmpty, localGet, localSet, localRemove, getCookie } from '@/utils/util'
import { mul, divide, minus, plus, toFixed, getDecimalNum, retainDecimal } from '@/utils/calculation'
import Clipboard from 'clipboard'
import QRCode from 'qrcodejs2'

// 检查是否需要KYC认证
export function checkKyc () {
    const store = useStore()
    const router = useRouter()
    const { t } = useI18n({ useScope: 'global' })
    const customerInfo = computed(() => store.state._user.customerInfo)
    const isMobile = process.env.VUE_APP_theme === 'plans'
    const gaClass = isMobile ? 'mobile_deposit_kyc_ga' : 'pc_deposit_kyc_ga'
    checkKycApply({
        businessCode: 'cashin',
        openAccountType: customerInfo.value.openAccountType
    }).then(res => {
        if (res.check()) {
            if (Number(res.data) !== 2) {
                return Dialog.alert({
                    title: t('common.tip'),
                    // 埋点类名
                    className: Number(res.data) !== 1 ? gaClass : '',
                    confirmButtonText: Number(res.data) === 1 ? t('common.goLook') : t('login.goAuthenticate'),
                    message: Number(res.data) === 2 ? t('deposit.KYCReviewing') : t('deposit.needKYC'),
                }).then(() => {
                    if (window.isPC) {
                        if (customerInfo.value.openAccountType === 0) {
                            router.replace({
                                path: '/depositChoose/authentication',
                                query: {
                                    businessCode: 'cashin'
                                }
                            })
                        } else {
                            router.replace({
                                path: '/businessKYC'
                            })
                        }
                    } else {
                        router.replace({ path: '/authentication' })
                    }
                })
            }
        }
    }).catch(err => {})
}

// 验证客户是否可存款
export function checkCustomerDeposit () {
    const store = useStore()
    const { t } = useI18n({ useScope: 'global' })
    // 客户信息
    const customerInfo = computed(() => store.state._user.customerInfo)
    // 在线客服地址
    const onlineService = unref(computed(() => store.state._base.wpCompanyInfo?.onlineService))
    // 获取客户信息
    store.dispatch('_user/findCustomerInfo', false).then(res => {
        if (res.check()) {
            // 是否显示联系客服弹窗
            if (Number(customerInfo.value.deposit) === 0) {
                Dialog.confirm({
                    title: t('common.tip'),
                    message: t('deposit.serviceTips1'),
                    confirmButtonText: t('common.serivce'),
                    cancelButtonText: t('common.close')
                }).then(() => {
                    if (onlineService) {
                        if (window.isPC) {
                            window.open(onlineService)
                        } else {
                            location.href = onlineService
                        }
                    }
                })
            }
        }
    })
}

// 获取所有支付通道列表
export function getPayTypes () {
    const store = useStore()
    const route = useRoute()
    const { query } = route
    const { t } = useI18n({ useScope: 'global' })
    // 获取wp配置的支付通道图标
    const paymentIconList = computed(() => store.state._base.wpCompanyInfo.paymentIconList)
    // 当前语言
    const lang = getCookie('lang')
    const params = {
        tradeType: store.getters.getCurrentTradeType(query.tradeType),
        clientType: 'mobile'
    }
    return new Promise((resolve, reject) => {
        Toast.loading({
            message: t('common.loading'),
            forbidClick: true,
            duration: 0
        })
        queryAllPayType(params).then(res => {
            if (res.check()) {
                const data = res.data || []
                // 设置通道图标并排序
                data.sort((a, b) => {
                    if (a.sort === b.sort) {
                        return 0
                    } else {
                        return a.sort > b.sort ? 1 : -1
                    }
                })
                data.map(el => {
                    const iconKey = el.paymentCode + '_' + el.paymentType + '_' + el.merchantNo
                    const isDirect = el.paymentCode === 'coin_mdpay'
                    if (paymentIconList.value[iconKey]) {
                        el.alias = paymentIconList.value[iconKey][lang].alias || ''
                        el.imgUrl = paymentIconList.value[iconKey][lang].imgUrl || ''
                    }
                    el.imgUrl = el.imgUrl || (isDirect ? require('@/assets/payment_icon/direct.png') : require('@/assets/payment_icon/exchange.png'))
                })
                if (data.length === 0) {
                    Toast.clear()
                }
                resolve(data)
            } else {
                Toast.clear()
                reject()
            }
        }).catch(() => {
            Toast.clear()
            reject()
        })
    })
}

// 汇兑
export function useExchange () {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const { query } = route
    const { t } = useI18n({ useScope: 'global' })

    // 客户信息
    const customerInfo = computed(() => store.state._user.customerInfo)
    // businessConfig
    const businessConfig = computed(() => store.state.businessConfig)
    // 颜色变量
    const style = computed(() => store.state.style)
    // 购买输入框提示
    const buyPlaceholder = computed(() => !isEmpty(state.accountInfo) ? (state.accountInfo.singleLowAmount + '～' + state.accountInfo.singleHighAmount) : '')
    // 是否显示购买提示文案
    const showBuyTip = computed(() => {
        if (isEmpty(state.amount)) return false
        if (parseFloat(state.amount) < parseFloat(state.accountInfo.singleLowAmount) || parseFloat(state.amount) > parseFloat(state.accountInfo.singleHighAmount)) {
            return true
        } else {
            return false
        }
    })
    // 购买币种小数位
    const buyCurrencyDigits = computed(() => {
        const result = customerInfo.value.accountList.find(el => el.currency === state.currency)
        return result?.digits || 2
    })
    // 支付币种小数位
    const paymentCurrencyDigits = computed(() => {
        const result = customerInfo.value.accountList.find(el => el.currency === state.paymentCurrency)
        return result?.digits || 2
    })
    // 是否可进行下一步
    const isNext = computed(() => !showBuyTip.value && !isEmpty(state.amount) && state.rateNum)

    // 当前充值方式
    const rechargeType = inject('rechargeType')
    // 当前选择的支付通道
    const paymentInfo = inject('paymentInfo')
    // 更新充值记录数据
    const updateRecord = inject('updateRecord')
    // 定时器对象
    const timer = ref(null)
    // 定时器间隔查询时间
    const timeSecond = 5000
    // 在线客服地址
    const onlineService = unref(computed(() => store.state._base.wpCompanyInfo?.onlineService))

    const state = reactive({
        // 当前语言
        lang: getCookie('lang') || 'zh-CN',
        // 是否在刷新中
        isRefresh: false,
        // 玩法类型
        tradeType: store.getters.getCurrentTradeType(query.tradeType),
        // 页面显示模块 1.待购买 2.待支付 3.待处理 4.购买成功 5.购买失败
        pageModule: -1,
        // 存款货币列表
        accountList: [],
        // 当前选中货币账户
        accountInfo: {},
        // 当前选择的购买货币
        currency: '',
        // 是否显示账户下拉菜单
        currencyShowMenu: false,
        // 当前汇兑支付通道
        paymentInfo: '',
        // 支付货币列表
        paymentCurrencyList: [],
        // 当前选择的支付货币
        paymentCurrency: '',
        // 是否显示支付货币下拉菜单
        paymentShowMenu: false,
        // 链名称列表
        chainList: [],
        // 当前选择的链名称
        chainName: '',
        // 是否显示链名称下拉菜单
        chainShowMenu: false,
        // 购买数量
        amount: '',
        // 购买币种手续费
        buyCurrencyFee: '',
        // 预计支付数量
        expectedAmount: '',
        // 支付币种手续费
        payCurrencyFee: '',
        // 存款汇率配置数据
        rateConfig: {},
        // 购买/支付汇率
        rateNum: '',
        // 是否正在提交中
        isSubmit: false,
        // 存款提案创建成功返回的数据
        despositResult: {
            data: '{}'
        },
        // 订单结果
        orderResult: {},
        // 补充资料
        appendVis: false,
        appendMap: {},
        paramsExtens: {},
        // 最后一次输入项 buy:购买 payment:支付
        lastInputType: '',
        // 存款时间列表
        timeList: [],
        // 是否显示存款时间弹窗
        timeShow: false,
        // 是否存款时间提示
        showTimeTip: false
    })

    // 重置页面数据
    const reset = () => {
        clearInterval(timer.value)
        state.pageModule = 1
        state.accountList = []
        state.accountInfo = {}
        state.currency = ''
        state.paymentCurrencyList = []
        state.paymentCurrency = ''
        state.rateConfig = {}
        state.rateNum = ''
        state.appendMap = {}
        state.paramsExtens = {}
        state.isSubmit = false
        state.lastInputType = ''
        state.timeList = []
        state.showTimeTip = false
        resetInput()
    }

    // 重置输入内容
    const resetInput = () => {
        state.amount = ''
        state.expectedAmount = ''
        state.buyCurrencyFee = ''
        state.payCurrencyFee = ''
    }

    // 设置账户币种列表
    const setAccountList = () => {
        const accountList = customerInfo.value.accountList.filter(el => Number(el.tradeType) === Number(state.tradeType))
        const data = state.paymentInfo.limitConfigList
        const result = []
        accountList.map(account => {
            data.map(item => {
                const el = Object.assign({}, item)
                if (account.currency === el.accountCurrency) {
                    // 设置购买数量限制
                    if (Number(el.feeType === 1)) {
                        el.singleLowAmount = minus(el.singleLowAmount, el.fee)
                        el.singleHighAmount = minus(el.singleHighAmount, el.fee)
                    } else {
                        el.singleLowAmount = mul(el.singleLowAmount, (1 - el.fee))
                        el.singleHighAmount = mul(el.singleHighAmount, (1 - el.fee))
                    }
                    result.push({
                        ...account,
                        ...el
                    })
                }
            })
        })
        // 设置默认选择币种
        let accountInfo = {}
        if (query.accountId && query.currency) {
            accountInfo = result.find(el => el.currency === query.currency) || {}
        }
        if (result.length > 0 && isEmpty(accountInfo)) {
            accountInfo = result[0]
        } else {
            Toast.clear()
            state.pageModule = 1
        }
        state.accountList = result
        state.currency = accountInfo.currency
    }

    // 设置支付货币列表
    const setPaymentList = () => {
        if (!state.currency) return
        const paymentInfo = state.paymentInfo
        // 设置支付币种列表数据
        const arr = paymentInfo.paymentCurrency.split(',')
        const result = []
        arr.map(el => {
            result.push({ currency: el })
        })
        if (result.length > 0) {
            state.paymentCurrencyList = result
            state.paymentCurrency = result[0].currency
        } else {
            state.paymentCurrencyList = []
            state.paymentCurrency = ''
        }
    }

    // 获取币种链名称列表数据
    const getChainList = () => {
        const result = []
        getListByParentCode({ parentCode: 'USDT' }).then(res => {
            if (res.check() && res.data.length > 0) {
                res.data.forEach(item => {
                    result.push({ currency: item.code, ...item })
                })
                state.chainList = result
                state.chainName = result[0].code
            } else {
                state.chainList = []
                state.chainName = ''
            }
        })
    }

    // 获取购买/支付货币对汇率
    const getDepositExchangeRate = async () => {
        Toast.loading({
            message: t('common.loading'),
            forbidClick: true,
            duration: 0
        })
        const param = {
            customerNo: customerInfo.value.customerNo,
            tradeType: state.tradeType,
            accountId: state.accountInfo.accountId,
            accountCurrency: state.accountInfo.currency,
            paymentCurrency: state.paymentCurrency
        }
        if (state.paymentInfo.paymentCode === 'opspay') {
            param.channelCode = state.paymentInfo.paymentCode
        }
        queryDepositExchangeRate(param).then(res => {
            if (res.check()) {
                Toast.clear()
                const rateConfig = res.data
                let value = rateConfig.formulaSymbol === 'multiply' ? mul(1, rateConfig.exchangeRate) : divide(1, rateConfig.exchangeRate)
                value = toFixed(value, buyCurrencyDigits.value)
                state.rateConfig = rateConfig
                state.rateNum = value
            } else {
                state.rateConfig = {}
                state.rateNum = ''
                Toast(res.msg)
            }
        }).catch(() => {
            Toast.clear()
        })
    }

    // 通道存款时间验证
    const checkDepositTime = () => {
        const openTime = state.paymentInfo.openTime
        if (!isEmpty(openTime)) {
            const todayStr = window.dayjs().format('YYYY-MM-DD')
            const tomorrowStr = window.dayjs().add(1, 'day')
            const timeList = []
            const [start, end] = openTime.split('-')
            const startLocal = window.dayjs.utc(`${todayStr} ${start}`).local()
            const endLocal = window.dayjs.utc(`${todayStr} ${end}`).local()

            if ((startLocal.isAfter(todayStr, 'day') && endLocal.isAfter(todayStr, 'day')) || (startLocal.isBefore(tomorrowStr, 'day') && endLocal.isBefore(tomorrowStr, 'day'))) {
                timeList.push(startLocal.format('HH:mm') + '-' + endLocal.format('HH:mm'))
            } else if (endLocal.format('HH:mm') === '00:00') {
                timeList.push(startLocal.format('HH:mm') + '-24:00')
            } else {
                timeList.push(startLocal.format('HH:mm') + '-23:59')
                timeList.push('00:00-' + endLocal.format('HH:mm'))
            }

            // 判断当前时间是否在设置的存款时间内
            const nowDate = window.dayjs.utc()
            const nowMinutes = nowDate.hour() * 60 + nowDate.minute() // 获取当前天的分钟数
            const startMinutes = parseFloat(start.split(':')[0]) * 60 + parseFloat(start.split(':')[1]) // 计算开始时间的分钟数
            const endMinutes = parseFloat(end.split(':')[0]) * 60 + parseFloat(end.split(':')[1]) // 计算结束时间的分钟数
            const isDialog = !(nowMinutes >= startMinutes && nowMinutes <= endMinutes)
            if (isDialog) {
                // 显示存款时间弹窗
                Toast.clear()
                state.timeList = timeList
                state.timeShow = true
                state.showTimeTip = true
            }
        } else {
            // 显示存款时间弹窗
            Toast.clear()
            state.timeShow = true
            state.showTimeTip = true
        }
    }

    // 控制购买货币下拉菜单
    const toggleBuyMenu = () => {
        state.currencyShowMenu = !state.currencyShowMenu
        state.paymentShowMenu = false
        state.chainShowMenu = false
    }

    // 控制支付货币下拉菜单
    const togglePaymentMenu = () => {
        state.paymentShowMenu = !state.paymentShowMenu
        state.currencyShowMenu = false
        state.chainShowMenu = false
    }

    // 控制链名称下拉菜单
    const toggleChainMenu = () => {
        state.chainShowMenu = !state.chainShowMenu
        state.paymentShowMenu = false
        state.currencyShowMenu = false
    }

    // 计算手续费 (手续费需要用购买数量来计算)
    const calculateFee = (value) => {
        // feeType  1：固定金额手续费 2：百分比手续费
        let buyCurrencyFee = ''
        if (Number(state.accountInfo.feeType === 1)) {
            buyCurrencyFee = state.accountInfo.fee
        } else if (Number(state.accountInfo.feeType === 2)) {
            buyCurrencyFee = divide(mul(value, (state.accountInfo.fee)), minus(1 - state.accountInfo.fee))
        } else {
            buyCurrencyFee = 0
        }

        state.buyCurrencyFee = toFixed(buyCurrencyFee, buyCurrencyDigits.value)
        state.payCurrencyFee = toFixed(mul(buyCurrencyFee, state.rateNum), paymentCurrencyDigits.value)
    }

    // 计算购买数量
    const calculateAmount = () => {
        if (isEmpty(state.expectedAmount)) {
            state.amount = ''
            resetInput()
        } else {
            // 预计支付数量转换成购买数量
            let amount = divide(state.expectedAmount, state.rateNum)
            amount = toFixed(amount, buyCurrencyDigits.value)
            // 计算手续费
            calculateFee(amount)
            // 计算购买数量
            state.amount = toFixed(parseFloat(amount) - parseFloat(state.buyCurrencyFee), buyCurrencyDigits.value)
        }
    }

    // 计算预计支付数量 (预计支付数量 = (购买数量 + 购买数量的手续费) * 汇率)
    const calculateExpectedAmount = () => {
        if (isEmpty(state.amount)) {
            state.expectedAmount = ''
            resetInput()
        } else {
            // 计算手续费
            calculateFee(state.amount)
            // 计算预计支付数量
            const amount = parseFloat(state.amount) + parseFloat(state.buyCurrencyFee)
            let value = mul(amount, state.rateNum)
            value = toFixed(value, paymentCurrencyDigits.value)
            state.expectedAmount = value
        }
    }

    // 输入购买数量
    const inputAmount = (event) => {
        if (getDecimalNum(state.amount) > buyCurrencyDigits.value) {
            state.amount = retainDecimal(state.amount, buyCurrencyDigits.value)
        }
        state.lastInputType = 'buy'
        calculateExpectedAmount()
    }

    // 输入支付数量
    const inputExpectedAmount = (event) => {
        state.lastInputType = 'payment'
        calculateAmount()
    }

    // 清空输入框的值
    const clearInput = () => {
        resetInput()
    }

    // 点击刷新
    const onRefresh = () => {
        if (state.isRefresh) return
        state.isRefresh = true
        queryDepositResult().then(() => {
            setTimeout(() => {
                state.isRefresh = false
            }, 2000)
        })
    }

    // 补充资料是否全部填写完成
    const checkAllComplete = () => {
        let flag = true
        const extend = state.paymentInfo.extend
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
        const extend = state.paymentInfo.extend
        for (const key in extend) {
            if (Object.hasOwnProperty.call(extend, key)) {
                const element = extend[key]
                if (isEmpty(state.appendMap[key]?.value)) {
                    return Toast(t('deposit.allInputRequire'))
                }
                if (!isEmpty(element.regex)) {
                    const valueReg = new RegExp(element.regex)
                    if (!valueReg.test(state.appendMap[key]?.value)) {
                        return Toast(`${extend[key][state.lang]}` + t('register.incorrectlyFormed'))
                    }
                }
                state.paramsExtens[key] = state.appendMap[key]?.value
            }
        }
        state.appendVis = false
        // 创建提案
        handleDeposit()
    }

    // 创建提案
    const handleDeposit = () => {
        // 判断按钮是否可点击
        if (!isNext.value || state.isSubmit) return
        // 判断是否需要填写补充资料
        if (!checkAllComplete()) {
            state.appendVis = true
            return
        }

        // 设置请求参数
        state.isSubmit = true
        const callbackUrl = window.isPC ? '' : window.location.href + '&isCallback=true'
        const params = {
            tradeType: state.tradeType,
            accountId: state.accountInfo.accountId,
            depositRateSerialNo: state.rateConfig.depositRateSerialNo,
            paymentCurrency: state.paymentCurrency,
            accountCurrency: state.currency,
            exchangeRate: state.rateConfig.exchangeRate,
            paymentChannelCode: state.paymentInfo.paymentCode,
            paymentChannelType: state.paymentInfo.paymentType,
            paymentMerchantNo: state.paymentInfo.merchantNo,
            paymentChannelClientType: 'mobile',
            channelCode: customerInfo.value.utmSource,
            depositFrom: 'H5',
            callbackUrl,
            blockchainName: state.chainName
        }
        // 设置购买或者支付数量
        if (state.lastInputType === 'buy') {
            params.depositAmount = plus(state.amount, state.buyCurrencyFee)
        } else {
            params.thirdAmount = state.expectedAmount
        }
        // 补充资料数据
        if (!isEmpty(state.paramsExtens)) {
            params.extend = JSON.stringify(state.paramsExtens)
        }

        // 发起api请求
        handleDesposit(params).then(res => {
            state.isSubmit = false
            if (res.check()) {
                state.despositResult = res.data
                despositSuccess()
            } else {
                Toast(res.msg)
            }
        }).catch(err => {
            state.isSubmit = false
        })
    }

    // 存款提案创建成功
    const despositSuccess = () => {
        const despositResult = state.despositResult
        localSet('proposalNo', despositResult.proposalNo)
        localSet('paymentId', state.paymentInfo.id)
        // 更新充值记录数据
        updateRecord()
        // 设置页面模块显示成待支付
        state.pageModule = 2
        // 定时查询订单结果
        timingQueryDepositResult()

        // 提交表单
        if (despositResult.submitType === 'post_data') {
            setTimeout(() => {
                document.getElementById('payForm').submit()
            }, 200)
        } else {
            setTimeout(() => {
                // 打开新页面
                if (window.isPC) {
                    window.open(despositResult.browserOpenUrl)
                } else {
                    // 跳转到新页面
                    window.location.href = despositResult.browserOpenUrl
                }
            }, 200)
        }
    }

    // 定时查询订单结果
    const timingQueryDepositResult = () => {
        const proposalNo = localGet('proposalNo')
        let num = 0
        if (proposalNo) {
            queryDepositResult()
            clearInterval(timer.value)
            timer.value = setInterval(() => {
                num += timeSecond
                // 10分钟后关闭定时器
                if (10 * 60 * 1000 < num) {
                    clearInterval(timer.value)
                } else {
                    queryDepositResult()
                }
            }, timeSecond)
        } else {
            state.pageModule = 1
        }
    }

    // 查询订单结果
    const queryDepositResult = () => {
        return new Promise(resolve => {
            const proposalNo = localGet('proposalNo')
            if (proposalNo) {
                const params = {
                    proposalNo,
                    tradeType: state.tradeType,
                    accountId: state.accountInfo.accountId
                }
                queryDepositProposal(params).then(res => {
                    const checkStatus = res.data.checkStatus
                    const paymentStatus = res.data.paymentStatus
                    state.orderResult = res.data
                    // 优先判断提案状态再判断支付状态
                    if (checkStatus === 2) {
                        // 购买成功
                        state.pageModule = 4
                    } else if (checkStatus === 3) {
                        // 购买失败
                        state.pageModule = 5
                    } else {
                        // 待支付
                        if (paymentStatus === 1) {
                            state.pageModule = 2
                        } else if (paymentStatus === 2) {
                            // 支付成功待处理
                            state.pageModule = 3
                        } else {
                            // 购买失败
                            state.pageModule = 5
                        }
                    }
                    resolve()
                }).catch(() => {
                    resolve()
                })
            } else {
                resolve()
            }
        })
    }

    // 打开客服页面
    const goService = () => {
        if (onlineService) window.open(onlineService)
    }

    // 跳转到资产页面
    const goAssets = () => {
        router.replace({ name: 'Assets' })
    }

    // 初始化数据
    const initData = () => {
        // 重置页面数据
        reset()
        nextTick(() => {
            // 通道存款时间验证
            checkDepositTime()
            // 设置账户币种列表
            setAccountList()
            // 设置支付货币列表
            setPaymentList()
            // 设置补充资料信息
            state.appendMap = state.paymentInfo.extend
        })
    }

    // 监听页面模块
    watch(() => state.pageModule, () => {
        if (state.pageModule === 4 || state.pageModule === 5) {
            clearInterval(timer.value)
            localRemove('proposalNo')
        }
    })

    // 监听当前支付通道
    watch(() => paymentInfo.value, () => {
        if (rechargeType.value === 2) {
            state.paymentInfo = paymentInfo.value
            // 初始化数据
            initData()
        }
    }, { immediate: true })

    // 监听购买货币
    watch(() => state.currency, () => {
        if (state.currency) {
            updateRecord(state.currency)
        }
    })

    // 监听支付货币
    watch(() => state.paymentCurrency, () => {
        // 支付币种为USDT获取链名称列表
        if (state.paymentCurrency === 'USDT') {
            // 获取币种链名称列表数据
            getChainList()
        } else {
            state.chainList = []
            state.chainName = ''
        }
    })

    // 监听购买/支付货币
    watchEffect(() => {
        if (state.currency && state.paymentCurrency) {
            state.accountInfo = state.accountList.find(el => el.currency === state.currency) || {}
            state.amount = ''
            state.expectedAmount = ''
            resetInput()
            // 获取购买/支付货币对汇率
            getDepositExchangeRate()
        }
    })

    onMounted(() => {
        // 定时查询订单结果
        if (!window.isPC && query.isCallback) {
            timingQueryDepositResult()
        } else {
            state.pageModule = 1
        }
    })

    onUnmounted(() => {
        // 清除定时器
        clearInterval(timer.value)
    })

    return {
        state,
        style,
        buyPlaceholder,
        showBuyTip,
        isNext,
        onlineService,
        businessConfig,
        toggleBuyMenu,
        togglePaymentMenu,
        toggleChainMenu,
        clearInput,
        inputAmount,
        inputExpectedAmount,
        handleDeposit,
        queryDepositResult,
        goService,
        goAssets,
        onRefresh,
        handleAppendField,
        timingQueryDepositResult
    }
}

// 直充
export function useDirect () {
    const store = useStore()
    const route = useRoute()
    const { query } = route
    const { t } = useI18n({ useScope: 'global' })

    // 客户信息
    const customerInfo = computed(() => store.state._user.customerInfo)
    // 当前充值方式
    const rechargeType = inject('rechargeType')
    // 当前选择的支付通道
    const paymentInfo = inject('paymentInfo')
    // 更新充值记录数据
    const updateRecord = inject('updateRecord')
    // 二维码对象
    const qrCode = ref(null)
    // 复制节点ref
    const copy = ref('')
    // state
    const state = reactive({
        // 玩法类型
        tradeType: store.getters.getCurrentTradeType(query.tradeType),
        // 当前选中币中账户
        accountInfo: '',
        // 当前选择的购买货币
        currency: '',
        // 是否显示账户下拉菜单
        currencyShowMenu: false,
        // 当前直充支付通道
        paymentInfo: '',
        // 存款币种列表
        accountList: '',
        // 是否显示支付币种下拉菜单
        paymentShowMenu: false,
        // 链名称列表
        chainList: [],
        // 当前选中链名称
        chainName: '',
        // 充值地址
        address: '',
        // 是否可获取地址
        isGet: true,
        // 是否正在加载地址
        loadAddress: false,
        // 存款时间列表
        timeList: [],
        // 是否显示存款时间弹窗
        timeShow: false,
        // 是否存款时间提示
        showTimeTip: false,
        // 是否显示地址弹窗
        addressShow: false
    })

    // 设置账户币种列表
    const setAccountList = () => {
        const accountList = customerInfo.value.accountList.filter(el => Number(el.tradeType) === Number(state.tradeType))
        const data = state.paymentInfo.limitConfigList
        const result = []
        accountList.map(account => {
            data.map(el => {
                if (account.currency === el.accountCurrency) {
                    result.push({
                        ...account,
                        ...el
                    })
                }
            })
        })
        // 设置默认选择币种
        let accountInfo = {}
        if (query.accountId && query.currency) {
            accountInfo = result.find(el => el.currency === query.currency) || {}
        }
        if (result.length > 0 && isEmpty(accountInfo)) {
            accountInfo = result[0]
        } else {
            Toast.clear()
        }
        state.accountList = result
        state.currency = accountInfo.currency
    }

    // 通道存款时间验证
    const checkDepositTime = () => {
        const openTime = state.paymentInfo.openTime
        if (!isEmpty(openTime)) {
            const todayStr = window.dayjs().format('YYYY-MM-DD')
            const tomorrowStr = window.dayjs().add(1, 'day')
            const timeList = []
            const [start, end] = openTime.split('-')
            const startLocal = window.dayjs.utc(`${todayStr} ${start}`).local()
            const endLocal = window.dayjs.utc(`${todayStr} ${end}`).local()

            if ((startLocal.isAfter(todayStr, 'day') && endLocal.isAfter(todayStr, 'day')) || (startLocal.isBefore(tomorrowStr, 'day') && endLocal.isBefore(tomorrowStr, 'day'))) {
                timeList.push(startLocal.format('HH:mm') + '-' + endLocal.format('HH:mm'))
            } else if (endLocal.format('HH:mm') === '00:00') {
                timeList.push(startLocal.format('HH:mm') + '-24:00')
            } else {
                timeList.push(startLocal.format('HH:mm') + '-23:59')
                timeList.push('00:00-' + endLocal.format('HH:mm'))
            }

            // 判断当前时间是否在设置的存款时间内
            const nowDate = window.dayjs.utc()
            const nowMinutes = nowDate.hour() * 60 + nowDate.minute() // 获取当前天的分钟数
            const startMinutes = parseFloat(start.split(':')[0]) * 60 + parseFloat(start.split(':')[1]) // 计算开始时间的分钟数
            const endMinutes = parseFloat(end.split(':')[0]) * 60 + parseFloat(end.split(':')[1]) // 计算结束时间的分钟数
            const isDialog = !(nowMinutes >= startMinutes && nowMinutes <= endMinutes)
            if (isDialog) {
                // 显示存款时间弹窗
                Toast.clear()
                state.timeList = timeList
                state.timeShow = true
                state.showTimeTip = true
            }
        } else {
            // 显示存款时间弹窗
            Toast.clear()
            state.timeShow = true
            state.showTimeTip = true
        }
    }

    // 获取直充支付通道支持币种信息
    const getChainInfo = () => {
        Toast.loading({
            message: t('common.loading'),
            forbidClick: true,
            duration: 0
        })
        getCryptoBlockchainInfo({
            currency: state.currency,
            paymentCode: state.paymentInfo.paymentCode
        }).then(res => {
            if (res.check()) {
                const arr = []
                res.data.blockchainList.map(el => {
                    arr.push({ currency: el })
                })
                if (arr.length > 0) {
                    state.chainList = arr
                    state.chainName = arr[0].currency
                } else {
                    state.chainList = []
                    state.chainName = ''
                    state.address = ''
                }
            } else {
                state.chainList = []
                state.chainName = ''
                state.address = ''
            }
        }).catch(() => {
            Toast.clear()
            state.chainList = []
            state.address = ''
        })
    }

    // 获取直充支付钱包地址
    const getRechargeAddress = () => {
        if (state.isGet) {
            Toast.loading({
                message: t('common.loading'),
                forbidClick: true,
                duration: 0
            })
            state.isGet = false
            state.loadAddress = true
            const params = {
                accountCurrency: state.currency,
                blockchainName: state.chainName,
                paymentChannelClientType: 'mobile',
                paymentChannelCode: state.paymentInfo.paymentCode,
                paymentChannelType: state.paymentInfo.paymentType,
                paymentMerchantNo: state.paymentInfo.merchantNo
            }
            getBindRechargeAddress(params).then(res => {
                Toast.clear()
                state.isGet = true
                state.loadAddress = false
                if (res.check()) {
                    Toast.clear()
                    state.address = res.data.address
                    creatQrCode()
                } else {
                    state.address = ''
                }
            }).catch(() => {
                Toast.clear()
                state.isGet = true
                state.loadAddress = false
                state.address = ''
            })
        }
    }

    // 申请绑定直充支付钱包地址
    const applyBindAddress = () => {
        if (isEmpty(state.chainName)) return Toast('Select network')
        if (state.isGet) {
            Toast.loading({
                message: t('common.loading'),
                forbidClick: true,
                duration: 0
            })
            state.isGet = false
            const params = {
                accountCurrency: state.currency,
                blockchainName: state.chainName,
                paymentChannelClientType: 'mobile',
                paymentChannelCode: state.paymentInfo.paymentCode,
                paymentChannelType: state.paymentInfo.paymentType,
                paymentMerchantNo: state.paymentInfo.merchantNo
            }
            applyRechargeBindAddress(params).then(res => {
                state.isGet = true
                if (res.check()) {
                    Toast.clear()
                    state.address = res.data.address
                    creatQrCode()
                    state.addressShow = true
                }
            }).catch(() => {
                Toast.clear()
                state.isGet = true
            })
        }
    }

    // 复制地址
    const copyAddress = () => {
        const clipboard = new Clipboard(copy.value)
        clipboard.on('success', e => {
            Toast(t('common.copySuccess'))
            // 释放内存
            clipboard.destroy()
        })
    }

    // 创建二维码
    const creatQrCode = () => {
        setTimeout(() => {
            if (qrCode.value) qrCode.value.innerHTML = ''
            new QRCode(qrCode.value, {
                text: state.address,
                width: 150,
                height: 150,
                colorDark: localGet('invertColor') === 'light' ? '#000000' : '#ffffff',
                colorLight: localGet('invertColor') === 'light' ? '#ffffff' : '#000000',
                correctLevel: QRCode.CorrectLevel.H
            })
        }, 100)
    }

    // 控制购买货币下拉菜单
    const toggleBuyMenu = () => {
        state.currencyShowMenu = !state.currencyShowMenu
        state.paymentShowMenu = false
    }

    // 控制支付货币下拉菜单
    const togglePaymentMenu = () => {
        state.paymentShowMenu = !state.paymentShowMenu
        state.currencyShowMenu = false
    }

    // 初始化
    const initData = () => {
        state.accountList = []
        state.accountInfo = {}
        state.currency = ''
        state.paymentCurrencyList = []
        state.paymentCurrency = ''
        // 设置账户币种列表
        setAccountList()
        // 通道存款时间验证
        checkDepositTime()
    }

    // 监听当前支付通道
    watch(() => paymentInfo.value, () => {
        if (rechargeType.value === 1) {
            state.paymentInfo = paymentInfo.value
            // 初始化
            initData()
        }
    }, { immediate: true })

    // 监听购买货币
    watch(() => state.currency, () => {
        // 设置当前账户信息
        state.accountInfo = state.accountList.find(el => el.currency === state.currency)
        // 获取直充支付通道支持币种信息
        getChainInfo()
        // 更新充值列表数据
        if (state.currency) {
            updateRecord(state.currency)
        }
    }, { immediate: true })

    // 监听购买货币、链名称
    watch(() => [state.currency, state.chainName], () => {
        // 获取直充支付钱包地址
        if (state.currency && state.chainName) {
            getRechargeAddress()
        }
    }, { immediate: true })

    return {
        state,
        qrCode,
        copy,
        copyAddress,
        getRechargeAddress,
        applyBindAddress,
        toggleBuyMenu,
        togglePaymentMenu
    }
}

// 说明弹窗
export function showExplain (message) {
    Dialog.alert({
        message
    })
}

// 处理存款状态文案
export function handleDepositState (row) {
    const { t } = useI18n({ useScope: 'global' })
    const { checkStatus, paymentStatus } = row
    if (checkStatus === 2) {
        return t('deposit.paySuccess')
    } else if (checkStatus === 3) {
        return t('deposit.payFail')
    } else {
        if (paymentStatus === 1) {
            return t('deposit.tobePay')
        } else if (paymentStatus === 2) {
            return t('deposit.tobeProcessed')
        } else {
            return t('deposit.payFail')
        }
    }
}
