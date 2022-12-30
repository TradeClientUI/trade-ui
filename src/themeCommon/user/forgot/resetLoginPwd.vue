<template>
    <div class='pageWrap'>
        <Top back left-icon='arrow-left' :menu='false' :right-action='false'>
            <template #right>
            </template>
        </Top>
        <!-- <a class='icon_icon_close_big' href='javascript:;' @click='$router.back()'></a> -->
        <Loading :show='loading' />
        <header class='header'>
            <h1 class='pageTitle'>
                {{ $t('forgot.resetPwd') }}
            </h1>
            <h6>{{ $t('forgot.pwdRule') }}</h6>
        </header>
        <van-cell-group>
            <div class='form-item'>
                <van-field v-model='newPwd' label='' :placeholder='$t("forgot.inputNewPwd")' :type='newPwdVis ? "text" : "password"' />
                <span
                    class='icon'
                    :class="newPwdVis ? 'icon_icon_pressed': 'icon_icon_default'"
                    @click='changeState("newPwdVis")'
                ></span>
            </div>
            <div class='form-item'>
                <van-field v-model='confirmPwd' label='' :placeholder='$t("forgot.newPwdAgain")' :type='confirmVis ? "text" : "password"' />
                <span
                    class='icon'
                    :class="confirmVis ? 'icon_icon_pressed': 'icon_icon_default'"
                    @click='changeState("confirmVis")'
                ></span>
            </div>
        </van-cell-group>
        <van-button class='confirmBtn' @click='handleConfirm'>
            <span>{{ $t('common.sure') }}</span>
        </van-button>
    </div>
</template>

<script>
import Top from '@/components/top'
import { reactive, toRefs } from 'vue'
import { Field, Toast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import { findPwd } from '@/api/user'
import md5 from 'js-md5'
import { useI18n } from 'vue-i18n'
import { localSet, pwdReg } from '@/utils/util'

export default {
    name: 'ResetPwd',
    components: {
        Top,
        Field
    },
    setup (props) {
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            newPwd: '',
            confirmPwd: '',
            newPwdVis: false,
            confirmVis: false,
            loading: false
        })

        function changeState (type) {
            state[type] = !state[type]
        }

        function handleConfirm () {
            if (!state.newPwd) {
                return Toast(t('forgot.inputNewPwd'))
            }
            if (!state.confirmPwd) {
                return Toast(t('forgot.inputSurePwd'))
            }
            if (state.newPwd.length < 6 || state.newPwd.length > 16) {
                return Toast(t('forgot.pwdRule'))
            }
            if (state.newPwd !== state.confirmPwd) {
                return Toast(t('forgot.pwdDiff'))
            }
            if (!pwdReg.test(state.newPwd)) {
                return Toast(t('forgot.pwdRule'))
            }

            const params = {
                type: route.query['type'], // 1邮箱，2手机号码，3客户账号
                loginName: route.query['loginName'],
                phoneArea: route.query['phoneArea'],
                verifyCode: route.query['verifyCode'],
                newPwd: md5(state.confirmPwd),
                sendToken: route.query['sendToken'],
                verifyCodeToken: route.query['verifyCodeToken'],
                googleCode: route.query['googleCode']
            }
            state.loading = true
            findPwd(params).then((res) => {
                state.loading = false
                if (res.check()) {
                    localSet('loginNameType', route.query['type'] === '1' ? 'email' : 'mobile')
                    router.push('/resetSuccess')
                }
            }).catch(err => {
                state.loading = false
                router.push('/resetFail')
            })
        }

        return {
            ...toRefs(state),
            changeState,
            handleConfirm
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    position: relative;
    height: 100%;
    .header {
        // display: flex;
        align-items: center;
        justify-content: space-between;
        margin: rem(40px) rem(30px);
    }
    .pageTitle {
        margin-bottom: rem(10px);
        font-weight: normal;
        font-size: rem(50px);
    }
    .confirmBtn {
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
}
</style>
