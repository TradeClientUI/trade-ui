<template>
    <div class='dialog-layer'>
        <el-dialog
            v-model='show'
            :close-on-click-modal='false'
            :title="$t('fundInfo.redeemRules')"
            width='520px'
        >
            <div class='rules-info'>
                <div class='tDate'>
                    <div class='start'>
                        <p>{{ $t('fundInfo.tDate') }}</p>
                        <p>{{ $t('fundInfo.redeemSubmit') }}</p>
                    </div>
                    <div class='center'>
                        <p>{{ $t('fundInfo.tDate') }}+1</p>
                    </div>
                    <div class='end'>
                        <p>{{ $t('fundInfo.tDate') }}+2</p>
                        <p>{{ $t('fundInfo.fundArrive') }}</p>
                    </div>
                </div>
                <div class='list'>
                    <p class='row'>
                        <span class='no'>
                            1
                        </span>
                        <span class='value'>
                            {{ $t('fundInfo.redeem_tip1') }}
                        </span>
                    </p>
                    <p class='row'>
                        <span class='no'>
                            2
                        </span>
                        <span class='value'>
                            {{ $t('fundInfo.redeem_tip2') }}
                        </span>
                    </p>
                    <p class='row'>
                        <span class='no'>
                            3
                        </span>
                        <span class='value'>
                            {{ $t('fundInfo.redeem_tip3') }}
                        </span>
                    </p>

                    <p class='row'>
                        <span class='no'>
                            4
                        </span>
                        <span class='value'>
                            {{ $t('fundInfo.fundRedeemFormula9') }}
                        </span>
                    </p>
                </div>
                <div class='block'>
                    <p class='title'>
                        {{ $t('fundInfo.jz_formula') }}
                    </p>
                    <p class='text'>
                        1、{{ $t('fundInfo.jz_formulaContent') }}
                    </p>
                    <p class='text'>
                        2、{{ $t('fundInfo.fundRedeemFormula10') }}
                    </p>
                    <p class='text indent'>
                        {{ $t('fundInfo.fundRedeemFormula11') }}
                    </p>
                    <p class='text'>
                        3、{{ $t('fundInfo.fundRedeemFormula12') }}
                    </p>
                    <p class='text indent'>
                        {{ $t('fundInfo.fundRedeemFormula13',{ number: 'A' }) }}
                    </p>
                    <p class='text indent'>
                        {{ $t('fundInfo.fundRedeemFormula14',{ number: 'A' }) }}
                    </p>
                    <p class='text indent'>
                        {{ $t('fundInfo.fundRedeemFormula13',{ number: 'B' }) }}
                    </p>
                    <p class='text indent'>
                        {{ $t('fundInfo.fundRedeemFormula14',{ number: 'B' }) }}
                    </p>
                    <p class='text indent'>
                        ...
                    </p>
                </div>

                <section class='block'>
                    <h2 class='title'>
                        {{ $t('fundInfo.deductRuletit1') }}
                    </h2>
                    <h3 class='title1'>
                        {{ $t('fundInfo.deductRuletxt4') }}
                    </h3>
                    <div v-if='redemptionCurrencySetting !== {}'>
                        <van-row v-for='(item,index) in redemptionCurrencySetting.value' :key='index' class='txt-row child'>
                            <van-col span='12'>
                                {{ item.currencyCode === ('self'|| 'SELF') ? $t('fundInfo.basketAssets') : item.currencyName }}
                            </van-col>
                            <van-col align='right' span='12'>
                                {{ item.redemptionFeeProportion? mulData(item.redemptionFeeProportion):0 }}%
                            </van-col>
                        </van-row>
                    </div>
                    <p class='text'>
                        {{ $t('fundInfo.deductRuledesc2') }}
                    </p>
                </section>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, defineExpose, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { div, mul } from '@/utils/calculation'
import { getFundInfo } from '@/api/fund'
// 是否显示弹窗
const show = ref(false)
const fundId = ref()
const redemptionCurrencySetting = ref({})

// 打开弹窗
const open = (showType, id) => {
    show.value = showType
    fundId.value = id
    getFundInfoFn()
}
const fundData = ref({})
const { t } = useI18n({ useScope: 'global' })

// 获取基金产品详情
const getFundInfoFn = () => {
    const param = {
        fundId: fundId.value
    }
    getFundInfo(param).then(res => {
        if (res.check()) {
            if (res.data) {
                fundData.value = ref(res.data)
                redemptionCurrencySetting.value = ref(res.data.redemptionCurrencySetting)
            }
        }
    })
}

const mulData = (value) => {
    return mul(value, 100)
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.rules-info {
    .row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .no {
            display: inline-flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            margin-right: 5px;
            color: #FFF;
            line-height: 1;
            background: var(--primary);
            border-radius: 50%;
        }
        .value {
            line-height: 18px;
        }
    }
    .block {
        margin-top: 20px;
        .title {
            color: var(--color);
            font-size: 20px;
        }
        .text {
            margin-top: rem(20px);
            &.indent {
                padding-left: 22px;
            }
        }
    }
    .tDate {
        position: relative;
        display: flex;
        justify-content: space-between;
        padding-top: 15px;
        padding-bottom: rem(30px);
        &::before {
            position: absolute;
            top: 5px;
            right: 15px;
            left: 15px;
            height: 1px;
            background: var(--primary);
            content: '';
        }
        .end {
            text-align: right;
        }
        .start,
        .center,
        .end {
            position: relative;
            &::before {
                position: absolute;
                top: -14px;
                left: 10px;
                width: 5px;
                height: 5px;
                background: var(--contentColor);
                border: 2px solid var(--primary);
                border-radius: 100%;
                content: '';
            }
        }
        .end {
            &::before {
                right: 10px;
                left: initial;
            }
        }
    }
    .txt-row {
        padding: rem(20px) 0 rem(20px) 0;
        font-size: 14px;
        border-bottom: 1px solid var(--lineColor);
        &.child {
            padding-left: rem(40px);
        }
    }
    .title {
        font-weight: normal;
        font-size: 16px;
    }
    .title1 {
        margin-top: 10px;
        font-weight: normal;
        font-size: 16px;
    }
}
</style>
