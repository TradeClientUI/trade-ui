<template>
    <centerViewDialog>
        <div class='pageWrap'>
            <Top back left-icon='arrow-left' :right-action='false' show-center :title="$t(isFirstSet ? 'common.settings' : 'common.modify') + $t('common.fundPwd')">
                <template #left>
                    <a class='topBack' href='javascript:;' @click='$router.back()'>
                        <span class='icon_icon_close_big'></span>
                    </a>
                </template>
                <template #right>
                </template>
            </Top>
            <header class='header'>
                <!-- <h1 class='pageTitle'>
                    {{ $t(isFirstSet ? 'common.settings' : 'common.modify') + $t('common.fundPwd') }}
                </h1> -->
                <h6>{{ $t('common.fundPwdTip') }}</h6>
            </header>
            <van-cell-group>
                <div v-if='!isFirstSet' class='form-item'>
                    <van-field
                        v-model='oldPwd'
                        :formatter='formatter'
                        label=''
                        maxlength='6'
                        :placeholder='$t("login.originPwd")'
                        :type='oldPwdVis ? "text" : "password"'
                    />
                    <span class='icon' :class="oldPwdVis ? 'icon_icon_pressed': 'icon_icon_default'" @click='changeState("oldPwdVis")'></span>
                </div>
                <div class='form-item'>
                    <van-field
                        v-model='newPwd'
                        :formatter='formatter'
                        label=''
                        maxlength='6'
                        :placeholder='$t("forgot.inputNewPwd")'
                        :type='newPwdVis ? "text" : "password"'
                    />
                    <span class='icon' :class="newPwdVis ? 'icon_icon_pressed': 'icon_icon_default'" @click='changeState("newPwdVis")'></span>
                </div>
                <div class='form-item'>
                    <van-field
                        v-model='confirmPwd'
                        :formatter='formatter'
                        label=''
                        maxlength='6'
                        :placeholder='$t("forgot.newPwdAgain")'
                        :type='confirmVis ? "text" : "password"'
                    />
                    <span class='icon' :class="confirmVis ? 'icon_icon_pressed': 'icon_icon_default'" @click='changeState("confirmVis")'></span>
                </div>
                <div class='form-item form-item-google'>
                    <googleVerifyCode
                        v-if='googleCodeVis'
                        @getGooleVerifyCode='getGooleVerifyCode'
                    />
                </div>
            </van-cell-group>
            <div v-if='!isFirstSet' class='forgot'>
                <router-link class='href' :to="{ name: 'Forgot', query: { type: 'fund' } }">
                    {{ $t('login.forgotFundPwd') }}
                </router-link>
            </div>
            <van-button class='confirmBtn' @click='handleConfirm'>
                <span>{{ $t('common.sure') }}</span>
            </van-button>
        </div>
    </centerViewDialog>
</template>

<script>
import Top from '@/components/top'
import centerViewDialog from '@planspc/layout/centerViewDialog'
import googleVerifyCode from '@/themeCommon/components/googleVerifyCode.vue'
import { reactive, toRefs, computed } from 'vue'
import { Toast, Dialog } from 'vant'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { bindAssertsPwd, updateAssertsPwd } from '@/api/user'
import md5 from 'js-md5'
import { useI18n } from 'vue-i18n'

export default {
    components: {
        Top,
        centerViewDialog,
        googleVerifyCode,
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const googleCodeVis = computed(() => customInfo.value.googleId > 0)

        const isFirstSet = computed(() => Number(customInfo.value.assertPassStatus) === 1)

        const state = reactive({
            newPwd: '',
            confirmPwd: '',
            oldPwd: '',
            newPwdVis: false,
            confirmVis: false,
            oldPwdVis: false,
            googleCode: ''
        })

        function changeState (type) {
            state[type] = !state[type]
        }

        const getGooleVerifyCode = val => {
            state.googleCode = val
        }

        function formatter (value) {
            // 过滤输入的非数字
            return value.replace(/[^\d]/g, '')
        }

        function handleConfirm () {
            if (!state.oldPwd && !isFirstSet.value) {
                return Toast(t('login.originPwd'))
            }
            if (!state.newPwd) {
                return Toast(t('forgot.inputNewPwd'))
            }
            if (!state.confirmPwd) {
                return Toast(t('forgot.inputSurePwd'))
            }
            if (state.newPwd.length !== 6) {
                return Toast(t('common.fundPwdTip'))
            }

            if (state.newPwd !== state.confirmPwd) {
                return Toast(t('forgot.pwdDiff'))
            }
            if (state.oldPwd === state.newPwd) {
                return Toast(t('forgot.pwdSame'))
            }
            if (googleCodeVis.value && !state.googleCode) {
                return Toast(t('common.inputGoogleCode'))
            }

            const toast = Toast.loading({
                message: t('common.loading'),
                forbidClick: true,
            })

            if (isFirstSet.value) {
                bindAssertsPwd({
                    pwd: md5(state.confirmPwd),
                    googleCode: state.googleCode
                }).then(res => {
                    toast.clear()
                    if (res.check()) {
                        Toast(t('forgot.fundPwdSetSuccess'))
                        store.dispatch('_user/findCustomerInfo')
                        router.back()
                    } else {
                        Toast(res.msg)
                    }
                })
            } else {
                updateAssertsPwd({
                    oldPwd: md5(state.oldPwd),
                    newPwd: md5(state.confirmPwd),
                    googleCode: state.googleCode
                }).then((res) => {
                    toast.clear()
                    if (res.check()) {
                        Toast(t('forgot.fundPwdModifySuccess'))
                        store.dispatch('_user/findCustomerInfo')
                        router.back()
                    } else {
                        Toast(res.msg)
                    }
                })
            }
        }

        return {
            ...toRefs(state),
            changeState,
            customInfo,
            isFirstSet,
            handleConfirm,
            formatter,
            getGooleVerifyCode,
            googleCodeVis
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    position: relative;
    height: 100%;
    background-color: var(--bgColor);
    .header {
        margin: rem(40px) rem(30px);
        h6 {
            font-size: rem(30px);
        }
    }
    .pageTitle {
        margin-bottom: rem(10px);
        color: var(--color);
        font-weight: normal;
        font-size: rem(50px);
    }
    .confirmBtn {
        @include hover();
        position: absolute;
        bottom: 0;
        width: 100%;
        background: var(--lineColor);
        border-color: var(--lineColor);
        span {
            color: var(--color);
            font-size: rem(30px);
        }
    }
    .form-item {
        position: relative;
        .icon {
            position: absolute;
            top: rem(25px);
            right: rem(50px);
            z-index: 99;
            cursor: pointer;
            &::before {
                font-size: rem(30px);
            }
        }
    }
    .form-item-google :deep() {
        .van-cell {
            padding-left: 15px;
            background: none;
        }
        .paste {
            display: none;
        }
    }
    .forgot {
        margin-top: rem(20px);
        padding-right: rem(30px);
        text-align: right;
        .href {
            color: var(--primary);
        }
    }
}
</style>
