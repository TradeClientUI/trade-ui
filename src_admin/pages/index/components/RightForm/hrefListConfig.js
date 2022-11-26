import { h5PageList } from '@index/views/Pages/h5PageList.js'
export default [
    ...h5PageList.filter(item => (!item.notHref)),
    // {
    //     name: 'DepositFunds',
    //     title: '入金'
    // },
    // {
    //     name: 'WithAmount',
    //     title: '出金'
    // },
    // {
    //     name: 'Login',
    //     title: '登录'
    // },
    {
        name: 'Msg',
        title: '消息中心'
    },
    {
        name: 'SecuritySetting',
        title: '安全设置'
    },
    {
        name: 'CommonSetting',
        title: '通用设置'
    },
    // {
    //     name: 'Personal',
    //     title: '个人资料'
    // },
    {
        name: 'Authentication',
        title: '身份认证'
    },
    // {
    //     name: 'SetLoginPwd',
    //     title: '修改密码'
    // },
    // {
    //     name: 'FundingDetails',
    //     title: '资金明细'
    // },
    {
        name: 'Nest',
        title: '外部地址',
        config: [
            {
                position: 'params',
                type: 'Input',
                name: 'id',
                label: 'id',
                hidden: true,
                default: 'queryinfo',
            },
            {
                position: 'query',
                type: 'Input',
                name: 'url',
                label: '链接地址',
                default: '',
            },
            {
                position: 'query',
                type: 'Input',
                name: 'title',
                label: '页面标题',
                default: '',
            }
        ]
    }
]
