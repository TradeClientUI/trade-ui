const preventReClick = {
    install (app) {
        // 防重复点击(指令实现)
        app.directive('preventReClick', {
            mounted (el, binding) {
                el.addEventListener('click', () => {
                    if (!el.disabled) {
                        el.disabled = true
                        setTimeout(() => {
                            el.disabled = false
                        }, binding.value || 3000)
                    }
                })
            }
        })
    }
}

export default preventReClick
