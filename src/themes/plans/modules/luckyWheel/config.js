export default {
    title: '大转盘',//'大转盘',
    tag: 'luckyWheel',
    hidden: true,
    // exclude:['nav'],   // 排除的页面code
    tagIcon: 'el-icon-star-on',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        {
            name: 'prizeButton',
            label: '抽奖按钮',
            type: 'File',
            default: ''
        },
        {
            name: 'items',
            type: 'Array',
            label: '奖品奖项',
            max: 8,
            config: [
                {
                    name: 'prizeName',
                    label: '奖品',
                    type: 'Input',
                    default: ''
                },
                {
                    name: 'prizeImg',
                    label: '奖品图片',
                    type: 'File',
                    default: ''
                },
            ]
        }
    ]
}
