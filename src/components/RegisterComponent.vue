<template>
  <div class="page-container">
    <form @submit.prevent="handleSubmit" class="form-container">
      <h2 class="formbold-form-title">Registrierung</h2>

      <div class="formbold-input-flex">
        <div>
          <label for="username" class="formbold-form-label">👤 Benutzername</label>
          <input type="text" id="username" v-model="username" class="formbold-form-input"
            placeholder="Benutzername (max. 15 Zeichen)" required maxlength="15" />
        </div>
      </div>

      <div class="formbold-input-flex">
        <div>
          <label for="email" class="formbold-form-label">📧 E-Mail</label>
          <input type="email" id="email" v-model="email" class="formbold-form-input" placeholder="E-Mail" required />
        </div>
      </div>

      <div class="formbold-input-flex">
        <div>
          <label for="password" class="formbold-form-label">🔒 Passwort</label>
          <input type="password" id="password" v-model="password" class="formbold-form-input"
            placeholder="Passwort (mind. 8 Zeichen)" required minlength="8" />
        </div>
      </div>

      <div class="formbold-input-flex">
        <div>
          <label for="password_confirm" class="formbold-form-label">🔒 Passwort bestätigen</label>
          <input type="password" id="password_confirm" v-model="password_confirm" class="formbold-form-input"
            placeholder="Passwort eingeben" required minlength="8" />
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
      <p>Schon ein Account vorhanden? <router-link to="/login">Hier einloggen 🔑</router-link></p>
    </div>
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
      // const hasUpperCase = /[A-Z]/.test(password);
      // const hasLowerCase = /[a-z]/.test(password);
      // const hasNumber = /[0-9]/.test(password);
      // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (password.length < minLength) {
        return "Password must be at least 8 characters long.";
      }
      // if (!hasUpperCase) {
      //   return "Password must contain at least one uppercase letter.";
      // }
      // if (!hasLowerCase) {
      //   return "Password must contain at least one lowercase letter.";
      // }
      // if (!hasNumber) {
      //   return "Password must contain at least one number.";
      // }
      // if (!hasSpecialChar) {
      //   return "Password must contain at least one special character.";
      // }
      // return null;
    },

    async handleSubmit() {
      const passwordError = this.validatePassword(this.password);
      if (passwordError) {
        this.errorMessage = passwordError;
        this.successMessage = "";
        return;
      }

      if (this.password !== this.password_confirm) {
        this.errorMessage = "Die Passwörter stimmen nicht überein.";
        this.successMessage = "";
        return;
      }

      this.stepLength = localStorage.getItem("step_size") ? Number(localStorage.getItem("step_size")) : null;

      const data = {
        username: this.username,
        email: this.email,
        password: this.password,
        step_length: this.stepLength
      };

      try {
        const response = await axios.post("https://treescope.cs.hs-fulda.de/auth/register", data);
        if (response.status === 201) {
          this.errorMessage = "";
          this.successMessage = "Registrierung erfolgreich! Bitte überprüfe deine E-Mail und bestätige deine Adresse, bevor du dich anmeldest.";
          this.redirectToHome();
        } else {
          throw new Error("Unerwarteter Fehler");
        }
      } catch (error) {
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
/* Gesamte Seitenhintergrund und Zentrierung */
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f0fff0;
  padding: 20px;
}

/* Formularcontainer */
.form-container {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

/* Titel zentrieren */
.formbold-form-title {
  font-weight: 600;
  font-size: 32px;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

/* Flex-Layout für Inputs */
.formbold-input-flex {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 15px;
}

/* Labels links ausrichten */
.formbold-form-label {
  font-size: 14px;
  margin-bottom: 5px;
  color: #495057;
  text-align: left;
  font-weight: bold;
}

/* Formularinputs */
.formbold-form-input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.formbold-form-input:focus {
  border-color: #80bdff;
  outline: none;
}

/* Button */
.formbold-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  background-color: #28a745;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.formbold-btn:hover {
  background-color: #218838;
}

/* Alerts */
.alert {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  font-weight: 500;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
}

/* Login-Link */
.login-link {
  margin-top: 20px;
  font-size: 16px;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
