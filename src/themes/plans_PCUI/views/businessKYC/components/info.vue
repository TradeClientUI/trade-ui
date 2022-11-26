<template>
    <div class='info'>
        <h2> {{ $t('businessKYC.information') }}</h2>
        <div class='content'>
            <strong> {{ $t('businessKYC.declaration') }}</strong>
            <p>{{ $t('businessKYC.tip14') }}</p>

            <p>{{ $t('businessKYC.tip15') }}  </p>

            <p> {{ $t('businessKYC.tip16') }} </p>

            <p> {{ $t('businessKYC.tip17') }} </p>

            <p> {{ $t('businessKYC.tip18') }}</p>
            <el-checkbox v-model='checked' :label="$t('businessKYC.tip19')" size='large' @change='onChange' />
        </div>
    </div>
</template>

<script setup >
import { reactive, ref, defineEmits } from 'vue'
const emit = defineEmits()

const checked = ref(false)
const onChange = (val) => {
    emit('update:protocol', val)
}
</script>

<style lang="scss" scoped>
.info {
    h2 {
        text-align: center;
    }
    .content {
        padding: 0 rem(100px);
        p {
            padding: rem(10px) 0;
        }
    }
}
</style>
