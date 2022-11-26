// 导出wp编辑器可以选择的路由列表

export default [
    {
        name: 'Home',
        title: '首页'
    },
    {
        name: 'Quote',
        title: '行情'
    },
    {
        name: 'Register',
        title: '注册'
    },
    {
        name: 'Login',
        title: '登录'
    },
    {
        name: 'Assets',
        title: '资产'
    },
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
