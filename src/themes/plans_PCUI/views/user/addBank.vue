<template>
    <centerViewDialog>
        <div id='addBankPage' class='page-wrap'>
            <top left-icon='arrow-left' :menu='false' :right-action='false' :show-center='true' />
            <div class='filed-wrap'>
                <van-cell-group>
                    <van-field
                        v-model.trim='countryName'
                        class='select'
                        :label="$t('bank.bankCountry')"
                        readonly
                        required
                        right-icon='arrow-down'
                        @click='countryShow = true'
                    />
                    <van-field v-model.trim='firstName' :label='$t("bank.bankPersonFirstName")' :placeholder='$t("bank.bankPersonFirstName")' required />
                    <van-field v-model.trim='lastName' :label='$t("bank.bankPersonLastName")' :placeholder='$t("bank.bankPersonLastName")' required />
                    <van-field
                        v-model.trim='bankAccount'
                        :label='$t("bank.bankAccount")'
                        maxlength='32'
                        :placeholder='$t("bank.inputBankAccount")'
                        required
                    />
                    <van-field
                        v-model.trim='bankName'
                        class='select'
                        :label='$t("bank.bankName")'
                        :placeholder='$t("bank.inputBankName")'
                        readonly
                        required
                        right-icon='arrow-down'
                        @click='openBankDialog'
                    />
                    <!-- <van-field
                    v-model='currency'
                    label='银行卡币种'
                    placeholder='请输入银行卡币种'
                    readonly
                    right-icon='arrow-down'
                    @click='currencyShow=true'
                /> -->
                    <CurrencyAction v-model='currency' v-model:show='currencyShow' class='cellRow' input-align='left' :required='true' />

                    <van-field
                        v-model.trim='swiftCode'
                        label='Swift Code'
                        :placeholder='$t("bank.swiftCode")'
                    />

                    <van-field
                        v-model.trim='otherCode'
                        label='Other Code'
                        :placeholder='$t("bank.otherCode")'
                    />
                </van-cell-group>
            </div>
            <van-button block class='confirm-btn pc_withdraw_choose_bankcard_click' type='primary' @click='handleConfirm'>
                <span>{{ $t('common.sure') }}</span>
            </van-button>

            <!-- 区域弹窗 -->
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
import { reactive, toRefs, computed, ref, watchEffect, onMounted } from 'vue'
import RuleFn from '@/themeCommon/user/addbank_rule'
import { useStore } from 'vuex'
import Schema from 'async-validator'
import { Toast } from 'vant'
import { addInternationalBank } from '@/api/user'
import { getCountryListByParentCode, getListByParentId } from '@/api/base'
import CurrencyAction from '@planspc/components/currencyAction'
import { useI18n } from 'vue-i18n'
import Mitt from '@/utils/mitt'

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
            bankAccount: '',
            currency: '',
            area: '',
            bankArea: '',
            areaShow: false,
            bankShow: false,
            swiftCode: '',
            otherCode: '',
            checkedBankCode: '',
            currencyShow: false,
            addSuccessShow: false,
            showCancel: false,
            provinceCities: []
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

        // 确认选择国家
        const countryConfirm = (item) => {
            state.countryCode = item.code
            state.countryShow = false
        }

        // 打开选择银行弹窗
        const openBankDialog = () => {
            if (state.bankList.length === 0) {
                return Toast(t('bank.bankCountryTip'))
            }
            state.bankShow = true
        }

        // 选择银行卡
        const onSelectBank = (item) => {
            state.bankShow = false
            state.bankName = item.name
            state.checkedBankCode = item.code
        }

        // 提交处理
        const handleConfirm = () => {
            const params = {
                firstName: state.firstName,
                lastName: state.lastName,
                bankCurrency: state.currency,
                bankName: state.bankName,
                bankCode: state.checkedBankCode,
                swiftCode: state.swiftCode,
                otherCode: state.otherCode,
                bankAccount: state.bankAccount,
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
            addInternationalBank(params).then(res => {
                toast.clear()
                if (res.check()) {
                    Mitt.emit('RELOAD_BANKLIST')
                    state.addSuccessShow = true
                }
            })
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

        // 监听countryCode
        watchEffect(() => {
            if (state.countryCode && countryBanks.value.length > 0) {
                // 获取银行卡列表数据
                getBankList()
            }
        })

        onMounted(() => {
            // 获取国家区号
            store.dispatch('getCountryListByParentCode')
            // 获取国家银行卡列表
            store.dispatch('getBankDictList')
        })

        return {
            countryName,
            countryList,
            countryConfirm,
            openBankDialog,
            onSelectBank,
            ...toRefs(state),
            handleConfirm,
            cancel,
            picker,
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
    .filed-wrap {
        flex: 1;
        display: flex;
        flex-direction: column;
        .select,
        .cellRow {
            cursor: pointer;
        }
        .select {
            :deep(input) {
                cursor: pointer;
            }
        }
        :deep {
            .van-cell {
                font-size: rem(28px);
            }
            .van-field__label {
                width: rem(300px);
                word-break: break-word;
            }
            .van-cell-group {
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
    :deep {
        .popup-bank,
        .popup-area {
            position: absolute !important;
        }
        .van-overlay {
            position: absolute;
        }
        .popup-area {
            right: 0;
            bottom: 0;
            width: 100%;
        }
        .van-action-sheet {
            right: 0;
            bottom: 0;
            width: 100%;
            position: absolute;
        }
    }
}

</style>

<style lang="scss">
@import '@/sass/mixin.scss';
.popup-bank {
    width: rem(800px);
    background-color: var(--bgColor);
    .bank-list {
        overflow-y: auto;
        background-color: var(--contentColor);
        .bank-item {
            @include hover();
            position: relative;
            display: flex;
            align-items: center;
            height: rem(120px);
            padding: 0 rem(40px);
            color: var(--color);
            font-size: rem(30px);
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
            .card {
                margin-top: rem(-12px);
                margin-right: rem(14px);
                color: var(--minorColor);
                font-size: rem(48px);
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
