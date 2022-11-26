<template>
    <div class='borrowMoney'>
        <van-radio-group v-model='checked' direction='horizontal'>
            <van-radio :name='2' @click='radioClick(2)'>
                {{ $t('trade.autoLoan') }}
                <van-icon class='questionIcon' name='question-o' @click.stop='lilvAlert=true' />
            </van-radio>
            <!-- <van-radio v-if='product.tradeType === 3' class='lastRadio' :name='3' @click='radioClick(3)'>
                {{ $t('trade.autoRepayment') }}
                <van-icon class='questionIcon' name='question-o' @click.stop='lilvAlert2=true' />
            </van-radio> -->
        </van-radio-group>

        <!-- 自动借款的解说 -->
        <van-dialog v-model:show='lilvAlert' :confirm-button-text="$t('common.sure')" title=''>
            <div class='availableLoanContent'>
                <p>{{ $t('trade.availableLoanContent3', [dailyInterest]) }}</p>
            </div>
        </van-dialog>
        <!-- 自动还款的解说 -->
        <van-dialog v-model:show='lilvAlert2' :confirm-button-text="$t('common.sure')" title=''>
            <div class='availableLoanContent'>
                <p>{{ $t('trade.availableLoanContent6') }}</p>
            </div>
        </van-dialog>
    </div>

    <!-- <div class='loanBar'>
        <div class='item sell' :class="{ 'active':modelValue===2 }" @click='setValue(2)'>
            <span class='hd'>
                {{ $t('trade.autoLoan') }}
            </span>
            <span class='ft'>
                <van-icon name='question-o' @click.stop='tips' />
            </span>
        </div>
        <div class='item buy' :class="{ 'active':modelValue===3 }" @click='setValue(3)'>
            <span class='hd'>
                {{ $t('trade.autoRepayment') }}
            </span>
            <span class='ft'>
                <van-icon name='question-o' @click.stop='tips' />
            </span>
        </div>
    </div> -->
</template>

<script>
import { computed, ref } from 'vue'
import { mul } from '@/utils/calculation'
export default {
    props: ['modelValue', 'product', 'account'],
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const lilvAlert = ref(false)
        const lilvAlert2 = ref(false)
        const checked = computed({
            get: () => props.modelValue,
            set: val => {
                emit('update:modelValue', val)
            }
        })
        const dailyInterest = computed(() => {
            const assetsId = props.account?.assetsId
            const interest = props.product.borrowInterestList?.find(item => Number(item.assetsId) === Number(assetsId))?.value

            return interest ? mul(interest, 100) + '%' : '--'
        })
        const setValue = (data) => {
            if (props.modelValue === data) data = 1
            emit('update:modelValue', data)
        }
        const radioClick = (curname) => {
            if (props.modelValue === curname) emit('update:modelValue', 1)
        }
        return {
            lilvAlert,
            lilvAlert2,
            dailyInterest,
            checked,
            setValue,
            radioClick,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.loanBar {
    position: relative;
    display: flex;
    .item {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        height: rem(80px);
        padding: rem(10px) rem(20px);
        color: var(--color);
        line-height: rem(60px);
        background: var(--assistColor);
        border-radius: rem(6px);
        &.sell {
            margin-right: 5px;
            padding-right: rem(20px);
        }
        &.buy {
            margin-left: 5px;
            padding-left: rem(20px);
        }
        &.active {
            color: var(--primary);
            background: var(--primaryAssistColor);
        }
    }
    .price {
        font-size: rem(28px);
    }
    .van-icon-question-o {
        font-size: rem(30px);
    }
}
.borrowMoney {
    margin-top: rem(38px);
    color: var(--minorColor);
    font-size: rem(24px);
    :deep(.van-radio) {
        flex: 1;
    }
    :deep(.van-radio__icon .van-icon) {
        width: rem(30px);
        height: rem(30px);
        margin-top: 2px;
        font-size: rem(26px);
        line-height: 0.9;
    }
    .questionIcon {
        font-size: rem(30px);
        vertical-align: -2px;
    }
    .lastRadio {
        margin-left: 10px;
    }

    --van-radio-label-color: var(--minorColor);
}
.availableLoanContent {
    padding: rem(30px);
    font-size: rem(24px);
    p {
        margin-top: rem(10px);
    }
}
</style>
