<template>
    <div ref='scrollParent' class='pageWrapp'>
        <LayoutTop :back='true' :menu='false' :title='$t("fundInfo.fundsList")'>
            <template #right>
                <i class='icon_mingxi1' @click='toRecords'></i>
            </template>
        </LayoutTop>
        <div v-if='fundProductList.length === 0'>
            <van-empty :description='$t("common.noData")' image='/images/empty.png' />
        </div>
        <div v-else ref='lazyParent'>
            <FundCard v-for='item in fundProductList' :key='item.fundId' :fund='item' @click='goInfo(item)' />
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, onActivated, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import FundCard from './components/fundCard.vue'
import { findFundList } from './hooks/fundInfo'
import { debounce } from '@/utils/util'
const router = useRouter()
const lazyParent = ref(null)
const scrollParent = ref(null)
const { getFundList, fundProductList, lazyloadData } = findFundList()
let pageScrollTop = 0

// 跳转到基金详情
const goInfo = item => router.push('/fundProductInfo?fundId=' + item.fundId)

// 滚动时加载单个基金产品的最新数据，防抖
const lazyDataDebounce = debounce(() => {
    if (!lazyParent.value?.children?.length) return false
    const scrollTop = scrollParent.value.scrollTop
    pageScrollTop = scrollTop
    const pageHeight = document.body.clientHeight
    const childrenEl = [...lazyParent.value.children]
    // 计算子元素是否在页面可视范围内
    childrenEl.forEach(async (el, i) => {
        await nextTick()
        const rect = el.getBoundingClientRect()
        if (rect.top > 0 && rect.top <= pageHeight) {
            // console.log(i, '在可视范围内')
            lazyloadData(i)
        } else if (rect.bottom > 0 && rect.bottom <= pageHeight) {
            // console.log(i, '在可视范围内')
            lazyloadData(i)
        }
    })
})

// 跳转申购赎回记录
const toRecords = () => {
    router.push({
        path: '/fundRecord',
        query: {
            direction: 'buy'
        }
    })
}

// 页面激活时设置滚动条位置
onActivated(() => {
    scrollParent.value.scrollTop = pageScrollTop
})

// 获取基金产品列表
onMounted(() => {
    getFundList().then(() => {
        lazyDataDebounce()
    })
    scrollParent.value.addEventListener('scroll', lazyDataDebounce, false)
})

// 移除监听事件
onBeforeUnmount(() => {
    scrollParent.value.removeEventListener('scroll', lazyDataDebounce, false)
})
</script>

<script >
export default {
    name: 'FundProductList',
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrapp {
    flex: 1;
    margin-top: rem(110px);
    overflow-y: auto;
    .icon_mingxi1 {
        font-size: rem(42px);
    }
}
</style>
