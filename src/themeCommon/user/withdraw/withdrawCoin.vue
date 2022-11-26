<template>
    <div class='container'>
        <!-- 加载中组件 -->
        <Loading :show='loading' />
        <!-- 头部导航 -->
        <Top
            back
            left-icon='arrow-left'
            :right-action='rightAction'
            :show-center='true'
            @rightClick='rightClick'
        />
        <div class='empty'></div>
        <div class='module-form'>
            <div class='select' @click='openCoinKind'>
                <label>{{ $t('withdrawCoin.coinName') }}</label>
                <div class='option'>
                    <input v-model='coinKind' :placeholder="$t('withdrawCoin.coinPlaceholder')" readonly type='text' />
                    <van-icon name='arrow-down' />
                </div>
            </div>
            <div class='select' @click='openChainName'>
                <label>{{ $t('withdrawCoin.chainName') }}</label>
                <div class='option'>
                    <input v-model='chainName' :placeholder="$t('withdrawCoin.chainPlaceholder')" readonly type='text' />
                    <van-icon name='arrow-down' />
                </div>
            </div>
            <div class='block'>
                <div class='title'>
                    <span>{{ $t('withdrawCoin.coinCount') }}</span>
                </div>
                <div class='handle'>
                    <input v-model='coinCount' :placeholder="$t('withdrawCoin.coinCountPlaceholder')" type='number' @change='changeAmount' @input='changeAmount' />
                    <button @click='onAllTake'>
                        {{ $t('withdrawCoin.allBtn') }}
                    </button>
                </div>
                <p class='may'>
                    <span>{{ $t('withdrawCoin.can') }} </span>
                    <strong v-if='showCanMoney'>
                        {{ coinTotal }} {{ coinKind }}-{{ chainName }}
                    </strong>
                </p>
            </div>
            <div class='case'>
                <p class='row'>
                    <label class='name'>
                        {{ $t('withdrawCoin.service') }}
                    </label>
                    <span class='value'>
                        {{ serviceCount }} {{ coinKind }}
                        <span v-if='chainName'>
                            -{{ chainName }}
                        </span>
                    </span>
                </p>
                <p class='row'>
                    <label class='name'>
                        {{ $t('withdrawCoin.predict') }}
                    </label>
                    <span class='value'>
                        {{ arriveCount }} {{ coinKind }}
                        <span v-if='chainName'>
                            -{{ chainName }}
                        </span>
                    </span>
                </p>
                <p class='row'>
                    <label class='name'>
                        {{ $t('withdrawCoin.minus') }}
                    </label>
                    <span class='value'>
                        {{ minusCount }}  {{ accountCurrency.currency }}
                    </span>
                </p>
            </div>
        </div>
        <div class='empty'></div>
        <div class='module-wallet'>
            <p class='title'>
                {{ $t('withdrawCoin.walletSelect') }}
            </p>
            <p class='hint'>
                {{ $t('withdrawCoin.walletHint') }}
            </p>
            <!-- 有钱包地址 -->
            <div v-if='currentWallet' class='wallet-address' @click='openWalletSelect'>
                <div class='info'>
                    <p class='row'>
                        <span class='name'>
                            {{ currentWallet.currency }}-{{ currentWallet.chainName }}
                        </span>
                        <span v-if='currentWallet.remark' class='tag'>
                            {{ currentWallet.remark }}
                        </span>
                    </p>
                    <p class='code'>
                        {{ currentWallet.address }}
                    </p>
                </div>
                <van-icon color='#333' name='arrow-down' />
            </div>
            <!-- 无钱包地址 -->
            <div v-else class='wallet-not' @click='goWalletAdd'>
                <van-icon :color='$style.color' name='plus' />
                <span>{{ $t('withdrawCoin.walletAdd') }}</span>
            </div>
        </div>
    </div>
    <van-button class='footer-btn' @click='onConfirm'>
        <span>{{ $t('withdraw.confirm') }}</span>
    </van-button>

    <!-- 提币币种弹窗 -->
    <van-action-sheet v-model:show='coinKindVisible' :actions='coinKindList' @select='selectCoinKind' />

    <!-- 链名称弹窗 -->
    <van-action-sheet v-model:show='chainNameVisible' :actions='chainNameList' @select='selectChainName' />

    <!-- 取款时间弹窗 -->
    <van-dialog v-model:show='timeShow' :confirm-button-text="$t('common.sure')" :title="$t('withdraw.hint')">
        <div class='time-wrap'>
            <h4>
                {{ $t('withdraw.timeHint') }}
            </h4><br />
            <div v-if='timeList.length > 0' class='flex'>
                <p v-if='timeList.length > 0'>
                    {{ $t('withdraw.timeName') }}：
                </p>
                <div class='time-text'>
                    <p v-for='(item,index) in timeList' :key='index'>
                        {{ item.weekDay }}：{{ item.openTimeLocal.toString() }}
                    </p><br />
                </div>
            </div>
        </div>
    </van-dialog>

    <!-- 提交成功弹窗 -->
    <van-dialog v-model:show='withdrawSuccess' class-name='add-success' :confirm-button-text="$t('common.sure')" :show-cancel-button='false' @confirm='$router.push("/assets")'>
        <i class='icon_success'></i>
        <p class='title'>
            {{ $t('withdraw.successText') }}
        </p>
        <p class='content'>
            {{ $t('withdraw.coinSuccessMsg') }}
        </p>
    </van-dialog>

    <!-- 选择钱包地址弹窗 -->
    <van-action-sheet v-model:show='walletSelectVisible' class='wallet-select' :round='false' :title="$t('withdrawCoin.walletSelect')">
        <van-radio-group v-model='walletId' @change='selectWallet'>
            <div class='wallet-list'>
                <div v-for='item in addressList' :key='item.id' class='item'>
                    <div class='info'>
                        <p class='row'>
                            <span class='name'>
                                {{ item.currency }}-{{ item.chainName }}
                            </span>
                            <span v-if='item.remark' class='tag'>
                                {{ item.remark }}
                            </span>
                        </p>
                        <p class='code'>
                            {{ item.address }}
                        </p>
                    </div>
                    <van-radio checked-color='#53C51A' :name='item.id' />
                </div>
            </div>
        </van-radio-group>
        <div class='add-handle' @click='goWalletAdd'>
            <van-icon :color='$style.color' name='plus' />
            <span>{{ $t('withdrawCoin.walletAdd') }}</span>
            <van-icon :color='$style.color' name='arrow' />
        </div>
    </van-action-sheet>

    <DialogFundPwd v-model:show='fundPwdVis' @confirmWithdraw='confirmWithdraw' />
</template>

<script>
// components
import Top from '@/components/top'
// vue
import { reactive, toRefs, computed, onMounted, watch } from 'vue'
// router
import { useRouter, useRoute } from 'vue-router'
// vuex
import { useStore } from 'vuex'
// vant
import { Toast, Dialog } from 'vant'
// i18n
import { useI18n } from 'vue-i18n'
// api
import {
    getWithdrawCurrencyList,
    queryWithdrawConfig,
    checkKycApply,
    getWalletAddressList,
    handleWithdraw,
    queryWithdrawRate,
    queryWithdrawLimitInfo,
    computeWithdrawFee
} from '@api/user'
// 工具方法
import { isEmpty, debounce } from '@/utils/util'
import DialogFundPwd from '@/themeCommon/components/dialogFundPwd'
import md5 from 'js-md5'

export default {
    components: {
        Top, DialogFundPwd
    },
    setup (props) {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { currency, accountId, tradeType, currentTab } = route.query
        const state = reactive({
            // 加载状态
            loading: true,
            // 头部导航栏右侧
            rightAction: {
                title: t('withdraw.moneyRecordText'),
                path: '/withdrawRecord?withdrawType=2'
            },
            // 是否显示可提金额
            showCanMoney: false,
            // 取款限制配置
            withdrawConfig: null,
            // 取款汇率配置
            withdrawRate: null,
            // 最高可提币数量
            singleHighAmount: 0,
            // 最低可提币数量
            singleLowAmount: 0,
            // 提币链名称数据列表
            allList: [],
            // 提币币种选项列表
            coinKindList: [],
            // 链名称列表
            chainNameList: [],
            // 提币币种
            coinKind: '',
            // 是否显示提币币种选项弹窗
            coinKindVisible: false,
            // 链名称
            chainName: '',
            // 是否显示链名称选项弹窗
            chainNameVisible: false,
            // 全部提币数量
            coinTotal: '',
            // 提币数量
            coinCount: '',
            // 手续费
            serviceCount: '0.00',
            // 预计到账
            arriveCount: '0.00',
            // 账户减扣
            minusCount: '0.00',
            // 是否显示取款时间弹窗
            timeShow: false,
            // 处理后的时区
            withdrawTimeConfigMap: {},
            // 是否显示提交成功弹窗
            withdrawSuccess: false,
            // 是否显示钱包地址选择弹窗
            walletSelectVisible: false,
            // 钱包地址列表
            addressList: [],
            // 当前选择的钱包
            currentWallet: null,
            // 当前选择钱包地址id
            walletId: 0,
            fundPwdVis: false,
            fundPwd: '',
            googleCode: ''
        })

        // 数据初始化
        const init = () => {
            state.showCanMoney = false
            state.coinTotal = ''
            state.coinCount = ''
            state.serviceCount = '0.00'
            state.arriveCount = '0.00'
            state.minusCount = '0.00'
        }

        // 账户信息
        const { value: customInfo } = computed(() => store.state._user.customerInfo)

        // 客服信息
        const onlineServices = computed(() => store.state._base.wpCompanyInfo?.onlineService)

        // 账户币种
        const { value: accountCurrency } = computed(() => store.state._user.customerInfo.accountList.find(el => el.accountId === Number(accountId)))
        console.log('currency', currency)
        console.log('accountCurrency', accountCurrency)
        // 导航栏右侧标题点击跳转
        const rightClick = () => {
            router.push(state.rightAction.path)
        }

        // 周数据
        const weekdayMap = {
            1: t('weekdayMap.1'),
            2: t('weekdayMap.2'),
            3: t('weekdayMap.3'),
            4: t('weekdayMap.4'),
            5: t('weekdayMap.5'),
            6: t('weekdayMap.6'),
            7: t('weekdayMap.7')
        }

        // 取款时间
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

        // 获取取款手续费
        const getWithdrawFee = debounce(() => {
            const coinTotal = parseFloat(state.coinTotal)
            const coinCount = parseFloat(state.coinCount)
            if (!state.coinKind) {
                return Toast(t('withdrawCoin.coinPlaceholder'))
            }
            if (!state.chainName) {
                return Toast(t('withdrawCoin.chainPlaceholder'))
            }
            if (state.coinCount === '') return
            if (coinCount < state.singleLowAmount) {
                return Toast({ message: `${t('withdrawCoin.hint_4')}${state.singleLowAmount}` })
            }
            if (coinCount > state.singleHighAmount) {
                return Toast({ message: `${t('withdrawCoin.hint_5')}${state.singleHighAmount}` })
            }
            if (coinCount > coinTotal) {
                return Toast(t('withdrawCoin.hint_1'))
            }

            const item = {
                ...params,
                amount: state.coinCount.toString(),
                withdrawType: 2,
                withdrawCurrency: state.coinKind,
                blockchainName: state.chainName,
                withdrawRateSerialNo: state.withdrawRate.withdrawRateSerialNo
            }
            computeWithdrawFee(item).then(res => {
                if (res.check()) {
                    const { data } = res
                    state.serviceCount = data.coinFee
                    state.arriveCount = data.coinFinalAmount
                    state.minusCount = data.amount
                }
            })
        }, 1000)

        watch(
            () => state.coinCount,
            (newval) => {
                getWithdrawFee()
            },
            { immediate: true }
        )

        // 改变提币数量
        const changeAmount = () => {
            // 获取取款手续费
            // getWithdrawFee()
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

        // 获取资金密码
        const confirmWithdraw = (val) => {
            state.fundPwd = val[0]
            state.googleCode = val[1] ? val[1] : ''
            // 发起提现
            launchHandleWithdraw()
        }

        // 请求参数
        const params = {
            customerNo: customInfo.customerNo,
            accountId,
            tradeType,
            withdrawType: 2,
            accountCurrency: accountCurrency.currency,
            customerGroupId: customInfo.customerGroupId,
            country: customInfo.country,
            withdrawMethod: currentTab
        }

        // 获取取款限制配置
        const getWithdrawConfig = () => {
            queryWithdrawConfig({
                ...params,
                withdrawCurrency: state.coinKind,
                blockchainName: state.chainName,
                tradeType
            }).then(res => {
                if (res.check()) {
                    const { data } = res
                    state.withdrawConfig = data
                    if (!data.customerGroupEnable) {
                        state.loading = false
                        return Dialog.confirm({
                            title: t('withdraw.hint'),

                            message: t('withdraw.withdrawLimitHint'),
                            confirmButtonText: t('withdraw.contact'),
                            cancelButtonText: t('withdraw.close')
                        }).then(() => {
                            if (onlineServices.value) { location.href = onlineServices.value }
                        }).catch(() => {})
                    } else {
                        // 检测取款是否需要kyc
                        checkKyc()
                    }

                    // 时区转换
                    transferUtc()
                } else {
                    state.loading = false
                }
            })
        }

        // 检测取款是否需要kyc
        const checkKyc = () => {
            checkKycApply({
                businessCode: 'withdraw',
                openAccountType: customInfo.openAccountType
            }).then(res => {
                state.loading = false
                const withdrawConfig = state.withdrawConfig
                if (Number(res.data) !== 2) {
                    return Dialog.alert({
                        title: t('withdraw.hint'),

                        confirmButtonText: Number(res.data) === 1 ? t('withdraw.kycBtn_1') : t('withdraw.kycBtn_2'),
                        message: Number(res.data) === 2 ? t('withdraw.kycMsg_1') : t('withdraw.kycMsg_2'),
                    }).then(() => {
                        router.replace({
                            name: 'Authentication',
                            query: { businessCode: 'withdraw' }
                        })
                    })
                } else {
                    if (!withdrawConfig.accountActiveEnable) {
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
                        }).catch(() => {})
                    }
                    if (!withdrawConfig.timeEnable) {
                        state.timeShow = true
                        return
                    }
                    if (!withdrawConfig.amountEnable) {
                        return Toast(t('withdrawCoin.hint_1'))
                    }
                    if (!withdrawConfig.hourIn24Enable) {
                        return Toast(t('withdrawCoin.hint_2') + withdrawConfig.withdrawBaseConfig.maxCount + t('withdrawCoin.unit'))
                    }
                }
            })
        }

        // 获取客户提币币种和链名称
        const queryWithdrawCurrencyList = (resolve) => {
            getWithdrawCurrencyList({
                companyId: customInfo.companyId,
                customerNo: customInfo.customerNo,
                customerGroupId: customInfo.customerGroupId,
                accountId,
                tradeType,
                accountCurrency: accountCurrency.currency,
                country: customInfo.country,
                withdrawMethod: currentTab
            }).then(res => {
                if (res.check()) {
                    const { data } = res
                    const coinKindList = []
                    if (data.length > 0) {
                        data.map(elem => {
                            if (!coinKindList.some(v => v.name === elem.withdrawCurrency) && elem.withdrawCurrency === currency) {
                                coinKindList.push({ name: elem.withdrawCurrency })
                            }
                        })

                        state.allList = data
                        state.coinKind = coinKindList[0].name
                        state.coinKindList = coinKindList
                        // 根据提币币种获取筛选链名称
                        filterChainName()
                    }
                    resolve(res)
                }
            })
        }

        // 根据提币币种获取筛选链名称
        const filterChainName = () => {
            const chainNameList = []
            const arr = state.allList.filter(v => v.withdrawCurrency === state.coinKind && v.withdrawCurrency === currency)
            arr.map(elem => {
                chainNameList.push({ name: elem.blockchainName })
            })
            state.chainName = chainNameList[0].name
            state.chainNameList = chainNameList

            // 获取钱包地址列表
            getWalletAddress()
        }

        // 提币币种弹窗
        const openCoinKind = () => {
            state.coinKindVisible = true
        }

        // 点击选择提币币种
        const selectCoinKind = (item) => {
            state.coinKind = item.name
            state.chainName = ''
            state.coinKindVisible = false
            // 初据初始化
            init()
            // 根据提币币种获取筛选链名称
            filterChainName()
        }

        // 链名称弹窗
        const openChainName = () => {
            state.chainNameVisible = true
        }

        // 点击选择链名称
        const selectChainName = (item) => {
            state.chainNameVisible = false
            if (state.chainName !== item.name) {
                state.chainName = item.name
                getWalletAddress()
                getWithdrawRate()
                getWithdrawConfig()
                getWithdrawFee()
            }
        }

        // 获取取款汇率
        const getWithdrawRate = () => {
            queryWithdrawRate({
                // companyId: customInfo.companyId,
                // customerNo: customInfo.customerNo,
                accountId,
                tradeType,
                accountCurrency: accountCurrency.currency,
                withdrawCurrency: state.coinKind,
                withdrawType: 2
            }).then(res => {
                if (res.check()) {
                    state.withdrawRate = res.data
                    // 获取取款、提币额度限制配置
                    getWithdrawLimitInfo()
                }
            })
        }

        // 获取取款、提币额度限制配置
        const getWithdrawLimitInfo = () => {
            queryWithdrawLimitInfo({
                ...params,
                withdrawRateSerialNo: state.withdrawRate.withdrawRateSerialNo,
                withdrawCurrency: state.coinKind,
                blockchainName: state.chainName,

            }).then(res => {
                if (res.check()) {
                    const { data } = res
                    state.coinTotal = data.withdrawAmount
                    state.singleHighAmount = data.singleHighAmount
                    state.singleLowAmount = data.singleLowAmount
                    state.showCanMoney = true
                }
            })
        }

        // 点击全部取出
        const onAllTake = () => {
            state.coinCount = state.coinTotal
            getWithdrawFee()
        }

        // 获取钱包地址列表
        const getWalletAddress = () => {
            if (!state.coinKind || !state.chainName) {
                state.addressList = []
                state.currentWallet = null
                state.walletId = 0
                return
            }
            getWalletAddressList({
                currency: state.coinKind,
                chainName: state.chainName
            }).then(res => {
                const { data } = res
                state.loading = false
                state.addressList = data
                // 设置当前地址
                const item = data[0]
                state.currentWallet = item || null
                state.walletId = item ? item.id : 0
            })
        }

        // 跳转到新增钱包地址页面
        const goWalletAdd = () => {
            state.walletSelectVisible = false
            router.push({ path: '/walletAdd', query: { tradeType, accountId } })
        }

        // 钱包地址弹窗
        const openWalletSelect = () => {
            state.walletSelectVisible = true
        }

        // 选择钱包
        const selectWallet = (value) => {
            state.walletId = value
            state.currentWallet = state.addressList.find(v => v.id === value)
            state.walletSelectVisible = false
        }

        // 点击确定
        const onConfirm = () => {
            const coinCount = parseFloat(state.coinCount)
            const amountDigitsLength = coinCount.toString().split('.')[1] ? coinCount.toString().split('.')[1].length : 0
            if (!state.coinKind) {
                return Toast({ message: t('withdrawCoin.coinPlaceholder') })
            }

            if (!state.chainName) {
                return Toast({ message: t('withdrawCoin.chainPlaceholder') })
            }
            if (!state.coinCount) {
                return Toast({ message: t('withdrawCoin.coinCountPlaceholder') })
            }
            if (amountDigitsLength > accountCurrency.digits) {
                return Toast(t('withdraw.withdrawDigitsTip'))
            }
            if (coinCount < state.singleLowAmount) {
                return Toast({ message: `${t('withdrawCoin.hint_4')}${state.singleLowAmount}` })
            }
            if (coinCount > state.singleHighAmount) {
                return Toast({ message: `${t('withdrawCoin.hint_5')}${state.singleHighAmount}` })
            }
            if (!state.currentWallet) {
                return Toast({ message: t('withdrawCoin.walletSelect') })
            }

            // 判断资金密码
            state.fundPwdVis = true
        }

        // 发起提现
        const launchHandleWithdraw = () => {
            state.loading = true
            const item = {
                ...params,
                amount: state.coinCount,
                withdrawCoinAmount: state.coinCount,
                rate: state.withdrawRate.exchangeRate,
                withdrawRateSerialNo: state.withdrawRate.withdrawRateSerialNo,
                bankAccountName: '',
                bankName: '数字钱包',
                bankCardNo: state.currentWallet.address,
                withdrawType: 2,
                withdrawCurrency: state.coinKind,
                blockchainName: state.chainName,
                fundPwd: md5(state.fundPwd),
                googleCode: state.googleCode
            }
            handleWithdraw(item).then(res => {
                state.loading = false
                if (res.check()) {
                    state.withdrawSuccess = true
                } else {
                    state.serviceCount = ''
                    state.arriveCount = ''
                    state.minusCount = ''
                }
            })
        }

        onMounted(() => {
            new Promise((resolve, reject) => {
                // 获取客户提币币种和链名称
                queryWithdrawCurrencyList(resolve)
            }).then((res) => {
                // 获取配置信息
                getWithdrawRate()
                // 获取取款限制配置
                getWithdrawConfig()
            })
            store.commit('_user/Update_account', accountId)
        })

        return {
            ...toRefs(state),
            rightClick,
            customInfo,
            openCoinKind,
            selectCoinKind,
            openChainName,
            selectChainName,
            timeList,
            changeAmount,
            onAllTake,
            goWalletAdd,
            openWalletSelect,
            selectWallet,
            onConfirm,
            accountCurrency,
            confirmWithdraw
        }
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.container {
    flex: 1;
    overflow-y: auto;
    .empty {
        height: rem(20px);
        background-color: var(--bgColor);
    }
}
.module-form {
    background-color: var(--contentColor);
    .select {
        display: flex;
        align-items: center;
        height: rem(90px);
        padding: 0 rem(30px);
        color: var(--color);
        font-size: rem(28px);
        border-bottom: 1px solid var(--lineColor);
        .option {
            display: inline-flex;
            flex: 1;
            align-items: center;
            justify-content: flex-end;
            height: 100%;
            input {
                flex: 1;
                height: 100%;
                margin: 0 rem(20px);
                text-align: right;
            }
        }
    }
    .block {
        padding: 0 rem(30px);
        .title {
            display: flex;
            align-items: center;
            height: rem(84px);
            color: var(--color);
            font-size: rem(28px);
        }
        .handle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: rem(100px);
            color: var(--color);
            border-bottom: 1px solid var(--lineColor);
            input {
                width: rem(500px);
                height: 100%;
                font-size: rem(56px);
            }
            ::placeholder {
                font-size: rem(28px);
            }
            button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: rem(168px);
                height: rem(60px);
                font-size: rem(24px);
                line-height: rem(60px);
                background: none;
                border: 1px solid var(--lineColor);
                border-radius: rem(30px);
            }
        }
        .may {
            display: flex;
            margin-top: rem(10px);
            font-size: rem(24px);
            span {
                display: inline-flex;
                align-items: center;
                margin-right: rem(8px);
                color: var(--color);
            }
            strong {
                display: inline-flex;
                align-items: center;
                color: var(--focusColor);
            }
        }
    }
    .case {
        padding: rem(15px) rem(30px);
        color: var(--minorColor);
        font-size: rem(24px);
        .row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: rem(50px);
            .name {
                display: inline-flex;
                align-items: center;
                span {
                    margin-right: rem(3px);
                }
            }
            .value {
                display: inline-flex;
            }
        }
    }
}
.module-wallet {
    padding: rem(30px);
    background-color: var(--contentColor);
    .title {
        color: var(--color);
        font-size: rem(28px);
    }
    .hint {
        margin-top: rem(14px);
        color: var(--focusColor);
        font-size: rem(20px);
    }
    // 无钱包地址
    .wallet-not {
        display: flex;
        align-items: center;
        height: rem(120px);
        margin-top: rem(28px);
        padding: 0 rem(30px);
        border: 1px solid var(--lineColor);
        border-radius: rem(4px);
        :deep(.van-icon-plus) {
            margin-right: rem(26px);
            font-weight: bold;
        }
        span {
            color: var(--color);
            font-size: rem(28px);
        }
    }
    // 有钱包地址
    .wallet-address {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: rem(120px);
        margin-top: rem(28px);
        padding: 0 rem(30px);
        border: 1px solid var(--lineColor);
        border-radius: rem(4px);
        .info {
            flex: 1;
            .row {
                display: flex;
                align-items: center;
                .name {
                    margin-right: rem(15px);
                    color: var(--color);
                    font-size: rem(30px);
                }
                .tag {
                    padding: rem(9px) rem(7px);
                    color: #3894FF;
                    font-size: rem(20px);
                    background-color: #EEF6FE;
                    border-radius: rem(4px);
                }
            }
            .code {
                margin-top: rem(10px);
                color: var(--color);
                font-size: rem(24px);
            }
        }
        :deep(.van-icon-arrow-down) {
            margin-right: rem(-2px);
            font-weight: bold;
        }
    }
}
.wallet-select {
    .wallet-list {
        padding: 0 rem(30px);
        .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: rem(116px);
            border-bottom: 1px solid var(--lineColor);
            &:nth-of-type(1) {
                border-top: 1px solid var(--lineColor);
            }
            .info {
                flex: 1;
                .row {
                    display: flex;
                    align-items: center;
                    .name {
                        margin-right: rem(15px);
                        color: var(--color);
                        font-size: rem(30px);
                    }
                    .tag {
                        padding: rem(9px) rem(7px);
                        color: #3894FF;
                        font-size: rem(20px);
                        background-color: #EEF6FE;
                        border-radius: rem(4px);
                    }
                }
                .code {
                    margin-top: rem(10px);
                    color: var(--color);
                    font-size: rem(24px);
                }
            }
        }
    }
    .add-handle {
        display: flex;
        align-items: center;
        height: rem(116px);
        padding: 0 rem(30px);
        :deep(.van-icon-plus) {
            margin-right: rem(26px);
            font-weight: bold;
        }
        span {
            flex: 1;
            color: var(--color);
            font-size: rem(28px);
        }
    }
}
.footer-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: rem(104px);
    background-color: var(--contentColor);
    border-top: 1px solid var(--lineColor);
    span {
        margin-left: rem(15px);
        color: var(--color);
        font-weight: bold;
        font-size: rem(30px);
        letter-spacing: 1px;
    }
}
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
    .flex {
        display: flex;
        .time-text {
            flex: 1;
        }
    }
}
</style>
