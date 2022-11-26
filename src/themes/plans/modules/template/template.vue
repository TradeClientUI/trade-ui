<template>
    <div class='template' :style='data.styleObj'>
        <component :is='customComponent' v-if='customComponent' />
    </div>
</template>

<script>
// import Vue from 'vue'
import { getCurrentInstance, ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
export default {
    props: {
        data: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    setup (props, context) {
        const store = useStore()
        const customerInfo = computed(() => store.state._user.customerInfo)
        const currentInstance = getCurrentInstance()
        const app = currentInstance.appContext.app
        console.log(currentInstance)
        const customComponent = ref(null)
        console.log('开始注册模块')
        const createComponent = () => {
            const componentName = props.data.moduleId
            // console.log('resolveComponent', resolveComponent(componentName))
            // if (app.component(componentName)) {
            //     app.unmount(componentName)
            // }
            app.component(componentName, {
                computed: {
                    customerInfo () {
                        return this.$store.state._user.customerInfo
                    }
                },
                template: props.data.content
            })
            customComponent.value = componentName
        }
        watch(
            () => props.data.content,
            () => createComponent(),
            { immediate: true }
        )

        return {
            customComponent,
            customerInfo,
        }
    },
    // data () {
    //     return {
    //         customComponent: null
    //     }
    // },
    // watch: {
    //     'data.content': {
    //         handler () {
    //             this.customComponent = Vue.component(this.data.moduleId, {
    //                 template: this.data.content
    //             })
    //         },
    //         immediate: true
    //     }
    // },
}
</script>

<style lang="scss" scoped>
div.template {
    background: none;
}
</style>
