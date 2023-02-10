<template>
    <div v-if='currencyList.length' class='symbol-icon'>
        <div class='icon'>
            <img :src='`/images/currency_icon/${currencyList[0]}.png`' />
            <img :src='`/images/currency_icon/${currencyList[1]}.png`' />
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import useSymbolIcon from '@/hooks/useSymbolIcon'
const props = defineProps({
    symbolKey: String
})
const { currencyList } = useSymbolIcon(props.symbolKey)
console.log({ props, currencyList })
</script>

<style lang="scss" scoped>
.symbol-icon {
    flex: none;
    .icon {
        display: flex;
        align-items: center;
        height: rem(80px);
        img {
            width: rem(52px);
            height: rem(52px);
            border: 1px solid #FFF;
            border-radius: 100%;
            &:last-child {
                margin-left: -10px;
            }
        }
    }
}
</style>
