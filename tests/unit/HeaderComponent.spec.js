import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createStore } from 'vuex';
import { createRouter, createWebHistory } from 'vue-router';
import HeaderComponent from "@/components/HeaderComponent.vue";

// Fake Vuex Store
const store = createStore({
  state: {
    darkMode: false,
  },
  getters: {
    darkMode: (state) => state.darkMode,
  },
  actions: {
    toggleDarkMode: vi.fn(),
  },
});

// Mock Router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/login', component: { template: '<div>Login</div>' } },
    { path: '/register', component: { template: '<div>Register</div>' } },
    { path: '/tutorial', component: { template: '<div>Tutorial</div>' } },
    { path: '/treeform', component: { template: '<div>Baum Form</div>' } },
    { path: '/map', component: { template: '<div>Übersicht</div>' } },
    { path: '/user', component: { template: '<div>User</div>' } },
  ],
});

describe('HeaderComponent.vue', () => {
  let wrapper;

  beforeEach(async () => {
    router.push('/');
    await router.isReady();
    wrapper = mount(HeaderComponent, {
      global: {
        plugins: [store, router],
      },
    });
  });

  it('zeigt Login- und Register-Links, wenn nicht authentifiziert', async () => {
    expect(wrapper.find('a[href="/login"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/register"]').exists()).toBe(true);
  });

  it('zeigt keine Login- und Register-Links, wenn authentifiziert', async () => {
    localStorage.setItem('token', 'test-token');
    await wrapper.vm.checkAuth();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('a[href="/login"]').exists()).toBe(false);
    expect(wrapper.find('a[href="/register"]').exists()).toBe(false);
  });

  it('zeigt Navigationslinks für authentifizierte Benutzer', async () => {
    localStorage.setItem('token', 'test-token');
    await wrapper.vm.checkAuth();
    await wrapper.vm.$nextTick();
    
    expect(wrapper.find('a[href="/tutorial"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/treeform"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/map"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/user"]').exists()).toBe(true);
  });

  it('führt Logout korrekt aus', async () => {
    localStorage.setItem('token', 'test-token');
    await wrapper.vm.checkAuth();
    await wrapper.vm.$nextTick();
    
    await wrapper.find('button.submit-button').trigger('click');

    expect(localStorage.getItem('token')).toBeNull();
    expect(wrapper.vm.isAuthenticated).toBe(false);
  });

});
