import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LayoutView from '../views/LayoutView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: LayoutView,
    name: 'home',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'devices',
        name: 'devices',
        component: () => import('@/views/DevicesView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/AboutView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/SettingsView.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'registration',
    component: () => import('@/views/RegistrationView.vue'),
    meta: { requiresGuest: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

function isAuthenticated (): boolean {
  return !!localStorage.getItem('token')
}

router.beforeEach((to, from, next) => {
  const authStatus = isAuthenticated()

  if (to.meta.requiresAuth && !authStatus) {
    next({ name: 'login' })
  } else if (to.meta.requiresGuest && authStatus) {
    next({ name: 'home' })
  } else {
    next() // Allow navigation
  }
})

export default router
