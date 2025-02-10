<template>
  <div class="explanation">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
  </div>
</template>
<script>
export default {
  name: "Explanation-Site",
  data() {
    return {
      title: "Tutorial",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque expedita eos beatae repellat cum. Similique, nisi vitae fugiat libero odit qui nemo quaerat quia impedit, modi ipsum adipisci iste cumque!"

    };
  }
};
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
