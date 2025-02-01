<template>
 
  <form class="form-container" @submit.prevent="submitForm">
    <h2 class="formbold-form-title">Baumregistrierung</h2>
    
    <div class="formbold-input-flex">
      <label class="formbold-form-label">Baumart</label>
      <input  v-model="formData.tree_type" placeholder="Baumart" class="formbold-form-input" required />
    </div>

    <label class="formbold-form-label">Höhe des Baumes</label>
    <input v-model="formData.measurement.height" placeholder="Höhe" min="1" type="number" class="formbold-form-input" required />

    <label class="formbold-form-label">Neigung</label>
    <input v-model="formData.measurement.inclination" placeholder="Neigung" min="1" max="89" type="number" class="formbold-form-input" required />

    <label class="formbold-form-label">Durchmesser des Stamms</label>
    <input v-model="formData.measurement.trunk_diameter" placeholder="Durchmesser des Stamms" min="1" type="number" class="formbold-form-input" required />

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


//const token = localStorage.getItem("token");


export default {
  data() {
    return {
      formData: {
        tree_type: "",
        latitude: 0,
        longitude: 0,
        health_status: 1,
        measurement: {
          suspected_tree_type: "",
          height: 0,
          inclination: 0,
          trunk_diameter: 0,
          notes: "Notiz",
        },
        files: []
      }
    };
  },
  computed: {
    iframeUrl() {
      const { latitude, longitude } = this.location;
      return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude}%2C${latitude}%2C${longitude}%2C${latitude}&layer=mapnik&marker=${latitude}%2C${longitude}`;
    }
  },
  methods: {
    async submitForm() {
      try {
        this.formData.measurement.suspected_tree_type=this.formData.tree_type;
        console.log(JSON.stringify(this.formData));
        const response = await fetch("https://treescope.cs.hs-fulda.de/api/v1/trees/create-tree", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",  // API erwartet JSON-Daten
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(this.formData)
        });

        const result = await response.json();
        console.log("Antwort vom Server:", result);
      } catch (error) {
        console.error("Fehler beim Senden des Formulars:", error);
      }
    },
    async getLocation() {
      try {
        const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
        if (position.coords) {
          this.location = position.coords;
          this.formData.longitude=this.location.longitude;
          this.formData.latitude=this.location.latitude;

        }
      } catch (error) {
        console.log("GeoLocation konnte net bitch");
      }
    },
    addFileInput() {
      this.formData.files.push({ filename: "", photo_data: "", description: "" });
    },
    handleFileUpload(event, index) {
      this.addFileInput();
      const file = event.target.files[0]; // Greift auf die ausgewählte Datei zu
      if (!file) return; // Falls keine Datei gewählt wurde, nichts tun
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = () => {
        this.formData.files[index].filename = file.name;
        this.formData.files[index].photo_data = reader.result;
      };
      
      reader.onerror = (error) => {
        console.error("Fehler beim Lesen der Datei:", error);
      };
    }
  },
  created: function(){
    this.getLocation()
  }
};
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

