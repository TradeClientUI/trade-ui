<template>
    <div class='history-record'>
        <div class='header'>
            <div class='left'>
                <span class='title'>
                    {{ $t('fundInfo.buyRedeemRecords') }}
                </span>
                <el-tabs v-model='activeName'>
                    <el-tab-pane :label="$t('fundInfo.applyRecords')" name='apply' />
                    <el-tab-pane :label="$t('fundInfo.redeemRecords')" name='redeem' />
                </el-tabs>
            </div>
            <!-- 申购记录过滤组件 -->
            <applyFilter
                v-if="activeName === 'apply'"
                :assets-list='assetsList'
                @filter='getApplyRecord'
            />
            <!-- 赎回记录过滤组件 -->
            <redeemFilter
                v-if="activeName === 'redeem'"
                :assets-list='assetsList'
                :shares-status='sharesStatus'
                @filter='getRedeemRecord'
            />
        </div>
        <div class='case'>
            <!-- 申购记录 -->
            <applyRecord v-if="activeName === 'apply'" ref='applyRecordRef' show-page />
            <!-- 赎回记录 -->
            <redeemRecord v-if="activeName === 'redeem'" ref='redeemRecordRef' show-page @setSharesStatus='setSharesStatus' />
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, computed, inject } from 'vue'
import { useStore } from 'vuex'
import applyRecord from './apply-record.vue'
import redeemRecord from './redeem-record.vue'
import applyFilter from './apply-filter.vue'
import redeemFilter from './redeem-filter.vue'
import { getAssetsList } from '@/api/base'

const store = useStore()
const fundRecordAcitve = inject('fundRecordAcitve')
// 用户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 组件ref
const applyRecordRef = ref(null)
const redeemRecordRef = ref(null)
// 资产列表数据
const assetsList = ref([])
// 当前选项卡 apply:申购记录  redeem:赎回记录
const activeName = ref(fundRecordAcitve.value || 'apply')
// 赎回记录状态 0:当前赎回 1:历史赎回
const sharesStatus = ref('')

// 监听activeName
watch(activeName, (newVal) => {
    nextTick(() => {
        switch (newVal) {
            // 获取申购记录
            case 'apply':
                getApplyRecord({ size: 10, current: 1 })
                break
            // 获取赎回记录
            case 'redeem':
                getRedeemRecord({ size: 10, current: 1 })
                break
        }
    })
}, { immediate: true })

// 获取资产列表数据
const queryAssetsList = () => {
    const arr = []
    getAssetsList({ type: 2 }).then(res => {
        if (res.check()) {
            res.data.map(el => {
                arr.push({
                    text: el.name,
                    value: el.code
                })
            })
        }
    })
    assetsList.value = arr
}

// 获取申购记录
const getApplyRecord = (params) => {
    applyRecordRef.value.getData(params)
}
// 获取赎回记录
const getRedeemRecord = (params) => {
    redeemRecordRef.value.getData(params)
}
// 设置赎回记录状态
const setSharesStatus = (value) => {
    sharesStatus.value = value
}

onMounted(() => {
    // 获取资产列表数据
    if (customerInfo.value) {
        queryAssetsList()
    }
})
</script>

<style lang="scss" scoped>
.history-record {
    min-height: 100%;
    background: var(--contentColor);
    border-radius: 10px;
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        position: relative;
        &::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: -1px;
            width: 100%;
            height: 3px;
            background-color: var(--assistColor);
            z-index: var(--el-index-normal);
        }
        .left {
            display: inline-flex;
            align-items: center;
            .title {
                font-size: 16px;
                font-weight: bold;
                color: var(--color);
                margin: 0 50px 0 20px;
            }
            &:deep {
                .el-tabs {
                    height: 60px;
                }
                .el-tabs__item {
                    height: 60px;
                    line-height: 60px;
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
        }
    }
    .case {
        padding: 10px;
    }
}
</style>
