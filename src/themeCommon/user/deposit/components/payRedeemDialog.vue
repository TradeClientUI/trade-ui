<template>
    <van-popup
        v-model:show='show'
        position='bottom'
        round
        teleport='body'
        @open='onOpen'
    >
        <div class='container'>
            <div class='header'>
                <!-- <div class='header-title'>
                    {{ $t('common.fundPwd') }}
                </div> -->
                <i class='icon_guanbi' @click='$emit("update:modelValue",false)'></i>
            </div>
            <div class='dialog-body'>
                <InputComp v-model='pin' clear :label='$t("deposit.inputPIN")' />
            </div>
            <div class='dialog-footer'>
                <van-button
                    block
                    class='pcHandler'
                    :loading='loading'
                    @click='submit'
                >
                    {{ $t('common.sure') }}
                </van-button>
            </div>
        </div>
    </van-popup>
</template>

<script >
import { computed, ref } from 'vue'
import InputComp from '@/components/form/input'
import { useI18n } from 'vue-i18n'
import { Toast } from 'vant'
export default {
    components: {
        InputComp,
    },
    props: ['modelValue'],
    emits: ['update:modelValue', 'submit'],
    setup (props, { emit }) {
        const { t } = useI18n({ useScope: 'global' })

        const show = computed({
            get: () => props.modelValue,
            set: val => emit('update:modelValue', val)
        })

        const loading = ref(false)
        const pin = ref('')

        // 弹窗打开时
        const onOpen = () => {
            pin.value = ''
        }

        const submit = () => {
            if (!pin.value) {
                Toast(t('deposit.inputPIN'))
                return false
            }

            loading.value = true
            emit('submit', {
                pin: pin.value,
                callback: () => {
                    loading.value = false
                }
            })
        }

        return {
            show,
            pin,
            loading,
            onOpen,
            submit,
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    position: relative;
}
.header {
    height: rem(88px);
    line-height: rem(88px);
    text-align: center;
    .header-title {
        font-size: rem(34px);
    }
}
.dialog-body {
    min-height: 250px;
    padding: rem(30px) rem(30px);
}
.icon_guanbi {
    position: absolute;
    top: 20px;
    right: 20px;
    line-height: 1;
}
.dialog-footer {
    width: 100%;
    padding: rem(30px) rem(30px);
    .pcHandler {
        color: #FFF;
        background: var(--primary);
        border: none;
        border-radius: 0;
        border-radius: rem(6px);
    }
}
</style>
