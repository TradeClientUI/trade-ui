<template>
    <div class='page-wrap'>
        <div class='page-top'>
            <p class='h1'>
                {{ $t('JG_referral.text1') }}
            </p>
            <p class='context'>
                <span class='context_left'>
                    {{ $t('JG_referral.text2') }}
                </span>
                <span>{{ $t('JG_referral.text3') }}</span>
            </p>
            <p class='btn' @click='showRules = true'>
                {{ $t('JG_referral.rulesBtn') }}
            </p>
        </div>
        <FinancialData v-if='isLogin' />
        <Recommendition v-else />
        <NewFooter />
        <van-dialog v-model:show='showRules' :close-on-click-overlay='true' :show-confirm-button='false' style='width: 90vw'>
            <DetailedRules @changeShowRules='changeShowRules' />
        </van-dialog>
    </div>
</template>

<script>
import NewFooter from '../../../layout/layoutBottom'
import FinancialData from './financialData/index'
import Recommendition from './recommendition/index'
import DetailedRules from './dialogItem/detailedRules'
import { useStore } from 'vuex'
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
// import { Dialog } from 'vant'
export default {
    components: {
        FinancialData,
        Recommendition,
        DetailedRules,
        NewFooter
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const wapisLogin = computed(() => store.state._user.customerInfo)
        const appisLogin = route.query.isLogin
        const isLogin = wapisLogin.value || appisLogin
        const showRules = ref(false)
        const changeShowRules = (value) => {
            console.log(value)
            showRules.value = value
        }
        const { isApp } = route.query
        onMounted(() => {
            // app隐藏头部和底部导航栏
            if (isApp) {
                document.querySelector('.nav-wrap').style.display = 'none'
                document.querySelector('#nav-footer').style.display = 'none'
            }
        })
        return {
            isLogin,
            showRules,
            changeShowRules
        }
    }
}
</script>

<style lang="scss" scoped>
.page-top{
    height: rem(550px);
    background: linear-gradient(45deg, #4D44EF 0%, #61E8F6 100%);
    padding: rem(88px) rem(48px) rem(28px);
    .h1{
        font-size: rem(48px);
        font-weight: 600;
        color: #FFFFFF;
        text-align: center;
        margin-bottom: rem(20px);
    }
    .context{
        margin: rem(34px) 0;
        text-align: center;
        color: rgba(255, 255, 255, 0.7);
        font-size: rem(28px);
        line-height: rem(43px);
        &_left{
            margin-right: rem(43px);
        }
    }
    .btn{
        width: rem(360px);
        height: rem(88px);
        background: #ebb650;
        box-shadow: rem(0px) rem(4px) rem(0px) rem(2px) rgba(227,161,34,1);
        border-radius: rem(88px);
        border: 1px solid #ebb650;
        font-size: rem(32px);
        font-weight: 500;
        line-height: rem(88px);
        color: #FFFFFF;
        text-align: center;
        cursor: pointer;
        margin: rem(48px) auto;
    }
}
</style>
