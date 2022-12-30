<template>
    <div class='svg-wrap'>
        <svg :height='height' :width='width'>
            <polyline :points='points' :stroke='color || $style[product.upDownColor] || $style.minorColor' stroke-width='1.5' style='fill: none;' />
        </svg>

        <!-- <svg fill='none' height='26' width='80' xmlns='http://www.w3.org/2000/svg'>
            <path :d='svgData[product.symbolKey]' :stroke='$style[color] || "#333"' stroke-width='1.5' />
        </svg> -->
    </div>
</template>

<script>
import { onActivated, computed, ref, toRefs } from 'vue'
export default {
    props: {
        product: {
            type: Object
        },
        data: {
            type: Array
        },
        width: {
            type: Number,
            default: 90
        },
        height: {
            type: Number,
            default: 30
        },
        color: {
            type: String,
            default: ''
        }
    },
    setup (props) {
        const points = computed(() => {
            if (props.data?.length > 0) {
                const rawData = props.data
                // x坐标数组
                const s = props.width / rawData.length
                // x起始坐标数组
                let x = 0
                // y坐标最小值
                const min = Math.min(...rawData)
                // y坐标最大值
                const max = Math.max(...rawData)
                // 缩放比例 max-min为曲线幅度
                const rodio = props.height / (max - min)
                // 此处的points 的值就是svg 都polyline 的points 属性的值
                let points = ''
                // 统一处理y坐标，垂直向上偏移，也即是y坐标最高点归零
                rawData.forEach(y => {
                    points += x + ' ' + ((max - y) * rodio) + ' '
                    x += s
                })
                return points
            }
            return []
        })

        return {
            points
        }
    }
}
</script>

<style lang="scss">
@import '~@/sass/mixin.scss';
.svg-wrap {
    margin-top: rem(20px);
}
</style>
