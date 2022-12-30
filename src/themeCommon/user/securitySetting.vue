<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' :custom-back='true' :menu='false' :title='$t("cRoute.securitySetting")' @back='$router.push("/")' />
        <van-cell-group :border='false' class='cellGroup'>
            <van-cell
                class='cellItem'
                is-link
                :title='$t("common.mobile")'
                :to='customInfo.phone ? "/changeBindMobile" : "/bindMobile"'
            >
                <template #right-icon>
                    <span class='right-val' :class="customInfo.phone ? 'yet' : 'none'">
                        {{ customInfo?.phone ? $t('common.modify') : $t('common.noneBind') }}
                    </span>
                    <van-icon name='arrow' />
                </template>
            </van-cell>
            <van-cell
                class='cellItem'
                is-link
                :title='$t("common.email")'
                :to="customInfo.email ? '/changeBindEmail' : '/bindEmail'"
                value=''
            >
                <template #right-icon>
                    <span class='right-val' :class="customInfo.email ? 'yet' : 'none'">
                        {{ customInfo?.email ? $t('common.modify') : $t('common.noneBind') }}
                    </span>
                    <van-icon name='arrow' />
                </template>
            </van-cell>
            <van-cell
                class='cellItem'
                is-link
                :title='$t("login.loginPwd")'
                to='/setLoginPwd'
                value=''
            >
                <template #right-icon>
                    <span class='right-val' :class="Number(customInfo.loginPassStatus) === 2 ? 'yet' : 'none'">
                        {{ Number(customInfo.loginPassStatus) === 1 ? $t('common.noSet') : $t('common.modify') }}
                    </span>
                    <van-icon name='arrow' />
                </template>
            </van-cell>
            <van-cell
                class='cellItem'
                is-link
                :title='$t("common.fundPwd")'
                to='/setFundPwd'
                value=''
            >
                <template #right-icon>
                    <span class='right-val' :class="Number(customInfo.assertPassStatus) === 2 ? 'yet' : 'none'">
                        {{ Number(customInfo?.assertPassStatus) === 1 ? $t('common.noSet') : $t('common.modify') }}
                    </span>
                    <van-icon name='arrow' />
                </template>
            </van-cell>
            <van-cell
                class='cellItem'
                is-link
                :title='$t("bank.bankList")'
                to='/bankList'
                value=''
            />
            <van-cell
                class='cellItem'
                is-link
                :title='$t("withdraw.withdrawLink")'
                to='/walletAddress'
                value=''
            />
            <van-cell
                class='cellItem'
                is-link
                :title='$t("mfa.routeTitile")'
                to='/googleMFA/status'
            >
                <template #right-icon>
                    <span class='right-val' :class="customInfo.googleId>0 ? 'yet' : 'none'">
                        {{ customInfo.googleId>0 ? $t("mfa.status1"):$t("mfa.status0") }}
                    </span>
                    <van-icon name='arrow' />
                </template>
            </van-cell>
        </van-cell-group>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { Dialog } from 'vant'
import { useRouter } from 'vue-router'
import { onBeforeMount, computed, reactive, getCurrentInstance, toRefs, onUnmounted } from 'vue'
export default {
    setup (props, context) {
        const instance = getCurrentInstance()
        const { t, locale } = useI18n({ useScope: 'global' })
        const store = useStore()
        const router = useRouter()
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const state = reactive({})

        return {
            customInfo
        }
    },
}
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    padding-top: rem(110px);
    background: var(--bgColor);
    .header {
        padding-bottom: rem(30px);
        padding-left: rem(30px);
        font-size: rem(48px);
        background: var(--contentColor);
    }
    .cellGroup {
        .cellItem {
            display: flex;
            align-items: center;
            height: rem(120px);
            font-size: rem(32px);
            background: var(--contentColor);
            background: var(--contentColor);
            border-top: solid rem(10px) var(--bgColor);
            //margin-top: rem(10px);
            &::after {
                border: none;
            }
            :deep(.van-cell__value){
                display: none;
            }
            :deep(.van-cell__title) {
                color: var(--color);
            }
            :deep(.van-icon-arrow) {
                margin-top: -2px;
            }
            .right-val {
                margin-right: rem(10px);
                color: var(--minorColor);
                font-size: rem(28px);
                vertical-align: middle;
                &.none {
                    color: var(--warn);
                }
            }
            .van-icon {
                margin-top: -2px;
                color: var(--minorColor);
            }
        }
    }
}
</style>
