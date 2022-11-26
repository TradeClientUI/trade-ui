import md5 from 'js-md5'
import JSEncrypt from 'jsencrypt'
const pubKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1SL0JdZRTcHZ1mesu8j74EeJ9b+bu5wvjEETTmo2dqQXbjxgJVbqr8bxS+xhaCssnSQyMb3zmImEbe6PgXZeeHRPssNJKwhM6Tr1NeABMecwgnsJxRiDCtwXXzYIdVyHoaJGxjfv9ZcnQqKN5HyODiVy4eJjSAaKcWyZmehoZQwIDAQAB'
const privkey = 'MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBALVIvQl1lFNwdnWZ6y7yPvgR4n1v5u7nC+MQRNOajZ2pBduPGAlVuqvxvFL7GFoKyydJDIxvfOYiYRt7o+Bdl54dE+yw0krCEzpOvU14AEx5zCCewnFGIMK3BdfNgh1XIehokbGN+/1lydCoo3kfI4OJXLh4mNIBopxbJmZ6GhlDAgMBAAECgYEApg3F0qdYQYHvkFN4AR22nkbLnzjkYQtUcR4S3X1hoPwVOIN/cfWMMzoP1jbYnInsgsS/8Neioa72IlWDy94PJR8W5yQ68Nwd1bc461Q9G2xr9+MxgvI+6yxk8MI5E1vET7yTo9z/cMWlHj5HSKC3hV2yefxjE22TnxuxJW7PflkCQQD9ClWkpnblUjkBFU39/nw6YpvQMOkDVmrXx7+1+4MPYevmYHIlFXrVzMlT6KhJ9Qc/h3TTaXSmCjDizEp7dT2NAkEAt2eMR3oLxgEa3lndynnEBxtXYHvioDvg56xED+Six69s4K2w/suGhP69OcfFhxPKI7fMU36kT7kQzDqHzO72DwJBANT9afFZnSKR/yGGSUvOdcq/TeAEC16f0vcmT5xixIKiLeqQrAPC/M4RvjU+1MjL0voKjq+VSHaqhVOiGd+pY9ECQQCBnhfhCBs8A9nmXSLHj0kAMM2O7d8bmVX4xaGQjeiRMaTEIV0epd5bLeGz7UDnlw/cMHCibbVYdpWtkIwbRKL3AkBn5o/tC0B8/T8mPKIQz4ZnvqxP29j3kET9s0gW1+ZuCZDnsolLU28oPYmVBkfEYQLfYTED+tGzmz/fGFgyDT9C'

// const pubKey = '-----BEGIN PUBLIC KEY----- MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCpCvqMGFeJcWsJnqj/8wi7w4UL E5q/uSXl/qx6ybMlxyovYtuvspG3P5RrWyPcI/BuYYjs5gnJiPV1St4/wZN7ZY2F 3L5sQ31EIwp1hRfnKdApMOSdDomN3baX0i52M24vvtWY1VRi4gIXR9+IekVqxfxh Iz7IXzEDw3u9GD0aBQIDAQAB -----END PUBLIC KEY-----'
// const privkey = '-----BEGIN RSA PRIVATE KEY----- MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBALVIvQl1lFNwdnWZ6y7yPvgR4n1v5u7nC+MQRNOajZ2pBduPGAlVuqvxvFL7GFoKyydJDIxvfOYiYRt7o+Bdl54dE+yw0krCEzpOvU14AEx5zCCewnFGIMK3BdfNgh1XIehokbGN+/1lydCoo3kfI4OJXLh4mNIBopxbJmZ6GhlDAgMBAAECgYEApg3F0qdYQYHvkFN4AR22nkbLnzjkYQtUcR4S3X1hoPwVOIN/cfWMMzoP1jbYnInsgsS/8Neioa72IlWDy94PJR8W5yQ68Nwd1bc461Q9G2xr9+MxgvI+6yxk8MI5E1vET7yTo9z/cMWlHj5HSKC3hV2yefxjE22TnxuxJW7PflkCQQD9ClWkpnblUjkBFU39/nw6YpvQMOkDVmrXx7+1+4MPYevmYHIlFXrVzMlT6KhJ9Qc/h3TTaXSmCjDizEp7dT2NAkEAt2eMR3oLxgEa3lndynnEBxtXYHvioDvg56xED+Six69s4K2w/suGhP69OcfFhxPKI7fMU36kT7kQzDqHzO72DwJBANT9afFZnSKR/yGGSUvOdcq/TeAEC16f0vcmT5xixIKiLeqQrAPC/M4RvjU+1MjL0voKjq+VSHaqhVOiGd+pY9ECQQCBnhfhCBs8A9nmXSLHj0kAMM2O7d8bmVX4xaGQjeiRMaTEIV0epd5bLeGz7UDnlw/cMHCibbVYdpWtkIwbRKL3AkBn5o/tC0B8/T8mPKIQz4ZnvqxP29j3kET9s0gW1+ZuCZDnsolLU28oPYmVBkfEYQLfYTED+tGzmz/fGFgyDT9C -----END RSA PRIVATE KEY-----'

// request入参加密
export function encryptParams (data = {}, timestamp, pubKey) {
    if (Object.prototype.toString.call(data, null) === '[object Object]') data = Object.assign({}, data, { timestamp })
    const keys = Object.keys(data).filter(el => ['string', 'number'].includes(typeof (data[el])) && data[el] !== '').sort((a, b) => a.localeCompare(b))
    const encryptA = keys.map(el => `&${el}=${data[el]}`)
    const encryptB = `timestamp=${timestamp}`
    const encryptC = encryptB + encryptA.join('')
    const encryptD = md5(encryptC).toUpperCase()
    const newData = { signature: encryptD }
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key) && typeof (data[key]) !== 'undefined') {
            newData[key] = data[key]
        }
    }

    /* 加密 */
    const newDataStr = JSON.stringify(newData)
    const encryptedDataString = encryptByChunk(newDataStr, pubKey)
    // console.log(encryptC, encryptD, newData, encryptedDataString)
    // console.log('解出来的', decryptByChunk(encryptedDataString))
    return encryptedDataString
}

// request入参分块加密
export function encryptByChunk (str, pubKey) {
    const encryptor = new JSEncrypt() // 创建加密对象实例
    str = encodeURIComponent(str)
    encryptor.setPublicKey(pubKey)// 设置公钥
    const chunk = 100
    let i = 0
    let encryptedStr = ''
    const strLen = str.length / chunk

    // 对内容进行分块加密
    for (i = 0; i < strLen; i++) {
        encryptedStr += encryptor.encrypt(str.slice(i * chunk, (i + 1) * chunk))
        if (i < strLen - 1) encryptedStr += ','
    }
    // encryptedStr += encryptor.encrypt(str.slice(i * chunk))

    return encryptedStr
}

// request入参分块解密
export function decryptByChunk (encrypted) {
    const encryptedArr = encrypted.split(',')
    let encryptedStr = ''
    const decrypt = new JSEncrypt()
    decrypt.setPrivateKey(privkey)
    encryptedArr.forEach(el => {
        encryptedStr += decrypt.decrypt(el)
    })
    const encryptedData = JSON.parse(encryptedStr)
    console.log(encryptedData)
    return encryptedData
}
