<template>
    <div class='page-wrap'>
        <top left-icon='arrow-left' :menu='false' :right-action='false' :show-center='true' />
        <div class='filed-wrap'>
            <van-cell-group>
                <van-field
                    v-model.trim='countryName'
                    :label="$t('bank.bankCountry')"
                    readonly
                    required
                    right-icon='arrow-down'
                    @click='countryShow = true'
                />
                <van-field v-model.trim='firstName' :label='$t("bank.bankPersonFirstName")' :placeholder='$t("common.input") + $t("bank.bankPersonFirstName")' required />
                <van-field v-model.trim='lastName' :label='$t("bank.bankPersonLastName")' :placeholder='$t("common.input") + $t("bank.bankPersonLastName")' required />
                <!-- <van-field v-model.trim='bankNo' :label='$t("bank.bankNo")' :placeholder='$t("bank.inputBankNo")' type='number' /> -->
                <van-field v-model.trim='bankAccount' :label='$t("bank.bankAccount")' :placeholder='$t("bank.inputBankAccount")' required />
                <van-field
                    v-model.trim='bankName'
                    :label='$t("bank.bankName")'
                    :placeholder='$t("bank.inputBankName")'
                    readonly
                    required
                    right-icon='arrow-down'
                    @click='openBankDialog'
                />
                <CurrencyAction v-model='currency' v-model:show='currencyShow' class='cellRow' input-align='left' :list='currencyList' />

                <!-- <van-field
                    v-model.trim='area'
                    :label='$t("bank.openAddress")'
                    :placeholder='$t("bank.inputOpenAddressText")'
                    readonly
                    right-icon='arrow-down'
                    @click='areaShow = true'
                />
                <van-field v-model.trim='bankArea' :label='$t("bank.branchAddress")' :placeholder='$t("bank.inputBranchAddress")' /> -->
                <van-field v-model.trim='swiftCode' label='Swift Code' :placeholder='$t("bank.swiftCode")' />
                <van-field v-model.trim='otherCode' label='Other Code' :placeholder='$t("bank.otherCode")' />
            </van-cell-group>
        </div>
        <van-button block class='confirm-btn mobile_withdraw_choose_bankcard_ga' type='primary' @click='handleConfirm'>
            <span>{{ $t('common.sure') }}</span>
        </van-button>
    </div>

    <!-- 区域弹窗 -->
    <van-popup v-model:show='areaShow' position='bottom'>
        <van-picker
            ref='picker'
            :columns='provinceCities'
            @cancel='areaShow=false'
            @change='onChangeArea'
            @confirm='areaConfirm'
        />
    </van-popup>
    <!-- 国家列表弹窗 -->
    <van-action-sheet
        v-model:show='countryShow'
        :actions='countryList'
        :round='false'
        @select='countryConfirm'
    />
    <!-- 银行卡列表弹窗 -->
    <van-popup
        v-model:show='bankShow'
        class='popup-bank'
        position='right'
        :style="{ height: '100%' }"
    >
        <div v-if='(bankList.length > 0)' class='bank-list'>
            <div v-for='item in bankList' :key='item.code' class='bank-item' @click='onSelectBank(item)'>
                <van-icon class='card' name='card' />
                <span>{{ item.name }}</span>
            </div>
        </div>
        <van-empty v-else :description='$t("bank.bankCountryTip")' image='/images/empty.png' />
    </van-popup>
    <!-- 添加成功弹窗 -->
    <van-dialog
        v-model:show='addSuccessShow'
        :cancel-button-text='$t("common.cancel")'
        class-name='add-success'
        :confirm-button-text='$t("common.sure")'
        :show-cancel-button='showCancel'
        @cancel='cancel'
        @confirm='$router.back()'
    >
        <i class='icon_success'></i>
        <p class='title'>
            {{ $t('common.tip') }}
        </p>
        <p class='content'>
            {{ $t('bank.submitSuccessTips') }}
        </p>
    </van-dialog>
</template>

<script>
import { useRouter } from 'vue-router'
import top from '@/components/top'
import { reactive, toRefs, computed, ref, watch, watchEffect, onMounted } from 'vue'
import RuleFn from './addbank_rule'
import { useStore } from 'vuex'
import Schema from 'async-validator'
import { Toast } from 'vant'
import { addInternationalBank } from '@/api/user'
import { getCountryListByParentCode, getListByParentCode, getListByParentId } from '@/api/base'
import CurrencyAction from '@/components/currencyAction'
import { useI18n } from 'vue-i18n'

export default {
    components: {
        top,
        CurrencyAction
    },
    async setup (props, { emit, attrs }) {
        const router = useRouter()
        const store = useStore()
        const picker = ref(null)
        const { t } = useI18n({ useScope: 'global' })
        // 用户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        // 国家列表
        const countryList = computed(() => {
            return store.state.countryList
        })
        // 当前选择的国家名称
        const countryName = computed(() => {
            const item = countryList.value.find(el => el.code === state.countryCode)
            return item?.displayName || ''
        })
        // 国家银行卡列表数据
        const countryBanks = computed(() => store.state.bankDict)

        const state = reactive({
            countryCode: customInfo.value.country, // 当前选择的国家code
            countryShow: false, // 是否显示选择国家弹窗
            bankList: [], // 当前可选择的银行卡列表数据
            firstName: '',
            lastName: '',
            bankNo: '',
            bankName: '',
            allCurrencyList: [], // 所有国家银行卡币种列表
            currencyList: [], // 当前选择国家的银行卡币种列表
            currency: '',
            area: '',
            bankArea: '',
            areaShow: false,
            bankShow: false,
            checkedBankCode: '',
            currencyShow: false,
            addSuccessShow: false,
            showCancel: false,
            provinceCities: [],
            bankAccount: '',
            swiftCode: '',
            otherCode: ''
        })

        // 获取银行卡列表数据
        const getBankList = () => {
            const item = countryBanks.value.find(el => el.code === (state.countryCode + '_bank'))
            if (item) {
                getListByParentId({
                    parentId: item.id
                }).then(res => {
                    state.bankName = ''
                    state.checkedBankCode = ''
                    if (res.check()) {
                        state.bankList = res.data || []
                    } else {
                        state.bankList = []
                    }
                })
            } else {
                state.bankName = ''
                state.checkedBankCode = ''
                state.bankList = []
            }
        }

        // 获取所有国家银行卡币种数据
        const getCountryCurrencys = () => {
            getListByParentCode({ parentCode: 'common_currency' }).then(res => {
                if (res.check()) {
                    const { data } = res
                    if (data && data.length > 0) {
                        state.allCurrencyList = data
                    }
                }
            })
        }

        // 获取当前选择的国家银行卡币种数据
        const getCurrencyList = () => {
            const item = state.allCurrencyList.find(el => el.code === (state.countryCode + '_currency'))
            if (item) {
                getListByParentId({
                    parentId: item.id
                }).then(res => {
                    state.currencyList = res.data || []
                    if (res.data.length === 1) {
                        state.currency = res.data[0].code
                    }
                })
            } else {
                state.currencyList = []
                state.currency = ''
            }
        }

        // 获取省市区列表数据
        const getProvinceCities = async (parentCode) => {
            state.loading = true
            await getCountryListByParentCode({ parentCode }).then(res => {
                if (res.check()) {
                    if (res.data.length > 0) {
                        if (state.provinceCities.length > 0) {
                            state.provinceCities.forEach(pc => {
                                res.data.forEach(el => {
                                    if (pc.code === el.parentCode) {
                                        pc.children = res.data.map(el => { return { text: el.displayName } })
                                    }
                                })
                            })
                        } else {
                            res.data.forEach(el => {
                                state.provinceCities.push({
                                    text: el.displayName,
                                    code: el.code,
                                    children: []
                                })
                            })
                        }
                    }
                }
            })
        }

        // await getProvinceCities(customInfo.value.country)
        if (state.provinceCities.length > 0) {
            getProvinceCities(state.provinceCities[0]?.code)
        }

        const onSelectBank = (item) => {
            state.bankShow = false
            state.bankName = item.name
            state.checkedBankCode = item.code
        }

        const onSelectCurrency = (item) => {
            state.currencyShow = false
            state.currency = item.name
        }

        const onChangeArea = async (values) => {
            await getProvinceCities(values[0].code)
            const citys = state.provinceCities.find(el => el.code === values[0].code).children
            picker.value.setColumnValues(1, citys)
            // picker.value.setColumnValues(1, provinceCities[values[0]])
        }

        // 提交处理
        const handleConfirm = () => {
            // firstName账户持有人名
            // lastName账户持有人姓
            // bankAccountName账户持有人姓名
            // bankCardNumber银行卡号
            // bankCurrency银行币种
            // bankName银行名称
            // bankAddress银行开户地址
            // bankBranch银行支行
            // country国家
            // province省
            // city市
            const province = state.area.split(',')[0]
            const city = state.area.split(',')[1]
            const params = {
                firstName: state.firstName,
                lastName: state.lastName,
                bankName: state.bankName,
                bankCurrency: state.currency,
                bankCode: state.checkedBankCode,
                bankAccount: state.bankAccount,
                swiftCode: state.swiftCode,
                otherCode: state.otherCode
            }

            const validator = new Schema(RuleFn(t))

            validator.validate(params, (errors, fields) => {
                if (errors) {
                    return Toast(errors[0].message)
                }
                handleAddBank(params)
            })
        }

        // 确认选择国家
        const countryConfirm = (item) => {
            state.countryCode = item.code
            state.countryShow = false
        }

        const handleAddBank = (params) => {
            const toast = Toast.loading({
                message: t('common.loading'),
                forbidClick: true,
            })
            addInternationalBank(params).then(res => {
                toast.clear()
                if (res.check()) {
                    state.addSuccessShow = true
                }
            })
        }

        // 打开选择银行弹窗
        const openBankDialog = () => {
            if (state.bankList.length === 0) {
                return Toast(t('bank.bankCountryTip'))
            }
            state.bankShow = true
        }

        const cancel = () => {
            state.firstName = ''
            state.lastName = ''
            state.bankNo = ''
            state.currency = ''
            state.bankName = ''
            state.bankArea = ''
            state.area = ''
        }

        const areaConfirm = (val) => {
            state.areaShow = false
            state.area = val.map(el => el.text).join()
        }

        // 监听countryCode
        watchEffect(() => {
            if (state.countryCode) {
                // 获取银行卡列表数据
                if (countryBanks.value.length > 0) {
                    getBankList()
                }
                // 获取当前选择的国家银行卡币种数据
                if (state.allCurrencyList.length > 0) {
                    getCurrencyList()
                }
            }
        })

        onMounted(() => {
            // 获取国家区号
            store.dispatch('getCountryListByParentCode')
            // 获取国家银行卡列表
            store.dispatch('getBankDictList')
            // 获取所有国家银行卡币种数据
            getCountryCurrencys()
        })

        return {
            countryName,
            countryList,
            countryConfirm,
            openBankDialog,
            onSelectBank,
            onSelectCurrency,
            ...toRefs(state),
            handleConfirm,
            cancel,
            picker,
            onChangeArea,
            areaConfirm
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    flex: 1;
    background-color: var(--bgColor);
    :deep {
        .van-cell {
            font-size: rem(26px);
        }
        .van-field__label {
            width: rem(200px);
        }
    }
    .confirm-btn {
        height: rem(90px);
        position: absolute;
        bottom: 0;
        background: var(--contentColor);
        border-color: var(--lineColor);
        span {
            color: var(--color);
            font-size: rem(30px);
        }
    }
}

</style>

<style lang="scss">
@import '@/sass/mixin.scss';
.popup-bank {
    width: rem(600px);
    background-color: var(--bgColor);
    .bank-list {
        padding: rem(30px) 0;
        background-color: var(--contentColor);
        .bank-item {
            display: flex;
            align-items: center;
            height: rem(120px);
            position: relative;
            padding: 0 rem(40px);
            color: var(--color);
            font-size: rem(28px);
            text-align: left;
            &::after {
                position: absolute;
                top: 0;
                left: 0;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                width: 200%;
                height: 200%;
                border-bottom: 1px solid var(--lineColor);
                -webkit-transform: scale(0.5);
                transform: scale(0.5);
                -webkit-transform-origin: 0 0;
                transform-origin: 0 0;
                content: '';
                pointer-events: none;
            }
            .card {
                margin-top: rem(-12px);
                margin-right: rem(14px);
                color: var(--minorColor);
                font-size: rem(48px);
            }
        }
    }
    .van-empty__description {
        text-align: center;
        padding: 0 rem(60px);
        font-size: rem(26px);
    }
}
.action-sheet-area {
    .van-picker {
        background-color: var(--bgColor);
        .van-picker-column__item {
            color: var(--color);
        }
        .van-picker__toolbar {
            color: var(--color);
        }
        .van-picker__mask {
            background-image: none;
        }
    }
}
.add-success {
    padding: rem(30px) rem(30px) 0 rem(30px);
    text-align: center;
    background-color: var(--contentColor);
    .icon_success {
        color: var(--success);
        font-size: rem(96px);
    }
    .title {
        color: var(--color);
        line-height: rem(80px);
    }
    .content {
        margin: rem(20px) 0;
        color: var(--color);
        font-size: rem(28px);
    }
    .van-dialog__confirm {
        color: var(--color);
        background-color: var(--contentColor);
    }
}
</style>
