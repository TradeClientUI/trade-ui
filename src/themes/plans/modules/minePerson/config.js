import { img } from '@admin/components/baseConfig'
export default {
    title: '个人信息',//'个人信息',
    tag: 'minePerson',
    include: ['mine'], // 只有这些页面显示
    tagIcon: 'el-icon-user',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        {
            name: 'faceImg',
            label: '默认头像',
            type: 'File',
            default: ''
        },
    ]
}
