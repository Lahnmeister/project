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
  .form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .formbold-form-title {
    font-weight: 600;
    font-size: 28px;
    line-height: 35px;
    width: 100%;
    text-align: center;
    margin-bottom: 30px;
  }
  
  .formbold-form-input {
    text-align: center;
    width: 100%;
    padding: 8px 22px;
    border-radius: 5px;
    border: 1px solid #dde3ec;
    background: #ffffff;
    font-weight: 500;
    font-size: 15px;
    outline: none;
    resize: none;
  }
  
  .formbold-input-flex {
    display: contents;
    gap: 15px;
    flex-wrap: wrap;
    margin-bottom: 15px;
  }
  
  .formbold-input-flex > div {
    width: 100%;
    max-width: 300px;
    margin-bottom: 10px;
  }
  
  .formbold-form-label {
    font-size: 14px;
    line-height: 24px;
    display: block;
    margin-bottom: 10px;
  }
  
  .formbold-btn {
    text-align: center;
    width: 100%;
    font-size: 16px;
    border-radius: 5px;
    padding: 14px 25px;
    border: none;
    font-weight: 500;
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
    margin-top: 25px;
  }
  
  .formbold-btn:hover {
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
  }
  
  .remember-forgot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    margin-top: 10px;
  }
  
  .remember-forgot a {
    color: #4CAF50;
    text-decoration: none;
    font-weight: 500;
  }
  
  .remember-forgot a:hover {
    text-decoration: underline;
  }
  
  .register-link {
    font-size: 14px;
    margin-top: 15px;
    text-align: center;
  }
  
  .register-link a {
    color: #4CAF50;
    text-decoration: none;
    font-weight: 500;
  }
  
  .register-link a:hover {
    text-decoration: underline;
  }
  </style>
  