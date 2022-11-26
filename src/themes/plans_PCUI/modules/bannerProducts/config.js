import { common, img } from '@admin/components/baseConfig'
export default {
    title: 'Banner产品',
    tag: 'bannerProducts',
    hidden: true, // 左侧模块列表不显示
    tagIcon: 'el-icon-film',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    listHidden: true,
    config: [
        {
            name: 'product',
            label: '产品ID',
            type: 'Product',
            default: {}
        }
    ]
}
