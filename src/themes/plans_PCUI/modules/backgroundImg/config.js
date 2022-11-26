import { img } from '@admin/components/baseConfig'
export default {
    title: '背景图模块',
    tag: 'backgroundImg',
    tagIcon: 'el-icon-film',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        ...img,
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
            name: 'height',
            label: '模块高度',
            type: 'Input',
            default: '50px'
        },
    ]
}
