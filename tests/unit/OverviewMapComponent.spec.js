import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import OverviewMapComponent from '@/components/OverviewMapComponent.vue';
import L from 'leaflet';

vi.stubGlobal('fetch', vi.fn(async (url) => {
  console.log("Mock API Call:", url); // Debugging: Prüfe, ob API-Call ausgelöst wird

  if (url.includes('/trees/user-tree')) {
    return {
      ok: true,
      json: async () => ({ trees: [{ id: 1, tree_type: { name: 'Eiche' }, latitude: 50.1, longitude: 8.6 }] }),
    };
  }
  return { ok: false };
}));


describe('OverviewMapComponent.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(OverviewMapComponent);
  });

  it('rendert die Komponente korrekt', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('initialisiert die Karte', async () => {
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.map).not.toBeNull();
  });

});
