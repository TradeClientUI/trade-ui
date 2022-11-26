import { common, img } from '@admin/components/baseConfig'
export default {
    title: '多图Banner',
    tag: 'ad',
    tagIcon: 'el-icon-thumb',
    exclude: ['Register', 'TradeIndex', 'Nav', 'mine'], // 排除的页面code
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        {
            name: 'items',
            type: 'Array',
            label: '广告项',
            max: 5,
            config: [
                ...common,
                ...img
            ]
        }
    ]
}
