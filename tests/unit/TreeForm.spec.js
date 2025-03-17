import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import TreeForm from '@/components/TreeForm.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { Geolocation } from '@capacitor/geolocation';

// Mock Vue Router
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div>Home</div>' } }],
});

// Mock Fetch für API-Aufrufe
global.fetch = vi.fn((url) => {
  if (url.includes('/trees/types')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ tree_types: [{ id: 1, name: 'Eiche' }, { id: 2, name: 'Kiefer' }] }),
    });
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: 'Baum erfolgreich erstellt!' }),
  });
});

// Mock Geolocation
vi.mock('@capacitor/geolocation', () => ({
  Geolocation: {
    getCurrentPosition: vi.fn(() =>
      Promise.resolve({
        coords: { latitude: 50.123456, longitude: 8.654321 },
      })
    ),
  },
}));

describe('TreeForm.vue', () => {
  let wrapper;

  beforeEach(async () => {
    localStorage.setItem('token', 'test-token'); // Auth-Token setzen
    router.push('/');
    await router.isReady();

    wrapper = mount(TreeForm, {
      global: {
        plugins: [router],
      },
    });
  });

  it('rendert die Komponente', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('lädt die Baumarten in das Dropdown', async () => {
    await wrapper.vm.fetchTreeTypes();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.dropDownList.length).toBe(2);
    expect(wrapper.find('option[value="1"]').text()).toBe('Eiche');
    expect(wrapper.find('option[value="2"]').text()).toBe('Kiefer');
  });

  it('aktualisiert Formulardaten korrekt', async () => {
    await wrapper.setData({
      formData: {
        tree_type_id: 1,
        measurement: { height: 10, inclination: 15, trunk_diameter: 20, notes: 'Gesund' },
      },
    });

    expect(wrapper.find('input[placeholder="Höhe"]').element.value).toBe('10');
    expect(wrapper.find('input[placeholder="Neigung"]').element.value).toBe('15');
    expect(wrapper.find('input[placeholder="Durchmesser des Stamms"]').element.value).toBe('20');
    expect(wrapper.find('input[placeholder="Notiz"]').element.value).toBe('Gesund');
  });

  it('ruft Geolocation auf und speichert die Koordinaten', async () => {
    await wrapper.vm.getLocation();
    expect(Geolocation.getCurrentPosition).toHaveBeenCalled();
    expect(wrapper.vm.formData.latitude).toBe(50.123456);
    expect(wrapper.vm.formData.longitude).toBe(8.654321);
  });

  it('fügt eine Datei zum Upload hinzu', async () => {
  const file = new File(['dummy content'], 'baum.jpg', { type: 'image/jpeg' });
  const input = wrapper.find('input[type="file"]');

  // Mock für das input.files-Objekt erstellen
  Object.defineProperty(input.element, 'files', {
    value: [file],
    writable: false,
  });

  // Das `change` Event auslösen
  await input.trigger('change');

  // Warten, bis der FileReader das `onload`-Event abgeschlossen hat
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Vue-Update abwarten
  await wrapper.vm.$nextTick();

  // Überprüfe, ob die Datei korrekt verarbeitet wurde
  expect(wrapper.vm.formData.files.length).toBe(1);
  expect(wrapper.vm.formData.files[0].filename).toBe('baum.jpg');
});





  it('sendet das Formular korrekt ab', async () => {
    await wrapper.vm.submitForm();
    expect(fetch).toHaveBeenCalledWith('https://treescope.cs.hs-fulda.de/api/v1/trees/create-tree', expect.any(Object));
  });

  it('prüft die Authentifizierung und leitet weiter, wenn kein Token vorhanden ist', async () => {
    localStorage.removeItem('token');
    await wrapper.vm.checkAuth();
    expect(router.currentRoute.value.path).toBe('/');
  });
});
