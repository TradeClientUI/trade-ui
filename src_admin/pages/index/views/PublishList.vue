<template>
    <div class='m-pageList'>
        <el-page-header class='header' :content="$t('publishList.label1')" @back='back' />
        <div class='data-list'>
            <el-table
                v-loading='loading'
                border
                :data='list'
                style='width: 100%;'
            >
                <el-table-column
                    align='center'
                    :label="$t('publishList.label2')"
                    prop='page_code'
                    width='100'
                />
                <el-table-column
                    align='center'
                    :label="$t('publishList.label3')"
                    prop='title'
                    width='120'
                />
                <el-table-column align='center' :label="$t('publishList.label4')" prop='img'>
                    <template #default='scope'>
                        <div
                            v-if='scope.row.img'
                            class='img'
                            @click='showImg(scope.row.img)'
                        >
                            <img alt='' :src='scope.row.img' />
                        </div>
                        <span v-else>
                            {{$t('publishList.label5')}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    align='center'
                    :label="$t('publishList.label6')"
                    prop='release_version'
                />
                <el-table-column
                    align='center'
                    :label="$t('publishList.label7')"
                    prop='release_description'
                />
                <el-table-column
                    :label="$t('publishList.label8')"
                    prop='create_date'
                    width='160'
                />
                <el-table-column
                    align='center'
                    :label="$t('publishList.label9')"
                    prop='creater'
                    width='100'
                />
                <el-table-column
                    align='center'
                    fixed='right'
                    :label="$t('publishList.label10')"
                    width='200'
                >
                    <template #default='scope'>
                        <el-button
                            disabled
                            size='small'
                            type='text'
                            @click='rollback(scope.row.id)'
                        >
                            {{$t('publishList.label11')}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog v-model='showBigImg' :title="$t('publishList.label12')" width='500px'>
            <div class='show-img'>
                <img alt='' :src='showImgUrl' width='100%' />
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getPushPageList, rollBackReleasePage } from '@index/Api/editor'
import { reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import { getQueryString } from '@admin/utils'
import { useI18n } from 'vue-i18n'
import {
    useRouter, useRoute
} from 'vue-router'
export default {
    name: 'PublishList',
    setup (props) {
        const { ctx } = getCurrentInstance()
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            list: [],
            loading: false,
            showBigImg: false,
            showImgUrl: ''
        })

        const back = () => {
            router.go(-1)
        }
        const getList = () => {
            state.loading = true
            getPushPageList({
                pageCode: route.query.pageCode,
                channelId: getQueryString('id'),
                language: getQueryString('language'),
            })
                .then(res => {
                    state.loading = false
                    if (!res.success) {
                        ctx.$message.error(res.data)
                        return
                    }
                    state.list = res.data
                })
                .finally(() => {
                    state.loading = false
                })
        }
        const rollback = (id) => {
            this.$confirm(t('publishList.label12'))
                .then(_ => {
                    rollBackReleasePage({ id: id })
                        .then(res => {
                            state.loading = false
                            if (!res.success) {
                                ctx.$message.error(res.message)
                                return
                            }
                            this.$confirm(t('publishList.label13'), {
                                confirmButtonText: t('publishList.label14'),
                                cancelButtonText: t('publishList.label15'),
                            })
                                .then(() => {
                                    router.push({ name: 'Editor', query: { page_code: route.query.id } })
                                })
                                .catch(() => {})
                        })
                        .catch(error => {
                            console.log(error)
                        })
                    done()
                })
                .catch(_ => { })
        }

        const showImg = (img) => {
            state.showImgUrl = img
            state.showBigImg = true
        }

        onMounted(() => {
            getList()
        })

        return {
            back,
            getList,
            rollback,
            showImg,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped lang="scss">
.m-pageList {
    height: 100vh;
    padding: 20px;
    overflow-y: auto;
    .header {
        line-height: 50px;
    }
}
.data-list {
    padding: 20px;
    .img {
        display: inline-block;
        height: 100px;
        img {
            width: auto;
            height: 100px;
        }
    }
}
.show-img {
    text-align: center;
    img {
        width: 400px;
    }
}
</style>
