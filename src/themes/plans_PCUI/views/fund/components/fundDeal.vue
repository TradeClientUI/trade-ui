<template>
    <div class='fund-deal'>
        <!-- 选项卡 -->
        <el-tabs v-model='activeName'>
            <el-tab-pane :label="$t('fundInfo.buy')" name='apply'>
                <fundApply :fund='fund' />
            </el-tab-pane>
            <el-tab-pane :label="$t('fundInfo.sell')" name='redeem'>
                <fundRedeem :fund='fund' />
            </el-tab-pane>
        </el-tabs>
        <!-- <LoginMask /> -->
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import fundApply from './fundApply.vue'
import fundRedeem from './fundRedeem.vue'
// import LoginMask from '@planspc/components/loginMask.vue'

defineProps({
    fund: {
        type: Object,
        default: () => {}
    }
})

// 当前选择选项卡 apply:申购 redeem:赎回
const activeName = ref('apply')
</script>

<style lang="scss" scoped>
.fund-deal {
    position: relative;
    padding-top: 10px;
    padding-bottom: 20px;
    &:deep {
        .el-tabs {
            padding: 0 20px;
        }
        .el-tabs__header {
            margin: 0;
        }
        .el-tabs__nav {
            display: flex;
            width: 100%;
            height: 40px;
        }
        .el-tabs__nav-wrap::after {
            display: none;
        }
        .el-tabs__active-bar {
            height: 2px;
        }
        .el-tabs__item {
            flex: 1;
            font-size: 20px;
            color: var(--normalColor);
            height: 40px;
            text-align: center;
            line-height: 40px;
            font-weight: bold;
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
