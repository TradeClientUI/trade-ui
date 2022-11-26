import { common, img } from '@admin/components/baseConfig'
export default {
    title: '轮播Banner',
    tag: 'swipe',
    tagIcon: 'el-icon-film',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        {
            name: 'loop',
            label: '自动轮播',
            type: 'Select',
            default: true,
            options: [
                { value: true, label: '是' },
                { value: false, label: '否' },
            ]
        },
        {
            name: 'autoplay',
            label: '轮播间隔',
            type: 'Select',
            default: 3000,
            options: [
                { value: 1000, label: '1000ms' },
                { value: 2000, label: '2000ms' },
                { value: 3000, label: '3000ms' },
                { value: 5000, label: '5000ms' },
                { value: 7000, label: '7000ms' },
            ]
        },
        {
            name: 'items',
            type: 'Array',
            label: '轮播项',
            max: 5,
            config: [
                ...common,
                ...img
            ]
        }
    ]
}
