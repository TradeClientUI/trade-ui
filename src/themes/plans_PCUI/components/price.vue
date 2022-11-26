<template>
    <span class='priceBar' :class="['digit'+digit]" v-html='priceHTML'></span>
    <!-- <span v-show='mode===2' class='price'>
        <span class='normal'>
            1.55
        </span>
        <span class='big'>
            22
        </span>
        <sup>5</sup>
    </span> -->
</template>

<script>
import { computed } from 'vue'
import BigNumber from 'bignumber.js'
export default {
    props: {
        price: {
            type: [Number, String],
            default: ''
        },
        mode: {
            type: Number,
            default: 2
        },
        pointRatio: Number,
        digit: Number,
    },
    setup (props) {
        const priceHTML = computed(() => {
            if (props.mode === 1 || !props.price || !props.pointRatio) {
                return props.price
            }
            // let lastBigIndex = String(props.pointRatio).length - 1 // 后一个被放大的数字的下标
            // lastBigIndex *= -1 // 倒数的下标
            // let firstBigIndex = lastBigIndex - 2 // 前一个被放大的数字的下标，倒数的下标
            // const price = Number(props.price).toFixed(props.digit)
            // const digitDotIndex = price.includes('.') ? price.split('').reverse().join('').indexOf('.') * -1 : -9999999 // 小数点的下标，倒数的下标
            // if (lastBigIndex < digitDotIndex) lastBigIndex--
            // if (firstBigIndex < digitDotIndex) firstBigIndex--
            // return `<span class='normal'>${price.slice(0, firstBigIndex)}</span><span class='big'>${price.slice(firstBigIndex, lastBigIndex)}</span><sup >${price.slice(lastBigIndex)}</sup>`
            const price = BigNumber(props.price).toFixed(props.digit)
            let bigEnd = price.length - String(props.pointRatio).length
            if (price.charAt(bigEnd) === '.') bigEnd--
            let bigStart = bigEnd - 1
            if (price.charAt(bigStart) === '.') bigStart--
            return `<span class='normal'>${price.slice(0, bigStart)}</span><span class='big'>${price.slice(bigStart, bigEnd + 1)}</span><sup >${price.slice(bigEnd + 1)}</sup>`
        })
        return {
            priceHTML
        }
    }
}
</script>

<style lang="scss">
@import '~@/sass/mixin.scss';
.priceBar {
    font-weight: bold;
    font-size: rem(30px);
    .normal {
        vertical-align: text-bottom;
    }
    .big {
        font-size: rem(46px);
    }
    sup {
        font-size: inherit;
    }
    &.digit13,
    &.digit14,
    &.digit15,
    &.digit16 {
        font-size: rem(26px);
        .big {
            font-size: rem(40px);
        }
    }
}
</style>
