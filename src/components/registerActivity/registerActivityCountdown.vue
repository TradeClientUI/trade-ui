<template>
    <div v-if='countdownAvailable && activityTime > 0 && !isFinished' class='count-down-box'>
        <svg
            class='clock-icon'
            p-id='4021'
            t='1673525417729'
            version='1.1'
            viewBox='0 0 1024 1024'
            xmlns='http://www.w3.org/2000/svg'
        >
            <path d='M728.126772 465.975716H544.184226V213.217785a32.613927 32.613927 0 0 0-65.227853 0v285.371858a32.613927 32.613927 0 0 0 32.613926 32.613926h216.230334a32.613927 32.613927 0 0 0 0-65.227853zM885.652037 185.495947a32.613927 32.613927 0 0 0 45.985637-45.985636l-130.455706-130.455707a32.613927 32.613927 0 0 0-45.007219 46.964055z' fill='#ffffff' p-id='4022' /><path d='M820.424184 835.165365A456.594972 456.594972 0 1 0 185.431034 817.227705L87.589254 972.143857a32.613927 32.613927 0 0 0 55.117536 34.570762l92.94969-147.741088a456.594972 456.594972 0 0 0 536.172954 15.654685l83.165512 130.455707a32.613927 32.613927 0 0 0 55.117536-34.570763zM120.20318 499.56806a391.367119 391.367119 0 1 1 391.367119 391.36712 391.367119 391.367119 0 0 1-391.367119-391.36712z' fill='#ffffff' p-id='4023' /><path d='M120.20318 195.932404a32.613927 32.613927 0 0 0 23.155888-9.458039l130.455707-130.455706A32.613927 32.613927 0 0 0 227.17686 9.706883l-130.455707 130.455706A32.613927 32.613927 0 0 0 120.20318 195.932404z' fill='#ffffff' p-id='4024' />
        </svg>
        <CountDown :time='activityTime' @finish='onFinish'>
            <template #default='timeData'>
                <div class='flex gap-5'>
                    <div v-if='timeData.days !== 0'>
                        <span class='count-down font-mono text-4xl'>
                            <span :style="{ '--value': timeData.days }"></span>
                        </span>
                        {{ _dense ? 'd' : $t('api.timeleftCell') }}
                    </div>
                    <div>
                        <span class='count-down font-mono text-4xl'>
                            <span :style="{ '--value': timeData.hours }"></span>
                        </span>
                        {{ _dense ? 'h' : $t("common.hours") }}
                    </div>
                    <div>
                        <span class='count-down font-mono text-4xl'>
                            <span
                                :style="{ '--value': timeData.minutes }"
                            ></span>
                        </span>
                        {{ _dense ? 'm' : $t("common.minutes") }}
                    </div>
                    <div>
                        <span class='count-down font-mono text-4xl'>
                            <span
                                :style="{ '--value': timeData.seconds }"
                            ></span>
                        </span>
                        {{ _dense ? 's' : $t("common.seconds") }}
                    </div>
                </div>
            </template>
        </CountDown>
        <span v-if='props.showEndText' class='rule-box'>
            <p>{{ $t('common.finish') }}</p>
        </span>
        <span v-if='props.showRuleIcon' class='rule-box'>
            <p>{{ $t('common.finish') }}</p>
            <registerActivityRuleDialog rule-icon />
        </span>
    </div>
    <registerActivityRulePopup v-if='props.showRuleText' />
</template>

<script setup>
import { CountDown } from 'vant'
import { defineProps, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { registerActivityRulePopup, registerActivityRuleDialog, useRegisterActivity } from '@/components/registerActivity'
const { activityTime, countdownAvailable } = useRegisterActivity()

const props = defineProps({
    showRuleIcon: {
        type: Boolean,
        default: false,
    },
    showRuleText: {
        type: Boolean,
        default: false,
    },
    showEndText: {
        type: Boolean,
        default: false,
    },
    dense: {
        type: Boolean,
        default: false,
    },
})
const isFinished = ref(false)
const store = useStore()
const { locale } = useI18n()
/** 充值页面英文时分秒简写 */
const _dense = props.dense && locale.value === 'en-US'
const onFinish = () => {
    store.dispatch('_activity/getEnableAct')
    store.dispatch('_activity/getActFinishStatus')
    isFinished.value = true
}

</script>

<style lang="scss" scoped>
img {
    margin-right: 10px;
}
.count-down-box {
    display: flex;
    align-items: baseline;
    text-align: center;
    .clock-icon {
        margin-right: 8px;
        height: 24px;
    }
}
.font-mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
}
.van-count-down {
    color: var(--color);
}
.count-down {
    font-size: 36px;
    line-height: 1em;
    &>span {
        height: 1em;
        display: inline-flex;
        overflow-y: hidden;
        &::before {
            position: relative;
            content: '00\a 01\a 02\a 03\a 04\a 05\a 06\a 07\a 08\a 09\a 10\a 11\a 12\a 13\a 14\a 15\a 16\a 17\a 18\a 19\a 20\a 21\a 22\a 23\a 24\a 25\a 26\a 27\a 28\a 29\a 30\a 31\a 32\a 33\a 34\a 35\a 36\a 37\a 38\a 39\a 40\a 41\a 42\a 43\a 44\a 45\a 46\a 47\a 48\a 49\a 50\a 51\a 52\a 53\a 54\a 55\a 56\a 57\a 58\a 59\a 60\a 61\a 62\a 63\a 64\a 65\a 66\a 67\a 68\a 69\a 70\a 71\a 72\a 73\a 74\a 75\a 76\a 77\a 78\a 79\a 80\a 81\a 82\a 83\a 84\a 85\a 86\a 87\a 88\a 89\a 90\a 91\a 92\a 93\a 94\a 95\a 96\a 97\a 98\a 99\a';
            white-space: pre;
            top: calc(var(--value) * -1em);
            text-align: center;
            transition: all 1s cubic-bezier(1, 0, 0, 1);
        }
    }
}
.flex {
    display: flex;
}
.gap-5 {
    gap: 0.1rem;
}
.rule-box {
    display: flex;
    align-items: center;
    height: 20px;
    p {
        margin-left: 8px;
        margin-right: 4px;
         color: var(--color);
    }
}
.light {
    .clock-icon path {
        fill: var(--color);
    }
}
</style>
