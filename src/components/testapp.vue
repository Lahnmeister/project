<template>
  <div class="form-container">
    <h1>Distanz zum Baum und Standort</h1>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="distance">Distanz zum Baum</label>
        <input type="number" id="distance" v-model="distance" required min="0" step="0.1" placeholder="z. B. 5" />
      </div>

      <div class="form-group">
        <button type="submit" class="submit-button">Absenden</button>
      </div>
    </form>

    <div class="form-group">
      <button @click="getLocation" class="location-button">Standort abrufen</button>
    </div>

    <div v-if="location">
      <p>Standort: {{ location.latitude }}°, {{ location.longitude }}°</p>
      <p>Abweichung: {{ location.accuracy }} Meter</p>
    </div>

    <div v-if="submitted">
      <p>Die eingegebene Distanz zum Baum beträgt: <strong>{{ distance }} Meter</strong></p>
    </div>

    <!-- Anzeige der Karte -->
    <div class="map-container" v-if="location">
      <h2>Karte mit Standort</h2>
      <iframe :src="iframeUrl" width="425" height="350" style="border: 1px solid black"></iframe>
      <br />
    </div>

  </div>
</template>

<script>
import { Geolocation } from '@capacitor/geolocation';

export default {
  name: 'DistanceForm',
  data() {
    // Initialisierung
    return {
      distance: '',
      submitted: false,
      location: null,
    };
  },
  computed: {
    // Karte mit gegebenem Standort ausgeben
    iframeUrl() {
      const { latitude, longitude } = this.location;
      return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude}%2C${latitude}%2C${longitude}%2C${latitude}&layer=mapnik&marker=${latitude}%2C${longitude}`;
    }
  },
  methods: {
    async handleSubmit() {
      // Umschreiben der JSON
      this.submitted = true;
      const data = {
        distance: this.distance,
        location: {
          latitude: this.location.latitude,
          longitude: this.location.longitude,
          accuracy: this.location.accuracy,
        },
      };

      const jsonData = JSON.stringify(data, null, 2);

      const blob = new Blob([jsonData], { type: 'application/json' });

      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'data.json';
      a.click();
      URL.revokeObjectURL(a.href);
    },

    // Standort abrufen
    async getLocation() {
      try {
        const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
        if (position.coords) {
          this.location = position.coords;
        } else {
          console.log("Test");
        }
      } catch (error) {
        console.log("Test");
      }
    }
  }
};
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
  display: block;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button.submit-button,
.location-button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

button.submit-button:hover,
.location-button:hover {
  background-color: #45a049;
}

div p {
  text-align: center;
  font-size: 18px;
  color: #333;
}

.map-container {
  margin-top: 20px;
  text-align: center;
}

.map-container h2 {
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.map-image {
  width: 100%;
  max-width: 450px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
