const longTap = {
    getFireEvent: function () {
        // 兼容pc端
        let fireEvent = {
            start: 'mousedown',
            move: 'mousemove',
            end: 'mouseup'
        }
        if ('ontouchend' in document.body) {
            fireEvent = {
                start: 'touchstart',
                move: 'touchmove',
                end: 'touchend'
            }
        }
        return fireEvent
    },
    install: (app) => {
        /**
         * @description: 长按事件
         * @param {arg} 触发事件的时间
         * @return: e touchstart事件的event el触发的dom
         * eg: v-longTap:fn='value'
         */
        app.directive('longpress', {
            // 指令是具有一组生命周期的钩子：
            // 在绑定元素的 attribute 或事件监听器被应用之前调用
            created(el, binding, vnode) { },
            // 在绑定元素的父组件挂载之前调用
            beforeMount() { },
            // 绑定元素的父组件被挂载时调用
            mounted(el, binding, vnode) {
                // console.log(binding, vnode);
                const longTime = 1000
                let timer = null
                const { arg, instance, value } = binding
                const handler = instance[arg]
                if (!arg || !handler) {
                    return
                }
                const touchstart = (e) => {
                    timer = setTimeout(() => {
                        handler(value, e, el)
                    }, longTime)
                }
                const touchmove = function () {
                    clearTimeout(timer)
                    timer = 0
                }
                const touchend = function () {
                    clearTimeout(timer)
                    timer = 0
                }
                const contextmenuCancel = function (event) {
                    event.preventDefault()
                }

                el.__vueTouchStart__ = touchstart
                el.__vueTouchMove__ = touchmove
                el.__vueTouchEnd__ = touchend
                el.__contextmenu__ = contextmenuCancel

                const { start, move, end } = longTap.getFireEvent()
                el.addEventListener(start, touchstart)
                el.addEventListener(move, touchmove)
                el.addEventListener(end, touchend)
                el.addEventListener('contextmenu', contextmenuCancel) // 禁止手机浏览器菜单
            },
            // 在包含组件的 VNode 更新之前调用
            beforeUpdate() { },
            // 在包含组件的 VNode 及其子组件的 VNode 更新之后调用
            updated() { },
            // 在绑定元素的父组件卸载之前调用
            beforeUnmount(el, binding) {
                const { start, move, end } = longTap.getFireEvent()
                el.removeEventListener(start, el.__vueTouchStart__)
                el.removeEventListener(move, el.__vueTouchMove__)
                el.removeEventListener(end, el.__vueTouchEnd__)
                el.removeEventListener('contextmenu', el.__contextmenu__)
                el.__vueTouchStart__ = null
                el.__vueTouchMove__ = null
                el.__vueTouchEnd__ = null
                el.__contextmenu__ = null
            },
            // 卸载绑定元素的父组件时调用
            unmounted() { }
        })
    }
}
export default longTap
