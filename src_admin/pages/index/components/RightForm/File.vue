<template>
    <div class='m-file'>
        <el-form-item :label='config.label'>
            <el-input v-model='imgUrl' placeholder='请输入' @input='input'>
                <template #append>
                    <el-button
                        icon='el-icon-upload'
                        type='primary'
                        @click='uploadFile'
                    >
                        上传文件
                    </el-button>
                </template>
            </el-input>
        </el-form-item>
        <div v-if='config.tips' class='tips-wrap'>
            {{ config.tips }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'File',
    props: {
        config: {
            type: Object,
            default () {
                return {}
            }
        },
        activeData: {
            type: String,
        }
    },
    data () {
        return {
            imgUrl: this.activeData
        }
    },
    mounted () {
        // 设置wp上传文件的callback

    },
    methods: {
        uploadFile () {
            // 调用wp的方法上传图片
            if (window.tb_show) {
                tb_show('', 'media-upload.php?type=image&amp;TB_iframe=true')
                // 设置callBack
                window.send_to_editor = (html) => {
                    if (window.tb_remove) {
                        tb_remove()
                    }
                    console.log(html)
                    const _div = document.createElement('div')
                    _div.innerHTML = html
                    const imgUrl = _div.querySelector('img').getAttribute('src')
                    this.$emit('formChange', imgUrl)
                    this.imgUrl = imgUrl
                }
            } else {
                console.log('执行WordPress window.tb_show方法显示上传图片功能')
            }
        },
        input (val) {
            this.$emit('formChange', val)
        }
    }
}
</script>

<style lang="scss" scoped>
.m-file {
    margin-bottom: 18px;
    .el-form-item {
        margin-bottom: 0 !important;
    }
}
.tips-wrap {
    margin-top: 5px;
    padding-left: 90px;
    color: #E6A23C;
}
</style>
