import { common } from '@admin/components/baseConfig'
export default {
    title: '菜单列表',//'菜单列表',
    tag: 'menulist',
    exclude: ['nav'], // 排除的页面code
    tagIcon: 'el-icon-menu',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        {
            name: 'items',
            type: 'Array',
            label: '菜单元素',
            max: 20,
            config: [
                ...common,
                {
                    name: 'icon',
                    label: '图标地址',
                    type: 'File',
                    default: ''
                },
                {
                    name: 'href',
                    label: '跳转链接',
                    type: 'Href',
                },
                {
                    name: 'title',
                    label: '标题',
                    type: 'Input',
                    default: '默认文字'
                },
                {
                    name: 'value',
                    label: '内容',
                    type: 'Input',
                    default: ''
                },
                {
                    name: 'valueStyle',
                    label: '内容样式',
                    type: 'Select',
                    default: 'none',
                    options: [
                        { value: 'none', label: '无' },
                        { value: 'primary', label: '样式1' },
                        { value: 'success', label: '样式2' },
                        { value: 'danger', label: '样式3' },
                        { value: 'warning', label: '样式4' }
                    ]
                },
                {
                    name: 'isLink',
                    label: '显示箭头',
                    type: 'Radio',
                    default: true,
                    options: [
                        { value: true, label: '是' },
                        { value: false, label: '否' }
                    ]
                },
                {
                    name: 'describe',
                    label: '描述文字',
                    type: 'Input',
                    default: ''
                }
            ]
        }
    ]
}
