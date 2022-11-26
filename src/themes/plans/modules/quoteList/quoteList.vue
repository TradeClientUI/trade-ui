<template>
    <div>
        <p v-if='h5Preview' align='center'>
            <img alt='' src='./quoteList.png' style='width: 100%;' />
        </p>
        <div v-else>
            <!-- <quoteComp /> -->
        </div>
    </div>
</template>

<script>
// import quoteComp from '@plans/views/trade/tradeComponent'
export default {
    components: {
        // quoteComp,
    },
}
</script>

<style lang="scss" scoped>
</style>
