export default function name(t, customerInfo) {
    return {
        googleCode: {
            required: true,
            message: t('common.inputGoogleCode'),
        },
        phoneCode: {
            required: !!customerInfo.phone,
            message: t('common.smsCodeInput'),
        },
        emailCode: {
            required: !!customerInfo.email,
            message: t('common.emailCodeInput'),
        },
    }
}