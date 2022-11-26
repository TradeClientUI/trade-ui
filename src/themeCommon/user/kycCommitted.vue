<template>
    <div class='pageWrap'>
        <i class='icon_success'></i>
        <p class='t1'>
            {{ $t('auth.tips0') }}
        </p>
        <p class='t2'>
            {{ $t('auth.tips1') }}
        </p>

        <!--
        <p class='t2'>
            {{ $t('auth.tips2') }}
        </p>
        -->
        

        <div class='btns'>
            <van-button hairline class="leBtn" type='success' @click='$router.replace({ name: "Home" })'>
                {{ $t('common.backHome') }}
            </van-button>
            <van-button hairline  class="riBtn" type='default' @click='$router.replace({ name: "Authentication" })'>
                {{ $t('common.lookProcess') }}
            </van-button>
        </div>
    </div>
</template>

<script>
import { onBeforeRouteLeave, useRouter } from 'vue-router'
export default {
    setup (props, context) {
        const router = useRouter()
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    padding: rem(100px) rem(30px) rem(30px);
    text-align: center;
    background: var(--contentColor);
    .icon_success {
        color: var(--primary);
        font-size: rem(96px);
    }
    .t1 {
        margin-top: rem(20px);
        font-weight: bold;
        font-size: rem(36px);
    }
    .t2 {
        line-height: rem(50px);
        text-align: center;
    }
    .btns {
        display: flex;
        justify-content: space-around;
        margin-top: rem(50px);
        .leBtn{
            background: var(--primary);
            width:rem(300px);
        }
        .riBtn{
            width:rem(300px);
            color: var(--primary);
            border: 1px solid var(--primary);
        }
    }
}

</style>
