export default {
    title: '跑马灯组件',
    tag: 'notice',
    exclude: ['nav'], // 排除的页面code
    tagIcon: 'el-icon-star-on',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        {
            name: 'items',
            type: 'Array',
            label: '跑马灯项',
            max: 6,
            config: [
                {
                    name: 'href',
                    label: '跳转地址',
                    type: 'Href',
                },
                {
                    name: 'text',
                    label: '内容',
                    type: 'Textarea',
                    default: '默认文字'
                },
            ]
        },
    ]
}
