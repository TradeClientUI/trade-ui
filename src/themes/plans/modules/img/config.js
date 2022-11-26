import { img } from '@admin/components/baseConfig'
const config = {}
img.forEach(item => {
    config[item.name] = item
})
export default {
    title: '单图Banner',//'单图Banner',
    tag: 'img',
    exclude: ['nav'], // 排除的页面code
    tagIcon: 'el-icon-picture-outline',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        ...img
    ]
}
