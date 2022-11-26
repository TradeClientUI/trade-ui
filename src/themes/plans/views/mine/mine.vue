<template>
    <div class='page-wrap' :class='{ hasNav: $hasNav }'>
        <PageComp class='minePageComp' :data='pageModules' />
        <!-- <div class='support'>
            <img alt='' src='/images/support.png' />
        </div> -->
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
    &.hasNav {
        //padding-bottom: rem(100px);
    }
    .support {
        width: rem(300px);
        margin: rem(-70px) auto rem(10px);
        line-height: rem(32px);
        text-align: center;
        img {
            width: 100%;
        }
    }
}

</style>
