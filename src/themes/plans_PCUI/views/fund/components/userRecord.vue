<template>
    <div class='record-module'>
        <div class='header'>
            <el-tabs v-model='activeName'>
                <el-tab-pane :label="$t('fundInfo.applyRecords')" name='apply' />
                <el-tab-pane :label="$t('fundInfo.redeemRecords')" name='redeem' />
                <el-tab-pane :label="$t('fundInfo.assets')" name='assets' />
            </el-tabs>
            <span
                v-if="activeName !== 'assets'"
                class='link'
                @click='goAllRecord'
            >
                {{ $t('fundInfo.allRecords') }}
            </span>
        </div>
        <div class='case'>
            <!-- 申购记录 -->
            <applyRecord v-if="activeName === 'apply'" ref='applyRecordRef' max-height='500px' />
            <!-- 赎回记录 -->
            <redeemRecord v-if="activeName === 'redeem'" ref='redeemRecordRef' max-height='500px' />
            <!-- 资产 -->
            <assetsList v-if="activeName === 'assets'" max-height='500px' />
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, defineExpose } from 'vue'
import { useRouter } from 'vue-router'
import applyRecord from './applyRecord.vue'
import redeemRecord from './redeemRecord.vue'
import assetsList from './assetsList'

const router = useRouter()
// 组件ref
const applyRecordRef = ref(null)
const redeemRecordRef = ref(null)
// 当前选项卡 apply:申购记录  redeem:赎回记录 assets:资产
const activeName = ref('apply')

// 监听activeName
watch(activeName, (newVal) => {
    nextTick(() => {
        switch (newVal) {
            // 获取申购记录
            case 'apply':
                getApplyRecord({ size: 20, current: 1 })
                break
            // 获取赎回记录
            case 'redeem':
                getRedeemRecord({ size: 20, current: 1 })
                break
        }
    })
}, { immediate: true })

// 获取申购记录
const getApplyRecord = (params) => {
    if (applyRecordRef.value) {
        applyRecordRef.value.getData(params)
    }
}
// 获取赎回记录
const getRedeemRecord = (params) => {
    if (redeemRecordRef.value) {
        redeemRecordRef.value.getData(params)
    }
}

// 跳转到所有记录页面
const goAllRecord = () => {
    router.push({
        path: '/fundRecord',
        query: {
            activeName: activeName.value
        }
    })
}

// 暴露子组件属性或方法
defineExpose({
    getApplyRecord,
    getRedeemRecord
})
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";

.record-module {
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        background: var(--contentColor);
        &:deep {
            .el-tabs {
                height: 40px;
            }
            .el-tabs__item {
                --el-text-color-primary: var(--normalColor);
                user-select: none;
                font-weight: 400;
                color: var(--normalColor);
                &.is-active {
                    font-weight: bold;
                    color: var(--primary);
                }
            }
            .el-tabs__active-bar {
                background-color: var(--primary);
            }
            .el-tabs__nav-wrap::after {
                display: none;
            }
        }
        .link {
            color: var(--primary);
            cursor: pointer;
            &:hover {
                text-decoration: underline;
            }
        }
    }
    .case {
        padding: 0 16px;
        background: var(--contentColor);
    }
}
</style>
