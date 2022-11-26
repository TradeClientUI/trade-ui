<template>
    <centerViewDialog class='bindMobilePage'>
        <bindMobileComponent :type='phone ? "change" : "bind"' />
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import bindMobileComponent from './components/bindMobileComponent'
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'

export default {
    components: {
        centerViewDialog,
        bindMobileComponent
    },
    setup (props) {
        const store = useStore()
        const phone = computed(() => store.state._user.customerInfo?.phone)
        return {
            phone
        }
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.bindMobilePage {
    line-height: 50px;
}
</style>
