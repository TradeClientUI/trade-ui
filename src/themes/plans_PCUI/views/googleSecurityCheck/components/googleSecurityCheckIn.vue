// 谷歌安全验证
<template>
    <div class='page-wrap'>
        <!-- <LayoutTop :back='true' /> -->
        <Top absolute back left-icon='arrow-left' :right-action='false' show-center>
            <template #left>
                <a class='topBack' href='javascript:;' @click='$router.back()'>
                    <span class='icon_icon_close_big'></span>
                </a>
            </template>
        </Top>

        <!-- 谷歌安全验证 -->
        <GoogleSecurityCheck
            ref='googleSecurityCheck'
            @update:googleSafetyData='updateGoogleSafetyData'
            @update:loading='updateLoading'
        />
    </div>
</template>

<script>
import Top from '@/components/top'
import { onBeforeMount, computed, reactive, watch, toRefs, ref, onUnmounted } from 'vue'
import { Dialog, Toast } from 'vant'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { createCustomerApi, editCustomerApiSave } from '@/api/user'
import GoogleSecurityCheck from '@/themes/plans_PCUI/components/googleSecurityCheck.vue'

export default {
    components: {
        Top,
        GoogleSecurityCheck
    },
    setup (props, context) {
        const store = useStore()
        // const accountList = computed(() => {
        //     return store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(props.tradeType))
        // })
        const style = computed(() => store.state.style)
        const state = reactive({
            loading: false,
            ggSafetyPopupShow: false,
            googleSafetyData: {},
            applySuccessShow: false,
            query: {
                purview: [],
                tag: '',
            },
            originPage: '',
            params: {},
            editParams: {},
            isCreateOk: false, // 是否创建成功
            backData: { // 创建成功后返回数据
                apiKey: '',
                privateKey: '',
                permissionList: [],
                whiteIps: ''
            }
        })

        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const { id } = route.query

        watch(() => state.ggSafetyPopupShow, val => {
            context.emit('update:ggSafetyPopupShow', val)
        })

        const close = () => {
            context.emit('update:popShow', false)
        }

        const checkCurrency = (currency) => {
            state.curCurrency = currency.currency
            // currency.fullName = state.assetsMap[currency.currency]
            context.emit('update:currency', currency)
            // state.popupShow = false
        }
        const bgColor = style.value.primary + '0D'

        const googleVerifyCodeRef = ref(null)
        const customerInfo = computed(() => store.state._user.customerInfo)
        console.log(customerInfo.value)

        const handleSaveCheck = () => {
            state.loading = true
            console.log(state.query)
            const params = state.query
            // delete params.originPage
            // delete params.purview
            createCustomerApi(params).then(res => {
                state.loading = false
                console.log(res)
                if (Number(res.code) === 0) { // 创建成功
                    // applySuccessShowFn(true)
                    console.log('创建成功！')
                    state.isCreateOk = true
                    state.backData = res.data
                    if (state.backData.whiteIps == null) {
                        state.backData.whiteIps = '--'
                    }
                    state.backData.permissionDTOList = JSON.stringify(res.data.permissionDTOList)
                    // handRoutTo('/api/createSuccess', state.backData)
                    router.push({
                        path: '/api/api/createSuccess',
                        query: state.backData
                    })
                } else {
                    Toast(res.msg)
                    state.loading = false
                }
            }).catch(err => {
                state.loading = false
            })
        }

        const handleEditSave = () => {
            state.loading = true
            const _params = {
                ...state.editParams,
                ...state.query
            }
            // delete _params.originPage
            // delete _params.purview
            console.log(_params)
            editCustomerApiSave(_params).then(res => {
                state.loading = false
                if (Number(res.code) === 0) {
                    console.log(res)
                    Toast(t('api.editSuccess'))
                    setTimeout(() => {
                        router.push({ path: '/api', query: { reload: true } })
                    }, 1500)
                } else {
                    Toast(res.msg)
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // 更新返回的谷歌安全验证参数，
        const updateGoogleSafetyData = val => {
            state.googleSafetyData = val
            if (state.googleSafetyData.googleCode) {
                state.ggSafetyPopupShow = false
                state.googleSafetyData.tag = state.query.tag
                state.query = {
                    purview: state.query.purview,
                    tag: state.query.tag,
                    originPage: state.query.originPage,
                    ...state.googleSafetyData,
                }
                console.log(state.query)
                console.log('updateGoogleSafetyData:157')
                if (state.originPage === 'apiList') {
                    handleSaveCheck()
                }

                if (state.originPage === 'apiEdit') {
                    handleEditSave()
                }
            }
        }

        const updateLoading = val => {
            state.loading = val
        }

        const getQuery = () => {
            state.params = route.query
            console.log(state.params)
            state.query.tag = route.query.tag
            state.originPage = route.query.originPage
            if (route.query.editParams) {
                state.editParams = JSON.parse(route.query.editParams)
            }
        }

        // 路由跳转
        const handRoutTo = (path, query) => router.push({
            path: route.path + path,
            query: query
        })

        onBeforeMount(() => {
            getQuery()
            // applySuccessShowFn(true)
        })

        return {
            ...toRefs(state),
            updateGoogleSafetyData,
            updateLoading,
            handRoutTo,
            getQuery,
            handleSaveCheck,
            close,
            bgColor,
            checkCurrency,
            customerInfo,
            googleVerifyCodeRef
        }
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.custom-dialog {
    display: flex;
    flex-direction: column;
    height: 92%;
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
}
</style>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    width: 100%;
    height: 100%;
    margin-top: rem(20px);
    overflow: auto;
    // background: var(--contentColor);
    :deep(.topNav .main) {
        max-width: 100%;
    }
    .formBox {
        margin: rem(10px);
        .cell {
            margin-bottom: rem(30px);
        }
        .van-cell {
            padding: 0 0 0 rem(20px);
        }
        .label {
            padding-bottom: rem(20px);
        }
        .copyBtn {
            display: block;
            width: rem(150px);
            height: rem(66px);
            color: var(--primary);
            line-height: rem(66px);
            text-align: center;
        }
    }
    .footerBox {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
    }
}

</style>
