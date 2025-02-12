<template>
    <form class="form-container" @submit.prevent="submitForm">
      <h2 class="formbold-form-title">Baumregistrierung</h2>
      
      <div class="formbold-input-flex">
        <label class="formbold-form-label">Baumart</label>
        <input v-model="formData.tree_type" placeholder="Baumart" class="formbold-form-input" required />
      </div>

    <div class="formbold-input-flex">
      <div>
        <label for="phone" class="formbold-form-label">Neigung</label>
        <input
          type="number"
          name="inclination-in-degrees"
          id="inclination-in-degrees"
          class="formbold-form-input"
        />
      </div>
    </div>

    <div class="formbold-input-flex">
      <div>
        <label for="tree1" class="formbold-form-label">Bild Nr. 1</label>
        <input
          type="file"
          name="tree1"
          id="tree1"
          class="formbold-form-input"
        />
      </div>

      <div>
        <label for="tree2" class="formbold-form-label">Bild Nr. 2</label>
        <input
          type="file"
          name="tree2"
          id="tree2"
          class="formbold-form-input"
        />
      </div>
    </div>

    <div class="formbold-input-flex">
      <div>
        <!--<label for="location" class="formbold-form-label">Your location</label>-->
        <div v-if="location">
          <iframe :src="iframeUrl" style="border: 1px solid black"></iframe>
          <br />
        </div>
      </div>
    </div>

    <!--<p class="formbold-policy">
      privacy policy oder so
      <a href="#">privacy policy.</a>
    </p>-->
    <button class="formbold-btn">Register tree</button>
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
        console.log("GeoLocation konnte net bitch");
      }
    }
  },
  created: function(){
    this.getLocation()
  }
}



</script>

<script setup>

import {onMounted } from "vue";
import { useRouter } from "vue-router";

// Variable, um zu prüfen, ob der Benutzer authentifiziert ist
const router = useRouter();
  
  // Überprüfen, ob ein gültiges Token im localStorage vorhanden ist
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        router.push("/"); // Falls kein Token vorhanden ist, zurück zur Login-Seite
        return;
    }
  };
  
  // Beim Laden der Seite die Authentifizierung prüfen
  onMounted(() => {
    checkAuth();
  });

</script>

<style scoped>
@import './style.css';
</style>
