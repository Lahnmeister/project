<template>
    <nav :class="['header', darkMode ? 'dark' : 'light']">
      <ul>
        <li><router-link to="/">Startseite</router-link></li>
        <li><router-link to="/tutorial">Tutorial</router-link></li>
        <li><router-link to="/treeform">Baum Form</router-link></li>
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/register">Register</router-link></li>
        <!--<li><router-link to="/trivia">Trivia</router-link></li>
        <li><router-link to="/vorteile">Vorteile</router-link></li>
        <li><router-link to="/vorteile">Vorteile</router-link></li>
        <li><router-link to="/MobileApp">Mobile App</router-link></li>
        <li><router-link to="/v-model">Demo - v-model</router-link></li>
        <li><router-link to="/testapp">Testapp</router-link></li>-->
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
  
  <style scoped>
  @import './style.css';
  </style>
  