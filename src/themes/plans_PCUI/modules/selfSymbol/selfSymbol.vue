<template>
    <div>
        <p v-if='h5Preview' align='center'>
            <img alt='' src='./selfSymbol.png' />
        </p>
        <div v-else>
            <!-- <optional :data="{ list: optinalList }" /> -->
        </div>
    </div>
</template>

<script>
// import Optional from '@plans/views/selfSymbol/optional/optional'
export default {
    // components: {
    //     Optional,
    // },
    computed: {
        // ...mapGetters(['selfSymbolList']),
        // ...mapState({
        //     positionList: state => state.ix_user.postionList,
        //     product_map: state => state.ix_quote.product_map,
        // }),
        // optinalList() { // 自选产品列表
        //     const defaultList = this.selfSymbolList.slice();
        //     if (defaultList.length === 0) return []

        //     const newList = [];
        //     defaultList.forEach(el => {
        //         const item = this.product_map[String(el.symbolId)]
        //         if (!item) return false;
        //         const inPosition = this.positionList.find(position => {
        //             return parseInt(position.symbol) === parseInt(el.symbolId) || position.symbol === item.groupSymbol.name;
        //         })
        //         el.inPosition = inPosition
        //         const newItem = Object.assign({}, item, { selfSymbol: el });
        //         if (item) newList.push(newItem);
        //     })
        //     return newList;
        // },
    },
}
</script>

<style lang="scss" scoped>
img {
    width: 100%;
}
</style>
