<template>
    <el-dialog
        ref='selectToken'
        v-model='modelValue'
        title='Select a token'
        width='400px'
        @open='onOpen'
    >
        <div class='body-module'>
            <div class='tokenListBox'>
                <div v-for='item in coinList' :key='item.id' class='row tokenCell' :index='item.id' @click='handleSelectToken(item)'>
                    <div class='hd'>
                        <img class='currencyIcon' :src='"/images/tokens/"+ item.thirdCoinCode.toLowerCase() +".svg"' />
                    </div>
                    <div class='center'>
                        <p class='thirdCoinCode'>
                            {{ item.thirdCoinCode }}
                        </p>
                        <p class='subCoinCode'>
                            {{ item.subCoinCode }}
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
    </el-dialog>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { formatAmount } from '@/utils/calculation'
import { web3Hooks } from '@/plugins/web3/index'

defineProps({
    modelValue: Boolean
})
const emit = defineEmits(['update:modelValue', 'select'])
const store = useStore()

const { getWalletBalance } = web3Hooks()

// 关闭弹窗
const close = () => emit('update:modelValue', false)

const coinListOrigin = [
    {
        id: 1,
        assetId: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
        contractAddresses: '0x0000000000000000000000000000000000001010',
        thirdCoinCode: 'ETH',
        subCoinCode: 'Ethereum',
        balance: '0',
    },
    {
        id: 2,
        assetId: '0xff795577d9ac8bd7d90ee22b6c1703490b6512fd',
        contractAddresses: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        thirdCoinCode: 'DAI',
        subCoinCode: 'Dai',
        balance: '0',
    },
    {
        id: 3,
        assetId: '0xe22da380ee6b445bb8273c81944adeb6e8450422',
        contractAddresses: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        thirdCoinCode: 'USDC',
        subCoinCode: 'USDC Coin',
        balance: '0',
    },
    {
        id: 4,
        assetId: '0xe22da380ee6b445bb8273c81944adeb6e8450422',
        contractAddresses: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
        thirdCoinCode: 'stETH',
        subCoinCode: 'stETH',
        balance: '0',
    },
]

const coinList = computed(() => {
    const aaveProducts = store.state._web3.aaveProducts
    return coinListOrigin.map(el => {
        const storeProduct = aaveProducts.find(o => o.thirdCoinCode === el.thirdCoinCode) || {}
        return {
            ...el,
            balance: storeProduct.balance || '0'
        }
    })
})

// 网络不对的时候重置balance
const resetBalance = () => {
    coinListOrigin.forEach(el => {
        el.balance = '0'
    })
}

// 获取coinListOrigin的代币的余额
const getTokenBalance = () => {
    const realChainIds = [1, 137]
    const chainId = store.state._web3.chainId
    if (realChainIds.indexOf(chainId) === -1) return resetBalance()
    coinListOrigin.forEach(el => {
        getWalletBalance(chainId, el.assetId).then(res => {
            console.log(el.subCoinCode, res)
        })
    })
}

// 选择token
const handleSelectToken = (item) => {
    emit('select', item)
    close()
}

const onOpen = () => {
    getTokenBalance()
}

</script>

<style lang="scss" scoped>
.tokenCell {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    align-items: center;
    font-size: 14px;
    padding: 6px 10px;
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
