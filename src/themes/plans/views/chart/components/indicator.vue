<template>
    <div class='indicator-wrap'>
        <van-nav-bar
            left-arrow
            left-text='返回'
            :right-text='isEdit? "完成" :"编辑"'
            title='指标'
            @click-left='onClickLeft'
            @click-right='onClickRight'
        />
        <div class='indicator'>
            <van-cell-group>
                <van-cell class='indicator-type' is-link title='主窗口' @click='openStudyList("main")' />
                <van-swipe-cell
                    v-for='item in computedMainList'
                    :key='item.text'
                    :ref='el => refMap[item.text] = el'
                    :before-close='(e) => beforeClose(e, item)'
                    class='item'
                    disabled
                >
                    <template #left>
                        <div class='left' @click='openRight(refMap[item.text])'>
                            <van-icon name='clear' />
                        </div>
                    </template>
                    <van-cell :title='item.text' :value='item.value' />
                    <template #right>
                        <van-button square text='删除' type='danger' @click='onDelete(item.name)' />
                    </template>
                </van-swipe-cell>
                <van-cell class='indicator-type' is-link title='指标窗口' @click='openStudyList("sub")' />
                <van-swipe-cell
                    v-for='item in computedSubList'
                    :key='item.value'
                    :ref='el => refMap[item.text] = el'
                    :before-close='(e) => beforeClose(e, item)'
                    class='item'
                    disabled
                >
                    <template #left>
                        <div class='left' @click='openRight(refMap[item.text])'>
                            <van-icon name='clear' />
                        </div>
                    </template>
                    <van-cell :title='item.text' :value='item.value' />
                    <template #right>
                        <van-button square text='删除' type='danger' @click='onDelete(item.name)' />
                    </template>
                </van-swipe-cell>
            </van-cell-group>
            <span class='remark'>
                要添加指标，请点击窗口标题
            </span>
        </div>
        <van-popup v-model:show='showMainStudy' position='right' :style="{ height: '100%', width: '100%' }">
            <StudyList v-if='showMainStudy' :type='indicatorType' @addStudy='addStudy' @back='showMainStudy=false' />
        </van-popup>
    </div>
</template>

<script>
import { NavBar, SwipeCell } from 'vant'
import { computed, ref, unref } from 'vue'
import StudyList from './studyList'
import { localGet, localSet } from '@/utils/util'

export default {
    name: 'Indicator',
    components: {
        [NavBar.name]: NavBar,
        [SwipeCell.name]: SwipeCell,
        StudyList
    },
    emits: ['back'],
    setup (props, context) {
        const showMainStudy = ref(false)
        // 图表配置
        const chartConfig = ref({})
        try {
            chartConfig.value = JSON.parse(localGet('chartConfig')) || {}
        } catch (error) {}
        const refMap = {}
        // 主指标列表
        const computedMainList = computed(() => unref(chartConfig).indicators?.filter(e => e.params[0]).map(e => ({ text: e.label, name: e.name })) || [])
        // 副指标列表
        const computedSubList = computed(() => unref(chartConfig).indicators?.filter(e => !e.params[0]).map(e => ({ text: e.label, name: e.name })) || [])
        // 编辑状态
        const isEdit = ref(false)
        // 头部左侧返回
        const onClickLeft = () => {
            context.emit('back')
        }
        // 头部右侧编辑/完成
        const onClickRight = () => {
            isEdit.value = !isEdit.value
            if (isEdit.value) {
                Object.keys(refMap).forEach(key => refMap[key] && refMap[key].open('left'))
            } else {
                Object.keys(refMap).forEach(key => refMap[key] && refMap[key].close())
            }
        }
        // 打开删除按钮
        const openRight = (ref) => {
            ref.open('right')
        }
        // 单元格逻辑
        const beforeClose = ({ position }, { ref }) => {
            if (position === 'cell') {
                ref.close('right')
                ref.open('left')
            }
        }
        // 打开指标弹出层
        const indicatorType = ref('')
        const openStudyList = (type) => {
            indicatorType.value = type
            showMainStudy.value = true
        }

        // 添加指标
        const addStudy = ({ type, value }) => {
            chartConfig.value = JSON.parse(localGet('chartConfig')) || {}
            unref(chartConfig).indicators = [
                ...unref(chartConfig)?.indicators || [],
                value
            ]
            localSet('chartConfig', JSON.stringify(unref(chartConfig)))
        }
        // 删除指标
        const onDelete = (name) => {
            chartConfig.value = JSON.parse(localGet('chartConfig')) || {}
            unref(chartConfig).indicators = unref(chartConfig)?.indicators.filter(e => e.name !== name)
            localSet('chartConfig', JSON.stringify(unref(chartConfig)))
        }

        return {
            computedMainList,
            computedSubList,
            onClickLeft,
            openRight,
            onClickRight,
            isEdit,
            beforeClose,
            showMainStudy,
            openStudyList,
            addStudy,
            onDelete,
            indicatorType,
            refMap
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.indicator-wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .indicator {
        flex: 1;
        overflow-y: auto;
        .item {
            .left {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                padding-left: 12px;
                .van-icon-clear {
                    color: var(--focusColor);
                    font-size: 20px;
                }
            }
        }
        .indicator-type {
            color: var(--primary);
        }
        .remark {
            display: block;
            margin: 5px 0 20px;
            padding-left: 16px;
            color: var(--color);
            font-size: 12px;
        }
    }
}

</style>
