<template>
    <van-dialog
        v-model:show='show'
        class-name='register-activity-rule-dialog'
        :title="$t('registerActivity.activityRules')"
        width='600px'
    >
        <registerActivityRule />
        <template #footer>
            <div class='van-hairline--top van-dialog__footer'>
                <van-button
                    type='primary'
                    @click='show = false'
                >
                    {{ $t('fundInfo.iknow') }}
                </van-button>
            </div>
        </template>
    </van-dialog>
    <span v-if='props.ruleIcon'>
        <van-icon class='cursor-pointer' name='question-o' @click='show = true' />
    </span>
    <span v-else class='cursor-pointer rule-text' @click='show = true'>
        {{ $t('registerActivity.activityRules') }}
    </span>
</template>

<script setup>
import { ref } from 'vue'
import registerActivityRule from './registerActivityRule'
const show = ref(false)
const props = defineProps({
    /** 显示规则按钮还是文案 */
    ruleIcon: Boolean
})
</script>

<style lang="scss">
body .register-activity-rule-dialog {
    .van-dialog__content {
        max-height: 73vh;
        padding: 30px;
        overflow-y: auto;
    }
    .van-dialog__header {
        font-size: 24px;
        font-weight: 500;
        color: var(--color);
    }
    .van-dialog__footer {
        display: flex;
        justify-content: center;
        padding: 8px;
        .van-button {
            width: 200px;
            background-color: var(--primary);
            .van-button__text {
                color: #FFF;
            }
        }
    }
}

</style>
