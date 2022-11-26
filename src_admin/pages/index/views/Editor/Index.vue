<template>
    <div class='container'>
        <div class='left-board'>
            <div class='logo-wrapper'>
                <div class='back' @click='back'>
                    <i class='el-icon-arrow-left'></i>{{ $t('editor.back') }}
                </div>
                <!-- <div class="logo">交易H5定制平台</div> -->
            </div>
            <el-scrollbar class='left-scrollbar'>
                <div v-if="['TradeIndex','SelfSymbolIndex','Nav'].indexOf(pageCode)===-1" class='components-list'>
                    <div
                        v-for='(item, listIndex) in leftComponents'
                        :key='listIndex'
                    >
                        <!-- <div class="components-title">
                                <i class="el-icon-guide"></i>
                                {{ item.title }}
                            </div> -->

                        <draggable
                            v-model='item.list'
                            class='components-draggable'
                            :clone='cloneComponent'
                            draggable='.components-item'
                            :group="{
                                name: 'componentsGroup',
                                pull: 'clone',
                                put: false,
                            }"
                            item-key='listIndex'
                            :sort='false'
                            @end='onEnd'
                        >
                            <template #item='{ element }'>
                                <div
                                    class='components-item'
                                    @click='addComponent(element)'
                                >
                                    <div class='components-body'>
                                        <i :class='element.tagIcon'></i>
                                        {{ element.title }}
                                    </div>
                                </div>
                            </template>
                        </draggable>
                    </div>
                </div>
            </el-scrollbar>
        </div>

        <div class='center-board'>
            <div class='row-btns'>
                <div class='tips'>
                    {{ $t("editor.page") }}：<strong> {{ title }}</strong>
                    &nbsp;&nbsp;
                    {{ $t("editor.language") }}: <strong> {{ lang }}</strong>
                </div>
                <div class='left'>
                    <el-button
                        icon='el-icon-reading'
                        type='text'
                        @click='toH5PreviewAddress'
                    >
                        {{ $t("editor.h5PreviewAddress") }}
                    </el-button>
                    <el-button
                        icon='el-icon-reading'
                        type='text'
                        @click='toH5Address'
                    >
                        {{ $t("editor.h5RealAddress") }}
                    </el-button>
                </div>

                <div class='right action-bar'>
                    <!-- <el-button icon="el-icon-view" type="text" @click="showJson">
                    查看json
                </el-button> -->
                    <el-button
                        icon='el-icon-s-promotion'
                        type='text'
                        @click='handleModifyPageConfig'
                    >
                        {{ $t("editor.saveConfiguration") }}
                    </el-button>
                    <el-button
                        class='delete-btn'
                        icon='el-icon-delete'
                        type='text'
                        @click='empty'
                    >
                        {{ $t("editor.empty") }}
                    </el-button>
                    <el-button
                        icon='el-icon-upload'
                        type='text'
                        @click='showPublish = true'
                    >
                        {{ $t("editor.publishOnline") }}
                    </el-button>
                </div>
            </div>
            <div class='center-scrollbar'>
                <el-row class='center-board-row'>
                    <div id='previewContainer' class='previewContainer' :class='{ "pc":isPC }'></div>
                </el-row>
            </div>
        </div>
        <RightPanel :page-conf='pageConf' />
        <ShowJson :show-code='showCode' />
        <el-dialog v-model='showPublish' :title="$t('editor.publishPage')" width='600px'>
            <el-form
                label-position='left'
                label-width='80'
                :model='publishForm'
            >
                <el-form-item :label="$t('editor.releaseVersion')">
                    <el-input v-model='publishForm.releaseVersion' />
                </el-form-item>
                <el-form-item :label="$t('editor.releaseDescription')">
                    <el-input
                        v-model='publishForm.releaseDescription'
                    />
                </el-form-item>
            </el-form>
            <div slot='footer' class='dialog-footer'>
                <el-button @click='showPublish = false'>
                    {{ $t("cancel") }}
                </el-button>
                <el-button
                    :loading='publishLoading'
                    type='primary'
                    @click='handlePublish'
                >
                    {{ $t("sure") }}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import { getPageConfig, modifyPageConfig, pushPage, getViChannel } from '@index/Api/editor'
import RightPanel from './components/RightPanel'
import ShowJson from './components/ShowJson'
import { zip, unzip, randomStr, getQueryString } from '@utils/index'
import { deepClone } from '@utils/deepClone'
import { mobileComponentsConfig } from '@admin/components/config'
import previewRender from '@h5/wp_preview/preview'
import * as pageConfig from '@h5/wp_preview/pageBaseConfig'
import html2canvas from 'html2canvas'
import Mousetrap from 'mousetrap'
import { forOwn } from 'lodash'
import { computed, onMounted, onUnmounted, reactive, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { sessionSet, getCookie } from '@/utils/util'
import { useI18n } from 'vue-i18n'
let mobileComponents = null
const pageBaseConfig = pageConfig || {}
let ELEMENIINDEX = 0
let ROWID = 10

export default {
    components: {
        draggable,
        RightPanel,
        ShowJson
    },
    setup (props, context) {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const { id, lang, page_code, title } = route.query
        const state = reactive({
            leftComponents: [
                {
                    title: '移动端组件',
                    list: []
                },
                // {
                //     title: "PC端组件",
                //     list: pcComponents
                // }
            ],
            showCode: false,
            pageConf: {},
            pageCode: page_code,
            showPublish: false,
            publishLoading: false,
            publishForm: {
                releaseVersion: '',
                releaseDescription: ''
            },
            settingPageConfig: {},
            previewApp: {},
            getLoading: false,
            pageId: getQueryString('id'),
            drag: false,
            isPC: process.env.VUE_APP_theme === 'plans_PCUI',
            submitType: 0
        })

        const activeIndex = computed(() => store.state.editor.activeIndex)

        const handleGetPageConfig = () => {
            if (state.pageCode) {
                store.commit('editor/RESET_ELEMENT', [])
                getPageConfig({
                    page_code: state.pageCode,
                    channelId: id,
                    language: lang,
                })
                    .then(res => {
                        state.pageConf = res.data
                        const parseData = JSON.parse(res.data ? ((res.data.content.length <= 0 || res.data.content === '[]') ? '[]' : unzip(res.data.content)) : '[]')
                        const resData = Object.prototype.toString.call(parseData) === '[object Array]' ? parseData : []
                        console.log('getPageConfig', resData)
                        if (resData.length <= 0) {
                            if (pageBaseConfig.hasOwnProperty(state.pageCode)) {
                                pageBaseConfig[state.pageCode].forEach((item, index) => {
                                    addComponent(item, index)
                                })
                            }
                            return
                        }

                        const componentsObj = {}
                        mobileComponents.forEach(comp => {
                            componentsObj[comp.tag] = comp
                        })
                        let _ELEMENIINDEX = -1
                        const storeData = resData.map((target, _Aindex) => {
                            // target 组件数据
                            const _index = target.id.split('_')[1]
                            if (_index > _ELEMENIINDEX) {
                                _ELEMENIINDEX = _index
                            }
                            const config = []
                            // 组件配置信息
                            const compConfig = componentsObj[target.tag].config
                            compConfig.forEach((_data, _Bindex) => {
                                if (_data.type === 'Object' || _data.type === 'Array') {
                                    const _childConfig = deepClone(_data.config)
                                    let childConfig = null
                                    if (_data.type === 'Array') {
                                        const configList = target.data[_data.name] || []
                                        childConfig = configList.map((item, _Cindex) => {
                                            const _id = randomStr()
                                            _childConfig.forEach(configItem => {
                                                if (configItem.type === 'Array') {
                                                    // console.log(configItem.name)
                                                    // console.log(_id)
                                                    configItem._id = _id
                                                    // console.log(JSON.stringify(configItem.config))
                                                    configItem.formConfig = item[configItem.name].map(() => {
                                                        return configItem.config
                                                    })
                                                } else if (configItem.type === 'Object') {
                                                    configItem.formConfig = configItem.config
                                                } else {
                                                    if (!item.hasOwnProperty(configItem.name)) {
                                                        item[configItem.name] = configItem.default
                                                    }
                                                }
                                            })
                                            return _childConfig
                                        })
                                    } else {
                                        if (!target.data[_data.name]) {
                                            target.data[_data.name] = {}
                                        }
                                        childConfig = _childConfig
                                        _childConfig.forEach(configItem => {
                                            if (!target.data[_data.name].hasOwnProperty(configItem.name)) {
                                                target.data[_data.name][configItem.name] = configItem.default
                                            }
                                        })
                                    }
                                    config.push(Object.assign({}, _data, { formConfig: childConfig, _id: randomStr() }))
                                } else {
                                    config.push(deepClone(_data))
                                }
                            })
                            return Object.assign({ formConfig: config, hidden: componentsObj[target.tag].hidden }, target)
                        })
                        store.commit('editor/RESET_ELEMENT', storeData)
                        // ELEMENIINDEX = index + 1

                        // 如果PCUI的首页，如果没有顶部banner模块，自动添加顶部banner模块
                        // if (state.isPC && state.pageCode === 'Home') {
                        //     const fullBanner = mobileComponents.find(el => el.tag === 'fullBanner')
                        //     console.log('fullBanner', fullBanner)
                        //     fullBanner && addComponent(fullBanner)
                        // }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        }

        const showComp = () => {
            let list = []
            const pageCode = state.pageCode.toLocaleLowerCase()
            mobileComponents.forEach(item => {
                if (!item.hidden) {
                    if (item.exclude || item.include) {
                        if ((item.exclude && !item.exclude.includes(pageCode)) || (item.include && item.include.includes(pageCode))) {
                            list.push(item)
                        }
                    } else {
                        list.push(item)
                    }
                }
            })
            const isPCUI = process.env.VUE_APP_theme === 'plans_PCUI'
            if (isPCUI && pageCode === 'footer') list = list.filter(el => el.tag === 'footer')
            state.leftComponents[0].list = list
        }

        const getSettingPageData = () => {
            return new Promise((resolve, reject) => {
                getPageConfig({
                    page_code: 'SysSetting',
                    channelId: id,
                    language: lang,
                })
                    .then(res => {
                        if (!res.success) {
                            ElMessage.error(res.message)
                            return
                        }
                        const content = JSON.parse(res.data.other)
                        console.log(content)
                        state.settingPageConfig = content
                    })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(() => {
                        // this.getLoading = false
                        resolve()
                    })
            })
        }

        let deleteConfirm = false
        const deleteComp = (ev) => {
            if (deleteConfirm === true) return
            deleteConfirm = true
            ElMessageBox.confirm(t('editor.tip2'), t('editor.hint'), {
                confirmButtonText: t('sure'),
                cancelButtonText: t('cancel'),
                type: 'warning'
            }).then(() => {
                deleteConfirm = false
                store.commit('editor/DELETE_ELEMENT', store.state.editor.activated)
                ElMessage.success({
                    message: t('editor.deleteSuccess'),
                    type: 'success'
                })
            })
                .catch(error => {
                    deleteConfirm = false
                    console.log(error)
                })
        }

        const handleModifyPageConfig = (ev) => {
            return new Promise((resolve, reject) => {
                if (ev && ev.preventDefault) {
                    ev.preventDefault()
                }
                const tradeTypeBlockCollect = store.state.editor.tradeTypeBlockCollect
                const config = deepClone(store.state.editor.elementList.map(item => ({
                    id: item.id,
                    tag: item.tag,
                    data: item.data,
                    listHidden: item.listHidden,
                    hideUserRole: item.hideUserRole
                })))

                const tradeTypeBlock = {}
                const tradeTypeSelfSymbol = store.state.editor.tradeTypeSelfSymbol

                config.forEach(item => {
                    addId(item.data)
                    if (Array.isArray(item.data.items) && item.data.items.length > 0) {
                        item.data.items.forEach((el, idx) => {
                            // const tradeTypeBlock = []
                            if (tradeTypeBlockCollect[idx]) {
                                forOwn(tradeTypeBlockCollect[idx], (value, key) => {
                                    if (['data', 'value'].indexOf(key) === -1) {
                                        if (!tradeTypeBlock[key]) {
                                            tradeTypeBlock[key] = []
                                        }
                                        tradeTypeBlock[key].push({
                                            id: el.id,
                                            title: el.title,
                                            list: value
                                        })
                                    }
                                })
                            }
                            if (el.tradeTypeCollect) delete el.tradeTypeCollect
                        })
                        item.data.tradeTypeBlock = Object.assign({}, tradeTypeBlock)
                        // if (item.data.code_ids_all) delete item.data.code_ids_all
                    }

                    // const activated = store.state.editor.activated

                    if (['selfSymbol', 'productsSwipe', 'productsTimeSharing', 'bannerProducts'].includes(item.tag)) {
                        if (tradeTypeSelfSymbol[item.id]) item.data.product = tradeTypeSelfSymbol[item.id]
                    } else if (['productsWithIcon'].includes(item.tag)) {
                        if (activeIndex.value) item.data.items[activeIndex.value].product = store.state.editor.tradeTypeSelfSymbol[item.id]
                    }
                })
                console.log('模块列表数据', config)
                modifyPageConfig(Object.assign({}, state.pageConf, {
                    page_code: state.pageCode,
                    content: zip(JSON.stringify(config)),
                    other: JSON.stringify(store.state.editor.elementOther),
                    channelId: id,
                    language: lang,
                    title
                }))
                    .then(res => {
                        if (!res.success) {
                            ElMessage.error(res.message)
                            resolve(false)
                            return
                        }
                        resolve(true)
                        if (state.submitType === 0) {
                            ElMessage.success({
                                message: t('editor.saveSuccess'),
                                type: 'success'
                            })
                        }
                        state.submitType = 0
                    })
                    .catch(error => {
                        resolve(false)
                        console.log(error)
                    })
            })
        }

        const toH5PreviewAddress = () => {
            if (state.settingPageConfig.h5PreviewAddress) {
                window.open('//' + state.settingPageConfig.h5PreviewAddress)
            }
        }

        const toH5Address = () => {
            if (state.settingPageConfig.h5Address) {
                window.open('//' + state.settingPageConfig.h5Address)
            }
        }

        const back = () => {
            router.go(-1)
        }

        const showJson = () => {
            state.showCode = true
        }

        const addComponent = (element, index) => {
            const data = deepClone(element)
            const elementConfig = {
                data: {},
                formConfig: [],
            }
            const secondForm = []
            data.config.forEach(item => {
                if (item.type === 'Array' || item.type === 'Object') {
                    secondForm.push(item)
                } else {
                    elementConfig.formConfig.push(item)
                    if (item.type === 'Product') {
                        elementConfig.data[item.name] = item.default || {}
                    } else if (item.type === 'Href') {
                        elementConfig.data[item.name] = item.default || { params: {}, query: {} }
                    } else {
                        elementConfig.data[item.name] = item.default
                    }
                }
            })
            // 第二层
            secondForm.forEach(second => {
                const curElement = []
                const nextElement = []
                const form = {}
                second.config.forEach(nextListItem => {
                    if (nextListItem.type === 'Array' || nextListItem.type === 'Object') {
                        nextElement.push(nextListItem)
                    } else {
                        curElement.push(nextListItem)
                        if (nextListItem.type === 'Product') {
                            form[nextListItem.name] = nextListItem.default || {}
                        } else if (nextListItem.type === 'Href') {
                            form[nextListItem.name] = nextListItem.default || { params: {}, query: {} }
                        } else {
                            form[nextListItem.name] = nextListItem.default
                        }
                    }
                })
                // 第三层
                const nextForm = {}
                nextElement.forEach(nextItem => {
                    nextItem.config.forEach(nextListItem => {
                        if (nextListItem.type === 'Product') {
                            nextForm[nextListItem.name] = nextListItem.default || {}
                        } else if (nextListItem.type === 'Href') {
                            nextForm[nextListItem.name] = nextListItem.default || { params: {}, query: {} }
                        } else {
                            nextForm[nextListItem.name] = nextListItem.default
                        }
                    })
                    curElement.push(Object.assign({ _id: randomStr() }, nextItem, { formConfig: nextItem.type === 'Object' ? nextItem.config : [nextItem.config] }))
                    form[nextItem.name] = nextItem.type === 'Array' ? [nextForm] : nextForm
                })
                elementConfig.formConfig.push(Object.assign({ _id: randomStr() }, second, { formConfig: second.type === 'Object' ? curElement : [curElement] }))
                elementConfig.data[second.name] = second.type === 'Array' ? [form] : form
            })

            store.commit('editor/ADD_ELEMENT', {
                formConfig: elementConfig.formConfig,
                data: Object.assign({
                    accountType: ['G', 'R'], //, 'D', 'R_1', 'R_2'
                    expiryDate: [],
                    linkComp: '',
                    linkCompPosition: '',
                    background: '',
                    style: {
                        'margin-top': '',
                        'margin-right': '',
                        'margin-bottom': '',
                        'margin-left': '',
                        'padding-top': '',
                        'padding-right': '',
                        'padding-bottom': '',
                        'padding-left': '',
                    },
                    extend: {},
                    saved: false

                }, elementConfig.data),
                id: `${data.tag}_${randomStr()}`,
                hidden: data.hidden,
                tag: data.tag,
                index: index || 0,
                listHidden: element.listHidden,
                hideUserRole: element.hideUserRole

            })
            ++ELEMENIINDEX
        }

        const addId = (data) => {
            for (const item in data) {
                if (Object.prototype.toString.call(data[item]) === '[object Array]') {
                    data[item].forEach(second => {
                        if (Object.prototype.toString.call(second) === '[object Object]') {
                            second.id = randomStr() + '_' + ROWID
                            ++ROWID
                        }
                        addId(second)
                    })
                }
            }
        }

        const handlePublish = async () => {
            state.publishLoading = true
            state.submitType = 1
            const modifyData = await handleModifyPageConfig()
            if (!modifyData) {
                return
            }
            const isDev = process.env.NODE_ENV === 'development'
            const pageImg = await html2canvas(document.querySelector('.previewWrapper .drawing-board'), { allowTaint: true, useCORS: true })
            pushPage(Object.assign({
                pageCode: state.pageCode,
                img: isDev ? '' : pageImg.toDataURL('image/jpeg', 0.7),
                channelId: id,
                language: lang,
                title
            }, state.publishForm))
                .then(res => {
                    state.showPublish = false
                    if (!res.success) {
                        ElMessage.error(res.message)
                        return
                    }
                    ElMessageBox.confirm(`${state.pageCode}${t('editor.publishedSuccessfully')}`, {
                        confirmButtonText: t('sure'),
                        cancelButtonText: t('editor.close'),
                    }).then(_ => {
                        router.push({
                            name: 'PublishList',
                            query: { pageCode: state.pageCode, id: state.pageId, lang: 'zh' }
                        })
                    })
                        .catch(_ => { })
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => {
                    state.publishLoading = false
                })
        }

        const onEnd = (obj) => {
            if (obj.from !== obj.to) {
                console.log(obj.newIndex)
                addComponent(obj.item._underlying_vm_, obj.newIndex)
            }
        }

        const empty = () => {
            ElMessageBox.confirm(t('editor.tip3'), t('editor.hint'), { type: 'warning' }).then(
                () => {
                    store.commit('editor/RESET_ELEMENT', [])
                    ELEMENIINDEX = 0
                }
            )
        }
        const elementAdd = (key) => {
            const elementData = this.elementConfig.filter((item) => (item.name === key))[0]
            if (elementData) {
                addComponent()
                elementData.config.push(elementData.config[0])
            }
        }

        const cloneComponent = (origin) => {
            return deepClone(origin)
        }

        // 获取渠道配置
        const getViChannelConfig = () => {
            state.getLoading = true
            getViChannel(state.pageId).then(res => {
                if (!res.success) {
                    return this.$message.error(res.message)
                }

                state.settingPageConfig.h5PreviewAddress = res.data.web_view_site
                state.settingPageConfig.h5Address = res.data.web_site
                sessionSet('web_site', res.data.web_site)
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                state.getLoading = false
            })
        }

        onMounted(async () => {
            mobileComponents = await mobileComponentsConfig()
            // mobileComponents.forEach(item => {
            //     let frontStr = ''
            //     if (process.env.VUE_APP_theme === 'plans_PCUI') {
            //         frontStr = 'pcui.'
            //     } else {
            //         frontStr = 'plans.'
            //     }

            //     item.title = t(frontStr + item.tag)
            //     item.config.forEach(el => {
            //         if (el.name == 'src' || el.name == 'href') {
            //             el.label = t(frontStr + 'commonConfig.' + el.name)
            //         } else {
            //             el.label = t(frontStr + item.tag + 'Config.' + el.name)
            //             // 处理option
            //             if (el.options) {
            //                 el.options.forEach(option => {
            //                     option.label = t(frontStr + item.tag + 'Config.' + el.name + 'Config.' + option.value)
            //                 })
            //             }
            //             // 处理第二层config
            //             if (el.config) {
            //                 el.config.forEach(config => {
            //                     config.label = t(frontStr + item.tag + 'Config.' + el.name + 'Config.' + config.name)
            //                 })
            //             }
            //         }
            //     })
            // })
            state.previewApp = previewRender('#previewContainer', getCookie('lang'))
            handleGetPageConfig()
            showComp()
            await getSettingPageData()
            Mousetrap.bind(['del', 'backspace'], deleteComp)
            Mousetrap.bind(['command+s', 'ctrl+s'], handleModifyPageConfig)
            getViChannelConfig()
        })

        onUnmounted(() => {
            // if (state.previewApp) state.previewApp.unmount()
            context.emit('RESET_ELEMENT', [])
        })

        return {
            toH5PreviewAddress,
            showJson,
            toH5Address,
            back,
            handleModifyPageConfig,
            handlePublish,
            addId,
            onEnd,
            cloneComponent,
            elementAdd,
            empty,
            lang,
            title,
            addComponent,
            ...toRefs(state)
        }
    }

}
</script>

<style lang="scss">
@import './styles';
.previewContainer {
    margin: 0 auto;
    &.pc{
        width: 100%;
    }
}
</style>
