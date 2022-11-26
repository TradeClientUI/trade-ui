<template>
    <Top back show-center />
    <div class='page-wrap'>
        <van-radio-group v-model='checked'>
            <van-cell-group>
                <van-cell clickable title='中文' @click="checked = '1'">
                    <template #right-icon>
                        <van-radio name='1' />
                    </template>
                </van-cell>
                <van-cell clickable title='英文' @click="checked = '2'">
                    <template #right-icon>
                        <van-radio name='2' />
                    </template>
                </van-cell>
            </van-cell-group>
        </van-radio-group>
    </div>
</template>

<script>
import Top from '@/components/top'
import { toRefs, reactive } from 'vue'

export default {
    components: {
        Top
    },
    setup (props) {
        const state = reactive({
            checked: '1'
        })
        return {
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    flex: 1;
    overflow: auto;
}
</style>
