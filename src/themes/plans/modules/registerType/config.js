export default {
    title: '注册模块',//'注册模块',
    tagIcon: 'el-icon-open',
    // tagIcon: 'el-icon-basketball',
    tag: 'registerType',
    include: ['mine'], // 包含的页面code
    config: [
        {
            name: 'registerBanner',
            label: 'banner图片',
            type: 'File',
            default: ''
        },
        {
            name: 'typeSupport',
            label: '注册方式',
            type: 'Checkbox',
            default: ['mobile'],
            options: [
                { value: 'mobile', label: '手机号' },
                { value: 'email', label: '邮箱' },
            ],
        },
        {
            name: 'agreement_html',
            label: '协议内容',
            filterName: 'name',
            include: ['agreement'],
            default: '',
            type: 'Tinymce'
        }
    ]
}
