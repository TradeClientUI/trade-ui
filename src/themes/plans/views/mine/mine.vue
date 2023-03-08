<template>
    <div class='page-wrap'>
        <PageComp class='minePageComp' :data='pageModules' />
    </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
export default {
    setup () {
        const pageModules = ref([])
        const store = useStore()
        store.dispatch('_base/getPageConfig', 'Mine').then(res => {
            console.log('pageModules', res)
            pageModules.value = res
        })
        return {
            pageModules,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    height: 100%;
    overflow: auto;
    background: var(--bgColor);
    .minePageComp {
        min-height: 100%;
        padding-bottom: rem(110px);
    }
}

</style>
