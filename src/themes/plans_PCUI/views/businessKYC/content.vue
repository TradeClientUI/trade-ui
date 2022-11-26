<template>
    <router-view />
    <div v-loading='loading' class='page-wrap'>
        <el-steps :active='active' align-center finish-status='success'>
            <el-step v-for='item in authList' :key='item' :title='authMap[item]' />
        </el-steps>

        <basicInfo v-if='active === 0' ref='basicInfoRef' :form-data='formDataMap[currentCode]' :form-data1='formData' />
        <uploadFiles v-if='active === 1' ref='uploadFilesRef' :form-data='formDataMap[currentCode]' :form-data1='formData' />
        <certDirector v-if='active === 2' ref='certDirectorRef' :form-data='formDataMap[currentCode]' :form-data1='formData' />
        <beneficiary v-if='active === 3' ref='beneficiaryRef' :form-data='formDataMap[currentCode]' :form-data1='formData' />
        <accountHold
            v-if='active === 4'
            ref='accountHoldRef'
            :dialog-vis='dialogVis'
            :form-data='formDataMap[currentCode]'
            @update:dialogVis='updateDialogVis'
            @update:mainAccount='mainAccountState'
        />
        <info v-if='active === 5' @update:protocol='updateProtocol' />
        <div class='oper-wrap'>
            <el-button style='margin-top: 12px;' @click='prev'>
                {{ $t("businessKYC.prev") }}
            </el-button>
            <el-button v-if='draftVis' style='margin-top: 12px;' @click='save(false,true)'>
                {{ $t("businessKYC.saveDraft") }}
            </el-button>

            <el-button v-if='active === 5' :disabled='nextBtnDisabled' style='margin-top: 12px;' type='primary' @click='save(true,true)'>
                {{ $t("common.submit") }}
            </el-button>
            <el-button v-else style='margin-top: 12px;' type='primary' @click='next'>
                {{ $t("businessKYC.next") }}
            </el-button>
        </div>
    </div>
</template>

<script>
import { ElIcon, ElMessage, ElMessageBox } from 'element-plus'
import { computed, reactive, ref, toRefs, unref, watchEffect, watch } from 'vue'
import basicInfo from './components/basicInfo.vue'
import uploadFiles from './components/uploadFiles.vue'
import certDirector from './components/certDirector.vue'
import beneficiary from './components/beneficiary.vue'
import accountHold from './components/accountHold.vue'
import info from './components/info.vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import Schema from 'async-validator'

import { findAllLevelKyc, kycLevelApply, kycApply, findAllBizKycList } from '@/api/user'
import { isEmpty } from '@/utils/util'

export default {
    components: {
        basicInfo, uploadFiles, certDirector, beneficiary, accountHold, info
    },
    setup (props, context) {
        const { t, locale } = useI18n({ useScope: 'global' })
        const router = useRouter()
        const route = useRoute()

        const basicInfoRef = ref(null)
        const uploadFilesRef = ref(null)
        const certDirectorRef = ref(null)
        const beneficiaryRef = ref(null)
        const accountHoldRef = ref(null)

        // const authMap = [
        //     'company_basic_info', 'company_upload_file', 'company_auth_director', 'company_auth_owner', 'company_account_owner'
        // ]
        const authMap = {
            'company_basic_info': t('businessKYC.basicInfo'), // 企业认证-基础信息
            'company_upload_file': t('businessKYC.upload'), // 企业认证-上传文件
            'company_auth_director': t('businessKYC.directors'), // 企业认证-认证董事
            'company_auth_owner': t('businessKYC.verify'), // 企业认证-认证最终收益拥有人
            'company_account_owner': t('businessKYC.traders'), // 企业认证-账户持有人/交易员
        }
        const { elementCode, selectCountry, levelCode, selectCompanyType, index } = route.query

        const state = reactive({
            active: Number(index) || 0,
            dialogVis: false,
            nextBtnDisabled: false,
            draftVis: true,
            accountHoldVis: false, // 用户点击状态，根据此状态判断是否进入下一步
            authList: elementCode.split(','), // 需要认证的步骤
            loading: false,
            formData: [], // 认证表单数据
            alreadyUpload: false, // 账户持有人是否已上传
            formDataMap: {}
        })

        if (elementCode.split(',').length > 0) {
            const elementCodeList = elementCode.split(',')
            elementCodeList.forEach(el => { state.formDataMap[el] = {} })
        }

        // 当前认证code
        const currentCode = computed(() => state.authList[state.active])
        // 当前步骤组件
        const currentComp = computed(() => {
            if (currentCode.value === 'company_basic_info') {
                return basicInfoRef
            } else if (currentCode.value === 'company_upload_file') {
                return uploadFilesRef
            } else if (currentCode.value === 'company_auth_director') {
                return certDirectorRef
            } else if (currentCode.value === 'company_auth_owner') {
                return beneficiaryRef
            } else if (currentCode.value === 'company_account_owner') {
                return accountHoldRef
            }
            return null
        })

        const mainAccountVis = computed(() => {
            // 判断“账户持有人步骤”的主账户持有人是否有值

            const mainAccount = state.formDataMap['company_account_owner']?.mainAccount
            return mainAccount
        })

        // 读取已保存的kyc信息
        const getKycData = () => {
            findAllLevelKyc({
                levelCode,
                selectCountry,
                selectCompanyType,
                openAccountType: 1
            }).then(res => {
                // loading.value = false
                if (res.check()) {
                    if (res.data.length > 0) {
                        // state.formData = res.data[0].elementList
                        const elementList = res.data[0].elementList
                        if (elementList.length > 0) {
                            elementList.forEach(el => {
                                state.formDataMap[el.elementCode] = JSON.parse(el.elementValue)
                            })
                        }

                        console.log('form-data', state.formData)
                    }
                }
            }).catch(err => {
                // loading.value = false
            })
        }

        watchEffect(() => {
            if (mainAccountVis.value) {
                state.accountHoldVis = true
            } else {
                state.accountHoldVis = false
            }
        })

        // watch(() => state.active, val => {
        //     getKycData()
        // }, {
        //     immediate: true
        // })

        // 保存和提交
        const save = (commitTag = false, showToast = true) => {
            // console.log('currentComp====', unref([currentComp.value]))

            const elementList = []
            // if (commitTag) {
            if (isEmpty(state.formDataMap[currentCode.value]) && currentCode.value) {
                state.formDataMap[currentCode.value] = currentComp.value.value?.form
            }

            for (const key in state.formDataMap) {
                if (Object.hasOwnProperty.call(state.formDataMap, key)) {
                    const element = state.formDataMap[key]
                    if (!isEmpty(element)) {
                        elementList.push({
                            elementCode: key,
                            elementValue: JSON.stringify(element)
                        })
                    }
                }
            }

            state.loading = true

            kycLevelApply({
                selectCountry,
                levelCode,
                openAccountType: 1,
                selectCompanyType,
                commitTag,
                elementList
            }).then(res => {
                state.loading = false
                if (res.check()) {
                    if (commitTag) {
                        ElMessageBox.alert(t('businessKYC.commited'), t('common.submitSuccess'), {
                            confirmButtonText: 'OK',
                            callback: (action) => {
                                router.replace('/businessKYC')
                            },
                        })
                    } else {
                        if (showToast) {
                            ElMessage({
                                message: t('businessKYC.draftSaved'),
                                type: 'success',
                            })
                        }
                    }
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // 信息确认页面按钮状态
        const infoButtonState = () => {
            if (state.active === state.authList.length) {
                state.nextBtnDisabled = true
                state.draftVis = false
            }
        }
        // 账户持有人上传回调
        const mainAccountState = val => {
            state.alreadyUpload = true
        }

        const next = async () => {
            if (currentComp.value) {
                state.formDataMap[currentCode.value] = currentComp.value.value?.form
                const form = currentComp.value.value.formRef
                const flag = await form.validate()
                if (!flag) {
                    return false
                }

                if (currentCode.value === 'company_account_owner' && !mainAccountVis.value && !state.alreadyUpload) {
                    state.dialogVis = true
                } else {
                    // 每点下一步，都保存一下
                    // save(false, false)
                    state.active++
                }

                infoButtonState()

                const query = { ...route.query, index: state.active }
                router.replace({ query })
            }
        }
        const prev = () => {
            if (currentComp.value) {
                state.formDataMap[currentCode.value] = currentComp.value.value?.form
            }

            if (state.active === 0) {
                return router.back()
            }
            state.active--
            state.nextBtnDisabled = false
            state.draftVis = true
            infoButtonState()
            const query = { ...route.query, index: state.active }
            router.replace({ query })
        }

        const updateDialogVis = (val) => {
            state.dialogVis = val[0]
            state.accountHoldVis = val[1]
        }

        const updateProtocol = (val) => {
            state.nextBtnDisabled = !val
        }

        infoButtonState()
        getKycData()

        return {
            save,
            prev,
            next,
            basicInfoRef,
            uploadFilesRef,
            certDirectorRef,
            beneficiaryRef,
            accountHoldRef,
            authMap,
            updateDialogVis,
            updateProtocol,
            currentCode,
            mainAccountState,
            ...toRefs(state)
        }
    }
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    width: 1200px;
    margin: rem(100px) auto;
    padding-top: rem(50px);
    background: var(--contentColor);
    border-radius: rem(10px);
    :deep(.el-steps) {
        margin: rem(100px);
        .el-step__title.is-success {
            color: var(--primary);
        }
        .el-step__head.is-success {
            color: var(--primary);
        }
        .is-success .el-step__icon.is-text {
            border-color: var(--primary);
        }
    }
    .title {
        margin: rem(50px) 0 0 0;
        padding: rem(40px) 0;
        font-weight: bold;
    }
    :deep(.el-form) {
        margin: 0 rem(20px) rem(20px) rem(20px);
        padding: 0  rem(100px) 0 rem(100px);
        border-radius: rem(10px);
        .director {
            margin-bottom: 50px;
            padding-bottom: 50px;
            border-bottom: solid 1px #DDD;
            .head {
                display: flex;
                justify-content: space-between;
            }
        }
        h3 {
            margin-bottom: rem(50px);
        }
        .el-select {
            width: 100%;
        }
        .title {
            margin: rem(50px) 0  rem(50px) 0;
            font-weight: bold;
        }
        .tip {
            color: var(--warn);
        }
        .icon-upload {
            margin: rem(60px) 0 0 0;
        }
        .el-upload__tip {
            color: var(--minorColor);
            .tips {
                line-height: rem(50px);
            }
        }
        .link {
            display: inline-block;
            width: 360px;
            overflow: hidden; // 超出隐藏
            white-space: nowrap; // 不换行
            text-overflow: ellipsis; //字体超出用省略号显示
        }
        .uploader {
            position: relative;
            box-sizing: border-box;
            width: 360px;
            height: 180px;
            overflow: hidden;
            text-align: center;
            background-color: #FFF;
            border: 1px dashed #D9D9D9;
            border-radius: 6px;
            cursor: pointer;
            .icon-upload {
                display: block;
                margin: rem(100px) auto 0;
            }
            .upload-tip {
                color: var(--primary);
            }
        }
    }
    .oper-wrap {
        padding: 0  rem(100px)  rem(100px) rem(120px);
    }
}
</style>
