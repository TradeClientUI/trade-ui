<template>
    <div class='fullWidth'>
        <div class='trade-module auto-width'>
            <div class='trade-header'>
                <strong class='title'>
                    {{ $t('JG_newHome.marketTrend') }}
                </strong>
            </div>
            <!-- 切换选项 -->
            <div class='filter'>
                <el-tooltip
                    content='Earn interest by depositing your assets'
                    effect='dark'
                    placement='top'
                >
                    <span class='filter_btn' :class='{ active:fundIndex == 1 }' @click='filterFund(1)'>
                        {{ $t('trade.earning') }}
                        <i class='el-icon-info'></i>
                    </span>
                </el-tooltip>

                <el-tooltip
                    content='Easy access to complex crypto strategies'
                    effect='dark'
                    placement='top'
                >
                    <span class='filter_btn' :class='{ active:fundIndex == 2 }' @click='filterFund(2)'>
                        {{ $t('trade.indexFunds') }}
                        <i class='el-icon-info'></i>
                    </span>
                </el-tooltip>
            </div>

            <!-- 产品列表 -->
            <div class='product-module'>
                <!-- earning 产品列表-->
                <template v-if='fundIndex == 1'>
                    <trade-earning />
                </template>
                <!-- indexFunds header -->
                <template v-if='fundIndex == 2'>
                    <trade-funds />
                </template>
                <p class='more'>
                    <span class='link' @click='more'>
                        {{ $t('JG_newHome.viewMore') }}
                        <i class='el-icon-arrow-right'></i>
                    </span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import tradeEarning from './tradeEarning.vue'
import tradeFunds from './tradeFunds.vue'

export default {
    components: {
        tradeEarning,
        tradeFunds
    },
    setup (props, context) {
        const router = useRouter()

        // 筛选产品列表按钮
        const fundIndex = ref(1)

        // 查看更多
        const more = () => {
            fundIndex.value === 1 ? router.push('/earning') : router.push('/indexFunds')
        }

        // 筛选产品列表数据
        const filterFund = (Index) => {
            fundIndex.value = Index
        }

        return {
            more,
            fundIndex,
            filterFund
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

.fullWidth {
    margin-top: 4px;
    padding-top: 50px;
    padding-bottom: 50px;
    background: #fff;
}
.trade-header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
    .title {
        letter-spacing: 2px;
        font-size: 30px;
        font-weight: bold;
        color: var(--color);
        font-family: Microsoft Yahei;
        text-align: center;
    }
}
.filter{
    margin-top: 40px;
    &_btn{
        display: inline-block;
        height: 32px;
        line-height: 32px;
        background: var(--assistColor);
        margin-right: 16px;
        padding: 0 11px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 4px;
        cursor: pointer;
        &.active{
            color: var(--primary);
        }
    }
}
.product-module {
    .more {
        text-align: right;
        color: var(--minorColor);
        margin-top: 27px;
        i {
            font-weight: bold;
        }
        span {
            font-size: 14px;
            font-weight: bold;
            margin-right: 5px;
            cursor: pointer;
        }
    }

}
</style>
