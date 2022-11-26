<template>
    <router-view />
    <div class='fund-container'>
        <div class='fund-content'>
            <div class='side'>
                <h2 class='title'>
                    {{ $t('fundManager.side.title') }}
                </h2>
                <div class='list'>
                    <ul>
                        <li
                            v-for='item in menus'
                            :key='item.value'
                            :class="{ 'active': active === item.value }"
                            @click='switchMenu(item)'
                        >
                            <i :class='item.icon'></i>
                            <span>{{ item.name }} <i v-if="item.value === 'deduction' && deductHot === true" class='hot-num'></i></span>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 申购管理 -->
            <buy-module v-if="active === 'buy'" />
            <!-- 赎回管理 -->
            <ransom-module v-if="active === 'ransom'" />
            <!-- 下单执行标准 -->
            <standard-module v-if="active === 'standard'" />

            <!-- 基金管理费 -->
            <deductionModule v-if="active === 'deduction'" />
        </div>
    </div>
</template>

<script setup>
import buyModule from './components/buy-module.vue'
import ransomModule from './components/ransom-module.vue'
import standardModule from './components/standard-module.vue'
import deductionModule from './components/deduction-module.vue'
import { onMounted, ref, computed, provide } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getManagementFeesList } from '@/api/fund'
const store = useStore()
const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
// 获取账户信息
const customInfo = computed(() => store.state._user.customerInfo)
const companyId = computed(() => customInfo.value.companyId)

const listQuery = {
    customerNo: customInfo.value.customerNo,
    companyId: customInfo.value.companyId,
    deductDate: null,
    deductStatus: 2,
    current: 1,
    size: 10
}

// 用户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 基金经理专区菜单
const menus = ref([
    { name: t('fundManager.side.buy'), value: 'buy', icon: 'icon_xianhuojiaoyizhanghu' },
    { name: t('fundManager.side.ransom'), value: 'ransom', icon: 'icon_heyuezhucangzhanghu' },
    { name: t('fundManager.side.standard'), value: 'standard', icon: 'icon_heyuequancangzhanghu' },
    { name: t('fundManager.side.deduction'), value: 'deduction', icon: 'icon_zijinjilu' }
])
// 当前选中 buy:申购管理 ransom:赎回管理 standard:下单执行标准
const active = ref('buy')
// 切换菜单
const switchMenu = (item) => {
    if (item.value !== active.value) {
        active.value = item.value
    }
}

const deductHot = ref(false)

provide('deductHot', (value) => {
    deductHot.value = value
})

// 获取列表数据
const queryFundRedeemList = () => {
    const params = Object.assign({}, listQuery)
    getManagementFeesList(params).then(res => {
        if (res.check()) {
            if (res.data.records.length > 0) {
                deductHot.value = true
            } else {
                deductHot.value = false
            }
        } else {
            deductHot.value = false
        }
    }).catch(() => {
        // state.isLoading = false
    })
}

onMounted(() => {
    // 不是基金账号跳转到首页
    if (customerInfo.value.isFund !== 1) {
        router.replace({ name: 'Home' })
    }
    queryFundRedeemList()
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.fund-container {
    padding: 8px;
    background: var(--bgColor);
    .fund-content {
        display: flex;
        min-width: 1200px;
        min-height: 820px;
        .side {
            flex-shrink: 0;
            width: 256px;
            margin-right: 16px;
            background: var(--contentColor);
            border-radius: 10px;
            .title {
                @include font();
                padding: 30px;
                color: var(--color);
                font-weight: bold;
                font-size: 30px;
                line-height: 1;
            }
            .list {
                padding: 0 20px;
                li {
                    display: flex;
                    align-items: center;
                    height: 56px;
                    margin-bottom: 10px;
                    color: var(--color);
                    font-size: 14px;
                    background: var(--contentColor);
                    border-radius: 10px;
                    cursor: pointer;
                    i {
                        margin-right: 18px;
                        margin-left: 20px;
                        font-size: 18px;
                    }
                    &:hover {
                        color: var(--primary);
                    }
                }
                .active {
                    color: #FFF;
                    background: var(--primary);
                    i {
                        color: #FFF;
                    }
                    span {
                        color: #FFF;
                    }
                }
                span {
                    position: relative;
                    display: inline-block;
                    .hot-num {
                        position: absolute;
                        top: 0;
                        right: -10px;
                        display: inline-block;
                        width: 10px;
                        height: 10px;
                        margin: 0;
                        font-style: normal;
                        background: var(--warn);
                        border-radius: 100%;
                    }
                }
            }
        }
    }
}
</style>
