<template>
    <div class='module-content'>
        <el-tabs v-model='activeName'>
            <el-tab-pane :label="$t('fundManager.deduction.waitRecord')" name='wait' />
            <el-tab-pane :label="$t('fundManager.deduction.doneRecord')" name='record' />
        </el-tabs>
        <!-- 待扣减记录 -->
        <div v-if="activeName === 'wait'">
            <deduction-wait />
        </div>
        <!-- 已扣减记录 -->
        <div v-if="activeName === 'record'">
            <deduction-record />
        </div>
    </div>
</template>

<script setup>
import deductionWait from './deduction-wait.vue'
import deductionRecord from './deduction-record.vue'
import { ElTabs, ElTabPane } from 'element-plus'
import { ref } from 'vue'

// 当前选中tab wait:赎回待确认 record:赎回确认记录
const activeName = ref('wait')
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.module-content {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
    &:deep {
        .el-tabs {
            height: 60px;
        }
        .el-tabs__header {
            margin: 0;
        }
        .el-tabs__nav {
            height: 60px;
        }
        .el-tabs__nav-wrap::after {
            display: none;
        }
        .el-tabs__active-bar {
            height: 3px;
        }
        .el-tabs__item {
            height: 60px;
            color: var(--normalColor);
            font-size: 16px;
            line-height: 60px;
            &.is-active {
                color: var(--primary);
            }
        }
        .el-tabs__active-bar {
            background-color: var(--primary);
        }
    }
}
</style>
