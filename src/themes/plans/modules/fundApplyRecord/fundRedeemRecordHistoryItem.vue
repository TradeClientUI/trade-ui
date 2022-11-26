<template>
    <div class='fundApplyRecordItem' @click='full=true'>
        <p class='title'>
            {{ $t('fundInfo.sell') }}  {{ data.fundName }}
        </p>
        <ul class='infos' :class='{ "full": full || index===0 }'>
            <li class='item'>
                <span class='label'>
                    {{ $t('fundInfo.redeemShares') }}({{ data.currencyShares }})
                </span>
                <span>{{ data.shares }}</span>
            </li>
            <li class='item'>
                <span class='label'>
                    {{ $t('fundInfo.realtimeJZ') }}({{ data.currencyNet }})
                </span>
                <span>{{ data.sharesNet }}</span>
            </li>
            <li class='item'>
                <span class='label'>
                    {{ $t('fundInfo.redeemFees') }}
                    <em v-if="data.currencyRedeem !== 'self'">
                        ({{ data.currencyRedeem }})
                    </em>
                </span>
                <span v-if="data.currencyRedeem === 'self'" class='href' @click='showDetail(data.proposalNo)'>
                    {{ $t('common.look') }}
                </span>
                <span v-else>
                    {{ data.fees }}
                </span>
            </li>
            <li class='item'>
                <span class='label'>
                    {{ $t('fundInfo.redeemAmount') }}
                    <em v-if="data.currencyRedeem !== 'self'">
                        ({{ data.currencyRedeem }})
                    </em>
                </span>
                <span v-if="data.currencyRedeem === 'self'" class='href' @click='showDetail(data.proposalNo)'>
                    {{ $t('common.look') }}
                </span>
                <span v-else>
                    {{ data.amountRedeem }}
                </span>
            </li>
            <li class='item'>
                <span class='label'>
                    {{ $t('fundInfo.shareCurrency') }}
                </span>
                <span>{{ data.currencyShares }}</span>
            </li>
            <li class='item'>
                <span class='label'>
                    {{ $t('fundInfo.sureSharesStatus') }}
                </span>
                <span>{{ data.sharesStatus === 1 ? $t("fundInfo.confirmed") : $t("fundInfo.confirmFailure") }}</span>
            </li>
            <li class='item'>
                <span class='label'>
                    {{ $t('fundInfo.confirmTime') }}
                </span>
                <span>{{ formatTime(data.updateTime) }}</span>
            </li>
            <li class='item'>
                <span class='label'>
                    {{ $t('trade.pendingNo') }}
                </span>
                <span>{{ data.proposalNo }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { defineProps, ref, defineEmits } from 'vue'

defineProps({
    data: Object,
    index: Number,
    showInfo: Array
})
const emit = defineEmits(['showDetail'])

const showDetail = (item) => {
    emit('showDetail')
}
const full = ref(false)
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.fundApplyRecordItem {
    margin-bottom: rem(20px);
    padding: rem(10px) rem(30px);
    background: var(--contentColor);
    .title {
        font-size: rem(28px);
        line-height: 2;
    }
    .infos {
        position: relative;
        display: grid;
        grid-column-gap: rem(20px);
        grid-template-columns: 1fr;
        height: 7em;
        overflow: hidden;
        font-size: rem(24px);
        line-height: rem(42px);
        &::before {
            position: absolute;
            bottom: 0;
            left: 47%;
            width: 0;
            height: 0;
            border: 5px solid var(--placeholdColor);
            border-color: var(--placeholdColor) transparent transparent transparent;
            border-bottom: 0;
            content: '';
        }
        &.full {
            height: auto;
            &::before {
                display: none;
            }
        }
        .item {
            display: flex;
            justify-content: space-between;
        }
        .label {
            color: var(--minorColor);
        }
        .href {
            color: var(--primary);
        }
    }
}

</style>
