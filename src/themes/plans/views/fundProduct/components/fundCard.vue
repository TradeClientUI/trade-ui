<template>
    <section class='fundCard'>
        <figure class='figureImg'>
            <CurrencyIcon class='currencyImg' :currency='fund.shareTokenCode' size='60' />
            <h2 class='fundCurrency'>
                {{ fund.fundName }}
            </h2>
        </figure>
        <div class='fundType'>
            <span class='operation'>
                {{ fund.operationMode===1 ? $t('fundInfo.operationModeValue1') : $t('fundInfo.operationModeValue2') }}
            </span>
            <span class='title'>
                {{ fund.fundType }}
            </span>
        </div>
        <div class='desc'>
            {{ fund.introduction }}
        </div>
        <ul class='valueList'>
            <li class='item'>
                <p class='muted'>
                    {{ $t('fundInfo.realtimeJZ') }}({{ fund.currency }})
                </p>
                <p>
                    <span>{{ fund.netValue }}</span>
                </p>
                <p>
                    <span>
                        {{ fund.netValueChangeQuote }}
                    </span>
                    <i class='hours24' :class="[parseFloat(fund.netValueChangeQuote)<0 ? 'down':'up']">
                        24H
                    </i>
                </p>
            </li>
            <li class='item'>
                <p class='muted'>
                    {{ $t('fundInfo.marketPrice') }}({{ fund.currency }})
                </p>
                <p>
                    <span>{{ fund.marketPrice }}</span>
                </p>
                <p>
                    <span>
                        {{ fund.marketPriceChangeQuote }}
                    </span>
                    <i class='hours24' :class="[parseFloat(fund.marketPriceChangeQuote)<0 ? 'down':'up']">
                        24H
                    </i>
                </p>
            </li>
            <li class='item'>
                <p class='muted'>
                    {{ $t('fundInfo.totalMarketValue') }}({{ fund.currency }})
                </p>
                <p>
                    <span>{{ fund.totalBalance }}</span>
                </p>
            </li>
            <li class='item'>
                <p class='muted'>
                    {{ $t('fundInfo.latestPart') }}
                </p>
                <p>
                    <span>{{ fund.latestShare }}</span>
                </p>
            </li>
        </ul>
    </section>
</template>

<script setup>
import { defineProps } from 'vue'
import CurrencyIcon from '@/components/currencyIcon.vue'
defineProps({
    fund: Object
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.fundCard{
    background: var(--contentColor);
    padding: rem(30px);
    margin: rem(80px) rem(30px) rem(30px) rem(30px);
    border-radius: rem(15px);
    box-shadow: 0 0 rem(12px) rgba(0, 0, 0, .2);
    position: relative;
}
.figureImg{
    position: relative;
    padding-top: 20px;
    .currencyImg{
        position: absolute;
        top: -40px;
        left: 50%;
        margin-left: -25px;
    }
    .fundCurrency{
        margin-top: rem(20px);
        text-align: center;
        font-size: rem(50px);
    }
}
.fundType{
    margin-top: rem(78px);
    text-align: center;
    font-size: rem(32px);
    font-weight: bold;
    .operation{
        display: inline-block;
        padding-right: rem(20px);
        // margin-right: rem(20px);
        // border-left: 1px solid var(--minorColor);
        // color: var(--minorColor);
        line-height: 1;
    }
}
.desc{
    margin-top: 5px;
    line-height: 1.4;
    font-size: rem(28px);
    word-break: break-word;
}
.valueList{
    background: var(--contentColor);
    margin-top: rem(30px);
    border-top: 1px solid var(--assistColor);
    padding-top: rem(30px);
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-row-gap: rem(20px);
    grid-column-gap: rem(20px);
    .item{
        position: relative;
        background: var(--bgColor);
        border-radius: rem(10px);
        padding: rem(15px) rem(20px);
        line-height: 1.5;
        .hours24{
            // position: absolute;
            // right: rem(15px);
            // top: rem(18px);
            position: relative;
            margin-left: 5px;
            background: var(--placeholdColor);
            font-size: rem(22px);
            padding:0 rem(26px) 0 rem(6px);
            border-radius: rem(6px);
            color: var(--color);
            vertical-align: middle;

            &::after{
                content: '';
                position: absolute;
                right: rem(6px);
                top: rem(4px);
                width: 0;
                height: 0;
                border: 8px solid var(--normalColor);
                border-radius: 2px;
                border-width: 7px 4px 0 4px;
                border-color: var(--normalColor) transparent transparent transparent;
            }
            &.up{
                color: var(--riseColor);
                background: var(--quoteFallBg);
            }
            &.up::after{
                border-width: 0 4px 7px 4px;
                border-color: transparent transparent var(--riseColor)  transparent;
            }
            &.down{
                color: var(--fallColor);
                background: var(--quoteRiseBg);
            }
            &.down::after{
                border-width: 7px 4px 0 4px;
                border-color: var(--fallColor) transparent transparent transparent;
            }
        }
    }
    .mleft5{
        margin-left: 5px;
    }
}
</style>
