import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import quasarLang from 'quasar/lang/id'



// Import Quasar css
import 'quasar/src/css/index.sass'
import '@quasar/extras/material-icons/material-icons.css'

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  lang: quasarLang,
})


app.mount('#app')
