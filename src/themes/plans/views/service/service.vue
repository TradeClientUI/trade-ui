<template>
    <div class='page-wrap'>
        <service />
    </div>
</template>

<script>
import service from '@/themeCommon/user/service'
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'

export default {
    components: {
        service
    },
    setup (props) {

    }
}
</script>

<style lang="scss" scoped>
.page-wrap {
    flex: 1;
    overflow-y: auto;
}
</style>
