<template>
    <div class='page-wrap'>
        <LayoutTop />
        <section class='registerSuccess'>
            <div class='icon'>
                <i class='icon_success'></i>
            </div>
            <div class='container'>
                <h2>{{ $t('register.openSuccess') }}</h2>
            </div>
            <productList />
            <registerSuccessBanner :to-deposit='toDeposit' />
        </section>
    </div>
</template>

<script>
import { registerSuccessBanner } from '@/components/registerActivity'
import productList from './components/productList'
import useMethods from '@plans/hooks/useMethods'

export default {
    components: {
        productList,
        registerSuccessBanner
    },
    setup () {
        const { toDeposit } = useMethods()

        return {
            toDeposit,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    height: 100%;
    background-color: var(--bgColor);
}
.registerSuccess {
    padding: rem(200px) rem(40px) rem(40px);
    .icon {
        color: var(--success);
        font-size: rem(120px);
        text-align: center;
        .icon_success {
            color: var(--primary);
        }
    }
    .container {
        text-align: center;
        margin-bottom: rem(60px);
        h2 {
            margin: rem(15px) 0 rem(20px);
            font-weight: normal;
            font-size: rem(32px);
        }
    }
    .accountNo {
        color: var(--primary);
    }
}
.success-handle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: rem(20px);
    .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: rem(600px);
        height: rem(100px);
        margin: 0 rem(30px) rem(50px);
        border-radius: rem(10px);
        &.state-1 {
            background: var(--primary);
            color: #FFF;
        }
        &.state-2 {
            color: var(--primary);
            background-color: #F3F8FE;
        }
    }
}
</style>
