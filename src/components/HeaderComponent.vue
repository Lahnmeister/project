<template>
  <nav :class="['header', darkMode ? 'dark' : 'light']">
    <ul>
      <li v-if="!isAuthenticated">
        <router-link class="nav-button" to="/login">Login</router-link>
      </li>
      <li v-if="!isAuthenticated">
        <router-link class="nav-button" to="/register">Register</router-link>
      </li>
      <li v-if="!isAuthenticated">
        <router-link class="nav-button" to="/">Startseite</router-link>
      </li>
      <li>
        <router-link class="nav-button" to="/tutorial">Distanz- bzw. <br /> Höhenermittlung</router-link>
      </li>
      <li v-if="isAuthenticated">
        <router-link class="nav-button" to="/treeform">Baum Form</router-link>
      </li>
      <li v-if="isAuthenticated">
        <router-link class="nav-button" to="/map">Übersicht</router-link>
      </li>
      <li v-if="isAuthenticated">
        <router-link class="nav-button" to="/user">User</router-link>
      </li>
      <li v-if="isAuthenticated">
        <button class="logout-button" @click="logout">Ausloggen</button>
      </li>
    </ul>
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
.header {
  display: flex;
  -webkit-overflow-scrolling: touch;
  padding: 10px;
}

/* Flexibles Menü */
.header ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.header li {
  margin-right: 0px;
  white-space: nowrap;
}

/* Standardstil für Navigation-Buttons */
.nav-button {
  display: inline-block;
  padding: 10px 15px;
  border: 1px solid transparent;
  border-radius: 5px;
  background-color: transparent;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

/* Interaktiver Effekt: Beim Anklicken grün (#45a049) */
.nav-button:active {
  background-color: #45a049;
  color: #fff;
}

/* Logout-Button: Immer grün */
.logout-button {
  padding: 10px 15px;
  border: 1px solid transparent;
  border-radius: 5px;
  background-color: #45a049;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
}

/* Optionaler Hover-Effekt für Logout-Button */
.logout-button:hover {
  background-color: #3e8e41;
}

/* Optional: Styling für dunklen und hellen Modus */
.header.dark {
  background-color: #333;
  color: #fff;
}

.header.light {
  background-color: #fff;
  color: #000;
}
</style>
