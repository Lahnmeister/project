<template>
  <div id="app">
    <HeaderComponent  v-if="showHeader"/>
    <router-view></router-view>
  </div>
</template>

<script>
import HeaderComponent from './components/HeaderComponent.vue';

export default {
  components: {
    HeaderComponent
  },
  computed: {
    // Check the current route
    showHeader() {
      const hideHeaderRoutes = ["/login", "/register"]; // Routes without header
      return !hideHeaderRoutes.includes(this.$route.path);
    },
  },
};
</script>
