<template>
  <nav :class="['header', darkMode ? 'dark' : 'light']">
    <ul>
      <li v-if="!isAuthenticated"><router-link to="/login">Login</router-link></li>
      <li v-if="!isAuthenticated"><router-link to="/register">Register</router-link></li>
      <li><router-link to="/">Startseite</router-link></li>
      <li v-if="isAuthenticated"><router-link to="/tutorial">Tutorial</router-link></li>
      
      <li v-if="isAuthenticated"><router-link to="/treeform">Baum Form</router-link></li>
      <li v-if="isAuthenticated"><router-link to="/map">Übersicht</router-link></li>
      <li v-if="isAuthenticated"><router-link to="/user">User</router-link></li>
      <button v-if="isAuthenticated" class="submit-button" @click="logout">Ausloggen</button>
      
    </ul>
    <label class="switch">
      <input type="checkbox" v-model="darkMode" @change="toggleDarkMode" />
      <span class="slider"></span>
    </label>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'HeaderComponent',
  computed: {
    ...mapGetters(['darkMode']),
  },
  methods: {
    ...mapActions(['toggleDarkMode']),
  },
};
</script>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

// Variable, um zu prüfen, ob der Benutzer authentifiziert ist
const isAuthenticated = ref(false);
const router = useRouter();

// Überprüfen, ob ein gültiges Token im localStorage vorhanden ist
const checkAuth = () => {
  const token = localStorage.getItem("token");
  if (token) {
    isAuthenticated.value = true;
  } else {
    isAuthenticated.value = false;
  }
};

// Logout-Funktion, die das Token entfernt und den Benutzer zurück zur Login-Seite schickt
const logout = () => {
  localStorage.removeItem("token");
  isAuthenticated.value = false;
  router.push("/");
};

// Beim Laden der Seite die Authentifizierung prüfen
onMounted(() => {
  checkAuth();
});
</script>

<style scoped>
@import './style.css';
</style>