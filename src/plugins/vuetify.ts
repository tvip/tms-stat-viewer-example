/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import enUS from '@/locale/en-US.json';
import ruRU from '@/locale/ru-RU.json';

import {ru, en} from 'vuetify/locale';
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'

// Composables
import { createVuetify } from 'vuetify'
import {createI18n, useI18n} from "vue-i18n";


const messages = {
  en:{
    $vuetify: en,
    app: enUS
  },
  ru:{
    $vuetify: ru,
    app: ruRU
  },

}

export const i18n = createI18n({
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
  theme: {
    defaultTheme:'light'
  },
})
