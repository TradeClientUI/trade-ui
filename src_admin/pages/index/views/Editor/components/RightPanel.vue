<template>
    <div class='right-board'>
        <el-tabs v-model='currentTab' class='center-tabs' @tab-click='handleTabClick'>
            <el-tab-pane :label="$t('editor.componentProperties')" name='field'>
                <el-scrollbar class='right-scrollbar'>
                    <el-form v-if='activated' label-width='90px' size='small'>
                        <div class='base-setting'>
                            <el-popconfirm
                                v-if='!element.hidden'
                                :cancel-button-text="$t('cancel')"
                                :confirm-button-text="$t('editor.delete')"
                                icon='el-icon-info'
                                icon-color='red'
                                :title="$t('editor.tip1')"
                                @confirm='deleteElement'
                            >
                                <template #reference>
                                    <el-button class='delete-btn' icon='el-icon-delete' type='text'>
                                        {{ $t('editor.deleteComponent') }}
                                    </el-button>
                                </template>
                            </el-popconfirm>

                            <template v-if='!element.hideUserRole'>
                                <el-divider content-position='left'>
                                    <h3> {{$t('editor.basicSettings')}}</h3>
                                </el-divider>
                                <div class='setting-wrap'>
                                    <el-form-item :label="$t('editor.accountStatus')">
                                        <el-checkbox-group v-model='activeData.accountType'>
                                            <el-checkbox label='G'>
                                                {{ $t('editor.tourist') }}
                                            </el-checkbox>
                                            <!-- <el-checkbox label='D'>
                                            模拟
                                        </el-checkbox> -->
                                            <el-checkbox label='R'>
                                                {{ $t('editor.true') }}
                                            </el-checkbox>
                                        <!-- <el-checkbox label='R_1'>
                                            未入金
                                        </el-checkbox>
                                        <el-checkbox label='R_2'>
                                            已入金
                                        </el-checkbox> -->
                                        </el-checkbox-group>
                                    </el-form-item>
                                    <el-form-item :label="$t('editor.validPeriod')">
                                        <el-date-picker
                                            v-model='activeData.expiryDate'
                                            :end-placeholder="$t('editor.endDate')"
                                            format='YYYY-MM-DD HH:mm:ss'
                                            :range-separator="$t('editor.to')"
                                            :start-placeholder="$t('editor.startDate')"
                                            type='datetimerange'
                                            :unlink-panels='true'
                                        />
                                    </el-form-item>
                                </div>
                            </template>
                        </div>

                        <div class='component-setting'>
                            <el-divider v-if='element.formConfig && element.formConfig.length > 0' class='component-setting' content-position='left'>
                                <h3>{{ $t('editor.componentSettings') }}</h3>
                            </el-divider>
                            <div class='setting-wrap'>
                                <right-form
                                    :active-data='activeData'
                                    :element-config='element.formConfig'
                                    :element-tag='element.tag'
                                />
                            </div>
                        </div>
                    </el-form>
                <!-- <a
                        class="document-link"
                        target="_blank"
                        href="documentLink"
                        title="查看组件文档"
                    >
                        <i class="el-icon-link" />
                    </a> -->
                <!-- {{ activeData }} -->
                <!-- {{ elementConfig }} -->
                </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane :label="$t('editor.componentExtension')" name='extend'>
                <el-scrollbar v-if='activated' class='right-scrollbar' label-width='90px'>
                    <el-form label-width='90px' size='small'>
                        <el-divider content-position='left'>
                            {{ $t('editor.spacingSetting') }}
                        </el-divider>
                        <div class='m-spaceSetting'>
                            <el-input v-model="activeData.style['margin-top']" class='spaceInput top' :placeholder="$t('editor.upperSpacing')" />
                            <el-input v-model="activeData.style['margin-right']" class='spaceInput right' :placeholder="$t('editor.rightSpacing')" />
                            <el-input v-model="activeData.style['margin-bottom']" class='spaceInput bottom' :placeholder="$t('editor.bottomSpacing')" />
                            <el-input v-model="activeData.style['margin-left']" class='spaceInput left' :placeholder="$t('editor.leftSpacing')" />
                            <div class='margin'>
                                <el-input v-model="activeData.style['padding-top']" class='spaceInput top' :placeholder="$t('editor.fillUp')" />
                                <el-input v-model="activeData.style['padding-right']" class='spaceInput right' :placeholder="$t('editor.rightFill')" />
                                <el-input v-model="activeData.style['padding-bottom']" class='spaceInput bottom' :placeholder="$t('editor.underFill')" />
                                <el-input v-model="activeData.style['padding-left']" class='spaceInput left' :placeholder="$t('editor.leftPadding')" />
                                <div class='padding'>
                                    {{ $t('editor.component') }}
                                </div>
                            </div>
                        </div>
                        <!-- <el-divider content-position='left'>
                            样式设置
                        </el-divider>
                        <File :active-data='activeData.background' :config="{ label:'背景图片' }" @formChange='updateBackground' /> -->
                        <el-divider content-position='left'>
                            {{ $t('editor.locationSettings') }}
                            <el-button v-if='!element.hidden' class='delete-btn' icon='el-icon-delete' type='text' @click='deleteElement(activated)'>
                                {{ $t('editor.delete') }}
                            </el-button>
                        </el-divider>
                        <el-form-item :label="$t('editor.componentId')">
                            <el-input :disabled='true' :value='element.id' />
                        </el-form-item>
                        <!--<el-form-item label='绑定组件ID'>
                            <el-select v-model='activeData.linkComp' clearable placeholder='请选择'>
                                <el-option v-for='item in showElementList' :key='item.id' :label='item.id' :value='item.id' />
                            </el-select>
                        </el-form-item> -->
                        <el-form-item v-if='activeData.linkComp' :label="$t('editor.componentAlignment')">
                            <el-radio-group v-model='activeData.linkCompPosition'>
                                <el-radio label='top-right'>
                                    {{ $t('editor.upperRightCorner') }}
                                </el-radio>
                                <el-radio label='top-left'>
                                    {{ $t('editor.upperLeftCorner') }}
                                </el-radio>
                                <el-radio label='bottom-left'>
                                    {{ $t('editor.bottomLeftCorner') }}
                                </el-radio>
                                <el-radio label='bottom-right'>
                                    {{ $t('editor.bottomRightCorner') }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                    <!-- <el-divider content-position='left'>
                        扩展字段设置
                    </el-divider>
                    <el-form class='extendForm'>
                        <el-row v-for='(item, index) in extend' :key='index' class='row'>
                            <el-col :span='8'>
                                <el-input v-model='item.key' placeholder='Key'>
                                    <template slot='prepend'>
                                        Key
                                    </template>
                                </el-input>
                            </el-col>
                            <el-col :span='1' />

                            <el-col :span='8'>
                                <el-input v-model='item.value' placeholder='Value'>
                                    <template slot='prepend'>
                                        Value
                                    </template>
                                </el-input>
                            </el-col>
                            <el-col :span='1' />
                            <el-col :span='2'>
                                <el-button icon='el-icon-delete' type='danger' @click='deleteExtendRow(index)' />
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-row>
                        <el-col :span='24' style='text-align: center;'>
                            <el-button icon='el-icon-plus' type='text' @click='addExtendRow'>
                                添加
                            </el-button>
                        </el-col>
                    </el-row> -->
                </el-scrollbar>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import File from '@index/components/RightForm/File'
import { computed, reactive, toRefs, watch, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { forOwn, isPlainObject } from 'lodash'
export default {
    components: {
        File
    },
    props: {
        pageConf: {
            type: Object,
            default () {
                return {}
            }
        }
    },

    setup (props, context) {
        const store = useStore()
        const state = reactive({
            currentTab: 'field',
            extend: [{
                key: '',
                value: ''
            }]
        })

        const activated = computed(() => store.state.editor.activated)

        const showElementList = computed(() => {
            return store.state.editor.elementList.filter(
                item => item.id !== activated.value
            )
        })

        const element = computed(() => {
            const data =
                store.state.editor.elementList.filter(
                    item => item.id === activated.value
                )[0] || {}
            return data
        })

        const activeData = computed(() => {
            return element.value.data || {}
        })
        watchEffect(() => {
            if (Object.keys(activeData.value).length > 0) {
                if (activeData.value?.product) {
                    store.commit('editor/UPDATE_TRADETYPE_SELFSYMBOL_ALL', {
                        activatedId: activated.value,
                        data: activeData.value.product
                    })
                } else {
                    const tradeTypeBlock = activeData.value.tradeTypeBlock
                    const BlockEumn = {

                    }
                    if (isPlainObject(tradeTypeBlock)) {
                        forOwn(tradeTypeBlock, (value, key) => {
                            if (Array.isArray(value)) {
                                value.forEach(item => {
                                    if (!BlockEumn[item.id]) {
                                        BlockEumn[item.id] = {}
                                    }
                                    BlockEumn[item.id][key] = item.list
                                })
                            }
                        })
                    }
                    const sortKey = Object.keys(BlockEumn).sort(function (a, b) {
                        return parseInt(a.slice(a.lastIndexOf('_') + 1)) - parseInt(b.slice(b.lastIndexOf('_') + 1))
                    })
                    const initTradeTypeBlock = []
                    sortKey.forEach(item => {
                        initTradeTypeBlock.push(BlockEumn[item])
                    })
                    store.commit('editor/UPDATE_TRADETYPE_BLOCK_COLLECT', initTradeTypeBlock)
                }
            }
        })

        watch(() => state.extend, (newVal) => {
            const _obj = {}
            newVal.forEach(item => {
                if (item.key) {
                    _obj[item.key] = item.value
                }
            })
            store.commit('editor/UPDATE_FORM_DATA', {
                key: 'extend',
                value: _obj
            })
        }, {
            deep: true // 深度监听的参数
        })

        watch(() => activeData.value, (val, newVal) => {
            newVal.saved = true
        }, {
            deep: true
        })

        const updateBackground = (url) => {
            activeData.value.background = url
        }

        const handleTabClick = () => {
            if (state.currentTab === 'extend') {
                const arr = []
                for (const key in activeData.value.extend) {
                    arr.push({
                        key,
                        value: activeData.value.extend[key]
                    })
                }
                if (arr.length > 0) {
                    state.extend = arr
                }
            }
        }

        const deleteExtendRow = (index) => {
            state.extend.splice(index, 1)
        }

        const deleteElement = () => {
            store.commit('editor/DELETE_ELEMENT', activated.value)
        }

        const addExtendRow = () => {
            state.extend.push({
                key: '',
                value: ''
            })
        }

        return {
            ...toRefs(state),
            activated,
            element,
            activeData,
            updateBackground,
            showElementList,
            handleTabClick,
            deleteExtendRow,
            deleteElement,
            addExtendRow
        }
    }

}
</script>

<style lang="scss" scoped>
.right-board {
    position: absolute;
    top: 0;
    right: 0;
    width: 400px;
    padding-top: 3px;
    background-color: #FFF;
    .right-scrollbar {
        height: calc(100vh - 57px);
        :deep(.el-form) {
            .el-range-editor {
                width: 100%;
            }
        }
    }
    .delete-btn {
        margin-left: 15px;
    }
    .center-tabs {
        padding-left: 10px;
        .base-setting {
            padding-right: 10px;
        }
        .component-setting {
            margin-top: 50px;
            padding-right: 10px;
        }
        .setting-wrap {
            margin: 10px;
            margin-bottom: 20px;
            padding: 20px;
            border: solid 1px #CCC;
            border: solid 1px #DDD;
            border-radius: 10px;
        }
    }
}
.m-spaceSetting {
    position: relative;
    padding: 50px 20px;
    text-align: center;
    &.position {
        padding: 0;
        .margin {
            border: none;
        }
    }
    .spaceInput {
        position: absolute;
        width: 50px;
        font-size: 12px;
        :deep(.el-input__inner) {
            padding: 0 5px;
            text-align: center;
        }
    }
    .top {
        top: 5px;
        left: 50%;
        margin-left: -35px;
    }
    .bottom {
        bottom: 5px;
        left: 50%;
        margin-left: -35px;
    }
    .left {
        top: 50%;
        left: 5px;
        margin-top: -17px;
    }
    .right {
        top: 50%;
        right: 5px;
        margin-top: -17px;
    }
    .margin {
        position: relative;
        display: inline-block;
        width: 260px;
        height: 200px;
        border: solid 1px #CCC;
        border-radius: 8px;
        .padding {
            position: relative;
            top: 50%;
            left: 50%;
            width: 70px;
            height: 60px;
            margin-top: -30px;
            margin-left: -35px;
            color: #FFF;
            font-size: 16px;
            line-height: 60px;
            text-align: center;
            background-color: #CCC;
            border-radius: 8px;
        }
    }
}
.extendForm {
    .row {
        margin-bottom: 10px;
    }
}
</style>
