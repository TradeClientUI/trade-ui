
const tokens = {
    admin: {
        token: 'admin-token'
    },
    editor: {
        token: 'editor-token'
    }
}

const users = {
    'admin-token': {
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
    },
    'editor-token': {
        roles: ['editor'],
        introduction: 'I am an editor',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Normal Editor'
    }
}

module.exports = [
    // user login
    {
        url: '/vue-element-admin/user/login',
        type: 'post',
        response: config => {
            const { username } = config.body
            const token = tokens[username]

            // mock error
            if (!token) {
                return {
                    code: 60204,
                    message: 'Account and password are incorrect.'
                }
            }

            return {
                code: 20000,
                data: token
            }
        }
    },

    // get user info
    {
        url: '/global/customer.app.CustomerWebApiService.queryCustomerAssetsInfo',
        type: 'post',
        response: config => {
            return {
                code: '0',
                msg: '',
                data: {
                    currency: 'USD',
                    totalBalance: '9999999.888',
                    totalNetAssets: '1000.000',
                    totalAvailable: '1231.123',
                    digits: 3,
                    totalLiabilities: '-31.123',
                    totalLiabilitiesPrincipal: '500.000',
                    totalInterest: '0.000',
                    accountInfoMap: {
                        'USD': {
                            companyId: 209,
                            tradeType: 1,
                            accountId: 49,
                            status: 2,
                            activateStatus: 2,
                            currency: 'USD',
                            digits: 3,
                            balance: '1231231.234',
                            netAssets: '12123456.234',
                            available: '1231231.234',
                            equity: '1231231.234',
                            withdrawAmount: '1231231.234',
                            lockAmount: '11.234',
                            profit: '11.234',
                            margin: '11.234',
                            notWithdrawAmount: '11.234',
                            lockMargin: '11.234',
                            liabilities: '11.234',
                            liabilitiesPrincipal: '11.234',
                            interest: '11.234',
                            frozen: '11.234',
                        }
                    },
                }
            }
        }
    },
    {
        url: '/global/customer.app.CustomerWebApiService.queryAccountAssetsInfo',
        type: 'post',
        response: config => {
            return {
                code: '0',
                msg: '',
                data: {
                    companyId: 209,
                    tradeType: 1,
                    accountId: 49,
                    status: 2,
                    activateStatus: 2,
                    currency: 'USD',
                    digits: 3,
                    balance: '1231231.234',
                    netAssets: '12123456.234',
                    available: '1231231.234',
                    equity: '1231231.234',
                    withdrawAmount: '1231231.234',
                    lockAmount: '11.234',
                    profit: '11.234',
                    margin: '11.234',
                    notWithdrawAmount: '11.234',
                    lockMargin: '11.234',
                    liabilities: '11.234',
                    liabilitiesPrincipal: '11.234',
                    interest: '11.234',
                    frozen: '11.234',
                    availableLoan: '999999.999',
                }
            }
        }
    },
    // get user info
    {
        url: '/vue-element-admin/user/info\.*',
        type: 'get',
        response: config => {
            const { token } = config.query
            const info = users[token]

            // mock error
            if (!info) {
                return {
                    code: 50008,
                    message: 'Login failed, unable to get user details.'
                }
            }

            return {
                code: 20000,
                msg: '',
                data: info
            }
        }
    },

    // user logout
    {
        url: '/vue-element-admin/user/logout',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    }
]
