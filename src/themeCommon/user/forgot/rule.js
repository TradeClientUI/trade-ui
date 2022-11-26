import { emailReg } from '@/utils/util'
export default (t) => {
    return {
        // type: {
        //     required: true,
        // },
        mobile: [
            {
                message: t('common.inputPhone'),
                validator: (rule, value, callback, source, options) => {
                    return source.type === 0 ? !!value : true
                },
            }

        ],
        email: [
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
        ],
        checkCode: {
            message: t('common.inputVerifyCode'),
            validator: (rule, value, callback, source, options) => {
                return source.needCheckCode && source.type === 0 ? !!value : true
            },
        },
        emailCode: {
            message: t('common.inputVerifyCode'),
            validator: (rule, value, callback, source, options) => {
                return source.needCheckCode && source.type === 1 ? !!value : true
            },
        }
    }
}
