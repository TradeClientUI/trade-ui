export default function name (t, customerInfo) {
    return {
        googleCode: {
            required: true,
            message: t('common.inputGoogleCode'),
        },
        verifyCodeSMS: {
            required: !!customerInfo.phone,
            message: t('common.smsCodeInput'),
        },
        verifyCodeEmail: {
            required: !!customerInfo.email,
            message: t('common.emailCodeInput'),
        },
    }
}
