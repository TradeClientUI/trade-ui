<template>
    <Loading :show='loading' />
    <div class='page-wrap'>
        <slot name='notice'></slot>
        <div class='conditon-wrap'>
            <div v-for='(item,index) in elementList' :key='index' class='condition-item'>
                <van-field
                    v-if="item.showType === 'input'"
                    v-model.trim='conditionModel[item.elementCode]'
                    class='c-item'
                    :clearable='true'
                    :label='item.elementName'
                    :placeholder='$t("common.input")+item.elementName'
                    required
                    :type='item.elementCode === "phone" ? "number" : "text"'
                />
                <div v-if="item.showType === 'inputGroup'">
                    <van-field
                        v-model.trim='typeValue'
                        clickable
                        :label='item.elementName'
                        :placeholder='$t("register.chooseCertificateType")'
                        readonly
                        required
                        right-icon='arrow'
                        @click='showPicker = true'
                    />
                    <van-field v-model.trim='conditionModel[typeCode]' :label='$t("register.certificateNo")' :placeholder="$t('register.pleaseEnter')+ typeValue" required />
                </div>
                <div v-if='imgTypeVis(item)' class='c-item'>
                    <p class='upload-text'>
                        {{ item.elementName }}
                    </p>
                    <van-uploader :after-read='afterRead' :class='uploadImgGaClass' :name='item.elementCode' result-type='file'>
                        <img
                            v-if='item.elementValue'
                            :id='item.elementCode'
                            alt=''
                            class='upload-img'
                            :src='item.elementValue'
                        />
                        <img
                            v-else
                            :id='item.elementCode'
                            alt=''
                            class='upload-img'
                            :src="require('../../assets/auth/upload.png')"
                            srcset=''
                        />
                    </van-uploader>
                </div>

                <div v-if="item.showType === 'face_photo'">
                    <van-cell
                        :is-link="platform === 'web' ? false: true"
                        :title='item.elementName'
                        @click='toFaceAuth'
                    >
                        <template #label>
                            <span v-if="platform === 'web'" :style="'color:' + $style.warn">
                                {{ $t('faceAuth.faceTip') }}
                            </span>
                        </template>
                    </van-cell>
                </div>
                <div v-if="item.showType=== 'date'">
                    <van-field
                        v-model.trim='conditionModel[item.elementCode]'
                        clickable
                        :label='item.elementName'
                        :placeholder='$t("common.select")+item.elementName'
                        readonly
                        required
                        right-icon='arrow'
                        @click='handleDateClick(item.elementCode)'
                    />
                </div>
            </div>
        </div>
        <van-button v-if='!hideSubmitBtn' :class='["confirm-btn", submitGaClass]' @click='onConfirm'>
            {{ $t('common.submit') }}
        </van-button>
    </div>

    <van-popup v-model:show='dateShowPicker' class='actionsheetCenter' position='bottom' round>
        <van-datetime-picker
            v-model='datePickerVal'
            :max-date='maxDate'
            :min-date='minDate'
            type='date'
            @cancel='dateShowPicker = false'
            @confirm='dateConfirm'
        />
    </van-popup>

    <van-popup v-model:show='showPicker' class='actionsheetCenter' position='bottom' round>
        <van-picker
            :columns='columns'
            :columns-field-names='columnsFields'
            @cancel='showPicker = false'
            @confirm='handleConfirm'
        />
    </van-popup>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { toRefs, reactive, onBeforeMount, onBeforeUnmount, computed } from 'vue'
import { Toast } from 'vant'
import { findAllLevelKyc, kycLevelApply, kycApply } from '@/api/user'
import { getArrayObj, isEmpty } from '@/utils/util'
import { upload, getListByParentCode } from '@/api/base'
import { useI18n } from 'vue-i18n'
import { deepClone } from '@/utils/deepClone'

export default {
    props: {
        businessCode: {
            type: String
        },
        platform: {
            type: String,
            default: 'h5'
        }
    },

    setup (props) {
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const levelCode = route.query.levelCode
        const isMobile = process.env.VUE_APP_theme === 'plans'
        const uploadImgGaClass = isMobile ? 'mobile_kyc_image_ga' : 'pc_kyc_image_ga'
        const submitGaClass = isMobile ? 'mobile_kyc_submit_ga' : 'pc_kyc_submit_ga'

        // 证件类型对应的上传图片项
        const cardTypeMap = {
            'identity_card': ['back_identity_card', 'front_identity_card'],
            'passport': ['proof_of_passpord'],
            'drving_license': ['proof_of_drive']
        }

        const state = reactive({
            area: '',
            pathCode: '',
            loading: false,
            list: [],
            elementList: [],
            conditionVis: true,
            conditionModel: {},
            typeValue: '',
            showPicker: false,
            value1: '',
            columns: [],
            typeCode: '',
            elementCodeInputGroup: '',
            extendsMap: {}, // 字段和正则对应关系
            showImgList: [],
            dateShowPicker: false,
            currentDate: '', // window.dayjs(new Date()).format('YYYY-MM-DD'),
            minDate: new Date(1920, 0, 1),
            maxDate: new Date(),
            datePickerVal: new Date(),
            checkedCode: '',
            hasFacePhoto: false

        })

        const hideSubmitBtn = computed(() => !isEmpty(state.hasFacePhoto) && props.platform === 'web')
        const columnsFields = { text: 'name' }

        const getConditon = () => {
            state.loading = true
            findAllLevelKyc({
                levelCode: levelCode
            }).then(res => {
                state.loading = false

                state.list = res.data
                // 只有一个路径的时候默认选中
                if (Number(res.data.length === 1)) {
                    state.area = res.data[0].pathName
                    state.pathCode = res.data[0].pathCode
                    state.elementList = getArrayObj(state.list, 'pathCode', state.pathCode).elementList
                    state.areaShow = false
                    getInputGroupList()
                    if (state.elementList.length > 0) {
                        state.hasFacePhoto = state.elementList.find(el => el.elementCode === 'face_photo')
                        if (!isEmpty(state.hasFacePhoto) && props.platform === 'h5') {
                            router.push({
                                path: '/faceDetect',
                                query: {
                                    businessCode: props.businessCode,
                                    levelCode,
                                }
                            })
                            return
                        }
                        handleElementList()
                    }
                    console.log('state.conditionModel', state.conditionModel)
                }
            }).catch(err => {
                state.loading = false
            })
        }

        const handleElementList = () => {
            state.elementList.forEach(el => {
                // 如果是 inputGroup 单独处理
                if (el.showType === 'inputGroup') {
                    state.elementCodeInputGroup = el.elementCodeInputGroup
                    state.typeCode = el.elementCodeInputGroup
                    state.conditionModel[el.elementCodeInputGroup] = el.elementValueInputGroup
                    if (el.elementCodeInputGroup) {
                        state.showImgList = cardTypeMap[el.elementCodeInputGroup]
                    }
                } else if (el.showType === 'date') {
                    el.elementValue = el.elementValue ? el.elementValue : new Date().getDate().getTime()
                    state.conditionModel[el.elementCode] = window.dayjs(Number(el.elementValue)).format('YYYY-MM-DD')
                    state.datePickerVal = new Date(Number(el.elementValue))
                } else {
                    state.conditionModel[el.elementCode] = el.elementValue
                }
            })
        }

        // 有inputGroup证件类型的时候 请求类型列表
        const getInputGroupList = () => {
            const typeObj = getArrayObj(state.elementList, 'showType', 'inputGroup')
            if (!isEmpty(typeObj)) {
                getInputGroupData()
            }

            state.elementList.forEach(item => {
                state.extendsMap[item.elementCode] = {
                    name: item.elementName,
                    extend: item.extend,
                    showType: item.showType
                }
            })
        }

        const getInputGroupData = () => {
            getListByParentCode({ parentCode: 'id_card_type' }).then(res => {
                if (res.check() && res.data.length > 0) {
                    state.columns = res.data
                    state.typeValue = state.columns.find(item => item.code === state.elementCodeInputGroup)?.name || ''
                    // state.typeCode = state.columns.find(item => item.code === state.elementCodeInputGroup)?.code

                    if (res.data.length > 0) {
                        res.data.forEach(item => {
                            state.extendsMap[item.code] = {
                                name: item.name,
                                extend: item.extend
                            }
                        })
                    }
                }
            }).catch(res => {

            })
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
                    document.getElementById(detail.name).src = res.data
                    state.conditionModel[detail.name] = res.data

                    Toast(t('auth.uploadSuccess'))
                }
            }).catch(err => {
                state.loading = false
                console.log(err)
            })
        }

        const onConfirm = () => {
            // 证件类型只判断其中一种
            const compareElement = deepClone(state.elementList)
            const unCheckedColumns = state.columns.filter(el => el.code !== state.typeCode).map(item => cardTypeMap[item.code]).flat()
            unCheckedColumns.forEach(item => {
                const forDelIndex = compareElement.findIndex(el => el.elementCode === item)
                if (forDelIndex !== -1) {
                    compareElement.splice(forDelIndex, 1)
                    delete state.conditionModel[item]
                }
            })

            const tempElementList = []
            if (!isEmpty(state.conditionModel)) {
                for (const key in state.conditionModel) {
                    if (state.conditionModel.hasOwnProperty(key) && key !== 'null') {
                        if (!isEmpty(state.extendsMap[key]?.extend)) {
                            const valueReg = new RegExp(state.extendsMap[key].extend)
                            if (!valueReg.test(state.conditionModel[key])) {
                                return Toast(`${state.extendsMap[key].name} ` + t('register.incorrectlyFormed'))
                            }
                        }
                        if (!isEmpty(state.conditionModel[key])) {
                            tempElementList.push({
                                elementCode: key,
                                elementValue: state.conditionModel[key]
                            })
                        }

                        if (state.extendsMap[key]?.showType === 'date') {
                            const dateVal = tempElementList.find(el => el.elementCode === key)
                            dateVal.elementValue = (new Date(dateVal.elementValue).getTime()).toString()
                        }
                    }
                }
            }
            if (tempElementList.length < compareElement.length) {
                return Toast(t('auth.allAuthPlease'))
            }

            let params
            /* 具体业务的kyc认证 */
            if (!isEmpty(props.businessCode)) {
                params = {
                    businessCode: props.businessCode,
                    elementList: tempElementList,
                    levelCode
                }
                state.loading = true
                kycApply(params).then(res => {
                    state.loading = false
                    if (res.check()) {
                        if (props.platform === 'web') {
                            const parentPath = route.matched[route.matched.length - 2]
                            router.push({ path: parentPath.path + '/kycCommitted' })
                        } else {
                            router.replace({ name: 'KycCommitted' })
                        }
                        sessionStorage.removeItem('kycList')
                    }
                }).catch(err => {
                    state.loading = false
                    console.log(err)
                })
            } else {
                params = {
                    levelCode,
                    elementList: tempElementList,
                    pathCode: state.pathCode
                }
                state.loading = true
                kycLevelApply(params).then(res => {
                    state.loading = false
                    if (res.check()) {
                        if (props.platform === 'web') {
                            const parentPath = route.matched[route.matched.length - 2]
                            router.push({ path: parentPath.path + '/kycCommitted' })
                        } else {
                            router.replace({ name: 'KycCommitted' })
                        }
                    }
                }).catch(err => {
                    state.loading = false
                    console.log(err)
                })
            }
        }

        const deleteRepeatData = () => {
            const tempDelData = state.columns.filter((item) => item.code !== state.typeCode)
            if (tempDelData.length > 0) {
                tempDelData.forEach(item => {
                    delete state.conditionModel[item.code]
                })
            }
        }

        // 证件类型选择
        const handleConfirm = (value) => {
            state.typeValue = value.name
            state.typeCode = value.code
            state.showPicker = false
            state.showImgList = cardTypeMap[value.code]
            // 类型为证件类型的时候处理重复数据
            deleteRepeatData()
        }

        // 判断imgge类型是否显示
        const imgTypeVis = (item) => {
            // 判断是否有组合框
            const hasInputGroup = state.elementList.find(el => el.showType === 'inputGroup')
            // 选择的证件类型关联的图片
            const chooseTypeFlag = state.showImgList?.includes(item.elementCode)
            // 判断是否在证件类型关联的元素里面
            const hasIdCardType = Object.values(cardTypeMap).flat().indexOf(item.elementCode) === -1
            return item.showType === 'image' && (chooseTypeFlag || hasIdCardType || isEmpty(hasInputGroup))
        }

        onBeforeMount(() => {
            // 注册进来的kyc
            const kycList = sessionStorage.getItem('kycList')
            if (!isEmpty(kycList)) {
                state.elementList = JSON.parse(kycList)[0].elementList
                state.hasFacePhoto = state.elementList.find(el => el.elementCode === 'face_photo')
                getInputGroupList()
                handleElementList()
            } else {
                getConditon()
            }
        })

        const dateConfirm = (val) => {
            state.conditionModel[state.checkedCode] = window.dayjs(val).format('YYYY-MM-DD')
            state.dateShowPicker = false
        }

        const handleDateClick = (code) => {
            state.checkedCode = code
            state.dateShowPicker = true
        }

        // 跳转人脸识别
        const toFaceAuth = () => {
            if (props.platform === 'web') return
            router.push({
                path: '/faceDetect',
                query: {
                    businessCode: props.businessCode,
                    levelCode,
                }
            })
        }

        onBeforeUnmount(() => {
            sessionStorage.removeItem('kycList')
        })

        return {
            ...toRefs(state),
            onConfirm,
            getConditon,
            afterRead,
            handleConfirm,
            columnsFields,
            imgTypeVis,
            dateConfirm,
            handleDateClick,
            toFaceAuth,
            hideSubmitBtn,
            uploadImgGaClass,
            submitGaClass
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-y: auto;
    background-color: var(--bgColor);
    .notice {
        padding-left: rem(30px);
        line-height: rem(100px);
        .title {
            color: var(--minorColor);
            font-size: rem(28px);
            line-height: rem(36px);
        }
        ul {
            padding-left: rem(30px);
            li {
                margin-top: rem(20px);
                list-style-type: disc;
            }
        }
    }
    .conditon-wrap {
        flex: 1;
        overflow-y: auto;
        background: var(--contentColor);
        .condition-item {
            .c-item {
                padding-top: rem(20px);
                text-align: center;
                background: var(--contentColor);
                border-bottom: solid 1px var(--lineColor);
                :deep(.van-cell) {
                    background-color: var(--contentColor);
                    .van-cell__title {
                        color: var(--normalColor);
                    }
                    .van-cell__value {
                        color: var(--color);
                    }
                    .van-field__control {
                        color: var(--color);
                    }
                }
                .upload-img {
                    width: rem(400px);
                    padding: rem(30px);
                    border: dashed 1px var(--lineColor);
                    border-radius: rem(16px);
                }
                .upload-text {
                    margin-top: rem(20px);
                    font-size: rem(48px);
                }
                .van-uploader {
                    margin-top: rem(50px);
                    margin-bottom: rem(50px);
                }
            }
        }
    }
    .confirm-btn {
        width: 100%;
        color: var(--color);
        font-size: rem(30px);
        background: var(--contentColor);
        border-color: var(--lineColor);
    }
}
</style>
