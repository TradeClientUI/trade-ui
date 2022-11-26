import { createApp, App as Application } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/utils/dayjs'
import '@index/style/common.scss'
import RightForm from '@index/components/RightForm/index.vue'
import ElementPlus, { ElMessage } from 'element-plus'
import VueParticles from 'vue-particles'
// import 'element-plus/lib/theme-chalk/index.css'
import 'element-plus/dist/index.css'
import i18n, { setI18nLanguage, loadLocaleMessages }  from './i18n/i18n.js'
import { getCookie } from '@/utils/util';

const app = createApp(App)
app.config.globalProperties.$message = ElMessage

app.use(ElementPlus).use(store).use(router).use(i18n)
app.component(RightForm.name, RightForm)
app.use(VueParticles)
const lang = getCookie("lang") || 'zh-CN'
setI18nLanguage(i18n, lang)
loadLocaleMessages(i18n, lang)
// Vue.config.productionTip = false;
// Vue.component('RightForm',RightForm);
// new Vue({
//     router,
//     store,
//     render: h => h(App)
// }).$mount("#app");

app.mount('#app')
