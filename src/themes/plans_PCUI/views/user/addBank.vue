<template>
    <centerViewDialog>
        <div id='addBankPage' class='page-wrap'>
            <top left-icon='arrow-left' :menu='false' :right-action='false' :show-center='true' />
            <div class='filed-wrap'>
                <van-cell-group>
                    <van-field v-model.trim='firstName' :label='$t("bank.bankPersonFirstName")' :placeholder='$t("bank.bankPersonFirstName")' />
                    <van-field v-model.trim='lastName' :label='$t("bank.bankPersonLastName")' :placeholder='$t("bank.bankPersonLastName")' />
                    <van-field v-model.trim='bankNo' :label='$t("bank.bankNo")' :placeholder='$t("bank.inputBankNo")' type='number' />
                    <van-field
                        v-model.trim='bankName'
                        class='select'
                        :label='$t("bank.bankName")'
                        :placeholder='$t("bank.inputBankName")'
                        readonly
                        right-icon='arrow-down'
                        @click='bankShow = true'
                    />
                    <!-- <van-field
                    v-model='currency'
                    label='银行卡币种'
                    placeholder='请输入银行卡币种'
                    readonly
                    right-icon='arrow-down'
                    @click='currencyShow=true'
                /> -->
                    <CurrencyAction v-model='currency' v-model:show='currencyShow' class='cellRow' input-align='left' />

                    <van-field
                        v-model.trim='area'
                        class='select'
                        :label='$t("bank.openAddress")'
                        :placeholder='$t("bank.inputOpenAddressText")'
                        readonly
                        right-icon='arrow-down'
                        @click='areaShow = true'
                    />
                    <van-field v-model.trim='bankArea' :label='$t("bank.branchAddress")' :placeholder='$t("bank.inputBranchAddress")' />
                </van-cell-group>
            </div>
            <van-button block class='confirm-btn' type='primary' @click='handleConfirm'>
                <span>{{ $t('common.sure') }}</span>
            </van-button>
            <van-popup
                v-model:show='bankShow'
                class='popup-bank'
                get-container='#addBankPage'
                position='right'
                :style="{ height: '100%' }"
            >
                <div class='bank-list'>
                    <div v-for='item in bankDict' :key='item.code' class='bank-item' @click='onSelectBank(item)'>
                        <i class='bank-icons-sm' :class="'bk-'+ item.code"></i>
                        {{ item.name }}
                    </div>
                </div>
            </van-popup>
            <van-popup
                v-model:show='areaShow'
                class='popup-area'
                get-container='#addBankPage'
                position='bottom'
            >
                <van-picker
                    ref='picker'
                    :cancel-button-text="$t('common.cancel')"
                    :columns='provinceCities'
                    :confirm-button-text="$t('common.sure')"
                    @cancel='areaCancel'
                    @change='onChangeArea'
                    @confirm='areaConfirm'
                />
            </van-popup>
            <van-dialog
                v-model:show='addSuccessShow'
                class-name='add-success'
                :confirm-button-text='$t("common.sure")'
                get-container='#addBankPage'
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
        </div>
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import { useRouter, useRoute } from 'vue-router'
import top from '@/components/top'
import { reactive, toRefs, computed, ref } from 'vue'
import RuleFn from '@/themeCommon/user/addbank_rule'
import { useStore } from 'vuex'
import Schema from 'async-validator'
import { Toast } from 'vant'
import { addBank } from '@/api/user'
import { getCountryListByParentCode } from '@/api/base'
import CurrencyAction from '@planspc/components/currencyAction'
import { useI18n } from 'vue-i18n'

export default {
    components: {
        top,
        CurrencyAction,
        centerViewDialog
    },
    async setup (props, { emit, attrs }) {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const picker = ref(null)
        const { t } = useI18n({ useScope: 'global' })
        const bankDict = computed(() => store.state.bankDict)
        const customInfo = computed(() => store.state._user.customerInfo)

        const state = reactive({
            firstName: '',
            lastName: '',
            bankNo: '',
            bankName: '',
            currency: 'USD',
            area: '',
            bankArea: '',
            areaShow: false,
            bankShow: false,
            checkedBankCode: '',
            currencyShow: false,
            addSuccessShow: false,
            showCancel: false,
            provinceCities: []
        })

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

        await getProvinceCities(customInfo.value.country)
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
                bankCardNumber: state.bankNo,
                bankName: state.bankName,
                bankCurrency: state.currency,
                bankAddress: province + city,
                bankBranch: state.bankArea,
                country: customInfo.value.country,
                province: province,
                city: city,
                bankCode: state.checkedBankCode
            }

            const validator = new Schema(RuleFn(t))

            validator.validate(params, (errors, fields) => {
                if (errors) {
                    return Toast(errors[0].message)
                }
                handleAddBank(params)
            })
        }

        const handleAddBank = (params) => {
            const toast = Toast.loading({
                message: t('common.loading'),
                forbidClick: true,
            })
            addBank(params).then(res => {
                toast.clear()
                if (res.check()) {
                    state.addSuccessShow = true
                }
            })
        }
        const handRoutTo = (path) => {
            router.push(route.path + path)
        }
        const toBankList = () => {
            handRoutTo('/bankList')
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
        const areaCancel = () => {
            state.areaShow = false
        }

        store.dispatch('getBankDictList')

        return {
            onSelectBank,
            onSelectCurrency,
            ...toRefs(state),
            handleConfirm,
            toBankList,
            bankDict,
            cancel,
            picker,
            onChangeArea,
            areaConfirm,
            areaCancel
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    position: relative;
    flex: 1;
    background-color: var(--bgColor);
    overflow: hidden;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    .filed-wrap{
        flex: 1;
        display: flex;
        flex-direction: column;
        .select, .cellRow {
            cursor: pointer;
        }
        :deep{
            .van-cell-group{
                height: 100%;
                flex: 1;
            }
        }
    }
    .confirm-btn {
        @include hover();
        position: absolute;
        bottom: 0;
        background: var(--lineColor);
        border-color: var(--lineColor);
        span {
            color: var(--color);
            font-size: rem(30px);
        }
    }
    :deep{
        .popup-bank,.popup-area{
            position: absolute !important;
        }
        .van-overlay{
            position: absolute;
        }
        .popup-area{
            right: 0;
            bottom: 0;
            width: 100%;
        }
        .van-action-sheet{
            right: 0;
            bottom: 0 ;
            width: 100%;
            position: absolute;
        }
    }

}

</style>

<style lang="scss">
@import '@/sass/mixin.scss';
.popup-bank {
    background-color: var(--bgColor);
    .bank-list {
        min-width: rem(400px);
        //min-width: 2.66667rem;
        padding: rem(30px) rem(50px) 0 rem(50px);
        overflow-y: auto;
        background-color: var(--contentColor);
        .bank-item {
            @include hover();
            position: relative;
            padding: rem(15px) 0 rem(15px) 0;
            color: var(--color);
            font-size: rem(30px);
            line-height: rem(80px);
            line-height: rem(60px);
            text-align: left;
            cursor: pointer;
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
        }
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
