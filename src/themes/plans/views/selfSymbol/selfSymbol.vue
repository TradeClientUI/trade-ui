<template>
    <div class='selfSymbol'>
        <layoutTop>
            <div></div>
            <template #left>
                <span class='title'>
                    {{ $t('selfSymbol.my') }}
                </span>
            </template>
            <template #right>
                <router-link class='searchIcon' tag='div' :to="{ name:'Search' }">
                    <i class='icon_sousuo1'></i>
                </router-link>
            </template>
        </layoutTop>
        <SelfSymbolList ref='productListEl' />
    </div>
</template>

<script>
import SelfSymbolList from '@plans/modules/selfSymbolList/selfSymbolList.vue'
import { computed, onActivated, ref } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'Quote',
    components: {
        SelfSymbolList,
    },
    setup () {
        const store = useStore()
        const productListEl = ref(null)
        const customerInfo = computed(() => store.state._user.customerInfo)

        onActivated(() => {
            if (productListEl.value) productListEl.value.calcProductsDebounce()
        })
        return {
            productListEl
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.selfSymbol {
    display: flex;
    flex: 1;
    width: 100%;
    margin-top: rem(90px);
    margin-bottom: rem(100px);
    overflow: auto;
    background: var(--bgColor);
    .searchIcon {
        color: var(--color);
    }
}
.title {
    color: var(--color);
    font-weight: 700;
    font-size: rem(40px);
}
</style>
