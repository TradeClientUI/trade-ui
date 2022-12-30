import { bankNoReg } from '@/utils/util'
export default function (t) {
    return {
        firstName: [
            {
                message: [t('bank.bankPersonFirstName')],
                validator: (rule, value, callback, source, options) => {
                    return !!value
                },
            }
        ],
        lastName: [
            {
                message: [t('bank.bankPersonLastName')],
                validator: (rule, value, callback, source, options) => {
                    return !!value
                },
            }
        ],
        // bankCardNumber: [
        //     {
        //         message: [t('bank.inputBankNo')],
        //         validator: (rule, value, callback, source, options) => {
        //             return !!value
        //         },
        //     },
        //     {
        //         message: [t('bank.inputRealBankNo')],
        //         validator: (rule, value, callback, source, options) => {
        //             return bankNoReg.test(value)
        //         }

        //     }
        // ],
        bankAccount: [
            {
                message: [t('bank.inputBankAccount')],
                validator: (rule, value, callback, source, options) => {
                    return !!value
                },
            }
        ],
        bankName: [
            {
                message: [t('bank.inputBankName')],
                validator: (rule, value, callback, source, options) => {
                    return !!value
                },
            }
        ],
        bankCurrency: [
            {
                message: [t('bank.inputBankCurrency')],
                validator: (rule, value, callback, source, options) => {
                    return !!value
                },
            }
        ]
        // province: [
        //     {
        //         message: [t('bank.inputOpenProvince')],
        //         validator: (rule, value, callback, source, options) => {
        //             return !!value
        //         },
        //     }
        // ],
        // bankAddress: [
        //     {
        //         message: [t('bank.inputOpenAddress')],
        //         validator: (rule, value, callback, source, options) => {
        //             return !!value
        //         },
        //     }
        // ]
    }
}
