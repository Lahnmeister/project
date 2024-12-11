import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/', component: () => import('./components/testapp.vue') },
    { path: '/overview', component: () => import('./components/OverviewComponent.vue') }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
