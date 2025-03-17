import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  
  { path: '/', component: () => import('./components/TreeForm.vue') },
  { path: '/tutorial', component: () => import('./components/TutorialSite.vue') },
  { path: '/treeform', component: () => import('./components/TreeForm.vue') },
  { path: '/login', component: () => import('./components/LoginComponent.vue') },
  { path: '/register', component: () => import('./components/RegisterComponent.vue') },
  { path: '/user', component: () => import('./components/UserDataComponent.vue') },
  { path: '/table',name:"table", component: () => import('./components/OverviewComponent.vue') },
  { path: '/card', name:"card", component: () => import('./components/OverviewCardComponent.vue') },
  { path: '/map', name:"map", component: () => import('./components/OverviewMapComponent.vue') },
  { path: '/passwordreset', component: () => import('./components/ForgotPassword.vue') },
  { path: '/faq', component: () => import('./components/FAQComponent.vue') },
  { path: '/how-to-page', component: () => import('./components/How-to-Component.vue') },
  { path: '/posting', component: () => import('./components/PostingComponent.vue') }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;