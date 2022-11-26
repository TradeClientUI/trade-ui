import { install } from 'element-plus'

let router = null
let store = null
let I18n = null

export default {
    install: (app, { $store, $router, $I18n } = {}) => {
        router = $router
        store = $store
        I18n = $I18n
    }
}

// if(typeof(window)!=='undefined' && window.Vue){
//     window.Vue.use(install);
//     if(install.installed){
//         install.installed = false;
//     }
// }
