<template>
    <div class='doughnut'>
        <svg
            v-if='renderList && renderList.length > 0'
            class='doughnut-svg'
            :height='svgData.height'
            :viewBox='`0 0 ${svgData.width} ${svgData.height}`'
            :width='svgData.width'
            xmlns='http://www.w3.org/2000/svg'
        >
            <path
                v-for='(cur, index) in renderList'
                :key='index'
                :d='getPathItem(cur)'
                fill='none'
                :stroke='colors[index]'
                :stroke-width='arcData.stockWidth'
            />
        </svg>
    </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
export default {
    props: ['list', 'colors'],
    setup (props) {
        const state = reactive({
            // renderList: [], // 处理后用于渲染环形图的数据
            svgData: {
                // svg 数据 即画布参数
                width: 200,
                height: 200
            },
            arcData: {
                // 环形图参数
                r: 80, // 环形图的半径
                x0: 100, // 圆心x，一般把环形图放在画布中心位置就好
                y0: 100, // 同上
                stockWidth: 15 // 环形图的粗度...
            },
            // colors: [
            //     // 环形图颜色映射表
            //     '#477fd3',
            //     '#e3525c',
            //     '#f39800'
            // ]
        })
        const renderList = computed(() => {
            const list = handleChartData(props.list)
            return list
        })

        const handleChartData = (list) => {
            // 这里按照 圆心点为(0,0), r 为 1 来处理
            const newList = []
            list.forEach((item, index) => {
                const obj = {}
                let per = +item.split('%')[0]
                // 保留真实占比,后面需要判断是否是大小弧
                obj.relayPer = per
                const PI = Math.PI
                if (index !== 0) {
                    per += newList[index - 1].per
                }
                // 因为是拼接，所以本次的终点要在之前的基础上，所要要累加占比
                obj.per = per
                const deg = (per / 100) * PI * 2
                obj.start = {}
                obj.end = {}
                if (index === 0) {
                    obj.start.x = Math.cos(0)
                    obj.start.y = Math.sin(0)
                } else {
                    obj.start = newList[index - 1].end
                }
                obj.end.x = Math.cos(deg)
                obj.end.y = Math.sin(deg)
                newList.push(obj)
            })
            return newList
        }
        const getPathItem = (cur) => {
            // 这里在通过 圆心(x0, y0) r ,拼接好路径数据
            const { x0, y0, r } = this.arcData
            let str = 'M'
            const isLargeArc = cur.relayPer > 50 ? 1 : 0
            const startX = cur.start.x * r + x0
            const startY = cur.start.y * r + y0
            const endX = cur.end.x * r + x0
            const endY = cur.end.y * r + y0
            str += ' ' + startX + ' ' + startY + ' ' + 'A' + ' ' + r + ' ' + r + ' ' + '0' + ' ' + isLargeArc + ' ' + '1' + ' ' + endX + ' ' + endY
            return str
        }
        return {
            ...toRefs(state),
            renderList,
            handleChartData,
            getPathItem,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.doughnut-svg {
    transform: rotate(-90deg);
}
</style>
