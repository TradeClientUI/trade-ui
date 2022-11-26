/**
 * 创建link
 * @param url
 * @returns {Promise}
 */
function loadCSS (url) {
    var el = document.createElement('link')
    document.body.appendChild(el)
    var promise = new Promise((resolve, reject) => {
        el.addEventListener(
            'load',
            e => {
                resolve(e)
            },
            false
        )

        el.addEventListener(
            'error',
            e => {
                removeEl(el)
                reject(e)
            },
            false
        )
    })
    el.rel = 'stylesheet'
    el.href = url
    return promise
}

/**
 * 移除link标签
 * @param el link dom
 */
function removeEl (el) {
    document.body.removeChild(el)
}

export default loadCSS
