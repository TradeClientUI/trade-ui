<template>
    <el-form
        ref='formRef'
        label-position='top'
        label-width='auto'
        :model='form'
        :rules='rules'
        :size='size'
        @submit.native.prevent
    >
        <h4 class='tip'>
            {{ $t('businessKYC.inputTip') }}
        </h4>
        <p class='title'>
            {{ $t('businessKYC.accountInfo') }}
        </p>
        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item :label='$t("businessKYC.companyName")' prop='accountInfo.companyName'>
                    <el-input v-model='form.accountInfo.companyName' />
                </el-form-item>
            </el-col>
            <el-col :offset='0' prop='regNo' :span='12'>
                <el-form-item :label='$t("businessKYC.regNo")' prop='accountInfo.regNo'>
                    <el-input v-model='form.accountInfo.regNo' />
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item :label='$t("businessKYC.registration")' prop='accountInfo.createTime'>
                    <el-date-picker
                        v-model='form.accountInfo.createTime'
                        :placeholder="$t('common.select')+$t('businessKYC.registration')"
                        style='width: 100%;'
                        type='date'
                        value-format='x'
                    />
                </el-form-item>
            </el-col>
            <el-col :offset='0' :span='12'>
                <el-row :gutter='20'>
                    <el-col :span='10'>
                        <el-form-item :label='$t("businessKYC.area")' prop='accountInfo.area'>
                            <el-select
                                v-model='form.accountInfo.area'
                                :placeholder='$t("common.select")'
                            >
                                <el-option
                                    v-for='item in countryList'
                                    :key='item.code'
                                    :label='item.name'
                                    :value='item.code'
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col prop='phone' :span='14'>
                        <el-form-item :label='$t("businessKYC.contact")' prop='accountInfo.phone'>
                            <el-input v-model='form.accountInfo.phone' type='number' />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item :label='$t("businessKYC.source")' prop='accountInfo.resource'>
                    <el-input v-model='form.accountInfo.resource' />
                </el-form-item>
            </el-col>
            <el-col :offset='0' :span='12'>
                <el-form-item :label='$t("businessKYC.nature")' prop='accountInfo.nature'>
                    <el-select
                        v-model='form.accountInfo.nature'
                        :placeholder="$t('common.select') + $t('businessKYC.nature')"
                        @change='changeNature'
                    >
                        <el-option v-for='item in businessNature' :key='item.code' :label='item.displayName' :value='item.code' />
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item :label='$t("businessKYC.reason")' prop='accountInfo.reason'>
                    <el-input v-model='form.accountInfo.reason' type='textarea' />
                </el-form-item>
            </el-col>
        </el-row>
        <p class='title'>
            {{ $t("businessKYC.regAddr") }}
        </p>
        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item :label='$t("businessKYC.country")' prop='regAddress.regCountry'>
                    <el-select
                        v-model='form.regAddress.regCountry'
                        :placeholder="$t('common.select') + $t('businessKYC.country')"
                        @change='selectRegCountry'
                    >
                        <el-option
                            v-for='item in countryList'
                            :key='item.countryCode'
                            :label='item.name'
                            :value='item.countryCode'
                        />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :offset='0' :span='12'>
                <el-form-item :label='$t("businessKYC.city")' prop='regAddress.regCity'>
                    <el-input v-model='form.regAddress.regCity' />
                </el-form-item>
            </el-col>
        </el-row>

        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item :label='$t("businessKYC.street")' prop='regAddress.regStreet'>
                    <el-input v-model='form.regAddress.regStreet' />
                </el-form-item>
            </el-col>
        </el-row>

        <p class='title'>
            {{ $t('businessKYC.operatingAddr') }}
        </p>
        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item :label='$t("businessKYC.country")' prop='opertion.opertionCountry'>
                    <el-select
                        v-model='form.opertion.opertionCountry'
                        :placeholder="$t('common.select') + $t('businessKYC.country')"
                        @change='selectOperCountry'
                    >
                        <el-option
                            v-for='item in countryList'
                            :key='item.countryCode'
                            :label='item.name'
                            :value='item.countryCode'
                        />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :offset='0' :span='12'>
                <el-form-item :label='$t("businessKYC.city")' prop='opertion.opertionCity'>
                    <el-input v-model='form.opertion.opertionCity' />
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item :label='$t("businessKYC.street")' prop='opertion.opertionStreet'>
                    <el-input v-model='form.opertion.opertionStreet' />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
import { reactive, ref, computed, unref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { upload, getListByParentCode, getCountryListByParentCode } from '@/api/base'
import { isEmpty } from '@/utils/util'

export default {
    props: {
        formData: {
            type: Object,
            require: true
        },
    },
    setup (props, context) {
        const store = useStore()
        const { t, locale } = useI18n({ useScope: 'global' })
        const businessNature = ref([])
        const formRef = ref(null)
        const state = reactive({
            form: {
                accountInfo: {
                    companyName: '',
                    regNo: '',
                    createTime: '',
                    area: '',
                    phone: '',
                    resource: '',
                    nature: '',
                    natureName: '',
                    reason: '',
                },
                regAddress: {
                    regCountry: '',
                    regCountryName: '',
                    regCity: '',
                    regStreet: '',
                },
                opertion: {
                    opertionCountry: '',
                    opertionCountryName: '',
                    opertionCity: '',
                    opertionStreet: ''
                }
            },
            countryList: [],
            rules: {
                accountInfo: {
                    companyName: [
                        { type: 'string', required: true, message: t('common.input') + t('businessKYC.companyName'), trigger: 'blur' },

                    ],
                    regNo: [
                        { required: true, message: t('common.input') + t('businessKYC.regNo'), trigger: 'blur' },

                    ],
                    createTime: [
                        { required: true, message: t('common.select') + t('businessKYC.registration'), trigger: 'change' },

                    ],
                    area: [
                        { required: true, message: t('common.select') + t('businessKYC.area'), trigger: 'change' },

                    ],
                    phone: [
                        { required: true, message: t('common.input') + t('businessKYC.contact'), trigger: 'blur' },
                    ],
                    resource: [
                        { required: true, message: t('common.input') + t('businessKYC.source'), trigger: 'blur' },

                    ],
                    nature: [
                        { required: true, message: t('common.select') + t('businessKYC.nature'), trigger: 'change' },

                    ],
                    reason: [
                        { required: true, message: t('common.input') + t('businessKYC.reason'), trigger: 'blur' },

                    ],
                },
                regAddress: {
                    regCountry: [
                        { required: true, message: t('common.select') + t('businessKYC.country'), trigger: 'change' },

                    ],
                    regCity: [
                        { required: true, message: t('common.input') + t('businessKYC.city'), trigger: 'blur' },

                    ],
                    regStreet: [
                        { required: true, message: t('common.input') + t('businessKYC.street'), trigger: 'blur' },

                    ],
                },
                opertion: {
                    opertionCountry: [
                        { required: true, message: t('common.select') + t('businessKYC.street'), trigger: 'change' },

                    ],
                    opertionCity: [
                        { required: true, message: t('common.input') + t('businessKYC.street'), trigger: 'blur' },

                    ],
                    opertionStreet: [
                        { required: true, message: t('common.input') + t('businessKYC.street'), trigger: 'blur' },

                    ]
                }

            }
            // rules: {
            //     accountInfo: {
            //         type: 'object',
            //         required: true,
            //         fields: {
            //             companyName: [
            //                 { type: 'string', required: true, message: '请输入公司名称', trigger: 'blur' },

            //             ],
            //
            //         }

            //     }
            // }
        })

        watch(
            () => props.formData, (val) => {
                if (!isEmpty(val)) {
                    state.form = val
                }
            }, {
                immediate: true
            }
        )

        // 获取业务性质
        const getBusinessNature = () => {
            getListByParentCode({ parentCode: 'Business_Nature' }).then(res => {
                if (res.check()) {
                    businessNature.value = res.data
                }
            }).catch(res => {

            })
        }

        // 业务性质选择事件
        const changeNature = val => {
            state.form.accountInfo.natureName = businessNature.value.find(el => el.code === val).displayName
        }

        const getAllCountry = () => {
            getCountryListByParentCode({ parentCode: '-1' }).then(res => {
                if (res.check()) {
                    if (res.data.length > 0) {
                        const tempArr = []
                        res.data.forEach(item => {
                            const lable = item.name + ' (' + item.countryCode + ')'
                            const value = item.countryCode
                            if (item.code !== 'other') {
                                tempArr.push({
                                    name: lable,
                                    code: value,
                                    countryCode: item.code,
                                    countryName: item.name,
                                })
                            }
                        })
                        state.countryList = tempArr
                    }
                }
            })
        }

        // 注册国家选择
        const selectRegCountry = val => {
            state.form.regAddress.regCountryName = state.countryList.find(el => el.countryCode === val)?.countryName
        }

        const selectOperCountry = val => {
            state.form.opertion.opertionCountryName = state.countryList.find(el => el.countryCode === val)?.countryName
        }

        getBusinessNature()

        // 获取国家列表
        getAllCountry()

        return {
            ...toRefs(state),
            businessNature,
            formRef,
            changeNature,
            selectRegCountry,
            selectOperCountry
        }
    }
}

</script>
