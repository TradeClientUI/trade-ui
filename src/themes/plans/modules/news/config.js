import { img } from '@admin/components/baseConfig'
const config = {}
img.forEach(item => {
    config[item.name] = item
})
export default {
    title: '信息流',//'信息流',
    tag: 'news',
    exclude: ['Register', 'TradeIndex', 'Nav', 'mine'], // 排除的页面code
    tagIcon: 'el-icon-news',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        {
            name: 'newsArea',
            label: '地区',
            type: 'Radio',
            default: 1,
            options: [
                { value: 1, label: '中国大陆' },
                { value: 2, label: '其它地区' }
            ],
        },
        {
            name: 'orgid',
            label: 'orgid',
            type: 'Input',
            default: 1
        }
    ]
}
