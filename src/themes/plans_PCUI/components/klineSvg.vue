<template>
    <div class='svg-wrap'>
        <svg :height='height' :width='width'>
            <polyline :points='points' :stroke='$style.primary' stroke-width='1' style='fill: none;' />
        </svg>
    </div>
</template>

<script>
import { computed } from 'vue'
export default {
    props: {
        data: {
            type: Array
        },
        width: {
            type: Number,
            default: 300
        },
        height: {
            type: Number,
            default: 40
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
                const min = rawData.reduce((x, y) => x > y ? y : x)
                // y坐标最大值
                const max = rawData.reduce((x, y) => x > y ? x : y)
                // 缩放比例 max-min为曲线幅度
                const rodio = props.height / (max - min)
                // 此处的points 的值就是svg 都polyline 的points 属性的值
                let points = ''
                // 统一处理y坐标，垂直向上偏移，也即是y坐标最高点归零
                rawData.forEach(y => {
                    points += x + ' ' + (isNaN((max - y) * rodio) ? 0 : (max - y) * rodio) + ','
                    x += s
                })
                points = points.substring(0, points.length - 1)
                return points
            }
            return ''
        })

        return {
            points
        }
    }
}
</script>

<style lang="scss">
@import '~@/sass/mixin.scss';
.svg-wrap{
    margin-top: rem(20px);
}
</style>
