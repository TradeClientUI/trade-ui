<template>
    <el-form
        ref='formRef'
        label-position='top'
        label-width='auto'
        :model='form'
        :size='size'
        @submit.native.prevent
    >
        <div v-for='(item,index) in form.list' :key='index' class='director'>
            <div class='head'>
                <h3>{{ $t('businessKYC.verify') }} {{ index+1 }}</h3>
                <el-button v-if='index>0' size='small' @click='deleteItem(index)'>
                    {{ $t('common.remove') }}
                </el-button>
            </div>

            <p class='title'>
                {{ $t('businessKYC.basicInfo') }}
            </p>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item
                        :label="$t('businessKYC.firstName')"
                        :prop='"list."+index+".lastname"'
                        :rules="{
                            required: true,
                            message: $t('common.input') + $t('businessKYC.firstName'),
                            trigger: 'blur',
                        }"
                    >
                        <el-input v-model='item.lastname' type='text' />
                    </el-form-item>
                </el-col>
                <el-col :offset='0' :span='12'>
                    <el-form-item
                        :label=' $t("businessKYC.lastName") '
                        :prop='"list."+index+".firstName"'
                        :rules="{
                            required: true,
                            message: $t('common.input') + $t('businessKYC.lastName'),
                            trigger: 'blur',
                        }"
                    >
                        <el-input v-model='item.firstName' />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item
                        :label='$t("businessKYC.birth") '
                        :prop='"list."+index+".birthDay"'
                        :rules="{
                            required: true,
                            message: $t('common.select') + $t('businessKYC.birth'),
                            trigger: 'change',
                        }"
                    >
                        <el-date-picker
                            v-model='item.birthDay'
                            :placeholder=' $t("businessKYC.birth")'
                            style='width: 100%;'
                            type='date'
                            value-format='x'
                        />
                    </el-form-item>
                </el-col>
                <el-col :offset='0' :span='12'>
                    <el-form-item
                        :label='$t("businessKYC.country") '
                        :prop='"list."+index+".address"'
                        :rules="{
                            required: true,
                            message: $t('common.select') + $t('businessKYC.country'),
                            trigger: 'change',
                        }"
                    >
                        <el-select
                            v-model='item.address'
                            :placeholder='$t("businessKYC.country")'
                            @change='(val) => selectCountry(val, "addressName",index)'
                        >
                            <el-option
                                v-for='country in countryList'
                                :key='country.countryCode'
                                :label='country.name'
                                :value='country.countryCode'
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item
                        :label='$t("businessKYC.email")'
                        :prop='"list."+index+".email"'
                        :rules="[{
                                     required: true,
                                     message: $t('common.input')+ $t('businessKYC.email'),
                                     trigger: 'blur',
                                 },
                                 {
                                     type: 'email',
                                     message: $t('common.inputRealEmail'),
                                     trigger: ['blur', 'change'],
                                 }]"
                    >
                        <el-input v-model='item.email' />
                    </el-form-item>
                </el-col>
            </el-row>
            <p class='title'>
                {{ $t("businessKYC.UploadId") }}
            </p>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item
                        :label='$t("register.certificateType") '
                        :prop='"list."+index+".idType"'
                        :rules="{
                            required: true,
                            message: $t('common.select') + $t('register.certificateType'),
                            trigger: 'change',
                        }"
                    >
                        <el-select
                            v-model='item.idType'
                            :placeholder='$t("register.certificateType")'
                            @change='(val) => changeIdType(val,index)'
                        >
                            <el-option
                                v-for='ict in idCardType'
                                :key='ict.code'
                                :label='ict.displayName'
                                :placeholder='$t("register.certificateType")'
                                :value='ict.code'
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :offset='0' :span='12'>
                    <el-form-item
                        :label='$t("register.certificateNo") '
                        :prop='"list."+index+".idNo"'
                        :rules="{
                            required: true,
                            message: $t('common.input') + $t('register.certificateNo') ,
                            trigger: 'blur',
                        }"
                    >
                        <el-input v-model='item.idNo' />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item
                        :label='$t("businessKYC.regionIssue")'
                        :prop='"list."+index+".issued"'
                        :rules="{
                            required: true,
                            message: $t('common.select') + $t('businessKYC.regionIssue'),
                            trigger: 'change',
                        }"
                    >
                        <el-select
                            v-model='item.issued'
                            :placeholder="$t('businessKYC.regionIssue')"
                            @change='(val) => selectCountry(val, "issuedName",index)'
                        >
                            <el-option
                                v-for='country in countryList'
                                :key='country.countryCode'
                                :label='country.name'
                                :value='country.countryCode'
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item
                        :label='$t("businessKYC.identificationFile")'
                        :prop='"list."+index+".documents"'
                        :rules="{
                            required: true,
                            message: $t('businessKYC.pleaseUpload') + $t('businessKYC.identificationFile'),
                            trigger: 'change',
                        }"
                    >
                        <van-uploader :after-read='afterRead' :name="index+',documents'" result-type='file'>
                            <div class='uploader'>
                                <img class='icon-upload' src='/images/upload.png' srcset='' />
                                <p class='upload-tip'>
                                    {{ $t('businessKYC.upload') }}
                                </p>
                            </div>
                        </van-uploader>
                        <a class='link' :href='item.documents' target='_blank'>
                            {{ item.documents }}
                        </a>
                    </el-form-item>
                </el-col>
                <el-col :offset='0' :span='12'>
                    <el-form-item
                        :label=' $t("businessKYC.portraitPhoto")'
                        :prop='"list."+index+".photo"'
                        :rules="{
                            required: true,
                            message:$t('businessKYC.pleaseUpload') + $t('businessKYC.portraitPhoto'),
                            trigger: 'blur',
                        }"
                    >
                        <van-uploader :after-read='afterRead' :name="index+',photo'" result-type='file'>
                            <div class='uploader'>
                                <img class='icon-upload' src='/images/upload.png' srcset='' />
                                <p class='upload-tip'>
                                    {{ $t('businessKYC.upload') }}
                                </p>
                            </div>
                        </van-uploader>
                        <a class='link' :href='item.photo' target='_blank'>
                            {{ item.photo }}
                        </a>
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
        <el-row :gutter='20'>
            <el-col :offset='0' :span='24'>
                <div class='add' @click='add'>
                    <i class='el-icon-plus'></i>
                    {{ $t('common.add') }}{{ $t("businessKYC.verify") }}
                </div>
            </el-col>
        </el-row>
    </el-form>
</template>

<script >
import { reactive, ref, computed, unref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { ElIcon, ElMessage } from 'element-plus'
import { isEmpty } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { upload, getListByParentCode, getCountryListByParentCode } from '@/api/base'
export default {
    props: {
        formData: {
            type: Object,
            require: true
        }
    },
    setup (props, context) {
        const { t, locale } = useI18n({ useScope: 'global' })
        const store = useStore()
        const formRef = ref(null)
        const state = reactive({
            countryList: [],
            form: {
                list: [
                    {
                        lastname: '',
                        firstName: '',
                        birthDay: '',
                        address: '',
                        email: '',
                        idType: '',
                        idNo: '',
                        issued: '',
                        addressName: '',
                        issuedName: ''
                    }
                ]
            },
            idCardType: [],
            loading: false
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

        const selectCountry = (val, filed, index) => {
            state.form.list[index][filed] = state.countryList.find(el => el.countryCode === val)?.countryName
        }

        const changeIdType = (val, index) => {
            const displayName = state.idCardType.find(el => el.code === val)?.displayName
            state.form.list[index].idTypeName = displayName
        }

        const add = () => {
            state.form.list.push({
                lastname: '',
                firstName: '',
                birthDay: '',
                address: '',
                email: '',
                idType: '',
                idNo: '',
                issued: '',
                addressName: '',
                issuedName: ''
            })
        }

        const deleteItem = (index) => {
            state.form.list.splice(index, 1)
        }

        // 上传图片
        const afterRead = (file, detail) => {
            state.loading = true
            const formData = new FormData()
            formData.append('object', file.file)
            upload(
                formData
            ).then(res => {
                state.loading = false
                if (res.check()) {
                    const param = detail.name.split(',')
                    const propName = 'list.' + param[0] + '.' + param[1]
                    formRef.value.clearValidate([propName])
                    state.form.list[param[0]][param[1]] = res.data
                    ElMessage({
                        message: t('auth.uploadSuccess'),
                        type: 'success',
                    })
                }
            }).catch(err => {
                state.loading = false
                console.log(err)
            })
        }

        // 获取证件类型
        const getIdCardType = () => {
            getListByParentCode({ parentCode: 'id_card_type' }).then(res => {
                if (res.check() && res.data.length > 0) {
                    state.idCardType = res.data
                }
            }).catch(res => {

            })
        }

        getIdCardType()
        // 获取国家列表
        getAllCountry()

        return {
            add,
            afterRead,
            formRef,
            selectCountry,
            deleteItem,
            changeIdType,
            ...toRefs(state)
        }
    }
}

</script>

<style lang="scss" scoped>
.add {
    width: 100%;
    margin-top: 30px;
    color: #666;
    font-weight: bold;
    line-height: rem(100px);
    text-align: center;
    background: var(--bgColor);
    cursor: pointer;
}
</style>
