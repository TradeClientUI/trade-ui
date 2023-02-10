<template>
    <router-view />
    <div class='pageWrap'>
        <topNav class='header' />
        <div class='container'>
            <div class='content'>
                <section class='registerSuccess'>
                    <div class='icon'>
                        <i class='icon_success'></i>
                    </div>
                    <div class='container'>
                        <h2>{{ $t('register.openSuccess') }}</h2>
                    </div>
                </section>
                <registerProductList />
                <registerSuccessBanner :toDeposit="toDeposit"/>
            </div>
        </div>
    </div>
</template>

<script>
import topNav from '@planspc/layout/topNav'
import { registerSuccessBanner } from '@/components/registerActivity'
import registerProductList from './registerProductList'
import useMethods from '@planspc/hooks/useMethods'

export default {
    name: 'RegisterSuccess',
    components: {
        topNav,
        registerSuccessBanner,
        registerProductList
    },
      setup () {
        const { toDeposit }  = useMethods()

        return {
            toDeposit,
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

.pageWrap {
    position: relative;
    display: flex;
    flex-flow: column;
    height: 100%;

    .container {
        padding: 20px 0;
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;

        .content {
            width: 550px;
            padding: 35px 25px 25px;
            background-color: var(--contentColor);
            border-radius: 10px;
            box-shadow: rgb(255, 255, 255) 0 0 0 0, rgba(17, 24, 39, 0.05) 0 0 0 1px, rgba(0, 0, 0, 0.1) 0 20px 25px -5px, rgba(0, 0, 0, 0.1) 0 8px 10px -6px;
        }
    }
}

.registerSuccess {
    margin-bottom: 20px;

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

</style>
