export function addEvent (element, type, handle) {
    if (element.addEventListener) {
        element.addEventListener(type, handle, false)
    } else if (element.attachEvent) {
        element.attachEvent('on' + type, function () {
            handle.call(element)
        })
    } else {
        element['on' + type] = handle
    }
}
