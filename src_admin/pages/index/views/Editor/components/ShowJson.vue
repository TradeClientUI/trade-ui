<template>
    <div class='m-showJson'>
        <el-drawer
            v-model='showCode'
            append-to-body
            direction='rtl'
            size='40%'
            :with-header='false'
            @closed='closed'
        >
            <div class='editor-container'>
                <JsonEditor ref='jsonEditor' v-model='value' />
            </div>
        </el-drawer>
    </div>
</template>

<script>
import JsonEditor from '@index/components/JsonEditor'
import { onMounted, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
export default {
    name: 'ShowJson',
    components: {
        JsonEditor
    },
    props: ['showCode'],
    setup(props,context) {
        const store = useStore()
        const state = reactive({
            value: ''
        })

        onMounted(()=>{
            state.value = JSON.parse(JSON.stringify(store.state.editor.elementList))
        })

        const closed = ()=>{
            context.$emit('update:showCode', false)
        }

        return {
            ...toRefs(state),
            closed
        }
    }
}
</script>

<style lang="scss">
.editor-container {
    position: relative;
    height: 100%;
}
</style>
