import './assets/main.css'
import 'primeicons/primeicons.css'
import './assets/theme.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  ripple: true,
  inputStyle: 'outlined',
  theme: {
    preset: Aura,
    options: {
      cssLayer: false,
      darkModeSelector: '.dark',
      prefix: 'p'
    }
  }
})
app.use(ConfirmationService)
app.use(ToastService)

app.directive('tooltip', Tooltip)

app.mount('#app')
