import jsrsasign from 'jsrsasign'
import { token } from '../api/request_activity'

// 获取companyId
const companyId = sessionStorage.getItem('companyId')

// 加密生成签名
export function rsaSign (customerNo, timestamp) {
    console.log('--rsaSign---')
    const rs = jsrsasign
    console.log('--jsrsasign---')
    let pk = ''
    if (companyId === '360') {
        pk = '-----BEGIN PUBLIC KEY-----\n' + 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCszs/Vm6jQWeaK0GAHP+XD50pWR\n' +
        'LR4v/m+qlAh9lJCkdH9rh1r7vfuMwfhtaOOIoTz8X+GbWl1PazgDtidXrdnmU7fw3\n' +
        'b0UlHOkr35EJaEFonfnP8XqzqygJ+bG/Lk3kwpeGTtt+bf7FUPCkmEov9tJTPJ0Mo\n' + 'aHY+rwB1otk1WtwIDAQAB\n' +
        '-----END PUBLIC KEY-----'
    } else if (companyId === '368') {
        pk = '-----BEGIN PUBLIC KEY-----\n' +
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCym4U5YjEDWGRTKb0RwtZX3luj\n' + 'juKgfl0AYJkWr4MKD5fsqDWX/Ukox9KfWqfXg+GjJr/MIrqLICYI1FlfmcOkaRe3\n' +
        'fPbtHa7UwUn2bLvC2rLYSwcNy5dYNGbHfEgailA5aUSBnhwthr2seWS9LTFSOiRf\n' +
        'sgG/R4cwMtG9IkKabQIDAQAB\n' +
        '-----END PUBLIC KEY-----'
    } else if (companyId === '14') {
        // pk =
        // '-----BEGIN PUBLIC KEY-----\n' +
        // 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCwsQflc3EnxaFh1mBljiyzinXp\n' +
        // '29ZvLA09qA+WSlUAlSl5vrQ3Xb6B0JgTMFYUMB6zsJxZ/VcphVKBCa4RfOEFEKrv\n' +
        // 'gUyjLavq1g7hK1KO1qA/w8gWbEwTEKc411AcHN9AajNJxRZZa0l5jt7qgdLWqT66\n' +
        // 'yahR1HYPYxvEF6wBdwIDAQAB\n' +
        // '-----END PUBLIC KEY-----'
        pk = '-----BEGIN PUBLIC KEY-----\n' +
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCym4U5YjEDWGRTKb0RwtZX3luj\n' + 'juKgfl0AYJkWr4MKD5fsqDWX/Ukox9KfWqfXg+GjJr/MIrqLICYI1FlfmcOkaRe3\n' +
        'fPbtHa7UwUn2bLvC2rLYSwcNy5dYNGbHfEgailA5aUSBnhwthr2seWS9LTFSOiRf\n' +
        'sgG/R4cwMtG9IkKabQIDAQAB\n' +
        '-----END PUBLIC KEY-----'
    } else if (companyId === '11') {
        pk = '-----BEGIN PUBLIC KEY-----\n' +
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDWKORa5iRPKsFwqcL+lRYqgZkqWjZb6sNlmP351hOtpEt1htBqOAUmTnIpjWVtkdTPJYXZDV9hN0CsHlfx97rv\n' +
        'MLpm9IFYbH5p3kwC/26LodD4ADJgli1sTeehP8i+DDdJP6qRGT86Er2SYcJMOenpH8kqCPj+Df8AGYVvELffMwIDAQAB\n' +
        '-----END PUBLIC KEY-----'
    };

    // 签名
    const content = customerNo + '@' + timestamp + '@' + token
    // RSA加密签名
    const pub = rs.KEYUTIL.getKey(pk)
    const enc = rs.KJUR.crypto.Cipher.encrypt(content, pub)
    const sign = rs.hextob64(enc)
    return sign
}
