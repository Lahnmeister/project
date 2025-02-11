<template>
  <div class="explanation">
    <h1>Tutorial</h1>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perferendis mollitia alias delectus ipsum itaque eos, dicta illo, nisi enim, magni ipsa quidem! Minima fugiat accusantium sequi ullam corrupti, aperiam quaerat!</p>
  </div>
</template>
<script>

</script>

<script setup>

import {onMounted } from "vue";
import { useRouter } from "vue-router";

// Variable, um zu prüfen, ob der Benutzer authentifiziert ist
const router = useRouter();
  
  // Überprüfen, ob ein gültiges Token im localStorage vorhanden ist
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        router.push("/"); // Falls kein Token vorhanden ist, zurück zur Login-Seite
        return;
    }
  };
  
  // Beim Laden der Seite die Authentifizierung prüfen
  onMounted(() => {
    checkAuth();
  });

</script>

<style scoped>
@import './style.css';

</style>
