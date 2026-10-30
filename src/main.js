/**
 * Point d'entrée de l'application KEC.
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fontsource-variable/fraunces/full.css'
import '@fontsource-variable/fraunces/full-italic.css'
import '@fontsource-variable/manrope'
import '@/assets/styles/main.scss'

import App from './App.vue'
import { router } from './router'
import { i18n, initLocale } from './i18n'
import { reveal } from './utils/reveal'

async function bootstrap() {
  await initLocale()
  createApp(App)
    .use(createPinia())
    .use(i18n)
    .use(router)
    .directive('reveal', reveal)
    .mount('#app')
}

bootstrap()
