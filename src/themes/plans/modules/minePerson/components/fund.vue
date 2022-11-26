<template>
    <div class='page-wrap-fund'>
        <p class='header'>
            {{ $t('assets.totalAssets') }}({{ fundObj?.currency || '--' }})
        </p>
        <p class='balance'>
            {{ fundObj?.balance }}
        </p>
        <div class='btns'>
            <van-button
                size='mini'
                type='primary'
                @click='toDesposit'
            >
                {{ $t('trade.desposit') }}
            </van-button>
            <van-button
                size='mini'
                type='primary'
                @click='toWirhdraw'
            >
                {{ $t('trade.withdraw') }}
            </van-button>
        </div>
    </div>
</template>

<script>
import { onBeforeMount, computed, reactive, toRefs, onUnmounted } from 'vue'
import { queryCustomerAssets } from '@/api/user'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
export default {
    setup (props, context) {
        const router = useRouter()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            fundObj: {}
        })

        const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === 5))
        const accountInfo = computed(() => accountList?.value[0])

        queryCustomerAssets({}).then(res => {
            if (res.check()) {
                state.fundObj = res.data
            }
        }).catch(err => {

        })

        // 跳转充值页面
        const toDesposit = () => {
            if (accountList.value.length > 1) {
                router.push({
                    path: '/chooseAccount',
                    query: {
                        tradeType: 5,
                        type: 2
                    }
                })
            } else {
                router.push({
                    path: '/deposit',
                    query: {
                        accountId: accountInfo.value.accountId,
                        currency: accountInfo.value.currency,
                        tradeType: 5
                    }
                })
            }
        }

        // 跳转提现页面
        const toWirhdraw = () => {
            router.push({
                path: '/withdrawAccount',
                query: {
                    accountId: accountInfo.value.accountId,
                    currency: accountInfo.value.currency,
                    tradeType: 5
                }
            })
        }

        return {
            toDesposit,
            toWirhdraw,
            ...toRefs(state)
        }
    },
}
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.page-wrap-fund{
    margin-top: rem(48px);
    padding: rem(30px);
    border-radius: rem(10px);
    background: var(--lineColor);
    .header{
        font-size: rem(28px);
        color: var(--minorColor);
    }
    .balance{
        font-size: rem(70px);
        margin-bottom: rem(40px);
        margin-top: rem(10px);
        word-break: break-all;
    }
    .btns {
        display: flex;
        height: rem(65px);
        :deep(.van-button) {
            display: block;
            width: 50%;
            height: 100%;
            margin-right: rem(20px);
            font-size: rem(28px);
            line-height: rem(70px);
            border: none;
            color: var(--primary);
            background: var(--contentColor);
            border-radius: rem(6px);
            font-weight: bold;
            &:last-child {
                margin-right: 0;
            }
        }
    }
}

</style>
