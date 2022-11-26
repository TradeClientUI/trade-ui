export default {
    title: '公共底部',
    tag: 'footer',
    include: ['footer'],
    hideUserRole: true,
    tagIcon: 'el-icon-film',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        {
            name: 'logo',
            label: 'Logo图片',
            type: 'File',
            default: ''
        },
        {
            name: 'copyRight',
            label: 'copyRight',
            type: 'Input',
            default: '© 2021 Trade Switcher'
        },
    ]
}
