<template>
    <div class='stockAssetPage'>
        <stockAssetModule v-model='moduleType' />
        <stockPositionModule :type='moduleType' />
    </div>
</template>

<script setup>
import stockAssetModule from './stockAssetModule.vue'
import stockPositionModule from './stockPositionModule.vue'
import { ref } from 'vue'

const moduleType = ref('overview')

</script>

<style lang="scss" scoped>
.stockAssetPage {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
}
</style>
