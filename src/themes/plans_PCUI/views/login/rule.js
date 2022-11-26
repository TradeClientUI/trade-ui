import { emailReg } from '@/utils/util'
export default (t) => {
    return {
        type: {
            required: true,
        },
        loginName: [
            {
                message: t('common.inputPhone'),
                validator: (rule, value, callback, source, options) => {
                    return source.type === 2 ? !!value : true
                },
            },
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
                message: t('common.inputRealPhone'),
                validator: (rule, value, callback, source, options) => {
                    return source.type === 2 ? !isNaN(value) : true
                }
            },
        ],
        verifyCode: {
            message: t('common.inputVerifyCode'),
            validator: (rule, value, callback, source, options) => {
                return options.loginType === 'checkCode' ? !!value : true
            },
        },
        loginPwd: {
            message: t('common.inputPwd'),
            validator: (rule, value, callback, source, options) => {
                // console.log(rule, value, callback, source, options)
                return options.loginType === 'password' ? !!value : true
            },
        },
    }
}
