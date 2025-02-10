<template>
  <div v-if="showTutorial" class="tutorial-overlay">

    <div class="tutorial-content" v-if="!showMeasurementTutorial && !showAdditionalPage">
      <h2 v-if="currentPage <= 4">Citizen Science - Baummessung</h2>

      <div v-if="currentPage === 1">
        <h3>Möchten Sie sich jetzt registrieren?</h3>
        <button @click="goToRegistration">Ja</button>

        <button @click="skipAndStartMeasurementTutorial">Nein, später</button>
      </div>

      <div v-else-if="currentPage === 2">
        <h3>Benutzername</h3>
        <p>Suchen Sie sich einen Benutzernamen aus (keine Sonderzeichen oder Zahlen erlaubt):</p>
        <input type="text" v-model="formData.username" placeholder="Benutzername" />
        <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
        <button @click="prevPage">Zurück</button>
        <button @click="nextPage">Weiter</button>
      </div>

      <div v-else-if="currentPage === 3">
        <h3>E-Mail</h3>
        <p>Geben Sie Ihre E-Mail-Adresse ein:</p>
        <input type="email" v-model="formData.email" placeholder="E-Mail" />
        <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
        <button @click="prevPage">Zurück</button>
        <button @click="nextPage">Weiter</button>
      </div>

      <div v-else-if="currentPage === 4">
        <h3>Passwort</h3>
        <p>Wählen Sie ein Passwort aus (mindestens 8 Zeichen):</p>
        <input type="password" v-model="formData.password" placeholder="Passwort" />
        <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
        <button @click="prevPage">Zurück</button>
        <button @click="finishRegistration">Weiter</button>
      </div>

      <div v-else-if="currentPage === 5">
        <h3 v-if="!serverErrorMessage">Die Registrierung ist vollendet!</h3>
        <p v-if="!serverErrorMessage">Du kannst dich nun am Citizen-Science-Projekt beteiligen.</p>
        <h3 v-else>Fehler bei der Registrierung</h3>
        <p v-if="serverErrorMessage" style="color: red;">{{ serverErrorMessage }}</p>
        <button @click="prevPage" v-if="serverErrorMessage">Zurück</button>
        <button @click="closeTutorial" v-else>Schließen</button>
      </div>
    </div>

    <div class="tutorial-content" v-if="showMeasurementTutorial && !showAdditionalPage">
      <h2>Wie misst man einen Baum?</h2>
      <p>Distanz mit Schritten messen</p>

      <h3>Schrittweiten-Tabelle</h3>
      <b>1. Suche deine Körpergröße aus der Tabelle aus und lege einen normalen Schritt zurück</b>
      <table>
        <thead>
          <tr>
            <th>Körpergröße (cm)</th>
            <th>Frauen-Schrittlänge (cm)</th>
            <th>Männer-Schrittlänge (cm)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in stepLengths" :key="index">
            <td>{{ row.height }}</td>
            <td>{{ row.female }}</td>
            <td>{{ row.male }}</td>
          </tr>
        </tbody>
      </table>
      <b>2. Stelle sicher, dass du maximal ± 5 cm Abweichung von deinem erwarteten Durchschnittswert hast</b>
      <br />
      <b>3. Gib an, ob deine Schrittlänge dem erwarteten Wert entspricht:</b>

      <div class="step-length-check">
        <h3>Entspricht deine Schrittlänge dem erwarteten Wert?</h3>
        <p>Bitte wähle:</p>
        <button @click="handleStepLengthYes">Ja</button>
        <button @click="handleStepLengthNo">Nein</button>
      </div>

      <div v-if="stepLengthConfirmed === 'yes'" class="height-input">
        <label for="userHeight">Bitte gib deine Körpergröße in cm an:</label>
        <input type="number" v-model.number="userHeight" placeholder="Körpergröße in cm" id="userHeight" />
        <button @click="confirmHeight">Bestätigen</button>
      </div>

      <div v-if="stepLengthConfirmed === 'no'" class="manual-step-input">
        <label for="manualStepLength">Bitte gib deine Schrittgröße in cm an:</label>
        <input type="number" v-model.number="manualStepLength" placeholder="Schrittgröße in cm" id="manualStepLength" />
        <button @click="confirmManualStep">Bestätigen</button>
      </div>
    </div>

    <div class="tutorial-content" v-if="showAdditionalPage">
      <h2>Weitere Informationen zur Baummessung</h2>
      <h3>Tipps zur Messung</h3>
      <ul>
        <li>Achte bitte darauf, dass die Höhendifferenz zwischen dir und dem Baum möglichst gering ist. Idealerweise
          befindest du dich auf der selben Höhe wie der Baum.</li>
        <li>Mach bitte zwei Bilder. Ein Bild soll die Neigung des Baums dokumentieren, falls diese vorhanden ist. Das
          andere Bild soll keine Neigung enthalten (90 °). Beachte: Zwei Bilder mit Neigungen sind fehlerhaft.</li>
        <li>Halte bitte dein Gerät ungefähr auf der Brusthöhe, wenn du das Bild machen möchtest.</li>
        <li>Achte darauf, dass einige Bäume mehrere Kronen haben können, die möglicherweise höher sind als die anderen.</li>
      </ul>
      <button @click="closeTutorial">Schließen</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      showTutorial: true,
      showMeasurementTutorial: false,
      showAdditionalPage: false,
      currentPage: 1,

      skipRegistration: false,
      formData: {
        username: "",
        email: "",
        password: "",
      },
      errorMessage: "",
      serverErrorMessage: "",
      stepLengthConfirmed: null,
      userHeight: null,
      manualStepLength: null,

      stepLength: null,
      stepLengths: [
        { height: 152, female: 64, male: 64 },
        { height: 155, female: 64, male: 64 },
        { height: 158, female: 66, male: 66 },
        { height: 160, female: 66, male: 66 },
        { height: 165, female: 66, male: 69 },
        { height: 168, female: 69, male: 69 },
        { height: 170, female: 71, male: 71 },
        { height: 173, female: 71, male: 71 },
        { height: 175, female: 71, male: 74 },
        { height: 178, female: 74, male: 74 },
        { height: 180, female: 74, male: 76 },
        { height: 183, female: 76, male: 76 },
        { height: 185, female: 76, male: 76 },
        { height: 188, female: 79, male: 79 },
        { height: 191, female: 79, male: 79 },
        { height: 193, female: 79, male: 81 },
        { height: 196, female: 81, male: 81 }
      ]
    };
  },
  mounted() {
    if (localStorage.getItem("tutorialShown")) {
      this.showTutorial = false;
    }
  },
  methods: {
    nextPage() {
      if (this.currentPage === 2 && !this.validateUsername(this.formData.username)) {
        this.errorMessage = "Der Benutzername darf keine Sonderzeichen oder Zahlen enthalten.";
        return;
      }
      if (this.currentPage === 3 && !this.validateEmail(this.formData.email)) {
        this.errorMessage = "Bitte gib eine gültige E-Mail-Adresse ein.";
        return;
      }
      if (this.currentPage === 4 && !this.validatePassword(this.formData.password)) {
        this.errorMessage = "Das Passwort muss mindestens acht Zeichen lang sein.";
        return;
      }
      this.errorMessage = "";
      if (this.currentPage < 5) {
        this.currentPage++;
      }
    },
    prevPage() {
      this.errorMessage = "";
      this.serverErrorMessage = "";
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    goToRegistration() {
      this.skipRegistration = false;
      this.currentPage = 2;
    },
    skipAndStartMeasurementTutorial() {
      this.skipRegistration = true;
      this.startMeasurementTutorial();
    },
    finishRegistration() {
      if (!this.validatePassword(this.formData.password)) {
        this.errorMessage = "Das Passwort muss mindestens acht Zeichen lang sein.";
        this.currentPage = 4;
        return;
      }
      this.errorMessage = "";
      this.startMeasurementTutorial();
    },
    async registerUser() {
      try {
        const response = await axios.post(
          "https://treescope.cs.hs-fulda.de/auth/register",
          {
            username: this.formData.username,
            email: this.formData.email,
            password: this.formData.password,
            step_length: this.stepLength
          }
        );
        if (response.status === 201) {
          console.log("Registrierung erfolgreich:", response.data);
          this.serverErrorMessage = "";
          this.currentPage = 5;
        } else {
          throw new Error("Unerwarteter Fehler");
        }
      } catch (error) {
        console.error("Fehler bei der Registrierung:", error);
        if (error.response && error.response.status === 403) {
          this.serverErrorMessage = "Diese E-Mail-Adresse oder der Benutzername wird bereits verwendet.";
        } else {
          this.serverErrorMessage = "Es ist ein Fehler aufgetreten. Bitte versuche es erneut.";
        }
        this.currentPage = 5;
      }
    },
    validateUsername(username) {
      const regex = /^[a-zA-Z]+$/;
      return regex.test(username);
    },
    validateEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    },
    validatePassword(password) {
      return password.length >= 8;
    },
    startMeasurementTutorial() {
      this.showMeasurementTutorial = true;
    },
    handleStepLengthYes() {
      this.stepLengthConfirmed = 'yes';
    },
    handleStepLengthNo() {
      this.stepLengthConfirmed = 'no';
    },
    confirmHeight() {
      if (!this.userHeight || this.userHeight <= 0) {
        alert('Bitte geben Sie eine gültige Körpergröße in cm an.');
        return;
      }
      let stepSize;
      const matching = this.stepLengths.find(row => row.height >= this.userHeight);
      if (matching) {
        stepSize = (matching.female + matching.male) / 2;
      } else {
        const last = this.stepLengths[this.stepLengths.length - 1];
        stepSize = (last.female + last.male) / 2;
      }
      this.stepLength = stepSize;
      localStorage.setItem('userHeight', this.userHeight);
      localStorage.setItem('derivedStepSize', stepSize);

      this.showMeasurementTutorial = false;
      if (!this.skipRegistration) {
        this.registerUser();
      } else {
        this.closeTutorial();
      }
    },
    confirmManualStep() {
      if (!this.manualStepLength || this.manualStepLength <= 0) {
        alert("Bitte geben Sie eine gültige Schrittgröße in cm an.");
        return;
      }
      this.stepLength = this.manualStepLength;
      localStorage.setItem('manualStepSize', this.manualStepLength);

      this.showMeasurementTutorial = false;
      if (!this.skipRegistration) {
        this.registerUser();
      } else {
        this.closeTutorial();
      }
    },
    closeTutorial() {
      this.showTutorial = false;
      localStorage.setItem("tutorialShown", "true");
    }
  },
};
</script>

<style>
.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.tutorial-content {
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  width: 80%;
  max-width: 600px;
  max-height: 90%;
  overflow-y: auto;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

button {
  margin: 5px;
}
</style>
