import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import HeaderComponent from '../../src/components/HeaderComponent.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createStore } from 'vuex';

// Mock-Vuex-Store
const store = createStore({
  state: {
    darkMode: false, // Standardwert für Dark Mode ist deaktiviert
  },
  getters: {
    darkMode: (state) => state.darkMode, // Getter zum Abrufen des Dark Mode-Status
  },
  actions: {
    toggleDarkMode: vi.fn((context) => {
      context.state.darkMode = !context.state.darkMode; // Umschalten des Dark Mode-Status
    }),
  },
});

// Mock-Router mit allen relevanten Routen
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'Login', component: {} }, // Route für Login
    { path: '/register', name: 'Register', component: {} }, // Route für Registrierung
    { path: '/tutorial', name: 'Tutorial', component: {} }, // Route für das Tutorial
    { path: '/treeform', name: 'TreeForm', component: {} }, // Route für das Baum-Formular
    { path: '/overview', name: 'Overview', component: {} }, // Route für die Tabellenübersicht
    { path: '/overview2', name: 'Overview2', component: {} }, // Route für die Kartenübersicht
    { path: '/', name: 'Home', component: {} } // Route für die Startseite
  ],
});

describe('HeaderComponent.vue', () => {
  let wrapper;

  beforeEach(async () => {
    // Mountet die Header-Komponente mit Router und Store
    wrapper = mount(HeaderComponent, {
      global: {
        plugins: [router, store],
      },
    });
    await router.isReady(); // Warten, bis der Router vollständig geladen ist
  });

  // 🟢 Test: Überprüft, ob der Header korrekt gerendert wird
  it('rendert die Header-Navigation', () => {
    expect(wrapper.find('nav').exists()).toBe(true); // Prüft, ob das <nav>-Element existiert
  });

  // 🟢 Test: Überprüft, ob ein nicht angemeldeter Benutzer nur Login/Register sieht
  it('zeigt Login und Register, wenn der Benutzer nicht eingeloggt ist', () => {
    expect(wrapper.find('a[href="/login"]').exists()).toBe(true); // Login-Link sollte existieren
    expect(wrapper.find('a[href="/register"]').exists()).toBe(true); // Register-Link sollte existieren
    expect(wrapper.find('a[href="/tutorial"]').exists()).toBe(false); // Tutorial-Link sollte nicht sichtbar sein
    expect(wrapper.find('button.submit-button').exists()).toBe(false); // Logout-Button sollte nicht existieren
  });

  // 🟢 Test: Prüft, ob ein authentifizierter Benutzer zusätzliche Links sieht
  it('zeigt zusätzliche Links, wenn der Benutzer eingeloggt ist', async () => {
    localStorage.setItem('token', 'valid-token'); // Simuliert ein gespeichertes Token
    await wrapper.vm.checkAuth(); // Prüft die Authentifizierung
    await wrapper.vm.$nextTick(); // DOM-Update abwarten

    expect(wrapper.find('a[href="/tutorial"]').exists()).toBe(true); // Tutorial-Link sollte existieren
    expect(wrapper.find('a[href="/treeform"]').exists()).toBe(true); // Baum-Formular-Link sollte existieren
    expect(wrapper.find('button.submit-button').exists()).toBe(true); // Logout-Button sollte existieren
  });

  // 🟢 Test: Überprüft, ob das Logout funktioniert (Token löschen & Weiterleitung)
  it('führt Logout korrekt durch', async () => {
    localStorage.setItem('token', 'valid-token'); // Simuliert ein eingeloggtes Szenario
    await wrapper.vm.checkAuth(); // Authentifizierung prüfen
    await wrapper.vm.$nextTick(); // DOM-Update abwarten
    
    const routerPush = vi.spyOn(router, 'push'); // Überwacht die Navigation
    await wrapper.find('button.submit-button').trigger('click'); // Logout-Button klicken

    expect(localStorage.getItem('token')).toBeNull(); // Token sollte entfernt worden sein
    expect(wrapper.vm.isAuthenticated).toBe(false); // Benutzer sollte als ausgeloggt markiert sein
    expect(routerPush).toHaveBeenCalledWith('/'); // Benutzer sollte zur Startseite umgeleitet werden
  });

  // 🟢 Test: Überprüft, ob der Dark Mode aktiviert und korrekt dargestellt wird
  it('ändert die Dark Mode Klasse, wenn umgeschaltet wird', async () => {
    const checkbox = wrapper.find('input[type="checkbox"]'); // Findet den Dark Mode Toggle
    await checkbox.setChecked(); // Aktiviert den Toggle-Schalter
    await wrapper.vm.$nextTick(); // DOM-Update abwarten
    expect(wrapper.find('nav').classes()).toContain('dark'); // Prüft, ob die Klasse 'dark' gesetzt wurde
  });
});
