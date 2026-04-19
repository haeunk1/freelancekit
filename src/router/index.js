import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/invoice' },
  { path: '/invoice', component: () => import('@/views/InvoiceView.vue'), meta: { title: 'Free Invoice Generator — No Login Required' } },
  { path: '/quote', component: () => import('@/views/QuoteView.vue'), meta: { title: 'Free Quote Generator for Freelancers' } },
  { path: '/receipt', component: () => import('@/views/ReceiptView.vue'), meta: { title: 'Free Receipt Generator — No Signup' } },
  { path: '/contract', component: () => import('@/views/ContractView.vue'), meta: { title: 'Free Freelance Contract Generator' } },
  { path: '/privacy', component: () => import('@/views/PrivacyPolicyView.vue'), meta: { title: 'Privacy Policy' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = to.meta.title || 'FreelanceKit — Free Tools for Freelancers'
})

export default router
