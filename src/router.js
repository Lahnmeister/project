import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/', component: () => import('./components/testapp.vue') },
    { path: '/treeform', component: () => import('./components/TreeForm.vue') }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
