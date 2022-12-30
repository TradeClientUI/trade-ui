<template>
    <div class='recommend'>
        <p class='h1'>
            {{ $t('JG_referral.text4') }}
        </p>
        <div class='step'>
            <p class='num'>
                01
            </p>
            <div class='flex'>
                <div class='left'>
                    <p class='h2'>
                        {{ $t('JG_referral.step1') }}
                    </p>
                    <p class='desc'>
                        {{ $t('JG_referral.stepDesc1') }}
                    </p>
                </div>
                <div class='right fcc'>
                    <div class='border fcc'>
                        <img alt='' class='icon' src='../../../../images/business/openAccount/gift.png' />
                    </div>
                </div>
            </div>
        </div>
        <div class='step'>
            <p class='num'>
                02
            </p>
            <div class='flex'>
                <div class='left'>
                    <p class='h2'>
                        {{ $t('JG_referral.step2') }}
                    </p>
                    <p class='desc'>
                        {{ $t('JG_referral.stepDesc2') }}
                    </p>
                </div>
                <div class='right fcc'>
                    <div class='border fcc'>
                        <img alt='' class='icon' src='../../../../images/business/openAccount/group.png' />
                    </div>
                </div>
            </div>
        </div>
        <div class='step'>
            <p class='num'>
                03
            </p>
            <div class='flex'>
                <div class='left'>
                    <p class='h2'>
                        {{ $t('JG_referral.step3') }}
                    </p>
                    <p class='desc'>
                        {{ $t('JG_referral.stepDesc31') }}
                    </p>
                    <p class='desc'>
                        {{ $t('JG_referral.stepDesc32') }}
                    </p>
                </div>
                <div class='right fcc'>
                    <div class='border fcc'>
                        <img alt='' class='icon' src='../../../../images/business/openAccount/card.png' />
                    </div>
                </div>
            </div>
        </div>
        <p class='h1'>
            {{ $t('JG_referral.text5') }}
        </p>
        <div class='btn_warp'>
            <p class='btn' @click="handleClick('Login')">
                {{ $t('login.loginBtn') }}
            </p>
            <p class='btn' @click="handleClick('Register')">
                {{ $t('register.registerBtn') }}
            </p>
        </div>
    </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
export default {
    setup () {
        const route = useRoute()
        const router = useRouter()
        const { isUniapp } = route.query
        const handleClick = (type) => {
            switch (type) {
                case 'Login': {
                    if (isUniapp && uni) {
                        return uni.postMessage({
                            data: {
                                action: 'message',
                                type: 'refer_login',
                                params: {}
                            }
                        })
                    } else {
                        router.push('/login')
                    }
                    break
                }
                case 'Register': {
                    if (isUniapp && uni) {
                        return uni.postMessage({
                            data: {
                                action: 'message',
                                type: 'refer_register',
                                params: {}
                            }
                        })
                    } else {
                        router.push('/register')
                    }
                    break
                }
            }
        }
        return {
            handleClick
        }
    }
}
</script>

<style lang="scss" scoped>
.recommend{
    .h1{
        background-color: #ffffff;
        padding-top: rem(80px);
        padding-bottom: rem(20px);
        font-size: rem(48px);
        font-weight: 600;
        line-height: rem(72px);
        color: #333333;
        text-align: center;
    }
    .step{
        padding: rem(12px) rem(28px) rem(24px);
        .num{
            font-size: rem(48px);
            font-weight: bold;
            line-height: rem(72px);
            color: #999999;
        }
        .flex{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .h2{
                font-size: rem(32px);
                font-weight: 500;
                line-height: rem(48px);
                margin-bottom: rem(8px);
            }
            .desc{
                font-size: rem(28px);
                color: #999999;
                line-height: rem(42px);

            }
            .right{
                width: rem(84px);
                height: rem(84px);
                background-color: #ebb650;
                border-radius: rem(50px);
                .border{
                    height: rem(77px);
                    width: rem(77px);
                    border: rem(1px) solid #ffffff;
                    border-radius: rem(50px);
                }
                .icon{
                    width: rem(48px);
                    height: rem(48px);
                }
            }
            .fcc{
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
    .btn_warp{
        padding: rem(60px) 0;
        text-align: center;
        background-color: #ffffff;
        .btn{
            height: rem(80px);
            width: rem(336px);
            font-size: rem(32px);
            font-weight: 500;
            color: #FFFFFF;
            background-color: #0062FF;
            display: inline-block;
            line-height: rem(80px);
            border-radius: rem(10px);
            &:first-child{
                margin-right: rem(28px);
            }
        }
    }
}
</style>
