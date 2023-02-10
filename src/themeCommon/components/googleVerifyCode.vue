<template>
    <div class='form-item'>
        <van-field
            v-model.trim='googleCode'
            :border='false'
            :formatter='formatter'
            label=''
            maxlength='6'
            :placeholder='$t("common.inputGoogleCode")'
            type='text'
            @input='handleInput'
        />
        <span class='paste' @click='handlePaste'>
            {{ $t('common.paste') }}
        </span>
    </div>
</template>

<script setup>
import { ref, watch, unref, computed, defineEmits, defineExpose } from 'vue'
import { Dialog, Toast } from 'vant'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['getGooleVerifyCode', 'clear'])
const googleCode = ref('')
const { t } = useI18n({ useScope: 'global' })
const handlePaste = async (e) => {
    try {
        if (!navigator.clipboard) Toast(t('common.unSupported'))
        const text = await navigator.clipboard.readText()
        googleCode.value = text.substr(0, 6)
        emit('getGooleVerifyCode', googleCode.value)
    } catch (err) {
        console.error('Failed to copy!', err)
    }
}

const handleInput = () => {
    emit('getGooleVerifyCode', googleCode.value)
}
const formatter = (value) => {
    // 过滤输入的非数字
    return value.replace(/[^\d]/g, '')
}
const clear = () => {
    googleCode.value = ''
}

defineExpose({
    clear
})

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.form-item {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    margin-bottom: rem(20px);
    background: var(--contentColor);
    :deep(.van-cell) {
        padding-right: 0;
        padding-left: 0;
    }
    .title {
        padding: rem(20px) rem(30px);
        color: var(--normalColor);
    }
    .paste {
        width: rem(100px);
        color: var(--primary);
        text-align: center;
        cursor: pointer;
        &::before {
            font-size: rem(30px);
        }
    }
}
</style>
