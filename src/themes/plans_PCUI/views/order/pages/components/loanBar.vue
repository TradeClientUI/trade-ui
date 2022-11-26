<template>
    <div class='borrowMoney'>
        <div class='auto-born'>
            <el-checkbox v-model='checked' :label="$t('trade.autoLoan')" @click='handleClick(2)' />

            <el-popover
                placement='top-start'
                transition='el-fade-in-linear'
                trigger='hover'
                :width='500'
            >
                <template #reference>
                    <van-icon class='questionIcon' name='question-o' @click.stop='lilvAlert=true' />
                </template>

                <div class='availableLoanContent'>
                    <p>{{ $t('trade.availableLoanContent3', [dailyInterest]) }}</p>
                </div>
            </el-popover>
        </div>

        <!-- 自动还款的解说 -->
        <van-dialog v-model:show='lilvAlert2' title=''>
            <div class='availableLoanContent'>
                <p>{{ $t('trade.availableLoanContent6') }}</p>
            </div>
        </van-dialog>
    </div>
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
        const handleClick = (curname) => {
            if (props.modelValue === curname) emit('update:modelValue', 1)
        }
        return {
            lilvAlert,
            lilvAlert2,
            dailyInterest,
            checked,
            setValue,
            handleClick,
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
    color: var(--minorColor);
    :deep(.el-checkbox){
        vertical-align: middle;
        margin-right: 8px;
    }
    .questionIcon {
        cursor: pointer;
        vertical-align: -2px;
        font-size: 16px;
    }
    .lastRadio {
        margin-left: 10px;
    }

    --van-radio-label-color: var(--minorColor);
}
.availableLoanContent {
    line-height: 20px;
    p {
        margin-top: rem(10px);
    }
}
</style>
