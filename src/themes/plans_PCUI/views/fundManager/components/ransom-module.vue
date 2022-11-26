<template>
    <div class='module-content'>
        <el-tabs v-model='activeName'>
            <el-tab-pane :label="$t('fundManager.ransom.title1')" name='wait' />
            <el-tab-pane :label="$t('fundManager.ransom.title2')" name='record' />
        </el-tabs>
        <!-- 赎回待确认 -->
        <div v-if="activeName === 'wait'">
            <ransom-wait />
        </div>
        <!-- 赎回确认记录 -->
        <div v-if="activeName === 'record'">
            <ransom-record />
        </div>
    </div>
</template>

<script setup>
import ransomWait from './ransom-wait.vue'
import ransomRecord from './ransom-record.vue'
import { ElTabs, ElTabPane } from 'element-plus'
import { ref } from 'vue'

// 当前选中tab wait:赎回待确认 record:赎回确认记录
const activeName = ref('wait')
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.module-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    position: relative;
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
            font-size: 16px;
            color: var(--normalColor);
            height: 60px;
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
