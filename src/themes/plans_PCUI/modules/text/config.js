export default {
    title: '文本组件',
    tag: 'text',
    // exclude:['nav'],   // 排除的页面code
    tagIcon: 'el-icon-document',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        {
            name: 'moduleAlign',
            label: '对齐方式',
            type: 'Radio',
            default: 'center',
            options: [
                { value: 'center', label: '居中显示' },
                { value: 'full', label: '通栏显示' }
            ]
        },
        {
            name: 'fontWeight',
            label: '字体粗细',
            type: 'Radio',
            default: 'normal',
            options: [
                { value: 'normal', label: '标准' },
                { value: 'bold', label: '粗体' },
                { value: 'bolder', label: '更粗' },
                { value: 'lighter', label: '更细' }
            ]
        },
        {
            name: 'content',
            label: '文本内容',
            type: 'Textarea',
            default: ''
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
