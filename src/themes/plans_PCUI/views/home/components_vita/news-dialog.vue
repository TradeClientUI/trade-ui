<template>
    <div class='dialog-layer'>
        <el-dialog
            v-model='show'
            :before-close='close'
            :close-on-click-modal='false'
            :title='detailInfo?.title'
            width='520px'
        >
            <div v-loading='loading' v-html='detailInfo?.content'></div>
        </el-dialog>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { getCookie } from '@/utils/util'
import { articleDetail } from '@/api/information'

export default {
    setup () {
        const state = reactive({
            lang: getCookie('lang') || 'zh-CN',
            // 是否显示弹窗
            show: false,
            // 加载状态
            loading: false,
            // 详情数据
            detailInfo: {}
        })

        // 打开弹窗
        const open = (item) => {
            state.show = true
            state.loading = true
            const params = {
                id: item.id,
                orgid: 5
            }
            articleDetail(params, state.lang, 2).then(res => {
                state.loading = false
                state.detailInfo = res
            })
        }

        // 关闭弹窗
        const close = () => {
            state.show = false
            state.detailInfo = {}
        }

        return {
            ...toRefs(state),
            open,
            close
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
