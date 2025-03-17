<template>

  <form class="form-container" @submit.prevent="submitForm">
    <h2 class="formbold-form-title">Baumregistrierung</h2>

    <div class="formbold-input-flex">
      <label class="formbold-form-label">Baumart</label>
      <select v-model="formData.tree_type_id" class="formbold-form-input" required>
        <option value="" disabled>Bitte Baumart wählen</option>
        <option v-for="tree in dropDownList" :key="tree.id" :value="tree.id">
          {{ tree.name }}
        </option>
      </select>

    </div>

    <label class="formbold-form-label">Höhe des Baumes</label>
    <input v-model="formData.measurement.height" placeholder="Höhe" min="1" type="number" class="formbold-form-input"
      required />

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


//const token = localStorage.getItem("token");


export default {
  data() {
    return {
      dropDownList: [],
      location: null,
      formData: {
        tree_type_id: 0,
        latitude: 0,
        longitude: 0,
        health_status_id: 1,
        measurement: {
          height: 0,
          inclination: 0,
          trunk_diameter: 0,
          notes: null,
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
    async fetchTreeTypes() {
      try {
        const response = await fetch("https://treescope.cs.hs-fulda.de/api/v1/trees/types", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",  // API erwartet JSON-Daten
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          console.log("Fehler beim Abrufen der Baumarten");
        }

        const data = await response.json();
        console.log("Baumarten vom Server:", data);

        this.dropDownList = data.tree_types || [];

      } catch (error) {
        console.error("Fehler beim Abrufen der Baumarten:", error);
        this.dropDownList = []; // Setze eine leere Liste als Fallback
      }
    },
    async getLocation() {
      try {
        const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
        if (position.coords) {
          // Runden auf maximal sechs Nachkommastellen
          this.location = position.coords;
          this.formData.latitude = Number(this.location.latitude.toFixed(6));
          this.formData.longitude = Number(this.location.longitude.toFixed(6));
        }
      } catch (error) {
        console.log("GeoLocation konnte nicht abgerufen werden:", error);
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
  created: function () {
    this.getLocation()
    this.fetchTreeTypes()
  }
};
</script>


<script setup>
import { onMounted } from "vue";
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
