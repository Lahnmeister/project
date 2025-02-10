<template>
  <form action="" method="POST" class="form-container">
    <h2 class="formbold-form-title">Baumregistrierung</h2>

    <div class="formbold-input-flex">
      <label class="formbold-form-label">Baumart</label>
      <input v-model="formData.tree_type" placeholder="Baumart" class="formbold-form-input" required />
    </div>

    <div class="formbold-input-flex">
      <div>
        <label for="inclination" class="formbold-form-label">Neigung</label>
        <input type="number" name="inclination-in-degrees" id="inclination-in-degrees" class="formbold-form-input" />
      </div>
    </div>

    <label class="formbold-form-label">Neigung</label>
    <input v-model="formData.measurement.inclination" placeholder="Neigung" min="1" max="89" type="number"
      class="formbold-form-input" required />

    <label class="formbold-form-label">Durchmesser des Stamms</label>
    <input v-model="formData.measurement.trunk_diameter" placeholder="Durchmesser des Stamms" min="1" type="number"
      class="formbold-form-input" required />

    <label class="formbold-form-label">Notiz</label>
    <input v-model="formData.measurement.notes" placeholder="Notiz" />


    <input type="file" @change="handleFileUpload($event, 0)" />
    <input type="file" @change="handleFileUpload($event, 1)" />

    <div v-if="location">
      <iframe :src="iframeUrl" style="border: 1px solid black"></iframe>
      <br />
    </div>
    <button type="submit">Absenden</button>
  </form>
</template>

<script>
import { Geolocation } from '@capacitor/geolocation';

export default {
  name: 'DistanceForm',
  data() {
    return {
      distance: '',
      submitted: false,
      location: null,
    };
  },
  computed: {
    iframeUrl() {
      const { latitude, longitude } = this.location;
      return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude}%2C${latitude}%2C${longitude}%2C${latitude}&layer=mapnik&marker=${latitude}%2C${longitude}`;
    }
  },
  methods: {
    async handleSubmit() {
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

    async getLocation() {
      try {
        const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
        if (position.coords) {
          this.location = position.coords;
        }
      } catch (error) {
        console.log("Test");
      }
    }
  },
  created: function () {
    this.getLocation()
  }
}
</script>

<style scoped>
@import './style.css';
</style>
