<template>
    <div class='page-wrap'>
        <router-view />
        <!-- 充值记录 -->
        <deposit-record show-filter />
    </div>
</template>

<script>
import depositRecord from './components/deposit-record.vue'

export default {
    components: {
        depositRecord
    }
}
</script>

<style lang="scss" scoped>
</style>
