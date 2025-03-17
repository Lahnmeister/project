import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import OverviewComponent from '@/components/OverviewComponent.vue';

// Mock für `fetch`
vi.stubGlobal('fetch', vi.fn(async (url) => {
  if (url.includes('/trees/user-tree')) {
    return {
      ok: true,
      json: async () => ({ trees: [{ id: 1, tree_type: { name: 'Eiche' }, latitude: 50.1, longitude: 8.6 }] })
    };
  }
  return { ok: false };
}));

// Router-Mock erstellen
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div>Home</div>' } }],
});

describe('OverviewComponent.vue', () => {
  let wrapper;

  beforeEach(async () => {
    router.push('/'); // Simuliert eine gültige Route
    await router.isReady();

    wrapper = mount(OverviewComponent, {
      global: {
        plugins: [router], // Router wird eingebunden
      },
    });
  });

  it('rendert die Komponente korrekt', () => {
    expect(wrapper.exists()).toBe(true);
  });

});
