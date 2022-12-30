<template>
    <div v-if='!$store.state._user.customerInfo' class='loginMask'>
        <div>
            <router-link to='/register'>
                <van-button class='registerBtn' type='primary'>
                    {{ $t('c.register') }}
                </van-button>
            </router-link>
        </div>
        <p class='or'>
            or
        </p>
        <div>
            <router-link class='loginBtn' to='/login'>
                {{ $t('c.login') }}
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    setup () {
        return {}
    }
}
</script>

<style lang="scss" scoped>
.loginMask {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 2;
    background: rgb(0 0 0 / 20%);
    border-radius: 8px;
    opacity: 0;
    visibility: hidden;
    transition: 0.25s ease-in-out;
    .loginBtn {
        position: relative;
        font-size: 16px;
        color: var(--primary);
        &:hover {
            opacity: 0.8;
        }
        &::after {
            position: absolute;
            content: '';
            bottom: -4px;
            height: 1px;
            width: 100%;
            left: 0;
            background: var(--primary);
        }
    }
    .or {
        color: #FFF;
        font-size: 16px;
    }
    .registerBtn {
        border-radius: 5px;
        height: 40px;
        width: 140px;
        font-size: 16px;
        &:hover {
            opacity: 0.8;
        }
        &:focus,
        &:active {
            transform: scale(0.99);
            opacity: 1;
        }
    }
}
</style>
