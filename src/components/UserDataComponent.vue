<template>
  <div class="user-profile">
    <h1>Benutzerdaten</h1>

    <!-- Display mode when Edit is not clicked -->
    <div v-if="!isEditing">
      <!-- Button: Edit user data -->
      <button @click="toggleEdit" class="userdata-edit-button">
        Benutzerdaten bearbeiten
      </button>

      <!-- Display user data -->
      <p><strong>Benutzername:</strong> {{ user.username || 'Nicht angegeben' }}</p>
      <p><strong>E-Mail:</strong> {{ user.email || 'Nicht angegeben' }}</p>
      <p><strong>Vorname:</strong> {{ user.firstName || 'Nicht angegeben' }}</p>
      <p><strong>Nachname:</strong> {{ user.lastName || 'Nicht angegeben' }}</p>
      <p><strong>Schrittlänge (in cm):</strong> {{ user.step_length || 'Nicht angegeben' }}</p>
      <p><strong>Adresse:</strong> {{ user.address || 'Nicht angegeben' }}</p>
      <p><strong>Passwort:</strong> ********</p>

      <!-- Button: Delete account -->
      <button type="button" class="delete-button" @click="deleteAccount">
        Account löschen
      </button>
    </div>

    <!-- Edit mode: Displays the form -->
    <form v-else @submit.prevent="updateUser">
      <div class="form-group">
        <label for="username">Benutzername <span class="required">*</span></label>
        <input id="username" v-model="user.username" type="text" required placeholder="Benutzername" />
      </div>

      <div class="form-group">
        <label for="email">E-Mail</label>
        <div class="edit-container">
          <input id="email" v-model="user.email" type="email" placeholder="E-Mail-Adresse" disabled />
          <button type="button" class="edit-button" @click="openChangeEmailModal">
            E-Mail bearbeiten
          </button>
        </div>
      </div>

      <div class="form-group">
        <label for="firstName">Vorname</label>
        <input id="firstName" v-model="user.firstName" type="text" placeholder="Optional" />
      </div>

      <div class="form-group">
        <label for="lastName">Nachname</label>
        <input id="lastName" v-model="user.lastName" type="text" placeholder="Optional" />
      </div>

      <!-- Neues Feld: Schrittlänge (in cm) -->
      <div class="form-group">
        <label for="step_length">Schrittlänge (in cm) <span class="required">*</span></label>
        <input id="step_length" v-model.number="user.step_length" type="number" required
          placeholder="Schrittlänge in cm" />
      </div>

      <div class="form-group" style="position: relative;">
        <label for="address">Adresse <span class="required">*</span></label>
        <input id="address" v-model="addressQuery" type="text" placeholder="Adresse eingeben" @input="onAddressInput"
          @blur="hideSuggestions" autocomplete="off" required />
        <!-- Autocomplete Suggestions -->
        <ul v-if="addressSuggestions.length > 0" class="suggestions-list">
          <li v-for="(suggestion, index) in addressSuggestions" :key="index"
            @mousedown.prevent="selectAddress(suggestion)">
            {{ suggestion.display }}
          </li>
        </ul>
        <div v-if="addressError" class="error-message">
          {{ addressError }}
        </div>
      </div>

      <div class="form-group">
        <label for="latitude">Breitengrad (Latitude)</label>
        <input id="latitude" v-model="user.latitude" type="text" placeholder="Latitude" readonly required disabled />
      </div>

      <div class="form-group">
        <label for="longitude">Längengrad (Longitude)</label>
        <input id="longitude" v-model="user.longitude" type="text" placeholder="Longitude" readonly required disabled />
      </div>

      <div class="form-group">
        <label>Passwort</label>
        <div class="edit-container">
          <input type="password" v-model="user.password" id="password" placeholder="********" disabled />
          <button type="button" class="edit-button" @click="openChangePasswordModal">
            Passwort ändern
          </button>
        </div>
      </div>

      <!-- Error message  -->
      <div v-if="formError" class="error-message">
        {{ formError }}
      </div>

      <button type="submit" class="save-button">Speichern</button>
      <button type="button" @click="toggleEdit" class="cancel-button">Abbrechen</button>
    </form>

    <!-- MODAL: Change password -->
    <div v-if="showPasswordModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Passwort ändern</h2>
        <form @submit.prevent="changePassword">
          <div class="form-group">
            <label for="oldPassword">Altes Passwort</label>
            <input id="oldPassword" v-model="passwordData.oldPassword" type="password" required />
          </div>

          <div class="form-group">
            <label for="newPassword">Neues Passwort</label>
            <input id="newPassword" v-model="passwordData.newPassword" type="password" required />
          </div>

          <div v-if="passwordData.newPassword" class="password-requirements">
            <p :class="{ valid: passwordChecks.length }">Mindestens 8 Zeichen</p>
            <p :class="{ valid: passwordChecks.hasUpper }">Mindestens ein Großbuchstabe</p>
            <p :class="{ valid: passwordChecks.hasLower }">Mindestens ein Kleinbuchstabe</p>
            <p :class="{ valid: passwordChecks.hasNumber }">Mindestens eine Zahl</p>
            <p :class="{ valid: passwordChecks.hasSpecial }">Mindestens ein Sonderzeichen</p>
          </div>

          <div class="form-group">
            <label for="confirmNewPassword">Neues Passwort bestätigen</label>
            <input id="confirmNewPassword" v-model="passwordData.confirmNewPassword" type="password" required />
          </div>

          <div v-if="passwordChangeError" class="error-message">
            {{ passwordChangeError }}
          </div>
          <div v-if="passwordChangeSuccess" class="success-message">
            {{ passwordChangeSuccess }}
          </div>

          <button type="submit" :disabled="!isPasswordValid" class="save-button">Änderungen speichern</button>
          <button type="button" @click="closeChangePasswordModal" class="cancel-button">Abbrechen</button>
        </form>
      </div>
    </div>

    <!-- MODAL: Change e-mail -->
    <div v-if="showEmailModal" class="modal-overlay">
      <div class="modal-content">
        <h2>E-Mail ändern</h2>
        <form @submit.prevent="changeEmail">
          <div class="form-group">
            <label for="currentEmail">Aktuelle E-Mail</label>
            <input id="currentEmail" type="email" :value="user.email" disabled />
          </div>

          <div class="form-group">
            <label for="newEmail">Neue E-Mail</label>
            <input id="newEmail" v-model="emailData.newEmail" type="email" required placeholder="Neue E-Mail-Adresse" />
          </div>

          <div class="form-group">
            <label for="confirmNewEmail">Neue E-Mail bestätigen</label>
            <input id="confirmNewEmail" v-model="emailData.confirmNewEmail" type="email" required
              placeholder="Neue E-Mail-Adresse bestätigen" />
          </div>

          <div class="form-group">
            <label for="currentPassword">Aktuelles Passwort</label>
            <input id="currentPassword" v-model="emailData.currentPassword" type="password" required
              placeholder="Aktuelles Passwort" />
          </div>

          <div v-if="emailChangeError" class="error-message">
            {{ emailChangeError }}
          </div>
          <div v-if="emailChangeSuccess" class="success-message">
            {{ emailChangeSuccess }}
          </div>

          <button type="submit" :disabled="!isEmailValid" class="save-button">Änderungen speichern</button>
          <button type="button" @click="closeChangeEmailModal" class="cancel-button">Abbrechen</button>
        </form>
      </div>
    </div>

    <!-- Server Message -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content">
        <p>{{ popupMessage }}</p>
        <button @click="closePopup">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isEditing: false,
      showPasswordModal: false,
      showEmailModal: false,
      showPopup: false,
      popupMessage: "",
      user: {
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        step_length: 0,
        address: "",
        latitude: "",
        longitude: "",
        password: ""
      },
      passwordData: {
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      },
      emailData: {
        newEmail: "",
        confirmNewEmail: "",
        currentPassword: ""
      },
      // Error and success message
      emailChangeError: "",
      emailChangeSuccess: "",
      passwordChangeError: "",
      passwordChangeSuccess: "",
      // Address autocomplete
      addressQuery: "",
      addressSuggestions: [],
      addressSearchTimeout: null,
      addressError: "",
      // Form error
      formError: ""
    };
  },
  computed: {
    passwordChecks() {
      const pw = this.passwordData.newPassword;
      return {
        length: pw.length >= 8,
        hasUpper: /[A-Z]/.test(pw),
        hasLower: /[a-z]/.test(pw),
        hasNumber: /[0-9]/.test(pw),
        hasSpecial: /[^A-Za-z0-9]/.test(pw)
      };
    },
    isPasswordValid() {
      const checks = this.passwordChecks;
      return (
        checks.length &&
        checks.hasUpper &&
        checks.hasLower &&
        checks.hasNumber &&
        checks.hasSpecial &&
        this.passwordData.newPassword === this.passwordData.confirmNewPassword
      );
    },
    isEmailValid() {
      return (
        this.emailData.newEmail === this.emailData.confirmNewEmail &&
        this.emailData.newEmail.includes('@') &&
        this.emailData.currentPassword.trim() !== ""
      );
    },
    isAddressValid() {
      return (
        this.user.address.trim() !== "" &&
        this.user.latitude.trim() !== "" &&
        this.user.longitude.trim() !== ""
      );
    }
  },
  methods: {
    toggleEdit() {
      this.isEditing = !this.isEditing;
      if (!this.isEditing) {
        this.fetchUserData();
      }
    },

    formatCoordinate(coord) {
      const num = parseFloat(coord);
      if (isNaN(num)) {
        return "";
      }
      return num.toFixed(6);
    },

    validateCoordinates() {
      const lat = parseFloat(this.user.latitude);
      const lon = parseFloat(this.user.longitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        this.formError = "Bitte gib einen gültigen Breitengrad ein.";
        return false;
      }
      if (isNaN(lon) || lon < -180 || lon > 180) {
        this.formError = "Bitte gib einen gültigen Längengrad ein.";
        return false;
      }
      return true;
    },

    async fetchUserData() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Kein Authentifizierungstoken gefunden. Bitte logge dich erneut ein.");
        this.$router.push("/login");
        return;
      }
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.user_id || payload.id;
        if (!userId) {
          alert("Benutzer-ID konnte nicht ermittelt werden.");
          this.$router.push("/login");
          return;
        }
        const response = await fetch(`https://treescope.cs.hs-fulda.de/api/v1/users/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          this.user.username = data.username || "";
          this.user.email = data.email || "";
          this.user.firstName = data.first_name || "";
          this.user.lastName = data.last_name || "";
          this.user.step_length = data.step_length || 0;
          this.user.latitude = this.formatCoordinate(data.latitude) || "";
          this.user.longitude = this.formatCoordinate(data.longitude) || "";

          if (this.user.latitude && this.user.longitude) {
            await this.reverseGeocode(this.user.latitude, this.user.longitude);
          }
        } else {
          alert("Fehler beim Abrufen deiner Benutzerdaten. Bitte versuche es später erneut.");
        }
      } catch (error) {
        alert("Netzwerkfehler oder Server nicht erreichbar");
      }
    },

    async updateUser() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Kein Authentifizierungstoken gefunden. Bitte logge dich erneut ein.");
        this.$router.push("/login");
        return;
      }

      this.formError = "";
      this.addressError = "";

      if (!this.isAddressValid) {
        this.formError = "Bitte wähle eine gültige Adresse aus.";
        return;
      }
      if (!this.validateCoordinates()) {
        return;
      }
      if (!this.user.username.trim()) {
        this.formError = "Bitte gib einen gültigen Benutzernamen ein.";
        return;
      }
      if (!this.user.step_length || this.user.step_length < 60 || this.user.step_length > 90) {
        this.formError = "Bitte gib eine Schrittlänge zwischen 60 und 90 cm ein.";
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.user_id || payload.id;
        if (!userId) {
          alert("Benutzer-ID konnte nicht ermittelt werden.");
          this.$router.push("/login");
          return;
        }

        const updateParams = {
          username: this.user.username,
          latitude: this.formatCoordinate(this.user.latitude),
          longitude: this.formatCoordinate(this.user.longitude),
          step_length: this.user.step_length
        };
        if (this.user.firstName.trim() !== "") {
          updateParams.first_name = this.user.firstName;
        }
        if (this.user.lastName.trim() !== "") {
          updateParams.last_name = this.user.lastName;
        }

        const response = await fetch(`https://treescope.cs.hs-fulda.de/api/v1/users/${userId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updateParams)
        });

        if (response.ok) {
          const data = await response.json();
          alert("Daten erfolgreich aktualisiert!");
          this.isEditing = false;

          this.user.username = data.username || "";
          this.user.email = data.email || "";
          this.user.firstName = data.first_name || "";
          this.user.lastName = data.last_name || "";
          this.user.step_length = data.step_length || 0;
          this.user.latitude = this.formatCoordinate(data.latitude) || "";
          this.user.longitude = this.formatCoordinate(data.longitude) || "";

          // Schrittlänge im Local Storage speichern
          localStorage.setItem("step_size", this.user.step_length);

          if (this.user.latitude && this.user.longitude) {
            await this.reverseGeocode(this.user.latitude, this.user.longitude);
          }
        } else {
          const errData = await response.json() || {};
          const errMsg = errData.message || "";

          if (errMsg.includes("first_name")) {
            this.formError = "Der Vorname darf keine Zahlen oder Sonderzeichen enthalten.";
          } else if (errMsg.includes("last_name")) {
            this.formError = "Der Nachname darf keine Zahlen oder Sonderzeichen enthalten.";
          } else {
            this.formError = "Beim Speichern ist ein Fehler aufgetreten. Bitte prüfe deine Eingaben.";
          }
        }
      } catch (error) {
        this.formError = "Netzwerkfehler oder Server nicht erreichbar.";
      }
    },

    async changeEmail() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Kein Authentifizierungstoken gefunden. Bitte logge dich erneut ein.");
        this.$router.push("/login");
        return;
      }

      if (this.emailData.newEmail !== this.emailData.confirmNewEmail) {
        this.emailChangeError = "Die neuen E-Mail-Adressen stimmen nicht überein!";
        this.emailChangeSuccess = "";
        return;
      }
      if (this.emailData.currentPassword.trim() === "") {
        this.emailChangeError = "Bitte gib dein aktuelles Passwort ein.";
        this.emailChangeSuccess = "";
        return;
      }

      try {
        const payload = {
          email: this.emailData.newEmail,
          password: this.emailData.currentPassword
        };

        const response = await fetch("https://treescope.cs.hs-fulda.de/auth/change-mail", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (response.ok) {
          this.popupMessage = data.message || "E-Mail erfolgreich geändert!";
          this.showPopup = true;

          this.emailChangeSuccess = data.message || "E-Mail erfolgreich geändert!";
          this.emailChangeError = "";
          this.user.email = data.email || this.emailData.newEmail;
          this.emailData = {
            newEmail: "",
            confirmNewEmail: "",
            currentPassword: ""
          };
        } else {
          this.emailChangeError = "Es gab einen Fehler beim Ändern der E-Mail. Bitte prüfe deine Eingaben.";
          this.emailChangeSuccess = "";
        }
      } catch (error) {
        this.emailChangeError = "Netzwerkfehler oder Server nicht erreichbar.";
        this.emailChangeSuccess = "";
      }
    },

    async changePassword() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Kein Authentifizierungstoken gefunden. Bitte logge dich erneut ein.");
        this.$router.push("/login");
        return;
      }

      if (!this.isPasswordValid) {
        this.passwordChangeError = "Bitte erfülle alle Passwortanforderungen.";
        this.passwordChangeSuccess = "";
        return;
      }
      if (this.passwordData.newPassword !== this.passwordData.confirmNewPassword) {
        this.passwordChangeError = "Die neuen Passwörter stimmen nicht überein!";
        this.passwordChangeSuccess = "";
        return;
      }

      try {
        const payload = {
          old_password: this.passwordData.oldPassword,
          new_password: this.passwordData.newPassword
        };

        const response = await fetch("https://treescope.cs.hs-fulda.de/auth/change-password", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (response.ok) {
          this.popupMessage = data.message || "Passwort erfolgreich geändert!";
          this.showPopup = true;

          this.passwordChangeSuccess = data.message || "Passwort erfolgreich geändert!";
          this.passwordChangeError = "";
          this.passwordData = {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: ""
          };
          this.closeChangePasswordModal();
        } else {
          this.passwordChangeError = "Fehler beim Ändern des Passworts. Bitte prüfe deine Eingaben.";
          this.passwordChangeSuccess = "";
        }
      } catch (error) {
        this.passwordChangeError = "Netzwerkfehler oder Server nicht erreichbar.";
        this.passwordChangeSuccess = "";
      }
    },

    // Delete account 
    async deleteAccount() {
      const userConfirmed = confirm("Möchten Sie den Account wirklich löschen?");
      if (!userConfirmed) return;

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Kein Authentifizierungstoken gefunden. Bitte logge dich erneut ein.");
        this.$router.push("/login");
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.user_id || payload.id;
        if (!userId) {
          alert("Benutzer-ID konnte nicht ermittelt werden.");
          this.$router.push("/login");
          return;
        }

        const response = await fetch(`https://treescope.cs.hs-fulda.de/api/v1/users/${userId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          alert(data.message || "Der Account wurde gelöscht!");

          // Remove token to log out user
          localStorage.removeItem("token");

          // Reload page so that the user has the view of the logged out user again
          window.location.href = "/";
        } else {
          alert("Fehler beim Löschen des Accounts. Bitte versuche es erneut.");
        }
      } catch (error) {
        alert("Netzwerkfehler oder Server nicht erreichbar.");
      }
    },

    closePopup() {
      this.showPopup = false;
      if (this.emailChangeSuccess) {
        this.closeChangeEmailModal();
      }
      if (this.passwordChangeSuccess) {
        this.closeChangePasswordModal();
      }
    },

    onAddressInput() {
      if (this.addressSearchTimeout) {
        clearTimeout(this.addressSearchTimeout);
      }
      this.addressSearchTimeout = setTimeout(() => {
        this.fetchAddressSuggestions();
      }, 500);
    },
    async fetchAddressSuggestions() {
      if (this.addressQuery.trim() === "") {
        this.addressSuggestions = [];
        return;
      }
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            this.addressQuery
          )}&addressdetails=1&limit=5`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.addressSuggestions = data.map((item) => {
          const address = item.address || {};
          const postcode = address.postcode || "";
          const city = address.city || address.town || address.village || "";
          const country = address.country || "";
          const display = `${postcode} ${city}, ${country}`;
          return {
            display: display,
            lat: this.formatCoordinate(item.lat),
            lon: this.formatCoordinate(item.lon)
          };
        });
      } catch (error) {
        console.error("Fehler bei der Adresssuche:", error);
      }
    },
    async selectAddress(suggestion) {
      this.user.address = suggestion.display;
      this.user.latitude = this.formatCoordinate(suggestion.lat);
      this.user.longitude = this.formatCoordinate(suggestion.lon);
      this.addressQuery = suggestion.display;
      this.addressSuggestions = [];
      this.addressError = "";
    },
    hideSuggestions() {
      setTimeout(() => {
        this.addressSuggestions = [];
      }, 200);
    },
    async reverseGeocode(lat, lon) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const address = data.address || {};
        const postcode = address.postcode || "";
        const city = address.city || address.town || address.village || "";
        const country = address.country || "";
        this.user.address = `${postcode} ${city}, ${country}`;
        this.addressQuery = `${postcode} ${city}, ${country}`;
      } catch (error) {
        console.error("Fehler bei der Reverse-Geokodierung:", error);
      }
    },

    openChangePasswordModal() {
      this.showPasswordModal = true;
      this.passwordChangeError = "";
      this.passwordChangeSuccess = "";
    },
    closeChangePasswordModal() {
      this.showPasswordModal = false;
      this.passwordData = {
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      };
      this.passwordChangeError = "";
      this.passwordChangeSuccess = "";
    },

    openChangeEmailModal() {
      this.showEmailModal = true;
      this.emailChangeError = "";
      this.emailChangeSuccess = "";
    },
    closeChangeEmailModal() {
      this.showEmailModal = false;
      this.emailData = {
        newEmail: "",
        confirmNewEmail: "",
        currentPassword: ""
      };
      this.emailChangeError = "";
      this.emailChangeSuccess = "";
    }
  },
  mounted() {
    this.fetchUserData();
  }
};
</script>

<style scoped>
.user-profile {
  max-width: 300px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  place-content: center;
  display: grid;
}

h1 {
  text-align: center;
  margin-bottom: 1rem;
}

/* Edit user data */
.userdata-edit-button {
  display: inline-block;
  margin: 0.5rem 0.5rem 1rem 0;
  padding: 0.5rem 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.userdata-edit-button:hover {
  background-color: #28a745;
}

/* Delete account */
.delete-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #8b0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #a52a2a;
}

/* edit e-mail and password button */
.edit-button {
  display: inline-block;
  padding: 0.7rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.edit-button:hover {
  background-color: #0056b3;
}

/* Save button */
.save-button {
  padding: 0.5rem 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

.save-button:disabled {
  background-color: #94d3a2;
  cursor: not-allowed;
}

/* Cancel button */
.cancel-button {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Form groups */
.form-group {
  margin-bottom: 1rem;
}

.form-group input[disabled] {
  background-color: #e9ecef;
  cursor: not-allowed;
}

/* Label & Input */
label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Obligatory field */
.required {
  color: red;
}

/* Error & success messages */
.error-message {
  color: red;
  margin-bottom: 1rem;
}

.success-message {
  color: green;
  margin-bottom: 1rem;
}

/* suggestions-list (Autocomplete) */
.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  border-top: none;
  max-height: 150px;
  overflow-y: auto;
  background-color: #fff;
  position: absolute;
  width: calc(100% - 1rem);
  z-index: 1001;
}

.suggestions-list li {
  padding: 0.5rem;
  cursor: pointer;
}

.suggestions-list li:hover {
  background-color: #f0f0f0;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  width: 90%;
  max-width: 500px;
  padding: 2rem;
  border-radius: 8px;
  position: relative;
}

.modal-content h2 {
  margin-top: 0;
}

/* Change color for password requests */
.password-requirements p {
  margin: 0.25rem 0;
  color: red;
}

.password-requirements p.valid {
  color: green;
}

/* Edit container for e-mail and PW in the form */
.edit-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.edit-container input[disabled] {
  background-color: #e9ecef;
  cursor: not-allowed;
}

/* Popup window design */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

.popup-content {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.popup-content p {
  margin-bottom: 1rem;
}

.popup-content button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.popup-content button:hover {
  background-color: #0056b3;
}
</style>
