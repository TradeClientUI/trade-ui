import { common } from '@admin/components/baseConfig'
export default {
    title: '行情列表',//'行情列表',
    hidden: true,
    tag: 'quoteList',
    hideUserRole: true,
    tagIcon: 'el-icon-star-on',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        // {
        //     type: 'Input',
        //     name: 'abc',
        //     label: '基础配置1',
        //     default: ''
        // },
        // {
        //     type: 'Input',
        //     name: 'efg',
        //     label: '基础配置2',
        //     default: ''
        // },
        {
            type: 'Array',
            name: 'items',
            label: '板块',
            max: 50,
            config: [
                {
                    name: 'title',
                    label: '板块标题',
                    type: 'Input',
                    default: ''
                },
                // {
                //     name: 'tagDiplay',
                //     label: '排版类型',
                //     type: 'Radio',
                //     options: [
                //         { value: '1', label: '分组' },
                //         { value: '2', label: '分类' },
                //         { value: '3', label: '板块' }
                //     ],
                //     default: '3'
                // },
                {
                    name: 'code_ids_all',
                    filterName: 'tagDiplay',
                    include: ['3'],
                    label: '产品',
                    type: 'Product',
                    default: {}
                },
            ]
        }
    ]
}
