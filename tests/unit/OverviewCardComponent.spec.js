import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import OverviewCardComponent from '@/components/OverviewCardComponent.vue';
import { createRouter, createWebHistory } from 'vue-router';

// Router-Mock erstellen
const router = createRouter({
  history: createWebHistory(),
  routes: [],
});

vi.stubGlobal('fetch', vi.fn(async (url) => {
  if (url.includes('/trees/user-tree')) {
    return {
      ok: true,
      json: async () => ({
        trees: [
          {
            id: 1,
            tree_type: { name: 'Eiche', scientific_name: 'Quercus robur' },
            latitude: 50.1,
            longitude: 8.6,
            co2_stored: 100,
            created_at: '2024-03-17',
            locationName: 'Frankfurt',
            height: 10,
            files: [{ photo_path: '/uploads/tree1.jpg' }]
          }
        ]
      })
    };
  }
  return { ok: false };
}));

describe('OverviewCardComponent.vue', () => {
  let wrapper;

  beforeEach(async () => {
    router.push = vi.fn(); // Verhindert Router-Navigation
    wrapper = mount(OverviewCardComponent, {
      global: {
        plugins: [router], // Mock-Router bereitstellen
      }
    });
    await router.isReady(); // Warten, bis der Router bereit ist
  });

  it('rendert die Komponente korrekt', () => {
    expect(wrapper.exists()).toBe(true);
  });

 
  
  
  
});
