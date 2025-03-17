<template>
  <div class="page-container">
    <div class="form-container">
      <h2 class="formbold-form-title">🔑 Login</h2>

      <div class="formbold-input-flex">
        <div>
          <label for="username" class="formbold-form-label">👤 Benutzername</label>
          <input v-model="username" type="text" name="Username" id="username" placeholder="Benutzername eingeben"
            class="formbold-form-input" required />
        </div>
      </div>

      <div class="formbold-input-flex">
        <div>
          <label for="password" class="formbold-form-label">🔒 Passwort</label>
          <input v-model="password" type="password" name="password" id="password" placeholder="Passwort eingeben"
            class="formbold-form-input" required />
        </div>
      </div>

      <div class="formbold-input-flex remember-forgot">
        <div class="remember-password">
          <input type="checkbox" id="remember" />
          <label for="remember">💾 Merken</label>
        </div>
        <div>
          <router-link to="/passwordreset">
            <button class="formbold-btn">❓ Passwort vergessen?</button>
          </router-link>
        </div>
      </div>

      <button @click="login" class="formbold-btn">Login</button>

      <div class="register-link">
        <p>Noch kein Account? <router-link to="/register">Hier registrieren</router-link></p>
      </div>

      <p v-if="errorMessage" class="error-message">⚠️ {{ errorMessage }}</p>
    </div>
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
.page-container {
  background: #f0fff0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-container {
  background: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.formbold-form-label {
  display: block;
  text-align: left;
  font-weight: bold;
  margin-bottom: 5px;
}

.formbold-form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
}

.formbold-form-input:focus {
  border-color: #007BFF;
  outline: none;
}

.formbold-btn {
  background-color: #28a745;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  margin-top: 10px;
}

.formbold-btn:hover {
  background-color: #218838;
}

.register-link {
  margin-top: 15px;
}

.register-link a {
  color: #007BFF;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.remember-password {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.remember-password input {
  margin-bottom: 0px;
}
</style>
