// 从官网过来pre的用户自动分配交易账号

import md5 from 'js-md5'
import { getDevice } from '@/utils/util'
const accounts = [
    ['15523456789', 'aa1234'],
    ['15534567890', 'aa1234'],
    ['15545678901', 'aa1234'],
    ['15556789012', 'aa1234'],
    ['15567890123', 'aa1234'],
    ['15578901234', 'aa1234'],
    ['15589012345', 'aa1234'],
    ['15501234567', 'aa1234'],
    ['15512341234', 'aa1234'],
    ['15543214321', 'aa1234'],
    ['15500000000', 'aa1234'],
    ['15566668888', 'aa1234'],
    ['15588886666', 'aa1234'],
    ['15511112222', 'aa1234'],
    ['15533334444', 'aa1234'],
    ['15555556666', 'aa1234'],
    ['15577778888', 'aa1234'],
    ['15599990000', 'aa1234'],
    ['15500001111', 'aa1234'],
    ['15555555555', 'aa1234'],
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
