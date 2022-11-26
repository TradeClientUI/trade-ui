<template>
    <van-popup
        v-model:show='popupShow'
        @open='onOpen'
    >
        <div class='popup-model'>
            <div class='popHeader'>
                <h2 class='popTitle'>
                    Select a token
                </h2>
                <a class='close' href='javascript:;'>
                    <van-icon name='cross' @click="$emit('update:modelValue', false)" />
                </a>
            </div>
            <div class='popContainer'>
                <div class='tokenListBox'>
                    <div v-for='item in payCoinList' :key='item.id' class='row tokenCell' :index='item.id' @click='handleSelectToken(item)'>
                        <div class='hd'>
                            <img class='currencyIcon' :src='"/images/tokens/"+ item.symbol.toLowerCase() +".svg"' />
                        </div>
                        <div class='center'>
                            <p class='thirdCoinCode'>
                                {{ item.symbol }}
                            </p>
                            <p class='subCoinCode'>
                                {{ item.symbolDesc }}
                            </p>
                        </div>
                        <div class='ft'>
                            <span class='value'>
                                {{ formatAmount(item.balance, 3) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </van-popup>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { formatAmount } from '@/utils/calculation'
import { web3Hooks } from '@/plugins/web3/index'
import { UsePurchase } from '../../config/indexCoop-purchase'

const props = defineProps({
    modelValue: Boolean,
    payCoinList: Array,
    to: [String, Object],
})
const emit = defineEmits(['update:modelValue', 'select'])

const store = useStore()

const { getWalletBalance, getUserBalance } = web3Hooks()

// 关闭弹窗
const close = () => emit('update:modelValue', false)

// 弹窗是否显示
const popupShow = computed({
    get: () => props.modelValue,
    set: newval => emit('update:modelValue', newval)
})

// 选择token
const handleSelectToken = (item) => {
    emit('select', item)
    close()
}

const onOpen = () => {
    console.log('onOpen')
}

</script>

<style lang="scss" scoped>
.popup-model {
    background: var(--contentColor);
    border-radius: 4px;
    @media (max-width: 768px) {
        width: calc(100% - 30px);
        margin: 0 auto;
        padding: 24px 16px;
    }
}
.popHeader {
    display: flex;
    padding: 24px 24px 0;
    justify-content: space-between;
    align-items: center;
    h2 {
        font-size: 20px;
    }
    .close {
        font-size: 24px;
        color: var(--color);
    }
}
.popContainer {
    min-width: 320px;
    padding: 24px 0;
    border-radius: 6px;
    @media screen and (min-width: 767px) {
        width: 420px;
    }
}
.tokenCell {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    align-items: center;
    font-size: 14px;
    padding: 6px 20px;
    transition: 0.2s;
    cursor: pointer;
    color: var(--color);
    border-radius: 5px;
    &:hover {
        background-color: var(--bgColor);
    }
    .hd {
        margin-right: 10px;
    }
    .center {
        flex: 1;
    }
    .thirdCoinCode {
        font-size: 16px;
    }
    .value {
        font-size: 16px;
        font-weight: 700;
    }
}
.currencyIcon {
    display: inline-block;
    width: 40px;
    margin-right: 5px;
    vertical-align: middle;
}
</style>
