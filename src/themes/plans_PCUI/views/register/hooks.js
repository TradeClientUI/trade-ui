import { computed } from 'vue'
import { useStore } from 'vuex'
export default function () {
    const store = useStore()
    const registList = computed(() => store.state._base.wpCompanyInfo?.registList)

    // 根据国家获取对应的客户组
    const getCustomerGroupByCountry = country => {
        if (!country || !registList.value?.length) return null
        let _resultGroup = registList.value.find(el => el.registCountry.code === country)
        if (!_resultGroup) _resultGroup = registList.value.find(el => el.registCountry.isOther)
        return _resultGroup
    }
    // 根据国家获取对应的客户组ID
    const getCustomerGroupIdByCountry = country => {
        return getCustomerGroupByCountry(country)?.customerGroupId
    }
    // 根据国家获取对应的客户组的玩法
    const getPlansByCountry = country => {
        const group = getCustomerGroupByCountry(country)
        return group ? group.plans : store.state._base.wpCompanyInfo?.tradeTypeCurrencyList
    }
    return {
        getCustomerGroupIdByCountry,
        getPlansByCountry,
    }
}
