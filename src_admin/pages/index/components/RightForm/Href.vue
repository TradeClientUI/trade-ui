<template>
    <div class='m-href'>
        <el-form-item :label='config.label'>
            <el-select
                v-model='activeData.name'
                clearable
                placeholder='请选择'
                @change='changeUrl'
            >
                <el-option
                    v-for='item in hrefList'
                    :key='item.name'
                    :label='item.title'
                    :value='item.name'
                />
            </el-select>
        </el-form-item>
        <template v-if='elementConfig && elementConfig.length > 0'>
            <el-divider content-position='center'>
                {{ config.label }}-参数开始
            </el-divider>
            <right-form
                :active-data='activeData'
                :element-config='elementConfig'
            />
            <el-divider content-position='center'>
                {{ config.label }}-参数结束
            </el-divider>
        </template>
    </div>
</template>

<script>
import hrefList from '@h5/wp_preview/exportRoutes'
export default {
    name: 'Href',
    props: {
        config: {
            type: Object,
            default () {
                return {}
            }
        },
        activeData: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            hrefList: hrefList.filter(item => (!item.notHref)),
            elementConfig: [],
        }
    },
    mounted () {
        // 初始化表单值
        this.changeUrl(this.activeData.name, true)
    },
    methods: {
        changeUrl (val, flg) {
            // 重新初始化表单值
            let formConfig = this.hrefList.find(item => (item.name === this.activeData.name))
            formConfig = (formConfig ? formConfig.config : null) || null
            const formData = {
                name: this.activeData.name
            }
            const _elementConfig = []
            if (formConfig) {
                formConfig.forEach(item => {
                    // 生成表单
                    let _Obj = _elementConfig.find(elementItem => (elementItem.label === item.position))
                    if (!_Obj) {
                        _Obj = {
                            type: 'Object',
                            name: item.position,
                            formConfig: []

                        }
                        _elementConfig.push(_Obj)
                    }
                    _Obj.formConfig.push(item)
                    // 初始化表单数据

                    if (!formData[item.position]) {
                        formData[item.position] = {}
                    }
                    formData[item.position][item.name] = item.default
                })
            }
            this.elementConfig = _elementConfig
            if (!flg) {
                this.$emit('formChange', formData)
            }
        }
    }
}
</script>

<style lang="scss">
</style>
