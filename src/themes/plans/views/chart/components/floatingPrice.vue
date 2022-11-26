<template>
    <div v-if='sellPrice && buyPrice' class='floating-price' :class='classNames'>
        <div class='block sell'>
            <span class='num'>
                {{ sellPrice }}
            </span>
            <span class='text'>
                sell
            </span>
        </div>
        <div class='block buy'>
            <span class='num'>
                {{ buyPrice }}
            </span>
            <span class='text'>
                buy
            </span>
        </div>
    </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
    props: {
        sellPrice: {
            type: [Number, String],
            default: null
        },
        buyPrice: {
            type: [Number, String],
            default: null
        }
    },
    setup (props) {
        const oldPrice = props.sellPrice
        const classNames = ref('rise')
        watch(() => props.sellPrice, () => {
            if (props.sellPrice >= oldPrice) {
                classNames.value = 'rise'
            } else {
                classNames.value = 'fall'
            }
        })
        return {
            classNames
        }
    }
}
</script>

<style lang="scss" scoped>
.floating-price {
    position: fixed;
    top: 56px;
    left: 60px;
    z-index: 99;
    display: flex;
    flex-direction: row;
    color: #FFF;
    .sell,
    .buy {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        padding: 5px 8px;
        border-radius: 2px;
        .num {
            font-size: 15px;
        }
        .text {
            font-size: 11px;
        }
    }
    .sell{

    }
    .buy {
        margin-left: 1px;
    }
    &.rise {
        .block {
            background: var(--riseColor);
        }
    }
    &.fall {
        .block {
            background: var(--fallColor);
        }
    }
}
</style>
