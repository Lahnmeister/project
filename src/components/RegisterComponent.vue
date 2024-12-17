<template>
    <form @submit.prevent="handleSubmit">
        <h3>Sign Up</h3>

        <div class="">
            <label>Username</label>
            <input type="text" v-model="username" class="" placeholder="Username" required>
        </div>

        <div class="">
            <label>Email</label>
            <input type="email" v-model="email" class="" placeholder="Email" required>
        </div>

        <div class="">
            <label>Password</label>
            <input type="password" v-model="password" class="" placeholder="Password" required>
        </div> 

        <div class="">
            <label>Confirm Password</label>
            <input type="password" v-model="password_confirm" class="" placeholder="Confirm Password" required>
        </div>

        <div v-if="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="alert alert-success">
            {{ successMessage }}
        </div>

        <button type="submit" class="">Sign Up</button>
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