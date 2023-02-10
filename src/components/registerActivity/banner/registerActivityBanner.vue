<template>
    <!-- pc端首页活动banner -->
    <div v-if='countdownAvailable' class='register-activity'>
        <svg
            class='gift'
            fill='none'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
        >
            <path
                d='M13.5 6.379V3h-3v3.379l-2.94-2.94-2.12 2.122L7.878 8H4v3h6.75V8h2.5v3H20V8h-3.879l2.44-2.44-2.122-2.12L13.5 6.378zM4 13.5V20h6.75v-6.5H4zM13.25 20H20v-6.5h-6.75V20z'
                fill='currentColor'
            />
        </svg>
        <span @click.self='goRegister'>
            {{ indexBannerText }}
            <registerActivityRuleDialog />
        </span>
        <svg
            class='arrow'
            fill='none'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
            @click='goRegister'
        >
            <path
                clip-rule='evenodd'
                d='M12.288 12l-3.89 3.89 1.768 1.767L15.823 12l-1.768-1.768-3.889-3.889-1.768 1.768 3.89 3.89z'
                fill='currentColor'
                fill-rule='evenodd'
            />
        </svg>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
    registerActivityRuleDialog,
    useRegisterActivity,
} from '@/components/registerActivity'

const router = useRouter()
const { countdownAvailable, indexBannerText } = useRegisterActivity()

const goRegister = () => {
    router.push({ name: 'Register' })
}
</script>

<style lang="scss" scoped>
.register-activity {
    cursor: pointer;
    display: flex;
    font-size: 16px;
    margin-bottom: 10px;
    align-items: center;
    min-width: 700px;
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
        font-size: 24px;
    }
}
</style>
