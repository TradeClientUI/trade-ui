<template>
    <div class='tinymce-container' :class='{ fullscreen:fullscreen }' :style='{ width:containerWidth }'>
        <textarea :id='tinymceId' class='tinymce-textarea'></textarea>
        <div class='editor-custom-btn-container'>
            <editorImage class='editor-upload-btn' color='#1890ff' @successCBK='imageSuccessCBK' />
        </div>
    </div>
</template>

<script>
/**
 * docs: https://github.com/PanJiaChen/vue-element-admin/blob/master/src/components/Tinymce/index.vue
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import editorImage from './components/EditorImage'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN = '/wp-content/uploads/cats_business/libs/tinymce/tinymce.min.js'

export default {
    name: 'Tinymce',
    components: { editorImage },
    props: {
        id: {
            type: String,
            default: function () {
                return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
            }
        },
        modelValue: {
            type: String,
            default: ''
        },
        value: {
            type: String,
            default: ''
        },
        toolbar: {
            type: Array,
            required: false,
            default () {
                return []
            }
        },
        menubar: {
            type: String,
            default: 'file edit insert view format table'
        },
        height: {
            type: [Number, String],
            required: false,
            default: 360
        },
        width: {
            type: [Number, String],
            required: false,
            default: 'auto'
        }
    },
    emits: ['update:modelValue', 'input'],
    data () {
        return {
            hasChange: false,
            hasInit: false,
            tinymceId: this.id,
            fullscreen: false,
            languageTypeList: {
                'en': 'en',
                'zh': 'zh_CN',
                'es': 'es_MX',
                'ja': 'ja'
            }
        }
    },
    computed: {
        containerWidth () {
            const width = this.width
            if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
                return `${width}px`
            }
            return width
        }
    },
    watch: {
        moduleValue (val) {
            if (!this.hasChange && this.hasInit) {
                this.$nextTick(() =>
                    window.tinymce.get(this.tinymceId).setContent(val || ''))
            }
        }
    },
    mounted () {
        this.init()
    },
    activated () {
        if (window.tinymce) {
            this.initTinymce()
        }
    },
    deactivated () {
        this.destroyTinymce()
    },
    unmounted () {
        this.destroyTinymce()
    },
    methods: {
        init () {
            // dynamic load tinymce from cdn
            load(tinymceCDN, (err) => {
                if (err) {
                    this.$message.error(err.message)
                    return
                }
                this.initTinymce()
            })
        },
        initTinymce () {
            const _this = this
            window.tinymce.init({
                selector: `#${this.tinymceId}`,
                language: this.languageTypeList['zh'],
                height: this.height,
                body_class: 'panel-body ',
                object_resizing: false,
                toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
                // menubar: this.menubar,
                menubar: false,
                plugins: plugins,
                end_container_on_empty_block: true,
                powerpaste_word_import: 'clean',
                code_dialog_height: 450,
                code_dialog_width: 1000,
                advlist_bullet_styles: 'square',
                advlist_number_styles: 'default',
                imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
                default_link_target: '_blank',
                link_title: false,
                nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
                init_instance_callback: editor => {
                    if (_this.modelValue) {
                        editor.setContent(_this.modelValue)
                        _this.hasInit = true
                    }

                    editor.on('NodeChange Change KeyUp SetContent', () => {
                        this.hasChange = true
                        this.$emit('input', editor.getContent())
                        this.$emit('update:modelValue', editor.getContent())
                    })
                },
                setup (editor) {
                    editor.on('FullscreenStateChanged', (e) => {
                        _this.fullscreen = e.state
                    })
                    editor.on('change', (e) => {
                        editor.save() // 自动保存，tinymce 关闭离开页面时confirm提示框
                    })
                },
                // it will try to keep these URLs intact
                // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
                // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
                convert_urls: false
                // 整合七牛上传
                // images_dataimg_filter(img) {
                //   setTimeout(() => {
                //     const $image = $(img);
                //     $image.removeAttr('width');
                //     $image.removeAttr('height');
                //     if ($image[0].height && $image[0].width) {
                //       $image.attr('data-wscntype', 'image');
                //       $image.attr('data-wscnh', $image[0].height);
                //       $image.attr('data-wscnw', $image[0].width);
                //       $image.addClass('wscnph');
                //     }
                //   }, 0);
                //   return img
                // },
                // images_upload_handler(blobInfo, success, failure, progress) {
                //   progress(0);
                //   const token = _this.$store.getters.token;
                //   getToken(token).then(response => {
                //     const url = response.data.qiniu_url;
                //     const formData = new FormData();
                //     formData.append('token', response.data.qiniu_token);
                //     formData.append('key', response.data.qiniu_key);
                //     formData.append('file', blobInfo.blob(), url);
                //     upload(formData).then(() => {
                //       success(url);
                //       progress(100);
                //     })
                //   }).catch(err => {
                //     failure('出现未知问题，刷新页面，或者联系程序员')
                //     console.log(err);
                //   });
                // },
            })
        },
        destroyTinymce () {
            const tinymce = window.tinymce.get(this.tinymceId)
            if (this.fullscreen) {
                tinymce.execCommand('mceFullScreen')
            }

            if (tinymce) {
                tinymce.destroy()
            }
        },
        setContent (value) {
            window.tinymce.get(this.tinymceId).setContent(value)
        },
        getContent () {
            return window.tinymce.get(this.tinymceId).getContent()
        },
        imageSuccessCBK (arr) {
            arr.forEach(v => window.tinymce.get(this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`))
        }
    }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
    position: relative;
    line-height: normal;
    :deep{
        .mce-toolbar{
            .mce-container{
                &>div{
                        white-space: normal;
                }
            }
        }
    }

}
.tinymce-container {
    :deep(.mce-fullscreen) {
        z-index: 10000;
    }
}
.tinymce-textarea {
    z-index: -1;
    visibility: hidden;
}
.editor-custom-btn-container {
    position: absolute;
    top: 4px;
    right: 4px;
    /* z-index: 2005; */
}
.fullscreen .editor-custom-btn-container {
    position: fixed;
    z-index: 10000;
}
.editor-upload-btn {
    display: inline-block;
}
</style>
