import { img } from '@admin/components/baseConfig'
export default {
    title: '产品列表',//'产品列表',
    tag: 'productsWithIcon',
    // include: ['mine'], // 只有这些页面显示
    tagIcon: 'el-icon-s-marketing',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        {
            name: 'items',
            type: 'Array',
            label: '产品',
            max: 100,
            config: [
                {
                    name: 'product',
                    label: '产品ID',
                    type: 'Product',
                    default: {}
                },
                {
                    name: 'src',
                    label: '图标地址',
                    type: 'File',
                    default: '/wp-content/uploads/cats_business/BTCUSDT.png',
                    tips: '建议尺寸(px): 130*130'
                }
            ]
        }
    ]

}
