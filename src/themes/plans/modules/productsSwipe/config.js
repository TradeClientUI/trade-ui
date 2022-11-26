import { img } from '@admin/components/baseConfig'
const config = {}
img.forEach(item => {
    config[item.name] = item
})
export default {
    title: '产品行情轮播',//'产品行情轮播',
    tag: 'productsSwipe',
    include: ['home'], // 只有这些页面显示
    tagIcon: 'el-icon-s-marketing',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        {
            name: 'product',
            label: '产品ID',
            type: 'Product',
            default: {}
        }
    ]
}
