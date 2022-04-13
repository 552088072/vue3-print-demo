import  { createApp } from 'vue'
import App from './App.vue'

// 打印方法

import router from './router'

const app = createApp(App)
app.use(router)

app.mount('#app')
