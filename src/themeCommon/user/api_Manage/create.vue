// 创建api
<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' />
        <Loading :show='loading' />
        <div class='descEditTxt'>
            {{ $t("api.createDesc") }}
        </div>
        <div class='sub-title'>
            {{ $t("api.editTitle4") }}
        </div>

        <div class='api-input'>
            <van-field v-model.trim='query.tag' maxlength='20' :placeholder="$t('api.keyplaceholder')" />
        </div>

        <van-button block class='confirm-btn' type='primary' @click='handleCreate'>
            <span>{{ $t('compLang.confirm') }}</span>
        </van-button>

        <!-- 谷歌安全验证 -->
        <googleSecurityCheck
            v-if='ggSafetyPopupShow'
            ref='googleSecurityCheck'
            :show='ggSafetyPopupShow'
            @update:googleSafetyData='updateGoogleSafetyData'
            @update:popShow='updatePopupVis'
        />

        <!-- 创建成功后弹出框 -->
        <van-popup
            v-model:show='applySuccessShow'
            class='custom-dialog'
            :duration='0.2'
            position='bottom'
            round
            :transition-appear='true'
        >
            <div class='header'>
                <div class='header-title'>
                    {{ $t('api.createTitle') }}
                </div>
                <i class='icon_guanbi' @click='close'></i>
            </div>
            <div class='page-wrap'>
                <div class='create-tips'>
                    {{ $t('api.createTips') }}
                </div>
                <div class='sub-title'>
                    {{ $t('api.createSubTit1') }}
                </div>
                <van-row>
                    <van-col class='item-left txtWrap' span='20'>
                        {{ backData.apiKey }}
                    </van-col>
                    <van-col align='right' class='item-right' span='4'>
                        <i class='icon_fuzhi copy-btn' :data-clipboard-text='backData.apiKey' @click='copyCustomerNo'></i>
                    </van-col>
                </van-row>
                <div class='sub-title'>
                    {{ $t('api.createSubTit2') }}
                </div>
                <van-row>
                    <van-col class='item-left txtWrap' span='20'>
                        {{ backData.privateKey }}
                    </van-col>
                    <van-col align='right' class='item-right' span='4'>
                        <i class='icon_fuzhi copy-btn' :data-clipboard-text='backData.privateKey' @click='copyCustomerNo'></i>
                    </van-col>
                </van-row>
                <div class='sub-title'>
                    {{ $t('api.createSubTit3') }}
                </div>
                <div class='backContent'>
                    <span v-for='(item,i) in backData.permissionDTOList' :key='i'>
                        <em v-if='item.status == 1' class='perItem'>
                            {{ item.name }}
                        </em>
                    </span>
                </div>
                <div class='sub-title'>
                    {{ $t('api.createSubTit4') }}
                </div>
                <div class='backContent'>
                    {{ backData.whiteIps }}
                </div>
                <div class='sub-title col-black'>
                    {{ $t('api.createSubTit5') }}
                </div>
                <div class='sub-createTipsTxt' v-html="$t('api.createTipsTxt')">
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
// import { computed } from 'vue'
import { computed, reactive, toRefs, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { isEmpty, localGet, localSet } from '@/utils/util'
import Clipboard from 'clipboard'
import { Toast } from 'vant'
import googleSecurityCheck from '@/themeCommon/components/googleSecurityCheck.vue'
import { createCustomerApi } from '@/api/user'

export default {
    components: {
        googleSecurityCheck
    },
    setup (props, context) {
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const state = reactive({
            loading: false,
            ggSafetyPopupShow: false,
            googleSafetyData: {},
            applySuccessShow: false,
            query: {
                purview: [],
                tag: ''
            },
            isCreateOk: false, // 是否创建成功
            backData: { // 创建成功后返回数据
                apiKey: '',
                privateKey: '',
                permissionList: [],
                whiteIps: ''
            }
        })

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const companyId = computed(() => customInfo.value.companyId)

        const inviteVis = computed(() => {
            return (location.href.includes('uat') && companyId.value === 1) || (location.href.includes('pre') && companyId.value === 360) || (companyId.value === 11)
        })

        const handleCreate = () => {
            console.log(state.query.tag)
            if (state.query.tag) {
                const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im
                const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
                if (regEn.test(state.query.tag) || regCn.test(state.query.tag)) {
                    Toast(t('api.notSpecial'))
                    return false
                }
                updatePopupVis(true)
            } else {
                Toast(t('api.keyplaceholder'))
            }
        }

        const handleSaveCheck = () => {
            state.loading = true
            console.log(state.query)
            createCustomerApi({ ...state.query }).then(res => {
                state.loading = false
                if (Number(res.code) === 0) { // 创建成功
                    applySuccessShowFn(true)
                    state.isCreateOk = true
                    state.backData = res.data
                    if (state.backData.whiteIps == null) {
                        state.backData.whiteIps = '--'
                    }
                    state.ggSafetyPopupShow = false
                } else {
                    state.loading = false
                    Toast(res.msg)
                    return false
                }
            }).catch(err => {
                state.loading = false
            })
        }

        const updatePopupVis = val => {
            state.ggSafetyPopupShow = val
        }

        // 更新返回的谷歌安全验证参数，
        const updateGoogleSafetyData = val => {
            state.googleSafetyData = val
            if (state.googleSafetyData.googleCode) {
                // state.ggSafetyPopupShow = false
                state.googleSafetyData.tag = state.query.tag
                state.query = {
                    ...state.googleSafetyData
                }
                handleSaveCheck()
            }
        }

        // 复制
        const copyCustomerNo = (value) => {
            var clipboard = new Clipboard('.copy-btn')
            clipboard.on('success', e => {
                Toast(t('common.copySuccess'))
                clipboard.destroy()
            })
        }

        const applySuccessShowFn = (val) => {
            state.applySuccessShow = val
        }

        const back = () => {
            return router.replace('/mine')
        }

        const close = () => {
            applySuccessShowFn(false)
            if (state.isCreateOk) { // 如已创建成功，返回列表
                router.back()
            }
        }

        onBeforeMount(() => {
            // updatePopupVis(true)
            // applySuccessShowFn(true)
        })

        return {
            handleCreate,
            updateGoogleSafetyData,
            updatePopupVis,
            copyCustomerNo,
            handleSaveCheck,
            inviteVis,
            close,
            back,
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
    .descEditTxt {
        padding: rem(20px);
        color: var(--minorColor);
        font-size: rem(28px);
        text-align: left;
    }
    .sub-title {
        padding: 0 rem(28px) rem(15px) rem(28px);
        color: var(--color);
        font-size: rem(32px);
    }
    .confirm-btn {
        position: fixed;
        bottom: 0;
        height: rem(90px);
        background: var(--primary);
        border-color: var(--primary);
        span {
            color: var(--contentColor);
            font-size: rem(32px);
        }
    }
    .api-input {
        margin: rem(20px);
        .van-field {
            border: rem(1px) solid #DEDEDE;
            border-radius: rem(8px);
        }
    }
}
</style>

<style lang="scss">
@import '@/sass/mixin.scss';
.custom-dialog {
    display: flex;
    flex-direction: column;
    height: 90%;
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
            font-size: rem(48px);
        }
        .icon_guanbi {
            font-weight: bold;
            font-size: rem(30px);
        }
    }
    .page-wrap {
        margin-top: 0;
        padding: rem(20px);
        .sub-title {
            margin-top: rem(20px);
            padding: rem(20px) rem(28px) rem(15px) 0;
            color: var(--minorColor);
            font-size: rem(28px);
        }
        .sub-title.col-black {
            color: var(--normalColor);
        }
        .create-tips {
            margin-bottom: rem(40px);
            color: var(--warn);
            font-size: rem(22px);
        }
        .sub-createTipsTxt {
            color: var(--color);
        }
        .perItem {
            display: inline-block;
            margin-right: rem(10px);
            padding: rem(5px);
            color: var(--normalColor);
            font-style: normal;
            background-color: var(--assistColor);
        }
        .txtWrap {
            width: auto;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
}
</style>
