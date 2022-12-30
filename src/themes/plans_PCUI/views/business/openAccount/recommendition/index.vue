<template>
    <div class='page-content'>
        <p class='text_title'>
            {{ $t('JG_referral.text4') }}
        </p>
        <el-row class='row' justify='space-between'>
            <el-col class='col' :span='8'>
                <ul>
                    <li class='title'>
                        01
                    </li>
                    <li>
                        <div class='flex'>
                            <div class='left'>
                                <span class='h2'>
                                    {{ $t('JG_referral.step1') }}
                                </span>
                                <span class='desc'>
                                    {{ $t('JG_referral.stepDesc1') }}
                                </span>
                            </div>
                            <div class='right fcc'>
                                <div class='border fcc'>
                                    <img alt='' class='icon' src='../../../../images/business/openAccount/gift.png' />
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </el-col>
            <el-col class='col' :span='8'>
                <ul>
                    <li class='title'>
                        02
                    </li>
                    <li>
                        <div class='flex'>
                            <div class='left'>
                                <span class='h2'>
                                    {{ $t('JG_referral.step2') }}
                                </span>
                                <span class='desc'>
                                    {{ $t('JG_referral.stepDesc2') }}
                                </span>
                            </div>
                            <div class='right fcc'>
                                <div class='border fcc'>
                                    <img alt='' class='icon' src='../../../../images/business/openAccount/group.png' />
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </el-col>
            <el-col class='col' :span='8'>
                <ul>
                    <li class='title'>
                        03
                    </li>
                    <li>
                        <div class='flex'>
                            <div class='left'>
                                <span class='h2'>
                                    {{ $t('JG_referral.step3') }}
                                </span>
                                <span class='desc'>
                                    {{ $t('JG_referral.stepDesc31') }}
                                </span>
                                <span class='desc'>
                                    {{ $t('JG_referral.stepDesc32') }}
                                </span>
                            </div>
                            <div class='right fcc'>
                                <div class='border fcc'>
                                    <img alt='' class='icon' src='../../../../images/business/openAccount/card.png' />
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </el-col>
        </el-row>
        <p class='text_title'>
            {{ $t('JG_referral.text5') }}
        </p>
        <div class='btn_warp'>
            <router-link class='btn' to='/login'>
                {{ $t('login.loginBtn') }}
            </router-link>
            <router-link class='btn' to='/register'>
                {{ $t('register.registerBtn') }}
            </router-link>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
    emits: ['update:show'],
    setup () {
        const router = useRouter()
        const register = () => {
            router.push('/register')
        }
        const login = () => {
            router.push('/login')
        }
        return {
            register,
            login
        }
    }
}

</script>

<style lang="scss" scoped>
.page-content{
    background-color: #ffffff;
    padding: 60px;
}
.text_title{
    margin: auto;
    margin-bottom: 24px;
    text-align: center;
    height: 45px;
    font-size: 30px;
    font-weight: 600;
    color: #333333;
    line-height: 45px;
}
.row{
    width: 1200px;
    margin: auto;
    margin-bottom: 60px;
    .col{
        height: 201px;
        max-width: 381px;
        background: #F5F5F5;
        border-radius: 5px 5px 5px 5px;
        opacity: 1;
        padding: 12px 24px 24px;
    }
    .title{
        height: 45px;
        font-size: 30px;
        font-weight: 600;
        color: #999999;
        line-height: 45px;
    }
    .flex{
        margin-top: 24px;
        display: flex;
        justify-content: space-between;
        .h2{
            display: block;
            height: 30px;
            font-size: 20px;
            font-weight: 600;
            color: #333333;
            line-height: 30px;
            margin-bottom: 4px;
        }
        .desc{
            display: block;
            height: 24px;
            font-size: 16px;
            color: #999999;
            line-height: 24px;
        }
        .icon{
            width: 48px;
            height: 48px;
        }
        .right{
            width: 84px;
            height: 84px;
            background-color: #ebb650;
            border-radius: 50px;
            .border{
                height: 77px;
                width: 77px;
                border: 2px solid #ffffff;
                border-radius: 50px;
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
    margin: 60px auto;
    width: 1200px;
    text-align: center;
    .btn{
        height: 69px;
        width: 320px;
        font-size: 30px;
        font-weight: 600;
        color: #FFFFFF;
        margin: 0 120px;
        background-color: #0062FF;
        display: inline-block;
        line-height: 69px;
        border-radius: 4px;
        cursor: pointer;
    }
}

</style>
