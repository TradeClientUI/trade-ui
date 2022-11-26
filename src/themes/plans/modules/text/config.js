export default {
    title: '文本组件',//'文本组件',
    tag: 'text',
    // exclude:['nav'],   // 排除的页面code
    tagIcon: 'el-icon-document',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        {
            name: 'content',
            label: '文本内容',
            type: 'Textarea',
            default: ''
        },
        {
            name: 'color',
            label: '字体颜色',
            type: 'Input',
            default: '#333333'
        },
        {
            name: 'fontSize',
            label: '字体大小',
            type: 'Input',
            default: '14px'
        },
        {
            name: 'textAlign',
            label: '对齐方式',
            type: 'Radio',
            default: 'left',
            options: [
                { value: 'left', label: '左对齐' },
                { value: 'center', label: '居中对齐' },
                { value: 'right', label: '右对齐' },
            ]
        },
    ]
}
