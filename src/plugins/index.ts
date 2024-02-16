/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify, {i18n} from './vuetify'
import pinia from '../store'
import router from '../router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import VueApexCharts from "vue3-apexcharts";

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app
    .use(i18n)
    .use(vuetify)
    .use(router)
    .use(VueApexCharts)
    .use(pinia.use(piniaPluginPersistedstate))

}
