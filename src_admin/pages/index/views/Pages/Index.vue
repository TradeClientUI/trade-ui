<template>
    <div class='m-pageList'>
        <el-collapse :value="['1']">
            <el-collapse-item class='search' name='1' :title="$t('title')">
                <!-- <el-form ref='form' inline label-position='left' label-width='60px' :model='searchForm'>

                </el-form>
                <el-row>
                    <el-col class='footerBtns' :span='24'>
                        <el-button icon='el-icon-edit' type='success' @click='create'>
                            新建
                        </el-button>

                        <el-button icon='el-icon-search' :loading='loading' type='primary' @click='getPageList'>
                            查询
                        </el-button>
                    </el-col>
                </el-row> -->
            </el-collapse-item>
        </el-collapse>
        <el-tabs v-model='activeLang'>
            <el-tab-pane v-for='item in lang' :key='item.val' :label='item.name' :name='item.val' />
        </el-tabs>

        <div class='data-list'>
            <el-table v-loading='loading' border :data='list' style='width: 100%;'>
                <el-table-column align='center' :label="$t('pageCode')" prop='page_code'>
                    <template #default='scope'>
                        <el-button v-if="scope.row.page_code.indexOf('http')==0" size='small' type='text'>
                            {{ scope.row.page_code }}
                        </el-button>
                        <el-button v-else size='small' type='text' @click='edit(scope.row)'>
                            {{ scope.row.page_code }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column align='center' :label="$t('titleName')" prop='title' />
                <el-table-column align='center' :label="$t('state')" prop='status' width='60' />
                <el-table-column :label="$t('createTime')" prop='create_date' width='160' />
                <el-table-column :label="$t('updateTime')" prop='update_date' width='160' />
                <el-table-column align='center' :label="$t('operator')" prop='updater' width='100' />
                <el-table-column align='center' fixed='right' :label="$t('operate')" width='200'>
                    <template #default='scope'>
                        <!-- <el-button size='small' type='text' @click='setting(scope.row)'>
                            编辑
                        </el-button> -->
                        <el-button v-if="scope.row.page_code.indexOf('http')==0" size='small' type='text' @click='showOtherPage(scope.row.page_code)'>
                            {{ $t('check') }}
                        </el-button>
                        <el-button v-else size='small' type='text' @click='edit(scope.row)'>
                            {{ $t('designPage') }}
                        </el-button>
                        <el-button size='small' type='text' @click='viewPublish(scope.row)'>
                            {{ $t('viewHistory') }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="100"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="400"
            >
            </el-pagination>
        </div> -->
        <el-dialog
            v-model='addForm.show'
            append-to-body
            :close-on-click-modal='false'
            :title="addForm.type == 'add' ? $t('newPage') : $t('editPage')"
            width='500px'
            @closed='closed'
        >
            <el-form ref='addFormModal' label-width='80px' :model='addForm.form' :rules='addForm.rules'>
                <el-form-item :label="$t('pageType')">
                    <el-radio-group v-model='addForm.form.pageType' :aa='addForm.form.pageType' :disabled="addForm.type ==='modify'" @change='changeType'>
                        <el-radio label='1'>
                            {{ $t('innerPage') }}
                        </el-radio>
                        <el-radio label='2'>
                            {{ $t('activePage') }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if='addForm.form.pageType == 1' v-model='addForm.form.page_code' :disabled="addForm.type ==='modify'" :label="$t('pageCode')" prop='page_code'>
                    <el-select v-model='addForm.form.page_code' clearable :disabled="addForm.type ==='modify'" :placeholder="$t('pleaseChoose')" @change='changePage'>
                        <el-option v-for='item in h5PageList' :key='item.name' :label='item.title' :value='item.name' />
                    </el-select>
                </el-form-item>
                <template v-else-if='addForm.form.pageType == 2'>
                    <el-form-item :label="$t('pageAdd')" prop='page_code'>
                        <el-input v-model='addForm.form.page_code' :placeholder="$t('pleaseEnter')" />
                    </el-form-item>
                    <el-form-item :label="$t('titleName')">
                        <el-input v-model='addForm.form.title' autocomplete='off' :placeholder="$t('pleaseEnter')" />
                    </el-form-item>
                </template>
                <el-form-item :label="$t('State')">
                    <el-radio-group v-model='addForm.form.status'>
                        <el-radio label='1'>
                            {{ $t('enable') }}
                        </el-radio>
                        <el-radio label='0'>
                            {{ $t('disable') }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot='footer' class='dialog-footer'>
                <el-button @click='addForm.show = false'>
                    {{ $t('cancel') }}
                </el-button>
                <el-button :loading='addForm.loading' type='primary' @click='submit'>
                    {{ $t('sure') }}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { pageList, modifyPageConfig, getViChannel } from '@index/Api/editor'
import { deepClone } from '@utils/deepClone'
import { h5PageList } from './h5PageList'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { onMounted, reactive, ref, toRefs, getCurrentInstance, watch } from 'vue'
import { getQueryString } from '@admin/utils'
import { useI18n } from 'vue-i18n'
import { localGet, localSet } from '@/utils/util'
export default {
    beforeRouteEnter (to, from, next) {
        if (getQueryString('page') === 'cats_sett_manage') {
            next({ name: 'Setting' })
        } else if (getQueryString('page') === 'cats_init_manage') {
            next({ name: 'Install' })
        } else if (getQueryString('page') === 'cats_editor_page_manage') {
            next({ name: 'ChannelSetting' })
        } else {
            next()
        }
    },
    name: 'Pages',
    setup (props) {
        const router = useRouter()
        const route = useRoute()
        const addFormModal = ref(null)
        const { t } = useI18n({ useScope: 'global' })
        const {
            ctx
        } = getCurrentInstance()

        const checkPageCode = (rule, value, callback) => {
            const localData = state.list.find((item) => (item.page_code == value))
            if (state.addForm.type === 'add' && localData) {
                callback(new Error(t('error1')))
            } else {
                callback()
            }
        }

        const state = reactive({
            list: [],
            h5PageList: [],
            addForm: {
                show: false,
                loading: false,
                form: {
                    pageType: '2',
                    page_code: '',
                    title: '',
                    page_slug: 'act_1',
                    status: '1',
                    type: 'html',
                    content: '[]'
                },
                rules: {
                    page_code: [
                        {
                            required: true,
                            message: t('error2'),
                            trigger: 'blur'
                        },
                        {
                            validator: checkPageCode,
                            trigger: 'blur'
                        }
                    ]
                },
                type: 'add',

            },
            loading: false,
            searchForm: {},
            activeLang: route.query.language || 'zh-CN',
            lang: []

        })

        watch(
            () => state.activeLang,
            (val) => {
                getPageList()
                // router.replace({
                //     query: {
                //         id: getQueryString('id'),
                //         language: state.activeLang
                //     }
                // })
                // localSet('lang', state.activeLang)
                // setI18nLanguage(I18n, state.activeLang)
                // loadLocaleMessages(I18n, state.activeLang)
            }
        )
        // 获取页面配置
        const getPageConfig = () => {
            const that = this
            getViChannel(getQueryString('id')).then(res => {
                if (!res.success) {
                    that.$message.error(res.message)
                    return
                }

                let content = res.data.content ? JSON.parse(res.data.content) : {}
                content = Object.prototype.toString.call(content) === '[object Object]' ? content : {}

                state.lang = content.supportLanguage
            }).catch(error => {
                console.log(error)
            }).finally(() => {
            })
        }

        const changePage = () => {
            const info = state.h5PageList.find(item => (item.name == val))
            if (info) {
                state.addForm.form.title = info.title
            }
        }

        const changeType = (type) => {
            if (Number(type) === 1) {
                state.addForm.form.page_slug = 'h5'
            } else if (Number(type) === 2) {
                state.addForm.form.page_slug = 'act_1'
            }
        }

        const submit = () => {
            addFormModal.value.validate((valid) => {
                if (!valid) {
                    return
                }
                state.submitLoading = true
                modifyPageConfig(state.addForm.form)
                    .then(res => {
                        state.addForm.loading = false
                        if (!res.success) {
                            ctx.$message.error(res.message)
                        }
                        ctx.$message.success(state.addForm.type === 'add' ? t('createdSuccessfully') : t('createdSuccessfully'))
                        getPageList()
                        state.addForm.show = false
                    })
                    .catch(error => {
                        console.log(error)
                        state.addForm.loading = false
                    })
            })
        }
        const closed = () => {
            addFormModal.value.resetFields()
        }
        const create = () => {
            state.addForm.type = 'add'

            state.addForm.form = {
                pageType: '2',
                page_code: '',
                title: '',
                page_slug: 'act_1',
                type: 'html',
                status: '1',
                content: '',
                id: getQueryString('id'),
                language: state.activeLang // getQueryString('language'),
            }
            state.addForm.show = true
        }
        const edit = (row) => {
            router.push({
                name: 'Editor',
                query: {
                    page_code: row.page_code,
                    id: row.channel_id,
                    lang: state.activeLang,
                    title: row.title
                }
            })
        }
        const showOtherPage = (url) => {
            window.open(url)
        }
        const getPageList = () => {
            state.loading = true
            state.list = []
            pageList({
                type: 'html',
                channelId: getQueryString('id'),
                language: state.activeLang,
            }).then(res => {
                state.loading = false
                if (res.success) {
                    // 显示下拉列表
                    // h5PageList
                    state.list = res.data
                }
                const nameList = state.list.map(item => (item.page_code))
                state.h5PageList = h5PageList.filter(item => (nameList.indexOf(item.name) < 0))
            })
                .catch(error => {
                    state.loading = false
                    console.log(error)
                })
        }
        const setting = (row) => {
            state.addForm.form = deepClone(row)
            const nameList = h5PageList.map(item => (item.name))
            if (nameList.indexOf(row.page_code) >= 0) {
                state.addForm.form.pageType = '1'
                state.h5PageList = h5PageList.filter(item => (item.name == row.page_code))
            } else {
                state.addForm.form.pageType = '2'
            }

            state.addForm.type = 'modify'
            state.addForm.form.id = getQueryString('id')
            state.addForm.form.language = state.activeLang // getQueryString('language')
            state.addForm.show = true
        }
        const viewPublish = (row) => {
            router.push({
                name: 'PublishList',
                query: {
                    pageCode: row.page_code,
                    id: row.channel_id,
                    language: state.activeLang // getQueryString('language')

                }
            })
        }

        onMounted(() => {
            getPageList()
            getPageConfig()
        })

        return {
            changePage,
            changeType,
            submit,
            closed,
            create,
            edit,
            showOtherPage,
            getPageList,
            setting,
            viewPublish,
            checkPageCode,
            addFormModal,
            ...toRefs(state)
        }
    }

}
</script>

<style lang="scss" scoped>
.m-pageList {
    height: 100vh;
    margin: 30px;
    overflow-y: auto;
    .search {
        :deep(.el-collapse-item__wrap) {
            padding: 0 20px;
        }
    }
    .data-list {
        margin-top: 20px;
    }
    .headerBtns {
        margin-bottom: 20px;
    }
    .footerBtns {
        text-align: right;
    }
    .pagination {
        margin-top: 20px;
        padding: 0 20px;
        text-align: right;
    }
}
</style>
