<template>
    <div class='userRecord'>
        <div class='headbar'>
            <el-tabs v-model='activeName' class='tabs'>
                <el-tab-pane :label='[1,2].includes(Number(tradeType)) ? $t("trade.order") : $t("trade.order")' name='0' />
                <el-tab-pane v-if='[1,2].includes(Number(tradeType))' :label='$t("trade.position")' name='2' />
                <el-tab-pane :label='$t("trade.dealList")' name='1' />
                <el-tab-pane v-if='!([1,2].includes(Number(tradeType)))' :label='$t("trade.asset")' name='2' />
            </el-tabs>
            <router-link v-if='isLogin && activeName === "1"' class='link' :to="{ name: 'TransRecords', query: { tradeType } }">
                {{ $t('trade.allTransaction') }}
            </router-link>
        </div>
        <div v-if='mounted' class='content'>
            <!-- 当前委托 -->
            <CurrentCommission v-if='activeName ==="0"' :common-options='commonOptions' :trade-type='tradeType' />
            <!-- 成交记录 -->
            <Transaction v-if='activeName ==="1"' :common-options='commonOptions' :trade-type='tradeType' />
            <!-- 资产 -->
            <AssetsList v-if='activeName ==="2"' :common-options='commonOptions' :trade-type='tradeType' />
            <LoginMask v-if='!isLogin' class='loginMaskPop' />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, unref, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import { ElTabs, ElTabPane } from 'element-plus'
import CurrentCommission from './components/currentCommission'
import Transaction from './components/transaction'
import AssetsList from './components/assetsList'
import LoginMask from '@planspc/components/loginMask.vue'

const store = useStore()
const product = computed(() => store.getters.productActived)
const tradeType = computed(() => unref(product).tradeType)
const isLogin = computed(() => !!store.state._user.customerInfo?.customerNo)
const activeName = ref('0')

const commonOptions = {
    height: 358,
}

// 不同table数据混在一起了
const mounted = ref(true)
watch(() => tradeType.value, async () => {
    activeName.value = '0' // 玩法切换的时候重置tab页
    mounted.value = false
    await nextTick()
    mounted.value = true
})
</script>

<style lang="scss" scoped>
.userRecord {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
    .headbar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 0 16px;
        .tabs {
            height: 40px;
            :deep {
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
        }
    }
    .link {
        cursor: pointer;
        user-select: none;
    }
    :deep {
        .link {
            padding: 0 5px;
            cursor: pointer;
        }
    }
    .content {
        position: relative;
        .loginMaskPop {
            z-index: 8;
        }
        &:hover .loginMaskPop {
            visibility: visible;
            opacity: 1;
        }
        :deep(.operate) {
            background-color: var(--contentColor) !important;
        }
    }
}
</style>
