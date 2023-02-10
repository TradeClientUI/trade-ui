<template>
    <!-- 移动端首页活动banner -->
    <div v-if='countdownAvailable && !isLogin' class='register-activity'>
        <svg class='gift' fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
            <path d='M13.5 6.379V3h-3v3.379l-2.94-2.94-2.12 2.122L7.878 8H4v3h6.75V8h2.5v3H20V8h-3.879l2.44-2.44-2.122-2.12L13.5 6.378zM4 13.5V20h6.75v-6.5H4zM13.25 20H20v-6.5h-6.75V20z' fill='currentColor' />
        </svg>
        <div class='banner-text' @click.self='goRegister'>
            <span>{{ indexBannerText }} <registerActivityRulePopup /></span>
            <span class='arrow-box'>
                <svg class='arrow' fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' @click='goRegister'>
                    <path clip-rule='evenodd' d='M12.288 12l-3.89 3.89 1.768 1.767L15.823 12l-1.768-1.768-3.889-3.889-1.768 1.768 3.89 3.89z' fill='currentColor' fill-rule='evenodd' />
                </svg>
            </span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useRegisterActivity, registerActivityRulePopup } from '@/components/registerActivity'
import useMethods from '@plans/hooks/useMethods'

const { countdownAvailable, indexBannerText } = useRegisterActivity()
const store = useStore()
const router = useRouter()
const isLogin = computed(() => store.state._user.customerInfo)
const { toDeposit } = useMethods()

const goRegister = () => {
    if (isLogin.value) {
        toDeposit()
    } else {
        router.push({ name: 'Register' })
    }
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.register-activity {
    width: 100%;
    cursor: pointer;
    display: flex;
    font-size: 14px;
    line-height: 24px;
    color: var(--color);
    margin-bottom: rem(25px);
    text-align: left;
    align-items: center;
    .gift {
        margin-right: 5px;
        color: var(--primary);
        fill: var(--primary);
    }
    .arrow {
        color: var(--minorColor);
        fill: var(--minorColor);
    }
    svg {
        width: 24px;
        height: 24px;
    }
    .banner-text {
        flex: 1;
        display: flex;
        align-items: center;
        .arrow-box {
            display: flex;
            align-items: center;
        }
    }
}
</style>
