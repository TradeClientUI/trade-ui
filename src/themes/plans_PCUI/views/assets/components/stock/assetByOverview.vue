<template>
    <section class='wrapper'>
        <div class='titleBar'>
            <h3 class='title'>
                {{ $t('trade.accountJZC') }}
            </h3>
            <el-radio-group v-show="type==='overview'" v-model='currency' class='currencyRadio' size='small'>
                <el-radio-button label='USD' />
                <el-radio-button label='HKD' />
            </el-radio-group>
        </div>
        <p v-if='curAccount' class='capitalDataRow'>
            <em class='capital'>
                {{ curAccount.conNetAsset }} {{ currency.toUpperCase() }}
            </em>
        </p>

        <div class='tableBox'>
            <div class='item'>
                <span class='label'>
                    {{ $t('assets.maxDayPurchasePower') }}
                </span>
                <span class='value'>
                    {{ info.maxDayPurchasePower }}
                </span>
            </div>
            <div class='item'>
                <span class='label'>
                    {{ $t('assets.crossLevel') }}
                </span>
                <span class='value'>
                    {{ info.crossLevel }}
                    {{ $t('trade.multiples') }}
                </span>
            </div>
            <div class='item'>
                <span class='label'>
                    {{ $t('assets.riskLevelStatus') }}
                </span>
                <span class='value ' :class="[info.riskLevel===1 ? 'successColor' : 'red']">
                    {{ riskLevelMap[info.riskLevel] }}
                </span>
            </div>
            <div class='item'>
                <span class='label'>
                    {{ $t('assets.initMargin') }}
                </span>
                <span class='value'>
                    {{ info.margin }}
                </span>
            </div>
            <div class='item'>
                <span class='label'>
                    {{ $t('assets.warningMargin') }}
                </span>
                <span class='value'>
                    {{ info.warningMargin }}
                </span>
            </div>
            <div class='item'>
                <span class='label'>
                    {{ $t('assets.holdMargin') }}
                </span>
                <span class='value'>
                    {{ info.maintainMargin }}
                </span>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted, onBeforeUnmount, watch } from 'vue'
import { useStore } from 'vuex'
import { queryAccountAssetsInfoStock } from '@/api/user'
import { MsgSocket } from '@/plugins/socket/socket'
import { useI18n } from 'vue-i18n'
const props = defineProps({
    type: {
        type: String,
        default: () => ''
    }
})

const store = useStore()
const { t } = useI18n({ useScope: 'global' })
const currency = ref('USD')
const info = ref({})
const userAccount = computed(() => store.state._user.accountAssets[6] || {})
const curAccount = computed(() => userAccount.value[currency.value.toUpperCase()] || {})
const riskLevelMap = ref({
    1: t('riskLevel.safety'),
    2: t('riskLevel.warn'),
    3: t('riskLevel.danger')
})

// 获取资产详情
const getAssetInfo = () => {
    info.value = {}
    queryAccountAssetsInfoStock({
        currencyCode: currency.value.toUpperCase(),
        tradeType: '6'
    }).then(res => {
        if (res.check()) {
            info.value = {
                ...res.data
            }
        }
    })
}

watchEffect(() => {
    getAssetInfo()
})
watch(
    () => props.type,
    newval => {
        currency.value = props.type === 'overview' ? 'USD' : props.type
    }
)

onMounted(() => {
    MsgSocket.subscribeAsset({
        tradeTypes: '6',
        subscribeType: '1,2'
    })
})

onBeforeUnmount(() => {
    MsgSocket.cancelSubscribeAsset()
})
</script>

<style lang="scss" scoped>
.wrapper {
    margin-top: 10px;
    padding: 0 20px;
}
.titleBar {
    display: flex;
    align-items: center;
    .title {
        margin-right: 20px;
        font-size: 18px;
        font-weight: normal;
    }
    .currencyRadio {
        :deep(.el-radio-button__inner) {
            padding: 5px 10px;
        }
    }
}
.capitalDataRow {
    margin-top: 20px;
    height: 32px;
    line-height: 32px;
    display: flex;
    .capital {
        font-size: 20px;
        font-weight: bold;
        font-style: normal;
    }
    .item {
        margin-left: 15px;
    }
}
.tableBox {
    margin-top: 15px;
    width: 800px;
    line-height: 1.5;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-row-gap: 8px;
    .label {
        padding-right: 10px;
    }
}
</style>
