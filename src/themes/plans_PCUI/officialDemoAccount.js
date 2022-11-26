// 从官网过来pre的用户自动分配交易账号

import md5 from 'js-md5'
import { getDevice } from '@/utils/util'
const accounts = [
    ['13200001123', 'a123123'],
    ['13200001124', 'a123123'],
    ['13200001125', 'a123123'],
    ['13200001126', 'a123123'],
]
export function getPreDemoAccountParams () {
    const randomAccount = accounts[Date.now() % accounts.length]
    const loginParams = {
        'type': 2,
        'loginName': randomAccount[0],
        'device': getDevice(),
        'loginPwd': md5(randomAccount[1])
    }
    return loginParams
}
