// api编辑详情
<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' />
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
            <van-checkbox v-for='(item,index) in detailData.permissionDTOList' :key='index' :disabled='item.canEdit != true' :name='item.code'>
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

        <div class='bottom-btn'>
            <van-row gutter='10'>
                <van-col span='12'>
                    <van-button block plain type='primary' @click='handleDelete'>
                        {{ $t('compLang.delete') }}
                    </van-button>
                </van-col>
                <van-col span='12'>
                    <van-button block type='primary' @click='handleSubmit'>
                        {{ $t('save') }}
                    </van-button>
                </van-col>
            </van-row>
        </div>

        <van-popup
            v-model:show='helpPopupShow'
            class='custom-dialog'
            :duration='0.2'
            position='bottom'
            round
            :transition-appear='true'
        >
            <div class='header'>
                <div class='header-title'>
                    {{ $t('api.editTitle2') }}
                </div>
                <i class='icon_guanbi' @click='helpPopupShow = false'></i>
            </div>
            <div class='page-wrap' v-html="$t('api.editHelpTxt')">
            </div>
        </van-popup>

        <!-- 谷歌安全验证 -->
        <googleSecurityCheck
            v-if='ggSafetyPopupShow'
            ref='googleSecurityCheck'
            :show='ggSafetyPopupShow'
            @update:googleSafetyData='updateGoogleSafetyData'
            @update:popShow='updatePopupVis'
        />
    </div>
</template>

<script>
// import { computed } from 'vue'
import { computed, reactive, toRefs, onBeforeMount, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { Toast, Dialog } from 'vant'
import { createCustomerApiDetail, delCustomerApi, editCustomerApiSave } from '@/api/user'
import googleSecurityCheck from '@/themeCommon/components/googleSecurityCheck.vue'

export default {
    components: { googleSecurityCheck },
    setup (props, context) {
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
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
            helpPopupShow: false,
            ggSafetyPopupShow: false,
            googleSafetyData: {},
            applySuccessShow: false,
            isCreateOk: false, // 是否创建成功
            backData: { }// 创建成功后返回数据

        })

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

        const handleCreate = () => {
            state.verifyShow = true
        }

        const updatePopupVis = val => {
            state.ggSafetyPopupShow = val
        }

        // 更新返回的谷歌安全验证参数，
        const updateGoogleSafetyData = val => {
            state.googleSafetyData = val
            if (state.googleSafetyData.googleCode) {
                state.googleSafetyData.tag = state.query.tag
                state.query = {
                    ...state.query,
                    ...state.googleSafetyData
                }
                handleSave()
            }
        }

        // 保存编辑
        const handleSave = () => {
            // state.loading = true
            const { id, whiteIps, purview } = state.query
            const { tag } = state.detailData
            const _premArr = []

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
                ...state.googleSafetyData,
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
                    state.ggSafetyPopupShow = false
                    setTimeout(() => {
                        router.back()
                    }, 1500)
                } else {
                    Toast(res.msg)
                }
            }).catch(err => {
                state.loading = false
            })
        }

        const handleSubmit = () => {
            const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im
            const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
            if (regEn.test(state.query.tag) || regCn.test(state.query.tag)) {
                Toast(t('api.notSpecial'))
                return false
            }
            console.log(state.query, state.whiteIpsIsOk)
            if (state.query.whiteIps) {
                regWhiteIps()
            } else {
                state.whiteIpsIsOk = true
            }
            if (!state.whiteIpsIsOk) {
                return
            }
            if (!(Number(customInfo.value.googleId) > 0)) {
                Dialog.alert({
                    title: t('common.tip'),
                    showCancelButton: true,
                    confirmButtonText: t('api.mfaGoset'),
                    message: t('api.mfaTips'),
                }).then(() => {
                    router.replace({
                        name: 'MFA_status'
                    })
                })
                return
            }
            updatePopupVis(true)
        }

        const handleDelete = () => {
            const id = state.query.id
            Dialog.confirm({
                title: t('tip'),
                message:
                    t('api.deleteConfirm'),
            }).then(() => {
                delCustomerApi({ id }).then(res => {
                    state.loading = false
                    if (Number(res.code) === 0) {
                        Toast(t('api.deleteSuccess'))
                        setTimeout(() => {
                            router.back()
                        }, 1500)
                    } else {
                        Toast(res.msg)
                    }
                }).catch(err => {
                    state.loading = false
                })
            }).catch(() => {
            // on cancel
            })
        }

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
            console.log(ipArray)
            if (ipArray.length > 20) {
                Toast(t('api.cellLimite'))
                return false
            }
            const newIP = ipArray.join() // 转成字符串格式
            console.log(newIP)
            state.whiteIpsIsOk = true
        }

        const showHelper = () => {
            state.helpPopupShow = true
        }

        const back = () => {
            return router.replace('/mine')
        }

        onMounted(() => {
            initData()
        })

        return {
            initData,
            handleCreate,
            handleSave,
            handleSubmit,
            handleDelete,
            showHelper,
            regWhiteIps,
            back,
            updatePopupVis,
            updateGoogleSafetyData,
            inviteVis,
            ...toRefs(state)
        }
    },
}
</script>

<style lang="scss" scoped>
.page-wrap {
    width: 100%;
    height: 100%;
    margin-top: rem(110px);
    overflow: auto;
    background-color: var(--contentColor);
    :deep(.topNav .main) {
        max-width: 100%;
    }
    .bigIcon {
        padding-top: rem(30px);
    }
    .descEditTxt {
        padding: rem(20px);
        color: var(--warn);
        font-size: rem(22px);
        text-align: left;
    }
    .sub-title {
        padding: 0 rem(28px) rem(15px) rem(28px);
        color: var(--color);
        font-size: rem(32px);
    }
    .sub-title-minor {
        color: var(--minorColor);
        font-size: rem(24px);
    }
    .bottom-btn {
        padding: rem(20px);
    }
    .api-input {
        margin: rem(20px);
        .van-field {
            border: rem(1px) solid #DEDEDE;
            border-radius: rem(8px);
        }
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
            min-width: rem(140px);
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
    max-height: 85%;
    overflow: hidden;
    background: var(--bgColor);
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: rem(37px) rem(30px) rem(50px);
        .header-title {
            color: var(--color);
            font-weight: bold;
            font-size: rem(36px);
        }
        .icon_guanbi {
            font-weight: bold;
            font-size: rem(30px);
        }
    }
    .page-wrap {
        margin-top: 0;
        padding: rem(20px);
        padding-top: 0;
        overflow: auto;
        color: var(--normalColor);
        font-size: rem(28px);
        line-height: rem(42px);
    }
}
</style>
