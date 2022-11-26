<template>
    <router-view />
    <div class='page-wrap'>
        <el-form
            ref='formRef'
            v-loading='loading'
            label-position='top'
            label-width='auto'
            :model='form'
            :rules='rules'
            size='default'
        >
            <h2>{{ $t("businessKYC.kyc") }}</h2>
            <el-form-item :label='$t("businessKYC.currentCountry")' prop='selectCountry'>
                <el-select
                    v-model='form.selectCountry'
                >
                    <el-option
                        v-for='item in allCountry'
                        :key='item.countryCode'
                        :label='item.name'
                        :value='item.countryCode'
                    />
                </el-select>
            </el-form-item>
            <el-form-item
                :label='$t("businessKYC.enterpriseType")'
                prop='selectCompanyType'
            >
                <el-select
                    v-model='form.selectCompanyType'
                >
                    <el-option v-for='item in businessType' :key='item.code' :label='item.displayName' :value='item.code' />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click='onSubmit'>
                    {{ $t('businessKYC.next') }}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { upload, getListByParentCode, getCountryListByParentCode, findCompanyCountry } from '@/api/base'
import { findAllLevelKyc, kycLevelApply, kycApply, findAllBizKycList } from '@/api/user'
const { t, locale } = useI18n({ useScope: 'global' })
const router = useRouter()
const route = useRoute()
const store = useStore()
const { levelCode } = route.query

const businessType = ref([])
const loading = ref(false)
const formRef = ref(null)
const allCountry = ref([])// 所有国家列表
const companyCountryList = ref([]) // 企业开户的国家

// 获取用户注册的国家
const userCountry = computed(() => store.state._user.customerInfo.country)

const form = reactive({
    selectCompanyType: '',
    selectCountry: userCountry.value
})

const rules = reactive({
    selectCountry: [
        { required: true, message: t('common.select') + t('businessKYC.currentCountry'), trigger: 'change' }
    ],
    selectCompanyType: [
        { required: true, message: t('common.select') + t('businessKYC.enterpriseType'), trigger: 'change' }
    ]
})

// 根据 levelCode 查询kyc认证元素
const onSubmit = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            loading.value = true

            findAllLevelKyc({
                levelCode,
                selectCountry: form.selectCountry,
                selectCompanyType: form.selectCompanyType,
                openAccountType: 1
            }).then(res => {
                loading.value = false
                if (res.check()) {
                    if (res.data.length > 0) {
                        const elementList = res.data[0]?.elementList
                        const elementCode = elementList?.map(el => el.elementCode)
                        router.push({
                            path: '/businessKYC/content',
                            query: {
                                elementCode: elementCode.join(),
                                levelCode,
                                selectCountry: form.selectCountry,
                                selectCompanyType: form.selectCompanyType
                            }
                        })
                    }
                }
            }).catch(err => {
                loading.value = false
            })
        } else {
            console.log('error submit')
            return false
        }
    })
}

const getAllCountry = () => {
    getCountryListByParentCode({ parentCode: '-1' }).then(res => {
        if (res.check()) {
            if (res.data.length > 0) {
                const tempArr = []
                res.data.forEach(item => {
                    const lable = item.name
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
                allCountry.value = tempArr
            }
        }
    })
}

const getBusinessType = () => {
    getListByParentCode({ parentCode: 'EnterpriseType' }).then(res => {
        if (res.check()) {
            businessType.value = res.data
        }
    }).catch(res => {

    })
}
// 获取企业类型
getBusinessType()

// 获取国家列表
getAllCountry()

// 获取
store.dispatch('_user/findAllBizKycList').then(res => {
    if (res.check() && res.data.length > 0) {
        if (res.data[0]?.companyType) {
            form.selectCompanyType = res.data[0]?.companyType
        }
    }
})

</script>

<style lang="scss" scoped>
.page-wrap {
    width: 1200px;
    height: 100%;
    margin: rem(100px) auto;
    background: var(--contentColor);
    border-radius: rem(10px);
    .el-form {
        margin: rem(50px);
        padding: rem(100px);
        border-radius: rem(10px);
        .el-select {
            width: 100%;
        }
        h2 {
            margin-bottom: rem(50px);
        }
    }
}
</style>
