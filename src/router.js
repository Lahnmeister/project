import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/', component: () => import('./components/testapp.vue') },
    { path: '/login', component: () => import('./components/LoginComponent.vue') },
    { path: '/register', component: () => import('./components/RegisterComponent.vue') }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;