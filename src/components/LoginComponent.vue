<template>
  <div class="form-container">
    <h2 class="formbold-form-title">Login</h2>

    <div class="formbold-input-flex">
      <div>
        <label for="username" class="formbold-form-label">Benutzername</label>
        <input
          v-model="username"
          type="text"
          name="Username"
          id="email"
          placeholder="Benutzername eingeben"
          class="formbold-form-input"
          required
        />
      </div>
    </div>

    <div class="formbold-input-flex">
      <div>
        <label for="password" class="formbold-form-label">Passwort</label>
        <input
          v-model="password"
          type="password"
          name="password"
          id="password"
          placeholder="Passwort eingeben"
          class="formbold-form-input"
          required
        />
      </div>
    </div>

    <div class="formbold-input-flex remember-forgot">
      <div class="remember-password">
        <label for="remember">Merken</label>
        <input type="checkbox" id="remember"/> 
      </div>
      <div>
        <router-link to="/passwordreset">
          <button class="formbold-btn">Passwort vergessen?</button>
        </router-link>
      </div>
    </div>

    <button @click="login" class="formbold-btn">Login</button>

    <div class="register-link">
      <p>Noch kein Account? <router-link to="/register">Hier registrieren</router-link></p>
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
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    const data = await response.json();
    //console.log(data)

    if (response.ok) {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("step_size", data.user.step_length);
      router.push("/");
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
.remember-password{
  display: flex;
  gap:5px;
  margin-right: 20px;
}
.remember-password input{
  margin-bottom: 10px;
}
</style>
