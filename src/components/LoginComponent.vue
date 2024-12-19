<template>
  <div class="form-container">
    <form>
      <h2 class="formbold-form-title">Login</h2>
  
      <div class="formbold-input-flex">
        <div>
          <label for="email" class="formbold-form-label">E-Mail</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="E-Mail eingeben"
            class="formbold-form-input"
            required
          />
        </div>
      </div>
  
      <div class="formbold-input-flex">
        <div>
          <label for="password" class="formbold-form-label">Passwort</label>
          <input
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
        <label for="remember">
          <input type="checkbox" id="remember" /> Merken
        </label>
        <!--<a href="#" class="forgot-password">Passwort vergessen?</a>-->
      </div>
  
      <button type="submit" class="formbold-btn">Login</button>
  
      <div class="register-link">
        <!--<p>Don't have an account? <router-link to="/register">Register</router-link></p>-->
      </div>
    </form>
  </div>
  </template>
  
  <script>
  export default {
    name: 'LoginComponent',
  };
  </script>
  
  <style scoped>
@import './style.css';
  </style>
  