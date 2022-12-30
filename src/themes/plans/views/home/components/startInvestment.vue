<template>
    <div class='startInvestment-module'>
        <h2 class='title'>
            {{ $t('homeJD.tradeSteps') }} <br />
        </h2>
        <div class='step'>
            <div class='step-item item1'>
                <div class='num'>
                    1
                </div>
                <p class='step-title'>
                    <span>{{ $t('homeJD.tradeStep1') }} </span>
                </p>
            </div>
            <p class='jintou-icon'></p>
            <div class='step-item item2'>
                <div class='num'>
                    2
                </div>
                <p class='step-title'>
                    <span>{{ $t('homeJD.tradeStep2') }} </span>
                </p>
            </div>
            <p class='jintou-icon'></p>
            <div class='step-item item3'>
                <div class='num'>
                    3
                </div>
                <p class='step-title'>
                    <span>{{ $t('homeJD.tradeStep3') }} </span>
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
    position: relative;
    .title {
        font-size: rem(50px);
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
            color: var(--color);
            font-size: rem(28px);
            width: rem(522px);
            margin: auto;
            .num {
                width: rem(96px);
                height: rem(96px);
                border-radius: rem(96px);
                border: rem(4px) solid var(--color);
                font-size: rem(40px);
                text-align: center;
                line-height: rem(88px);
                margin-bottom: rem(16px);
            }
            .step-title {
                font-size: rem(32px);
                line-height: rem(48px);
                font-weight: 500;
                color: var(--color);
            }
        }
        .jintou-icon {
            width: rem(2px);
            height: rem(180px);
            background: var(--minorColor);
            margin: rem(24px) auto;
        }
    }
    .activate {
        text-align: center;
        background-color: #F2F4F8;
        padding: rem(80px) 0;
        .top {
            font-size: rem(40px);
            color: var(--color);
            font-weight: 600;
            line-height: rem(47px);
            margin-bottom: rem(20px);
        }
        .center {
            font-size: rem(28px);
            color: var(--normalColor);
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
            color: #FFF;
            margin: rem(40px) auto 0;
        }
    }
}
</style>
