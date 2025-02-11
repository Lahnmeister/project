<template>
  <div class="form-container">

    <h2 class="formbold-form-title">Login</h2>

    <div class="formbold-input-flex">
      <div>
        <label for="email" class="formbold-form-label">E-Mail</label>
        <input v-model="username" type="text" name="Username" id="email" placeholder="Benutzername eingeben"
          class="formbold-form-input" required />
      </div>
    </div>

    <div class="formbold-input-flex">
      <div>
        <label for="password" class="formbold-form-label">Passwort</label>
        <input v-model="password" type="password" name="password" id="password" placeholder="Passwort eingeben"
          class="formbold-form-input" required />
      </div>
    </div>

    <div class="formbold-input-flex remember-forgot">
      <label for="remember">
        <input type="checkbox" id="remember" /> Merken
        <router-link to="/passwordreset">
          <button class="formbold-btn">Passwort vergessen?</button>
        </router-link>
      </label>
      <!--<a href="#" class="forgot-password">Passwort vergessen?</a>-->
    </div>



    <button @click="login" class="formbold-btn">Login</button>

    <div class="register-link">
      <!--<p>Don't have an account? <router-link to="/register">Register</router-link></p>-->
    </div>

    <p v-if="errorMessage">{{ errorMessage }}</p>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

const login = async () => {
  try {
    const response = await fetch("https://treescope.cs.hs-fulda.de/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }, // API erwartet JSON-Daten

      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.access_token); // Speichert das Token
      router.push("/"); // Weiterleitung nach erfolgreichem Login
    } else {
      errorMessage.value = data.error || "Login fehlgeschlagen";
    }
  } catch (error) {
    errorMessage.value = "Netzwerkfehler oder Server nicht erreichbar";
  }
};
</script>

<style scoped>
@import './style.css';
</style>