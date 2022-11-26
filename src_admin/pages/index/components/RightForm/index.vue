<template>
    <!-- --{{ }} === {{ elementConfig }} -->
    <div class='rightForm'>
        <div
            v-for='(config, index) in elementConfig'
            :key='config.type + config.name + index'
        >
            <template
                v-if='
                    !config.hidden ||
                        !(
                            (config.exclude &&
                                config.exclude.includes(
                                    activeData[config.filterName]
                                )) ||
                            (config.include &&
                                !config.include.includes(
                                    activeData[config.filterName]
                                ))
                        )
                '
            >
                <el-form-item
                    v-if="config.type == 'Input' && !config.hidden "
                    :label='config.label'
                    :row='8'
                >
                    <el-input
                        v-model='activeData[config.name]'
                        placeholder='请输入'
                        :type='config.type.toLowerCase()'
                    />
                </el-form-item>
                <el-form-item
                    v-else-if="config.type == 'Textarea'"
                    :label='config.label'
                    :row='8'
                >
                    <el-input
                        v-model='activeData[config.name]'
                        placeholder='请输入'
                        :rows='5'
                        :type='config.type.toLowerCase()'
                    />
                </el-form-item>
                <el-form-item
                    v-else-if="config.type == 'Select'"
                    :label='config.label'
                >
                    <el-select
                        v-model='activeData[config.name]'
                        clearable
                        placeholder='请选择'
                    >
                        <el-option
                            v-for='item in config.options'
                            :key='item.value'
                            :label='item.label'
                            :value='item.value'
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-else-if="config.type == 'Radio'"
                    :label='config.label'
                >
                    <el-radio-group
                        v-model='activeData[config.name]'
                        placeholder='请选择'
                    >
                        <el-radio
                            v-for='item in config.options'
                            :key='item.value'
                            :label='item.value'
                        >
                            {{ item.label }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    v-else-if="config.type == 'Tinymce'"
                    class='tinymce-form-item'
                    :label='config.label'
                >
                    <Tinymce
                        v-model='activeData[config.name]'
                        :height='300'
                        :menubar='false'
                        :toolbar="['bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat hr', 'fullscreen bullist numlist link table forecolor backcolor fontsizeselect']"
                        :width='320'
                    />
                </el-form-item>
                <el-form-item
                    v-else-if="config.type === 'Checkbox'"
                    :label='config.label'
                >
                    <el-checkbox-group
                        v-model='activeData[config.name]'
                        placeholder='请选择'
                    >
                        <el-checkbox
                            v-for='item in config.options'
                            :key='item.value'
                            :label='item.value'
                        >
                            {{ item.label }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item
                    v-else-if="config.type === 'DatePicker'"
                    :label='config.label'
                >
                    <el-date-picker
                        v-model='activeData[config.name]'
                        end-placeholder='结束日期'
                        format='YYYY-MM-DD HH:mm:ss'
                        range-separator='至'
                        start-placeholder='开始日期'
                        type='datetimerange'
                        :unlink-panels='true'
                    />
                </el-form-item>
                <Href
                    v-else-if="config.type === 'Href'"
                    :active-data='activeData[config.name]'
                    :config='config'
                    @formChange='
                        (formData) => {
                            updateFormData(config.name, formData);
                        }
                    '
                />

                <File
                    v-else-if="config.type === 'File'"
                    :active-data='activeData[config.name]'
                    :config='config'
                    @formChange='
                        (formData) => {
                            updateFormData(config.name, formData);
                        }
                    '
                />
                <Product
                    v-else-if="config.type === 'Product'"
                    :active-block='activeBlock'
                    :active-data='activeData[config.name]'
                    :block-index='blockIndex'
                    :config='config'
                    :element-tag='elementTag'
                    :self-symbol='tradeTypeSelfSymbol'
                    :trade-type-collect='tradeTypeCollect'
                    @formChange='
                        (formData,type) => {
                            updateFormData(config.name, formData,type);
                        }
                    '
                />
                <div v-if="config.type == 'Object'">
                    <el-divider v-if='config.label' content-position='left'>
                        {{
                            config.label
                        }}
                    </el-divider>
                    <right-form
                        :active-block='config._id'
                        :active-data='activeData[config.name]'
                        :element-config='config.formConfig'
                    />
                </div>
                <div v-if="config.type == 'Array'">
                    <draggable
                        v-model='config.formConfig'
                        :animation='340'
                        handle='.handle'
                        :item-key='config.id||config._id'
                        @end='
                            (evt) =>
                                onEnd({
                                    oldIndex: evt.oldIndex,
                                    newIndex: evt.newIndex,
                                    key: config.name,
                                })
                        '
                    >
                        <template #item='{ element:ArrayItem, index: ArrayIndex }'>
                            <div
                                class='list-item'
                                :class="{ 'odd':(ArrayIndex%2==0) }"
                            >
                                <el-divider
                                    class='handle'
                                    content-position='left'
                                >
                                    {{ config.label }}
                                    <el-button
                                        v-if='config.formConfig.length > 1'
                                        class='delete-btn'
                                        icon='el-icon-delete'
                                        type='text'
                                        @click='
                                            deleteRow(
                                                config.formConfig,
                                                activeData[config.name],
                                                ArrayIndex
                                            )
                                        '
                                    >
                                        删除
                                    </el-button>
                                </el-divider>
                                <right-form
                                    :active-block='config._id'
                                    :active-data='
                                        activeData[config.name][ArrayIndex]
                                    '

                                    :block-index='ArrayIndex'
                                    :element-config='ArrayItem'
                                    :trade-type-collect='tradeTypeCollect'
                                />
                            </div>
                        </template>
                    </draggable>
                    <el-row>
                        <el-col :span='24' style='text-align: center;'>
                            <el-button
                                v-if='config.formConfig.length < config.max'
                                icon='el-icon-plus'
                                type='text'
                                @click='
                                    addRow(
                                        config.formConfig,
                                        activeData[config.name],
                                        config,
                                        activeData
                                    )
                                '
                            >
                                添加{{ config.label }}
                            </el-button>
                        </el-col>
                    </el-row>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import Tinymce from '@index/components/Tinymce'
import draggable from 'vuedraggable'
import Href from './Href'
import File from './File'
import Register from './Register'
import Product from './Product'
export default {
    name: 'RightForm',
    components: {
        Tinymce,
        draggable,
        Href,
        File,
        Register,
        Product
    },
    props: {
        elementConfig: {
            type: Array,
            default () {
                return []
            }
        },
        activeBlock: {},
        blockIndex: {},
        elementTag: {},
        // tradeTypeCollect: {},
        activeData: {
            type: Object,
            default () {
                return {}
            }
        },
    },
    data () {
        return {
            // tradeTypeCollect: [],
            // tradeTypeSelfSymbol: {},
        }
    },
    computed: {
        tradeTypeCollect () {
            return this.$store.state.editor.tradeTypeBlockCollect
        },
        tradeTypeSelfSymbol () {
            return this.$store.state.editor.tradeTypeSelfSymbol
        },
        tradeTypeBlockProduct () {
            return this.$store.state.editor.tradeTypeBlockProduct
        }
    },
    created () {
        // console.log('---activeData-----', this.activeData)
    },
    methods: {
        addRow (formConfig, data, config, activeData) {
            activeData.saved = true
            this.$store.commit('editor/ADD_FROM_ROW', {
                formConfig,
                data
            })
        },
        deleteRow (formConfig, data, index) {
            this.$store.commit('editor/DELETE_FROM_ROW', { formConfig: formConfig, data: data, index })
        },
        onEnd (evt) {
            // 更新表单结果
            console.log(evt)
            this.$store.commit('editor/CHANGE_INDEX_FROM_ROW', evt)
        },
        updateFormData (key, data, type) { // 此处提交版块产品
            if (key === 'product') {
                const activatedId = this.$store.state.editor.activated
                this.$store.commit('editor/UPDATE_TRADETYPE_SELFSYMBOL', { data, activatedId, type })
            } else if (key === 'tradeTypeBlock' || key === 'code_ids_all') {
                const newData = [...this.tradeTypeCollect]
                if (newData[this.blockIndex]) {
                    newData[this.blockIndex][type] = data
                } else {
                    newData[this.blockIndex] = { [type]: data }
                }
                this.$store.commit('editor/UPDATE_TRADETYPE_BLOCK_COLLECT', newData)
            } else {
                this.activeData[key] = data
                this.$store.commit('editor/UPDATE_FORM_DATA', { key, value: data })
            }
            // const newTradeTypeData = { ...this.activeData['tradeTypeCollect'], [type]: data }

            // this.$store.commit('editor/UPDATE_FORM_DATA', { key: 'tradeTypeCollect', value: newTradeTypeData })
            // if (key === 'product') {

            //     // this.activeData[key][type] = data
            // } else {
            //     const xinData = { ...this.activeData[key], [type]: data }
            //     this.$store.commit('editor/UPDATE_FORM_DATA', { key: key, value: xinData })
            //     // this.activeData[key] = data
            //     // if (this.activeData['tradeTypeCollect']) {
            //     //     this.activeData['tradeTypeCollect'][type] = data
            //     // }
            // }

            // this.activeData[key] = { ...data, tradeTypeCollect: { value: type, data } }
            // this.$store.commit('editor/UPDATE_FORM_DATA', {key:key,value:data})
        }
    }
}
</script>

<style lang="scss" scoped>
.delete-btn {
    margin-left: 15px;
}
.rightForm {
    padding-bottom: 10px;
    .list-item {
        margin: 10px;
        margin-bottom: 20px;
        padding: 10px;
        border-bottom: solid 1px #DDD;
    }
    .tinymce-form-item{
        flex-direction: column;
    align-items: flex-start;

        :deep{
            .el-form-item__label{
                    text-align: left;
            }
        }
    }
}

</style>
