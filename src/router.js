import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/', component: () => import('./components/testapp.vue') },
    { path: '/overview',name:"table", component: () => import('./components/OverviewComponent.vue') },
    { path: '/overview2', name:"card", component: () => import('./components/OverviewCardComponent.vue') },
    { path: '/overview3', name:"map", component: () => import('./components/OverviewMapComponent.vue') },
    { path: '/user', component: () => import('./components/UserDataComponent.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
