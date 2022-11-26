import { emailReg } from '@/utils/util'
import { checkCustomerExist } from '@/api/user'

// 判断用户是否存在的接口参数效验
export const checkCustomerExistRule = (t) => {
    return {
        type: {
            required: true,
        },
        loginName: [
            {
                message: t('common.inputEmail'),
                validator: (rule, value, callback, source, options) => {
                    return source.type === 1 ? !!value : true
                },
            },
            {
                message: t('common.inputRealEmail'),
                validator: (rule, value, callback, source, options) => {
                    return source.type === 1 ? emailReg.test(value) : true
                },
            },
            {
                message: t('common.inputPhone'),
                validator: (rule, value, callback, source, options) => {
                    return source.type === 2 ? !!value : true
                },
            },
            {
                message: t('common.inputRealPhone'),
                validator: (rule, value, callback, source, options) => {
                    return source.type === 2 ? source.mobileReg.test(value) : true
                }
            },
            // {
            //     asyncValidator: (rule, value, callback, source, options) => {
            //         checkCustomerExist(source).then(res => {
            //             if (res.check()) {
            //                 const msg = source.type === 2 ? '手机号已存在' : '邮箱已存在'
            //                 callback(res.data === 1 ? msg : undefined)
            //             } else {
            //                 callback(res.errorMsg())
            //             }
            //         }).catch(err => {
            //             callback(err)
            //         })
            //     },
            // },
        ],
        phoneArea: {
            message: t('register.inputZone'),
            validator: (rule, value, callback, source, options) => {
                return source.type === 2 ? !!value : true
            },
        },
        emailArea: {
            message: t('register.area'),
            validator: (rule, value, callback, source, options) => {
                return source.type === 1 ? !!value : true
            },
        },
        protocol: {
            message: t('register.protocolTip'),
            validator: (rule, value, callback, source, options) => {
                return !!source.protocol
            },
        }
    }
}

// 开户参数效验
export default function (t) {
    return {
        ...checkCustomerExistRule(t),
        verifyCode: {
            required: true,
            message: t('common.inputVerifyCode'),
            // validator: (rule, value, callback, source, options) => {
            //     return options.loginType === 'checkCode' ? !!value : true
            // },
        },
        // loginPwd: {
        //     message: '请输入密码',
        //     validator: (rule, value, callback, source, options) => {
        //         return options.loginType === 'password' ? !!value : true
        //     },
        // },
    }
}
