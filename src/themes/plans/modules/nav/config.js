import { img } from '@admin/components/baseConfig'
export default {
    title: '底部导航',//'底部导航',
    tag: 'nav',
    hidden: true, // 左侧模块列表不显示
    tagIcon: 'el-icon-star-on',
    hideUserRole: true,
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        {
            name: 'items',
            type: 'Array',
            label: '导航元素',
            max: 5,
            config: [
                {
                    name: 'src',
                    label: '图片地址',
                    type: 'File',
                    default: '/wp-content/uploads/cats_business/nav_home.png',
                    tips: '建议尺寸(px): 130*130'
                },

                {
                    name: 'href',
                    label: '跳转地址',
                    type: 'Href'
                },
                {
                    name: 'title',
                    label: '标题',
                    type: 'Input',
                    default: '首页'
                },
            ]
        },
    ]
}
