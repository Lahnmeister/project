<template>
  <form @submit.prevent="handleSubmit" class="form-container">
    <h2 class="formbold-form-title">Registrierung</h2>

    <div class="formbold-input-flex">
      <div>
        <label for="username" class="formbold-form-label">Benutzername</label>
        <input
          type="text"
          id="username"
          v-model="username"
          class="formbold-form-input"
          placeholder="Benutzername (max. 15 Zeichen)"
          required
          maxlength="15"
        />
      </div>
    </div>

    <div class="formbold-input-flex">
      <div>
        <label for="email" class="formbold-form-label">E-Mail</label>
        <input
          type="email"
          id="email"
          v-model="email"
          class="formbold-form-input"
          placeholder="E-Mail"
          required
        />
      </div>
    </div>

    <div class="formbold-input-flex">
      <div>
        <label for="password" class="formbold-form-label">Passwort</label>
        <input
          type="password"
          id="password"
          v-model="password"
          class="formbold-form-input"
          placeholder="Passwort (mind. 8 Zeichen)"
          required
          minlength="8"
        />
      </div>
    </div>

    <div class="formbold-input-flex">
      <div>
        <label for="password_confirm" class="formbold-form-label">Passwort bestätigen</label>
        <input
          type="password"
          id="password_confirm"
          v-model="password_confirm"
          class="formbold-form-input"
          placeholder="Passwort eingeben"
          required
          minlength="8"
        />
      </div>
    </div>

    <div v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="alert alert-success">
      {{ successMessage }}
      <p>Du wirst in Kürze zur Startseite weitergeleitet...</p>
    </div>

    <button type="submit" class="formbold-btn">Registrieren</button>
  </form>

  <div class="login-link">
      <p>Schon ein Account vorhanden? <router-link to="/login">Hier einloggen</router-link></p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RegisterComponent",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      password_confirm: "",
      errorMessage: "",
      successMessage: "",
      stepLength: null
    };
  },
  methods: {
    validatePassword(password) {
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (password.length < minLength) {
        return "Password must be at least 8 characters long.";
      }
      if (!hasUpperCase) {
        return "Password must contain at least one uppercase letter.";
      }
      if (!hasLowerCase) {
        return "Password must contain at least one lowercase letter.";
      }
      if (!hasNumber) {
        return "Password must contain at least one number.";
      }
      if (!hasSpecialChar) {
        return "Password must contain at least one special character.";
      }
      return null;
    },

    async handleSubmit() {
      const passwordError = this.validatePassword(this.password);
      if (passwordError) {
        this.errorMessage = passwordError;
        this.successMessage = "";
        return;
      }

      if (this.password !== this.password_confirm) {
        this.errorMessage = "The passwords don't match.";
        this.successMessage = "";
        return;
      }

      this.stepLength = localStorage.getItem("step_size") ? Number(localStorage.getItem("step_size")) : null;
      
      console.log("Type of stepLength:", typeof this.stepLength);
      console.log("Value of stepLength:", this.stepLength);

      const data = {
        username: this.username,
        email: this.email,
        password: this.password,
        step_length: this.stepLength
      };

      try {
        const response = await axios.post("https://treescope.cs.hs-fulda.de/auth/register", data);
        if (response.status === 201) {
          console.log("Registrierung erfolgreich:", response.data);
          this.errorMessage = "";
          this.successMessage = "Registrierung erfolgreich! Bitte überprüfe deine E-Mail und bestätige deine Adresse, bevor du dich anmeldest.";
          this.redirectToHome();
        } else {
          throw new Error("Unerwarteter Fehler");
        }
      } catch (error) {
        console.error("Fehler bei der Registrierung:", error);
        if (error.response && error.response.status === 403) {
          this.errorMessage = "Diese E-Mail-Adresse oder der Benutzername wird bereits verwendet.";
        } else {
          this.errorMessage = "Es ist ein Fehler aufgetreten. Bitte versuche es erneut.";
        }
        this.successMessage = "";
      }
    },

    redirectToHome() {
      setTimeout(() => {
        window.location.href = "/";
      }, 5000);
    }
  }
};
</script>


<style scoped>
@import "./style.css";
.login-link {
    font-size: 14px;
    margin-top: 15px;
    text-align: center;
  }
</style>
