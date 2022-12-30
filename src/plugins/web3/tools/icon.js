import makeBlockie from 'ethereum-blockies-base64'

/**
 * 生成图片logo
 * @param {String} imgUrl 图片URL
 * @param {String} address 如果imgUrl不是http开头，则使用address生成图片
 * @returns
 */
export const generateIcon = (imgUrl = '', address = '') => {
    try {
        return imgUrl?.startsWith('http') || imgUrl?.startsWith('data:image') ? imgUrl : makeBlockie(address)
    } catch (error) {
        console.log(error)
    }
}
