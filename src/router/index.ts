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
  history: createWebHistory(process.env.BASE_URL),
  routes,
})
console.log(process.env.BASE_URL)
export default router
