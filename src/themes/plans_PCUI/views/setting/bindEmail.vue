<template>
    <centerViewDialog class='bindEmailPage'>
        <bindEmailComponent :type='email ? "change" : "bind"' />
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import bindEmailComponent from './components/bindEmailComponent'
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
export default {
    components: {
        centerViewDialog,
        bindEmailComponent
    },
    setup (props) {
        const store = useStore()
        const email = computed(() => store.state._user.customerInfo?.email)
        return {
            email
        }
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.bindEmailPage {
    line-height: 50px;
}
</style>
