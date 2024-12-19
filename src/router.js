import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/', component: () => import('./components/testapp.vue') },
    { path: '/tutorial', component: () => import('./components/TutorialSite.vue') },
    { path: '/treeform', component: () => import('./components/TreeForm.vue') },
    { path: '/login', component: () => import('./components/LoginComponent.vue') },
    { path: '/register', component: () => import('./components/RegisterComponent.vue') },
    { path: '/overview', component: () => import('./components/OverviewComponent.vue') }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;