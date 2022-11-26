import { openAccountViewSet } from '@index/Api/editor'
export default async function () {
    const openAccountList = await openAccountViewSet()
    let resData = openAccountList.success ? openAccountList.data : []
    resData = resData.map(item =>
        Object.assign(item, { value: item.name, label: item.title })
    ).filter(item => (item.type === 'text'))
    return {
        title: '注册表单',//'注册表单',
        tag: 'registerForm',
        include: ['register'], // 包含的页面code
        tagIcon: 'el-icon-star-on',
        document: 'https://element.eleme.cn/#/zh-CN/component/input',
        config: [
            {
                name: 'rows',
                type: 'Array',
                label: '表单元素',
                max: 20,
                config: [
                    {
                        name: 'name',
                        label: '字段名',
                        default: '',
                        type: 'Select',
                        options: [
                            ...resData,
                            { value: 'checkCode', label: '验证码' },
                            { value: 'submitBtn', label: '提交按钮' },
                            { value: 'agreement', label: '协议' },
                        ]
                    },
                    {
                        name: 'title',
                        label: 'label',
                        default: '',
                        filterName: 'name',
                        exclude: ['agreement'],
                        type: 'Input'
                    },
                    {
                        name: 'bindName',
                        label: '绑定字段',
                        filterName: 'name',
                        include: ['checkCode'],
                        default: '',
                        type: 'Select',
                        options: [
                            { value: 'mobilePhone', label: '手机号' },
                            { value: 'email', label: '邮箱' }
                        ]
                    },
                    {
                        name: 'agreement_html',
                        label: '协议内容',
                        filterName: 'name',
                        include: ['agreement'],
                        default: '',
                        type: 'Tinymce'
                    }
                ]
            }
        ]
    }
}
