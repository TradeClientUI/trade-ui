<template>
    <div class='wrap'>
        <i class='icon_fail'></i>
        <p class='t1'>
            {{ $t('forgot.setPwdFailed') }}
        </p>
        <p class='t2'>
            {{ $t('forgot.tryLater') }}
        </p>
    </div>
    <div class='footer-bottom'>
        <van-button class='confirmBtn' @click='$router.push("/forgot")'>
            {{ $t('common.tryAgain') }}
        </van-button>
        <span class='line'></span>
        <van-button class='confirmBtn' @click='toService'>
            {{ $t('common.serivce') }}
        </van-button>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
    setup (props) {
        const router = useRouter()
        const store = useStore()
        const onlineServices = computed(() => store.state._base.wpCompanyInfo?.onlineService)
        const toService = () => {
            if (onlineServices.value) { location.href = onlineServices.value }
        }

        return {
            toService,
            onlineServices
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.wrap {
    padding-top: rem(240px);
    text-align: center;
    .icon_fail {
        color: var(--warn);
        font-size: rem(96px);
    }
    .t1 {
        margin-top: rem(40px);
        color: var(--color);
        font-size: rem(46px);
    }
    .t2 {
        margin-top: rem(20px);
        color: var(--color);
        font-size: rem(24px);
    }
    .t3 {
        margin-top: rem(30px);
        color: var(--minorColor);
        font-size: rem(24px);
    }
}
.footer-bottom {
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: center;
    width: 100%;
    background: var(--lineColor);
    .line {
        width: rem(2px);
        height: rem(47px);
        background: var(--placeholder);
    }
    .confirmBtn {
        flex: 1;
        background: var(--lineColor);
        border-color: var(--lineColor);
        span {
            color: var(--color);
            font-size: rem(34px);
        }
    }
}

</style>
