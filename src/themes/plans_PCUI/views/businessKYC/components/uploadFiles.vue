<template>
    <el-form
        ref='formRef'
        v-loading='loading'
        label-position='top'
        label-width='auto'
        :model='form'
        :rules='rules'
        :size='size'
        @submit.native.prevent
    >
        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item :label='$t("businessKYC.certificate") ' prop='regCertificate'>
                    <van-uploader :after-read='afterRead' name='regCertificate' result-type='file'>
                        <div class='uploader'>
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <p class='upload-tip'>
                                {{ $t('businessKYC.upload') }}
                            </p>
                        </div>
                    </van-uploader>
                    <a class='link' :href='form.regCertificate' target='_blank'>
                        {{ form.regCertificate }}
                    </a>
                    <!-- <el-upload
                        action='/upload'
                        class='upload-demo'

                        drag
                        method='handleUpload'
                        multiple
                    >
                        <img class='icon-upload' src='/images/upload.png' srcset='' />
                        <upload-filled />
                        <div class='el-upload__text'>
                            拖动文件或 <em>{{ $t('businessKYC.upload') }}</em>
                        </div>
                    </el-upload> -->
                </el-form-item>
            </el-col>
            <el-col :offset='0' :span='12'>
                <el-form-item :label=' $t("businessKYC.memorandum") ' prop='policy'>
                    <van-uploader :after-read='afterRead' name='policy' result-type='file'>
                        <div class='uploader'>
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <p class='upload-tip'>
                                {{ $t('businessKYC.upload') }}
                            </p>
                        </div>
                    </van-uploader>
                    <a class='link' :href='form.policy' target='_blank'>
                        {{ form.policy }}
                    </a>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item :label=' $t("businessKYC.CertificateIssued") ' prop='directorsList'>
                    <van-uploader :after-read='afterRead' name='directorsList' result-type='file'>
                        <div class='uploader'>
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <p class='upload-tip'>
                                {{ $t('businessKYC.upload') }}
                            </p>
                        </div>
                    </van-uploader>
                    <div class='el-upload__tip'>
                        {{ $t("businessKYC.tip1") }}
                    </div>
                    <a class='link' :href='form.directorsList' target='_blank'>
                        {{ form.directorsList }}
                    </a>
                </el-form-item>
            </el-col>
            <el-col :offset='0' :span='12'>
                <el-form-item :label='$t("businessKYC.tip2") ' prop='directorsList2'>
                    <van-uploader :after-read='afterRead' name='directorsList2' result-type='file'>
                        <div class='uploader'>
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <p class='upload-tip'>
                                {{ $t('businessKYC.upload') }}
                            </p>
                        </div>
                    </van-uploader>
                    <div class='el-upload__tip'>
                        {{ $t("businessKYC.tip3") }}
                    </div>
                    <a class='link' :href='form.directorsList2' target='_blank'>
                        {{ form.directorsList2 }}
                    </a>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item :label=' $t("businessKYC.ownershipStructure") ' prop='structure'>
                    <van-uploader :after-read='afterRead' name='structure' result-type='file'>
                        <div class='uploader'>
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <p class='upload-tip'>
                                {{ $t('businessKYC.upload') }}
                            </p>
                        </div>
                    </van-uploader>

                    <div class='el-upload__tip'>
                        <p class='tips'>
                            {{ $t("businessKYC.tip4") }}
                        </p>
                    </div>
                    <a class='link' :href='form.structure' target='_blank'>
                        {{ form.structure }}
                    </a>
                </el-form-item>
            </el-col>
            <el-col :offset='0' :span='12'>
                <el-form-item :label=' $t("businessKYC.sanctionQuestionnaire") ' prop='sanctionsQues'>
                    <van-uploader :after-read='afterRead' name='sanctionsQues' result-type='file'>
                        <div class='uploader'>
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <p class='upload-tip'>
                                {{ $t('businessKYC.upload') }}
                            </p>
                        </div>
                    </van-uploader>

                    <a class='link' :href='form.sanctionsQues' target='_blank'>
                        {{ form.sanctionsQues }}
                    </a>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item :label='$t("businessKYC.letterOfAuthorization") ' prop='authorizationLetter'>
                    <van-uploader :after-read='afterRead' name='authorizationLetter' result-type='file'>
                        <div class='uploader'>
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <p class='upload-tip'>
                                {{ $t('businessKYC.upload') }}
                            </p>
                        </div>
                    </van-uploader>

                    <a class='link' :href='form.authorizationLetter' target='_blank'>
                        {{ form.authorizationLetter }}
                    </a>
                </el-form-item>
            </el-col>
            <el-col :offset='0' :span='12'>
                <el-form-item :label=' $t("businessKYC.businessConditions") ' prop='businessConditions'>
                    <van-uploader :after-read='afterRead' name='businessConditions' result-type='file'>
                        <div class='uploader'>
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <p class='upload-tip'>
                                {{ $t('businessKYC.upload') }}
                            </p>
                        </div>
                    </van-uploader>

                    <div class='el-upload__tip'>
                        <p class='tips'>
                            {{ $t("businessKYC.tip5") }}
                        </p>
                        <p class='tips'>
                            {{ $t("businessKYC.tip6") }}
                        </p>
                        <p class='tips'>
                            {{ $t("businessKYC.tip7") }}
                        </p>
                        <p class='tips'>
                            {{ $t("businessKYC.tip8") }}
                        </p>
                    </div>
                    <a class='link' :href='form.businessConditions' target='_blank'>
                        {{ form.businessConditions }}
                    </a>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item :label='$t("businessKYC.tip9") ' prop='intermediateShareholders'>
                    <van-uploader :after-read='afterRead' name='intermediateShareholders' result-type='file'>
                        <div class='uploader'>
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <p class='upload-tip'>
                                {{ $t('businessKYC.upload') }}
                            </p>
                        </div>
                    </van-uploader>

                    <div class='el-upload__tip'>
                        <p class='tips'>
                            {{ $t("businessKYC.tip10") }}
                        </p>
                        <p class='tips'>
                            {{ $t("businessKYC.tip11") }}
                        </p>
                    </div>
                    <a class='link' :href='form.intermediateShareholders' target='_blank'>
                        {{ form.intermediateShareholders }}
                    </a>
                </el-form-item>
            </el-col>
            <el-col :offset='0' :span='12'>
                <el-form-item :label='$t("businessKYC.supplementaryDocuments") ' prop='furtherInfo'>
                    <van-uploader :after-read='afterRead' name='furtherInfo' result-type='file'>
                        <div class='uploader'>
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <p class='upload-tip'>
                                {{ $t('businessKYC.upload') }}
                            </p>
                        </div>
                    </van-uploader>
                    <a class='link' :href='form.furtherInfo' target='_blank'>
                        {{ form.furtherInfo }}
                    </a>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item :label='$t("businessKYC.website") ' prop='websit'>
                    <el-input v-model='form.websit' />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
import { reactive, ref, computed, unref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { ElIcon, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { upload, getListByParentCode } from '@/api/base'
import { isEmpty } from '@/utils/util'

export default {
    props: {
        formData: {
            type: Object,
            require: true
        }
    },
    setup (props, context) {
        const formRef = ref(null)
        const { t, locale } = useI18n({ useScope: 'global' })
        const state = reactive({
            loading: false,
            form: {
                regCertificate: '',
                policy: '',
                directorsList: '',
                directorsList2: '',
                structure: '',
                sanctionsQues: '',
                authorizationLetter: '',
                businessConditions: '',
                intermediateShareholders: '',
                furtherInfo: '',
                websit: ''
            },
            rules: {
                regCertificate: [
                    { type: 'string', required: true, message: t('businessKYC.pleaseUpload'), trigger: 'blur' },
                ],
                policy: [
                    { type: 'string', required: true, message: t('businessKYC.pleaseUpload'), trigger: 'blur' },
                ],
                directorsList: [
                    { type: 'string', required: true, message: t('businessKYC.pleaseUpload'), trigger: 'blur' },
                ],
                directorsList2: [
                    { type: 'string', required: true, message: t('businessKYC.pleaseUpload'), trigger: 'blur' },
                ],
                structure: [
                    { type: 'string', required: true, message: t('businessKYC.pleaseUpload'), trigger: 'blur' },
                ],
                sanctionsQues: [
                    { type: 'string', required: true, message: t('businessKYC.pleaseUpload'), trigger: 'blur' },
                ],
                authorizationLetter: [
                    { type: 'string', required: true, message: t('businessKYC.pleaseUpload'), trigger: 'blur' },
                ],
                businessConditions: [
                    { type: 'string', required: true, message: t('businessKYC.pleaseUpload'), trigger: 'blur' },
                ],
                intermediateShareholders: [
                    { type: 'string', required: true, message: t('businessKYC.pleaseUpload'), trigger: 'blur' },
                ],
                websit: [
                    { type: 'string', required: true, message: t('common.input'), trigger: 'blur' },
                ]

            }

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
                    state.form[detail.name] = res.data
                    formRef.value.clearValidate([detail.name])
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

        return {
            afterRead,
            formRef,
            ...toRefs(state)
        }
    }
}

</script>

<style lang="scss" scoped>

</style>
