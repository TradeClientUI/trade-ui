<template>
    <router-view />
    <div class='wrapper' :style='"min-height:" + wrapperHeight'>
        <div class='page-title'>
            <span class='back-icon' @click='back'>
                ＜
            </span>{{ $t('api.editHeader') }}
        </div>
        <div class='api-create'>
            <!-- <div class='desc'>
                {{ $t('api.text1') }}
                <span>
                    <a class='a-link' @click='showApiHelp'>
                        {{ $t("api.linkTxt") }}
                    </a>
                </span>
            </div>
            <div class='min-tit'>
                {{ $t('api.editTitle4') }}
            </div>
            <div class='api-input'>
                <van-field v-model='query.tag' maxlength='20' :placeholder="$t('api.keyplaceholder')" />
            </div> -->
            <Loading :show='loading' />
            <div class='descEditTxt'>
                {{ $t("api.descEditTxt") }}
            </div>
            <div class='sub-title'>
                {{ $t("api.editTitle1") }}
            </div>
            <div class='api-input'>
                <van-field v-model='detailData.tag' max='20' :placeholder="$t('api.keyplaceholder')" />
            </div>
            <div class='sub-title'>
                {{ $t("api.editTitle2") }} <van-icon name='question-o' @click='showHelper' />
            </div>
            <van-checkbox-group v-model='query.purview' class='purview-set' direction='horizontal' inset>
                <van-checkbox v-for='(item,index) in detailData.permissionDTOList' :key='index' :disabled='item.canEdit != true' :name='item.code' shape='success'>
                    {{ item.name }}
                </van-checkbox>
            </van-checkbox-group>

            <div class='sub-title'>
                {{ $t("api.editTitle3") }}
                <p class='sub-title-minor'>
                    {{ $t("api.editSubTit1") }}
                </p>
            </div>

            <div class='api-input'>
                <van-field
                    v-model='query.whiteIps'
                    autosize
                    :placeholder="$t('api.keyplaceholder2')"
                    rows='2'
                    type='textarea'
                />
            </div>

            <van-button block class='confirm-btn' type='primary' @click='handleSubmit'>
                <span>{{ $t('compLang.confirm') }}</span>
            </van-button>
        </div>

        <van-popup
            v-model:show='helpPopupShow'
            class='custom-dialog'
            :duration='0.2'
            position='center'
            round
            :transition-appear='true'
        >
            <div class='header'>
                <van-icon name='cross' @click='helpPopupShow = false' />
                <div class='header-title'>
                    {{ $t('api.editTitle2') }}
                </div>
                <!-- <i class='icon_guanbi' @click='helpPopupShow = false'></i> -->
            </div>
            <div class='page-wrap' v-html="$t('api.editHelpTxt')">
            </div>
        </van-popup>
    </div>
</template>

<script>
import { computed, toRefs, reactive, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Toast, Dialog } from 'vant'
import { createCustomerApiDetail, editCustomerApiSave, checkKycApply } from '@/api/user'

export default {
    components: {

    },
    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const { type } = route.query
        const state = reactive({
            loading: false,
            query: {
                purview: [],
                tag: '',
                id: '',
                whiteIps: ''
            },
            whiteIpsIsOk: false,
            detailData: {},
            oldDetailData: {},
            helpPopupShow: false
        })

        // console.log(store.state)
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const companyId = computed(() => customInfo.value.companyId)
        const inviteVis = computed(() => {
            return (location.href.includes('uat') && companyId.value === 1) || (location.href.includes('pre') && companyId.value === 360) || (companyId.value === 11)
        })

        // 初始获取详情
        const initData = () => {
            const id = route.query.id
            state.query.id = id
            state.loading = true
            createCustomerApiDetail({ id }).then(res => {
                state.loading = false
                if (Number(res.code) === 0) {
                    console.log(res)
                    state.detailData = res.data
                    state.oldDetailData = res.data
                    const perArr = []
                    res.data.permissionDTOList.map((item, index) => {
                        if (Number(item.status) === 1) {
                            perArr.push(item.code)
                        }
                        state.query.purview = perArr
                    })
                    state.query.whiteIps = res.data.whiteIps
                } else {
                    Toast(res.msg)
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // 保存编辑
        const handleSave = () => {
            // state.loading = true
            const { id, whiteIps, purview } = state.query
            const { tag } = state.detailData
            const _premArr = []

            state.detailData.permissionDTOList.map((item, index) => {
                _premArr.push({
                    ...item,
                    status: purview.includes(item.code) ? 1 : 2
                })
            })

            var permArr = [] // 比对旧数据权限列表，只把变更的提交
            state.oldDetailData.permissionDTOList.map((it, i) => {
                _premArr.map((item, index) => {
                    if (item.code !== 'ready_only') {
                        if (it.code === item.code) {
                            if (it.status !== item.status) {
                                permArr.push({
                                    code: item.code,
                                    status: item.status
                                })
                            }
                        }
                    }
                })
            })

            const params = {
                id: id,
                tag: tag,
                whiteIps: whiteIps,
                permissionList: permArr
            }
            console.log(params)

            editCustomerApiSave(params).then(res => {
                state.loading = false
                if (Number(res.code) === 0) {
                    console.log(res)
                    Toast(t('api.editSuccess'))
                    setTimeout(() => {
                        // router.back()
                        router.push({
                            path: '/api'
                        })
                    }, 1500)
                } else {
                    Toast(res.msg)
                }
            }).catch(err => {
                state.loading = false
            })
        }

        const showHelper = () => {
            state.helpPopupShow = true
        }

        const handleSubmit = () => {
            // handRoutTo('/googleSecurityCheck/index', state.query.tag)
            const id = route.query.id
            const { whiteIps, purview } = state.query
            const { tag } = state.detailData
            const _premArr = []

            if (!(Number(customInfo.value.googleId) > 0)) {
                Dialog.alert({
                    title: t('common.tip'),
                    showCancelButton: true,
                    confirmButtonText: t('api.mfaGoset'),
                    message: t('api.mfaTips'),
                }).then(() => {
                    handRoutTo('/googleMFA/status')
                })
                return
            }

            const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im
            const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
            if (regEn.test(state.query.tag) || regCn.test(state.query.tag)) {
                Toast(t('api.notSpecial'))
                return false
            }

            if (state.query.whiteIps) {
                regWhiteIps()
            } else {
                state.whiteIpsIsOk = true
            }
            if (!state.whiteIpsIsOk) {
                return
            }

            state.detailData.permissionDTOList.map((item, index) => {
                _premArr.push({
                    ...item,
                    status: purview.includes(item.code) ? 1 : 2
                })
            })

            var permArr = [] // 比对旧数据权限列表，只把变更的提交
            state.oldDetailData.permissionDTOList.map((it, i) => {
                _premArr.map((item, index) => {
                    if (item.code !== 'ready_only') {
                        if (it.code === item.code) {
                            if (it.status !== item.status) {
                                permArr.push({
                                    code: item.code,
                                    status: item.status
                                })
                            }
                        }
                    }
                })
            })

            const params = {
                id: id,
                tag: tag,
                whiteIps: whiteIps,
                permissionList: permArr
            }

            router.push({
                path: route.path + '/googleSecurityCheck/index',
                query: {
                    tag: tag || '',
                    originPage: 'apiEdit',
                    editParams: JSON.stringify(params)
                }
            })
        }

        const handRoutTo = (path, tag) => router.push({
            path: route.path + path,
            query: {
                tag: tag ? '' : tag,
                originPage: 'apiEdit'
            }
        })

        const regWhiteIps = () => {
            const reg = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/
            console.log('IP输入框的值:', state.query.whiteIps)
            const ipArray = state.query.whiteIps.split(',')
            for (const i in ipArray) {
                ipArray[i] = ipArray[i].replace(/\s/g, '')
                if (!reg.test(ipArray[i])) {
                    Toast(t('api.ipisError'))
                    state.whiteIpsIsOk = false
                    return
                }
            }
            if (ipArray.length > 20) {
                Toast(t('api.cellLimite'))
                return false
            }
            const newIP = ipArray.join() // 转成字符串格式
            console.log(newIP)
            state.whiteIpsIsOk = true
        }

        // 跳转到编辑页
        const back = (id) => {
            console.log(id)
            // router.back()
            router.push({ path: '/api' })
        }

        const showApiHelp = () => {
            state.helpPopupShow = true
        }

        const setMinHeight = () => {
            const heightFooter = document.querySelectorAll("div[class='footer-nav']")
            const headerFooter = document.querySelectorAll("div[class='nav-left']")
            const calcHeight = heightFooter[0].clientHeight + headerFooter[0].clientHeight
            state.wrapperHeight = 'calc(100vh - ' + calcHeight + 'px)'
        }

        onMounted(() => {
            initData()
            setMinHeight()
        })

        return {
            initData,
            setMinHeight,
            handRoutTo,
            handleSave,
            regWhiteIps,
            showHelper,
            handleSubmit,
            showApiHelp,
            back,
            inviteVis,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.wrapper {
    width: 1200px;
    min-height: calc(100% - 297px);
    margin: 20px auto;
    .page-title {
        font-weight: bold;
        font-size: 32px;
        .back-icon {
            cursor: pointer;
        }
    }
    .api-create {
        width: 460px;
        margin: 40px auto;
        .desc {
            margin-bottom: 20px;
            color: var(--minorColor);
            font-size: 14px;
            line-height: 24px;
            a {
                color: var(--riseColor);
            }
        }
        .min-tit {
            font-size: 18px;
        }
        .api-input {
            margin: 0 0 20px;
        }
    }
    .sub-title {
        font-size: 24px;
    }
    .api-input {
        margin: 0;
        .van-field {
            border: rem(1px) solid #DEDEDE;
            border-radius: rem(8px);
        }
    }
    .descEditTxt {
        padding: rem(20px) 0;
        color: var(--warn);
        font-size: rem(28px);
        text-align: left;
    }
    .sub-title {
        padding: 0 rem(28px) rem(15px) 0;
        color: var(--color);
        font-size: rem(32px);
    }
    .sub-title-minor {
        color: var(--minorColor);
        font-size: rem(24px);
    }
    .purview-set {
        margin: rem(20px);
    }
    .van-checkbox {
        position: relative;
        margin-bottom: rem(30px);
        padding: rem(10px) rem(30px);
        border: rem(1px) solid var(--minorColor);
        border-radius: rem(6px);
        :deep(.van-checkbox__label) {
            display: inline-block;
            min-width: rem(160px);
            font-size: rem(24px);
            text-align: center;
        }
        :deep(.van-icon) {
            display: none;
        }
        :deep(.van-checkbox__label) {
            margin-left: 0;
        }
        &[aria-checked='true'] {
            border: rem(1px) solid var(--primary);
            :deep(.van-checkbox__label) {
                color: var(--primary);
            }
            :deep(.van-icon) {
                position: absolute;
                top: -1px;
                right: -1px;
                display: inline-block;
                font-size: rem(22px);
                line-height: rem(18px);
                background: var(--primary);
                border-color: var(--primary);
            }
        }
        :deep(.van-checkbox__icon--disabled.van-checkbox__icon--checked) {
            .van-icon {
                color: var(--contentColor);
                background: var(--primary);
                border-color: var(--primary);
            }
        }
    }
}
</style>

<style lang="scss">
@import '@/sass/mixin.scss';
.custom-dialog {
    display: flex;
    flex-direction: column;
    max-height: 60%;
    overflow: hidden;
    background: var(--bgColor);
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 15px;
        background-color: var(--contentColor);
        .header-title {
            flex: 1;
            color: var(--color);
            font-weight: bold;
            font-size: rem(48px);
            text-align: center;
        }
        .van-icon {
            font-size: 24px;
            cursor: pointer;
        }
    }
    .page-wrap {
        margin-top: 0;
        padding: 15px;
        padding-top: 0;
        overflow: auto;
        color: var(--normalColor);
        font-size: 14px;
        line-height: 32px;
    }
}
</style>
