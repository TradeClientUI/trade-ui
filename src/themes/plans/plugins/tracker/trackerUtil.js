// 初始化GA追踪代码
export const initGTag = str => {
    // str = `<!-- Global site tag (gtag.js) - Google Analytics -->
    // <script async src="https://www.googletagmanager.com/gtag/js?id=UA-123679424-1"></script>
    // <script>
    //   window.dataLayer = window.dataLayer || [];
    //   function gtag(){dataLayer.push(arguments);}
    //   gtag('js', new Date());
    //   gtag('config', 'UA-123679424-1');
    // </script>`
    if (window['InitedGTM']) return false
    if (process.env.NODE_ENV === 'production') defaultGTM()
    if (!str) return
    window['InitedGTM'] = true
    // 如果是ga代码，需要增加部分全局属性
    if (str.includes('/gtag/js')) {
        window.dataLayer = window.dataLayer || []
        window.gtag = function () {
            window.dataLayer.push(arguments)
        }
    }

    const tag = document.createDocumentFragment()
    tag.innerHTML = str
    document.head.appendChild(tag)
    const div = document.createElement('div')
    div.innerHTML = str
    const nodelist = Array.from(div.children)
    nodelist.forEach(el => {
        if (el.src) {
            loadScript(el.src)
        } else {
            eval(el.innerHTML)
        }
    })
    // loadGaJs()  // 03开户追踪开户来源使用的ga代码
}
