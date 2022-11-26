<template>
    <div class='deal-list'>
        <dealItem
            v-for='(item, index) in list'
            :key='index'
            :biz-type-text='bizTypeText'
            :item='item'
            :trade-type='tradeType'
        />
    </div>
</template>

<script>
import dealItem from '@plans/modules/deal/dealItem.vue'
export default {
    components: {
        dealItem
    },
    props: {
        // 列表数据
        list: {
            type: Array,
            default: () => []
        },
        // bizTypeText
        bizTypeText: {
            type: Object,
            default: () => {}
        },
        // 玩法类型
        tradeType: {
            type: [Number, String],
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.deal-list {
    margin-top: rem(20px);
}
</style>
