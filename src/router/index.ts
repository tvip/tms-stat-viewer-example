// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/components/Login.vue'),
      },
      {
        name: 'app',
        path: 'app',
        component: () => import('@/layouts/default/Default.vue'),
        children:[
          {
            path: 'stat',
            name: 'stat',
            component: () => import('@/components/Stat.vue'),
          }
        ]
      },

    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
