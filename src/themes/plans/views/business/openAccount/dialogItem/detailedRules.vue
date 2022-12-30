<template>
    <div class='rules'>
        <p class='header'>
            {{ $t('JG_referral.rulesTitle') }}
            <van-icon class='cross' name='cross' @click='cross' />
        </p>
        <div class='cont'>
            <p class='h1'>
                {{ $t('JG_referral.rulesH1') }}
            </p>
            <p class='desc'>
                {{ $t('JG_referral.rulesText1') }}
            </p>
            <p class='h1'>
                {{ $t('JG_referral.rulesH2') }}
            </p>
            <p class='desc step'>
                <span class='number'>
                    01
                </span>
                {{ $t('JG_referral.step1') }}
            </p>
            <p class='desc step'>
                <span class='number'>
                    02
                </span>
                {{ $t('JG_referral.step2') }}
            </p>
            <p class='desc step'>
                <span class='number'>
                    03
                </span>
                {{ $t('JG_referral.step3') }}
            </p>
            <p class='h1'>
                {{ $t('JG_referral.rulesH3') }}
            </p>
            <div class='table'>
                <van-row>
                    <van-col class='t_header' span='8'>
                        {{ $t('JG_referral.rulesTable1') }}
                    </van-col>
                    <van-col class='t_header' span='16'>
                        {{ $t('JG_referral.rulesTable2') }}
                    </van-col>
                    <van-col class='t_bodey' span='8'>
                        {{ $t('JG_referral.rulesTable3') }}
                    </van-col>
                    <van-col class='t_bodey' span='16'>
                        {{ $t('JG_referral.rulesTable4') }}
                    </van-col>
                    <van-col class='t_bodey' span='8'>
                        {{ $t('JG_referral.rulesTable5') }}
                    </van-col>
                    <van-col class='t_bodey' span='16'>
                        {{ $t('JG_referral.rulesTable6') }}
                    </van-col>
                </van-row>
            </div>
            <p class='h1'>
                {{ $t('JG_referral.rulesH4') }}
            </p>
            <p class='desc mrb40'>
                {{ $t('JG_referral.rulesText5') }}
            </p>
            <p class='desc mrb40'>
                {{ $t('JG_referral.rulesText6') }}
            </p>
            <p class='desc mrb40'>
                {{ $t('JG_referral.rulesText7') }}
            </p>
            <p class='desc mrb40'>
                {{ $t('JG_referral.rulesText8') }}
            </p>
            <p class='desc mrb40'>
                {{ $t('JG_referral.rulesText9') }}
            </p>
            <p class='desc mrb40'>
                {{ $t('JG_referral.rulesText10') }}
            </p>
            <p class='h1'>
                {{ $t('JG_referral.rulesH5') }}
            </p>
            <p class='desc mrb40'>
                {{ $t('JG_referral.rulesText11') }}
            </p>
        </div>
    </div>
</template>

<script>
export default {
    emits: ['changeShowRules'],
    setup (props, { emit }) {
        const cross = () => {
            emit('changeShowRules', false)
        }
        return {
            cross
        }
    }

}
</script>

<style lang="scss" scoped>
.rules{
    .header{
        background-color: #ebb650;
        border-radius: rem(10px) rem(10px) 0px 0px;
        line-height: rem(117px);
        position: relative;
        text-align: center;
        color: #FBFBFB;
        font-size: rem(40px);
        font-weight: 500;
        .cross{
            position: absolute;
            right: rem(28px);
            line-height: rem(117px);
        }
    }
    .cont{
        padding: 0 rem(28px);
        height: 60vh;
        overflow-y: scroll;
        .h1{
            line-height: rem(60px);
            font-size: rem(40px);
            font-weight: 500;
            color: #ebb650;
            margin-top: rem(64px);
            margin-bottom: rem(40px);
        }
        .desc{
            font-size: rem(28px);
            line-height: rem(42px);
            position: relative;
            &.step{
                padding-left: rem(58px);
                margin-bottom: rem(40px);
                &::before{
                    content:'';
                    display: block;
                    width: rem(32px);
                    height: rem(32px);
                    background:#EBB650;
                    border-radius: 50%;
                    margin-right:rem(12px);;
                    position: absolute;
                    bottom: rem(-6px);
                    left: rem(6px);
                }
                .number{
                    position: absolute;
                    font-size: rem(32px);
                    font-weight: 500;
                    left: 0px;
                }
            }
            &.mrb40{
                margin-bottom: rem(40px);
            }

        }
    }
    .table{
        text-align: center;
        .t_header{
            font-size: rem(32px);
            color: #F6F6F6;
            font-weight: 500;
            height: rem(112px);
            line-height: rem(112px);
            background: #EBB650;
            border-top-right-radius: rem(10px);
            &:first-child{
                border-top-left-radius: rem(10px);
                border-top-right-radius: 0px;
            }
        }
        .t_bodey{
            line-height: rem(90px);
            border: rem(2px) solid #EBB650;
            font-size: rem(28px);
            color: rgba(51,51,51,0.8000);
            border-top: 0;
            &.van-col--16{
                border-left: 0;
            }
        }
    }

}

</style>
