<template>
  <div id="app">
    <!-- Header nur anzeigen, wenn showHeader true ist.-->
    <HeaderComponent v-if="showHeader" :key="$route.fullPath" />

    <!-- Dropdown-Menü nur auf folgenden Seiten anzeigen -->
    <div v-if="showDropdown">
      <select v-model="selectedView" @change="navigateToView">
        <option value="map">Karten Ansicht</option>
        <option value="table">Tabellen Ansicht</option>
        <option value="card">Einzel Ansicht</option>
      </select>
    </div>

    <div id="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import HeaderComponent from './components/HeaderComponent.vue';

export default {
  components: {
    HeaderComponent,
  },
  data() {
    return {
      selectedView: 'map', // Standardansicht
    };
  },
  computed: {
    showDropdown() {
      // Dropdown nur anzeigen, wenn der aktuelle Routename 'map', 'table' oder 'card' ist
      return ['map', 'table', 'card'].includes(this.$route.name);
    },
    showHeader() {
      // Header nicht anzeigen, wenn der aktuelle Pfad /login oder /register ist
      const hideHeaderRoutes = ["/login", "/register"];
      return !hideHeaderRoutes.includes(this.$route.path);
    },
  },
  watch: {
    // Überwacht den Routenwechsel und passt die Dropdownliste an
    '$route.name'(newRoute) {
      if (['map', 'table', 'card'].includes(newRoute)) {
        this.selectedView = newRoute;
      }
    },
  },
  methods: {
    navigateToView(event) {
      const selectedView = event.target.value;
      // Navigiere zur entsprechenden Route
      this.$router.push({ name: selectedView });
    },
  },
};
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

#header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: white;
  width: 100%;
}

#content {
  flex-grow: 1;
  overflow-y: auto;
}
</style>
