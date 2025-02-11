<template>
    <div class="form-container">
        <div class="formbold-input-flex">
            <h2 class="text-2xl font-semibold text-center mb-4">Bitte gib deine E-Mail ein</h2>
            <p class="text-gray-600 text-center mb-6">
                Bitte gib deine E-Mail-Adresse ein,<br> um deine Passwort zurück zu setzen.
            </p>

            <form @submit.prevent="submitEmail">
                <div class="mb-4">
                    <label for="email" class="formbold-form-label">E-Mail-Adresse:</label>
                    <input type="email" id="email" v-model="email" class="formbold-form-input"
                        placeholder="name@example.com" required />
                </div>

                <button type="submit" class="formbold-btn">
                    Passwort zurücksetzen
                </button>
            </form>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

const errorMessage = ref("");
const router = useRouter();
export default {
    data() {
        return {
            email: ''
        };
    },
    methods: {
        async submitEmail() {
            if (this.email) {
                try {
                    const response = await fetch("https://treescope.cs.hs-fulda.de/auth/reset-password", {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        }, // API erwartet JSON-Daten

                        body: JSON.stringify({
                            email: this.email
                        }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        console.log("response:" + data);
                        alert("Ihnen wurde eine Email zum zurücksetzen des Passworts geschickt.");
                        router.push("/"); // Weiterleitung nach erfolgreichem Login
                    } else {
                        errorMessage.value = data.error || "Login fehlgeschlagen";
                    }
                } catch (error) {
                    errorMessage.value = "Netzwerkfehler oder Server nicht erreichbar";
                }

            }
        }
    }
};
</script>

<style scoped>
@import './style.css';
</style>