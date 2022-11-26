import { img } from '@admin/components/baseConfig'
export default {
    title: 'Layout布局',
    tag: 'layout',
    exclude: ['nav'], // 排除的页面code
    tagIcon: 'el-icon-s-grid',
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
            name: 'gutter',
            label: '栅格间距',
            type: 'Select',
            default: 0,
            options: [
                { value: 0, label: '0px' },
                { value: 0.5, label: '1px' },
                { value: 1, label: '2px' },
                { value: 2.5, label: '5px' },
                { value: 5, label: '10px' },
                { value: 7.5, label: '15px' },
                { value: 10, label: '20px' },
                { value: 15, label: '30px' },
                { value: 20, label: '40px' },
                { value: 25, label: '50px' },
            ]
        },
        {
            name: 'items',
            type: 'Array',
            label: '栅格元素',
            max: 6,
            config: [
                {
                    name: 'label',
                    label: '文字',
                    type: 'Input',
                    default: '默认文字'
                },
                {
                    name: 'src',
                    label: '图片地址',
                    type: 'File',
                    default: ''
                },
                {
                    name: 'href',
                    label: '跳转地址',
                    type: 'Href'
                }
            ]
        },
    ]
}
