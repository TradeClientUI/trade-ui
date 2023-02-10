<template>
    <van-popup v-model:show='show' class='rule-popup' closeable>
        <div class='rule-title'>
            {{ $t('registerActivity.activityRules') }}
        </div>
        <registerActivityRule />
        <div class='close-button'>
            <van-button
                size='large'
                type='primary'
                @click='show = false'
            >
                {{ $t('fundInfo.iknow') }}
            </van-button>
        </div>
    </van-popup>
    <span v-if='countdownAvailable' class='rule-text' @click='show = true'>
        {{ $t('registerActivity.activityRules') }}
    </span>
</template>

<script setup>
import { ref } from 'vue'
import registerActivityRule from './registerActivityRule'
import { useRegisterActivity } from '@/components/registerActivity'
const { countdownAvailable } = useRegisterActivity()
const show = ref(false)

</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.rule-popup {
    width: 100%;
    height: 100%;
    text-align: left;
    .rule-container {
        padding: 0 rem(40px);
    }
    .rule-title {
        font-size: rem(40px);
        text-align: center;
        padding-bottom: rem(20px);
        padding-top: rem(35px);
        color: var(--color);
        font-weight: 700;
    }
    .close-button {
        position: sticky;
        bottom: 0;
        left: 0;
        width: 100%;
        :deep(.van-button) {
            border-radius: 0;
        }
    }
}
.rule-text {
    color: var(--primary);
    text-decoration: underline;
    min-width: rem(160px);
}
</style>
