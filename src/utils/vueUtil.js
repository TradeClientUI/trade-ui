// 封装Vue.set方法 兼容vue3 和vue2的语法, 此文件是vue3的语法
export function vue_set (obj, name, val) {
    obj[name] = val
    // if (obj.hasOwnProperty(name)) {
    //     obj[name] = val
    // } else if (Vue && Vue.set) {
    //     Vue.set(obj, name, val)
    // } else {
    //     obj[name] = val
    // }
}

// 合并两个对象的属性
export function assign (target, item) {
    Object.assign(target, item)
    // if (!Vue || !Vue.set) return Object.assign(target, item)
    // for (const key in item) {
    //     if (!item.hasOwnProperty(key)) return
    //     vue_set(target, key, item[key])
    // }
}
