<template>
    <nav :class="['header', darkMode ? 'dark' : 'light']">
      <ul>
        <li><router-link to="/">Startseite</router-link></li>
        <li><router-link to="/overview">Übersicht</router-link></li>
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
  .header {
    padding: 1em;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  
  .header ul {
    display: flex;
    gap: 1em;
    list-style: none;
    margin: 0;
    padding: 0;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
  
  .header li a {
    color: inherit; 
    text-decoration: none;
  }
  
  .header li a:hover {
    text-decoration: underline;
  }
  
  .light {
    background-color: #f9f9f9;
    color: #333; 
  }
  
  .dark {
    background-color: #333;
    color: #f9f9f9; 
  }
  
  .switch {
    position: absolute;
    display: inline-block;
    width: 34px;
    height: 20px;
    justify-content: right;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
  
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 34px;
  }
  
  .slider:before {
    position: absolute;
    content: '';
    height: 14px;
    width: 14px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
  
  input:checked + .slider {
    background-color: #42b983;
  }
  
  input:checked + .slider:before {
    transform: translateX(14px);
  }
  </style>
  