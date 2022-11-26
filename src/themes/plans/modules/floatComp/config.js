import { img } from '@admin/components/baseConfig'
const config = {}
img.forEach(item => {
    config[item.name] = item
})
export default {
    title: '浮动广告',//'浮动广告',
    tag: 'floatComp',
    tagIcon: 'el-icon-picture-outline',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        ...img
    ]
}
