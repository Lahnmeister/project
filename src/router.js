import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/', component: () => import('./components/testapp.vue') },
    { path: '/tutorial', component: () => import('./components/TutorialSite.vue') }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
