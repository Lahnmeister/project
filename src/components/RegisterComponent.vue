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
            placeholder="Benutzername"
            required
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
            placeholder="Passwort"
            required
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
          />
        </div>
      </div>
  
      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>
  
      <button type="submit" class="formbold-btn">Registrieren</button>
    </form>
  </template>

<script>

    //import axios from 'axios'

    export default{
        name: 'RegisterComponent',
        data(){
            return{
                username:'',
                email: '',
                password: '',
                password_confirm: '',
                errorMessage: '',
                successMessage: ''
            }
        },
        methods: {
            validatePassword(password){
                const minLength = 8;
                const hasUpperCase = /[A-Z]/.test(password);
                const hasLowerCase = /[a-z]/.test(password);
                const hasNumber = /[0-9]/.test(password);
                const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

                if(password.length < minLength){
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
                return null; // No errors
            },


            handleSubmit(){
                //Checking the password requirements
                const passwordError = this.validatePassword(this.password);
                if(passwordError){
                    this.errorMessage = passwordError;
                    this.successMessage = '';
                    return
                }

                //Check if password is the same
                if(this.password !== this.password_confirm){
                    this.errorMessage ="The passwords don't match."
                    this.successMessage = '';
                    return
                }
                



                const data = {
                    username: this.username,
                    email: this.email,
                    password: this.password
                }

                console.log(data)
                // axios.post('http://localhost:8100/register',data)
                //     .then(
                //         res => {
                //             console.log(res)
                //         }
                //     ).catch(
                //         err =>{
                //             console.log(err)
                //         }
                //     )
            }
        }
    }

</script>

<style scoped>
@import './style.css';
</style>
