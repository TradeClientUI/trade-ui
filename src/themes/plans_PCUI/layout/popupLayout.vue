<template>
    <van-popup v-model:show='show'>
        <div class='container'>
            内容
        </div>
    </van-popup>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
export default {
    setup () {
        const store = useStore()

        return {}
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.container{
    width: 400px;
    border-radius: 5px;
}
</style>
