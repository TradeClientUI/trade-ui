export default {
    title: '红包雨动画',//'红包雨动画',
    tag: 'redpacket',
    hidden: true, // 左侧模块列表不显示
    // exclude:['nav'],   // 排除的页面code
    tagIcon: 'el-icon-heavy-rain',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        {
            name: 'time',
            label: '动画时间(秒)',
            type: 'Input',
            default: ''
        },
        {
            name: 'type',
            label: '动画方式',
            type: 'Select',
            default: 1,
            options: [
                { value: 1, label: '只显示一次' },
                { value: 2, label: '每次进入页面显示' },
            ]
        }
    ]
}
