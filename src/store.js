import { createStore } from 'vuex';

export default createStore({
  state: {
    darkMode: false,
  },
  getters: {
    darkMode: (state) => state.darkMode,
  },
  mutations: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      console.log('Dark Mode Zustand geändert:', state.darkMode ? 'Dark Mode' : 'Light Mode');
    },
  },
  actions: {
    toggleDarkMode({ commit }) {
      commit('toggleDarkMode');
    },
  },
});
