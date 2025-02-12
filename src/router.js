import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/', component: () => import('./components/testapp.vue') },

    { path: '/login', component: () => import('./components/LoginComponent.vue') },
    { path: '/user', component: () => import('./components/UserDataComponent.vue') },
    { path: '/table',name:"table", component: () => import('./components/OverviewComponent.vue') },
    { path: '/card', name:"card", component: () => import('./components/OverviewCardComponent.vue') },
    { path: '/map', name:"map", component: () => import('./components/OverviewMapComponent.vue') }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;