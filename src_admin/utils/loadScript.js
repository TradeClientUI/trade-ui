/**
 * 创建script
 * @param url
 * @returns {Promise}
 */
function loadScript (url) {
    var scriptElement = document.createElement('script')
    document.body.appendChild(scriptElement)
    var promise = new Promise((resolve, reject) => {
        scriptElement.addEventListener(
            'load',
            e => {
                removeScript(scriptElement)
                resolve(e)
            },
            false
        )

        scriptElement.addEventListener(
            'error',
            e => {
                removeScript(scriptElement)
                reject(e)
            },
            false
        )
    })
    scriptElement.type = 'text/javascript'
    scriptElement.async = true
    scriptElement.src = url
    return promise
}

/**
 * 移除script标签
 * @param scriptElement script dom
 */
function removeScript (scriptElement) {
    document.body.removeChild(scriptElement)
}

export default loadScript
