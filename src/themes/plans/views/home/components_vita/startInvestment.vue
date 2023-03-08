<template>
    <div class='startInvestment-module'>
        <h2 class='title'>
            Start your first trade <br /> with these 3 steps
        </h2>
        <div class='step'>
            <div class='step-item item1'>
                <div class='num'>
                    1
                </div>
                <p class='step-title'>
                    <span>Register for a new account</span>
                </p>
            </div>
            <p class='jintou-icon'></p>
            <div class='step-item item2'>
                <div class='num'>
                    2
                </div>
                <p class='step-title'>
                    <span>Deposit into your account</span>
                </p>
            </div>
            <p class='jintou-icon'></p>
            <div class='step-item item3'>
                <div class='num'>
                    3
                </div>
                <p class='step-title'>
                    <span>Start investing in funds</span>
                </p>
            </div>
        </div>
        <!-- <div class='activate'>
            <p class='top'>
                Activate novice rewards
            </p>
            <p class='center'>
                Now register and recharge up to <br /> 150 usdt for new users!
            </p>
            <p class='btn' @click="$router.push('/faqs')">
                Activate now
            </p>
        </div> -->
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.startInvestment-module {
    @include globalFont();
    position: relative;
    .title {
        font-size: rem(56px);
        line-height: rem(66px);
        padding: rem(96px) 0;
        text-align: center;
        font-weight: bold;
    }
    .step {
        // margin-bottom: rem(80px);
        &-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-weight: 400;
            color: #111;
            font-size: rem(28px);
            width: rem(522px);
            margin: auto;
            .num{
                width: rem(96px);
                height: rem(96px);
                border-radius: rem(96px);
                border: rem(4px) solid #333333;
                font-size: rem(40px);
                text-align: center;
                line-height: rem(88px);
                margin-bottom: rem(16px);
            }
            .step-title {
                font-size: rem(32px);
                line-height: rem(48px);
                font-weight: 500;
                color: #111;
            }
        }
        .jintou-icon {
            width:rem(2px);
            height:rem(180px);
            background: #999;
            margin: rem(24px) auto;
        }
    }
    .activate {
        text-align: center;
        background-color: #F2F4F8;
        padding: rem(80px) 0;
        .top {
            font-size: rem(40px);
            color:#111;
            font-weight: 600;
            line-height: rem(47px);
            margin-bottom: rem(20px);
        }
        .center{
            font-size: rem(28px);
            color: #666666 ;
            line-height: rem(42px);
            font-weight: 400;
        }
        .btn {
            text-align: center;
            font-size: rem(32px);
            font-weight: 500;
            width: rem(288px);
            line-height: rem(92px);
            background: #0062FF;
            border-radius: rem(20px);
            color:#fff;
            margin: rem(40px) auto 0;
        }
    }
}
</style>
