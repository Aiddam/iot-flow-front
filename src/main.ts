import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';


const app = createApp(App)

app.use(store)
app.use(router)


app.use(PrimeVue, {
  theme: {
      preset: Aura,
      options: {
          prefix: 'p',
          darkModeSelector: false,
          cssLayer: false
      }
  }
});

app.mount('#app')
