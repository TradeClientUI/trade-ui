<template>
    <div class='page-wrap'>
        <Top absolute back left-icon='arrow-left' :right-action='false' show-center>
            <template #left>
                <a class='topBack' href='javascript:;' @click='goBackList'>
                    <span class='icon_icon_close_big'></span>
                </a>
            </template>
        </Top>
        <div class='formBox'>
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
                        <van-icon class='copy-btnPop' :data-clipboard-text='backData.apiKey' name='description' :title="$t('compLang.copy')" @click='copyActiveCode($event,backData.apiKey)' />
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
                        <van-icon class='copy-btnPop' :data-clipboard-text='backData.privateKey' name='description' :title="$t('compLang.copy')" @click='copyActiveCode($event,backData.privateKey)' />
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

                <van-button block class='confirm-btn' type='primary' @click='handleApi'>
                    <span>{{ $t('compLang.confirm') }}</span>
                </van-button>
            </div>
        </div>
    </div>
</template>

<script>
import Top from '@/components/top'
import { onBeforeMount, computed, reactive, watch, toRefs, ref, inject } from 'vue'
import { Toast } from 'vant'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import Clipboard from 'clipboard'

export default {
    components: {
        Top
    },
    props: ['popShow', 'currency', 'googleSafetyData'],
    setup (props, context) {
        const store = useStore()
        // const accountList = computed(() => {
        //     return store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(props.tradeType))
        // })
        const style = computed(() => store.state.style)
        const state = reactive({
            ggSafetyPopupShow: props.popShow,
            curCurrency: props.currency,
            loading: false,
            params: {},
            isCreateOk: false, // 是否创建成功
            backData: { // 创建成功后返回数据
                apiKey: '',
                privateKey: '',
                permissionList: [],
                whiteIps: ''
            },
            googleSafetyData: {},
            googleCode: '', // 谷歌验证码
            phoneCode: '', // 手机验证码
            sendTokenSMS: '', // 手机验证码发送票据
            emailCode: '', // 邮箱验证码
            sendTokenEmail: '', // 邮箱验证码发送票据
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
        const bgColor = style.value.primary + '0D'
        const googleVerifyCodeRef = ref(null)
        const customerInfo = computed(() => store.state._user.customerInfo)

        const isReLoad = inject('isReLoad')

        const goBackList = () => {
            isReLoad(true)
            router.push({ path: '/api' })
        }

        const handleApi = () => {
            isReLoad(true)
            router.push({ path: '/api' })
        }

        const getQuery = () => {
            state.params = route.query
            state.params.permissionDTOList = JSON.parse(route.query.permissionDTOList)
            state.backData = state.params
        }

        // 复制
        const handleCopy = (value) => {
            // console.log('handleCopy:' + value)
            console.log(value)
            var clipboard = new Clipboard('.copy-btnPop')
            console.log(clipboard)
            clipboard.on('success', e => {
                Toast(t('common.copySuccess'))
                // 释放内存
                clipboard.destroy()
            })
            clipboard.on('error', e => {
                // 不支持复制
                console.log('该浏览器不支持自动复制')
                // 释放内存
                clipboard.destroy()
            })
        }

        const copyActiveCode = (e, text) => {
            const clipboard = new Clipboard(e.target, { text: () => text })
            clipboard.on('success', e => {
                Toast(t('common.copySuccess'))
                // 释放内存
                clipboard.off('error')
                clipboard.off('success')
                clipboard.destroy()
            })
            clipboard.on('error', e => {
                // 不支持复制
                Toast('该浏览器不支持自动复制')
                // 释放内存
                clipboard.off('error')
                clipboard.off('success')
                clipboard.destroy()
            })
            clipboard.onClick(e)
        }

        onBeforeMount(() => {
            getQuery()
        })

        return {
            ...toRefs(state),
            goBackList,
            copyActiveCode,
            isReLoad,
            handleApi,
            close,
            handleCopy,
            bgColor,
            customerInfo,
            googleVerifyCodeRef,
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
        margin: 50px 15px 15px;
        .cell {
            margin-bottom: 10px;
        }
        .van-cell {
            padding: 0 0 0 10px;
        }
        .label {
            padding-bottom: 10px;
        }
    }
    .sub-title {
        padding: 5px 28px 5px 0;
        color: var(--minorColor);
        font-size: 14;
        line-height: 24px;
    }
    .sub-title.col-black {
        color: var(--normalColor);
    }
    .create-tips {
        margin: 20px 0;
        color: var(--warn);
        font-size: 14px;
        line-height: 24px;
    }
    .sub-createTipsTxt {
        color: var(--normalColor);
        line-height: 24px;
    }
    .copy-btnPop {
        margin-left: 10px;
        font-size: 18px;
        cursor: pointer;
    }
    .perItem {
        display: inline-block;
        margin-right: 10px;
        padding: 0 5px;
        color: var(--normalColor);
        font-size: rem(24px);
        font-style: normal;
        line-height: 24px;
        background-color: var(--lineColor);
    }
    .txtWrap {
        width: auto;
        min-height: auto;
        overflow: hidden;
        line-height: 24px;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .confirm-btn {
        margin-top: 20px;
    }
}

</style>
