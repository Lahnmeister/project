<template>
  <div>
    <Tutorial />
    <div class="form-container">
      <h1>Distanz zum Baum und Standort</h1>

      <!-- Hinweis zur Baumhoehenmesser-App -->
      <div class="app-info">
        <p>
          Hinweis: Um die Höhe des Baumes zu ermitteln, nutzen Sie bitte die App
          <a href="https://baumhoehenmesser.en.aptoide.com/app" target="_blank" rel="noopener">
            Baumhoehenmesser
          </a>.
          Um optimale Bilder zu erstellen, sollte die ermittelte Baumhöhe der Distanz entsprechen, die Sie im folgenden
          Feld berechnen.
        </p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="steps">Anzahl der Schritte: </label>
          <input type="number" id="steps" v-model.number="steps" @input="onInputChange" required min="0" step="1"
            placeholder="z. B. 3" />
        </div>
      </form>

      <!--<div class="form-group">
        <button @click="getLocation" class="location-button">Standort abrufen</button>
      </div>

      <div>
        <p>Uhrzeit: {{ time }} </p>
      </div>

      <div v-if="location">
        <p>Standort: {{ location.latitude }}°, {{ location.longitude }}°</p>
        <p>Abweichung: {{ location.accuracy }} Meter</p>
      </div>-->

      <div v-if="submitted">
        <p>Die berechnete Distanz zum Baum beträgt: <strong>{{ calculatedDistance }} Meter</strong></p>
      </div>

      <!-- Anzeige der Karte -->
      <div class="map-container" v-if="location">
        <h2>Karte mit Standort</h2>
        <iframe :src="iframeUrl" width="425" height="350" style="border: 1px solid black"></iframe>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import { Geolocation } from '@capacitor/geolocation';
import Tutorial from '@/components/FirstTutorial.vue';

export default {
  name: 'DistanceForm',
  components: {
    Tutorial,
  },
  data() {
    return {
      steps: '',
      submitted: false,
      location: null,
      time: null,
    };
  },
  computed: {
    calculatedDistance() {
      const stepLenght = parseFloat(localStorage.getItem("step_size") || "0") / 100;
      return (this.steps * stepLenght).toFixed(2);
    },
    iframeUrl() {
      const { latitude, longitude } = this.location;
      return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude}%2C${latitude}%2C${longitude}%2C${latitude}&layer=mapnik&marker=${latitude}%2C${longitude}`;
    },
  },
  mounted() {
    this.getTimeByIP();
  },
  methods: {
    async getTimeByIP() {
      try {
        const response = await fetch("http://worldtimeapi.org/api/ip");
        const data = await response.json();
        this.time = data.datetime;
      } catch (error) {
        setTimeout(this.getTimeByIP, 5000);
      }
    },
    async getLocation() {
      try {
        const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
        if (position.coords) {
          this.location = position.coords;
        }
      } catch (error) {
        console.log("Fehler beim Abrufen des Standorts");
      }
    },
    onInputChange() {
      this.submitted = true;
    },
    // handleSubmit könnte hier implementiert werden, falls erforderlich
  },
};
</script>

<style scoped>
@import './style.css';

.form-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
}

form {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}



.app-info {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f0f8ff;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
}

.app-info a {
  color: #007bff;
  text-decoration: none;
}

.app-info a:hover {
  text-decoration: underline;
}
</style>
