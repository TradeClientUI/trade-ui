
let decimals = 18 // 输入框小数位长度
const inputEvent = (e) => {
    let newval = e.target.value
    if (/[^0-9\.]/.test(newval)) { // 只能输入数字
        newval = newval.replace(/[^0-9\.]/g, '')
    }
    if (isNaN(newval)) {
        newval = parseFloat(newval)
    }
    // 根据decimals保留小数位
    if (decimals > 0 && newval.includes('.')) {
        const [int, decimal] = newval.split('.')
        newval = `${int}.${decimal.slice(0, decimals)}`
    }
    e.target.value = newval
}

export default {
    install (app) {
        // 输入正数
        app.directive('positiveNumber', {
            // 当被绑定的元素挂载到 DOM 中时……
            mounted (el, binding) {
                // console.log(binding)
                decimals = parseInt(binding.value)
                el.addEventListener('input', inputEvent, true)
            },
            beforeUnmount (el) {
                el.removeEventListener('input', inputEvent, true)
            },
        })
    }
}
