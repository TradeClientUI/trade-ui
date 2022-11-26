import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@index/style/common.scss'
import ElementUI from 'element-plus'
import '@/utils/dayjs'
// import 'element-ui/lib/theme-chalk/index.css'
import 'element-plus/lib/theme-chalk/index.css'

const app = createApp(App)

app.use(ElementUI).use(store).use(router).mount('#app')
// app.config.productionTip = false

// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')
