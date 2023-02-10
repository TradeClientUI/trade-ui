<template>
    <div class='rule-container'>
        <h3>{{ $t("registerActivity.activityRules") }}：</h3>
        <p>
            {{
                $t("registerActivity.activateWithin", {
                    rechargeGapHour: activityInfo.rechargeGapHour,
                    rewardAmount:activityInfo.rewardAmount
                })
            }}
        </p>
        <h3>{{ $t("registerActivity.terms") }}：</h3>
        <ol>
            <li>
                {{
                    $t("registerActivity.rule2", {
                        rechargeAmount: activityInfo.rechargeAmount,
                        rewardAmount: activityInfo.rewardAmount,
                    })
                }}
            </li>

            <li>
                {{
                    $t("registerActivity.rule3", {
                        rewardAmount:
                            toFixed(divide(activityInfo.rewardAmount, activityInfo.finishVolume), 2)
                    })
                }}
            </li>

            <li>
                {{ $t('registerActivity.rule4') }}
            </li>

            <li>{{ $t("registerActivity.rule1") }}</li>

            <li>
                {{ $t('registerActivity.rule5', { finishDay:activityInfo.finishDay }) }}
            </li>

            <li>
                {{ $t('registerActivity.rule6') }}：
                <ul>
                    <li>{{ $t('registerActivity.rule7') }}；</li>
                    <li>{{ $t('registerActivity.rule8') }}；</li>
                    <li>{{ $t('registerActivity.rule9') }}；</li>
                </ul>
                {{ $t('registerActivity.rule10') }}
            </li>

            <li>
                {{ $t('registerActivity.rule11') }}
            </li>

            <li>
                {{ $t('registerActivity.rule12') }}
            </li>
        </ol>
    </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { divide, toFixed } from '@/utils/calculation'
const store = useStore()
const activityInfo = store.state._activity.info
</script>

<style lang="scss" scoped>
.rule-container {
    text-align: left;
    padding: 0 10px;
}
ol {
    padding-left: 28px;
    font-size: 16px;
    line-height: 32px;
    list-style-type: decimal;
    color: var(--color);
    text-align: left;
    li {
        padding-left: 8px;
        margin-top: 12px;
        margin-bottom: 12px;
        &::marker {
            font-weight: 400;
            color: var(--placeholdColor);
        }
    }
}
ul {
    text-align: left;
    list-style-type: disc;
    padding-left: 28px;
}
p {
    margin-top: 12px;
    margin-bottom: 12px;
    font-size: 16px;
}
</style>
