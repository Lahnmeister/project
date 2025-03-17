<template>
  <Tutorial />
  <form class="form-container" @submit.prevent="submitForm">
    <h2 class="formbold-form-title">Baumregistrierung</h2>

    <div class="formbold-input-flex">
      <label class="formbold-form-label with-tooltip">
        Baumart
        <img src="@/assets/icon/info-icon.svg" class="info-icon" alt="Info" @click.stop="toggleTooltip('tree_type')" />
        <span v-if="activeTooltip === 'tree_type'" class="tooltip-text">
          Wähle die Baumart aus der Liste aus.
        </span>
      </label>
      <select v-model="formData.tree_type_id" class="formbold-form-input" required>
        <option value="" disabled>Bitte Baumart wählen</option>
        <option v-for="tree in dropDownList" :key="tree.id" :value="tree.id">
          {{ tree.name }}
        </option>
      </select>
    </div>

    <label class="formbold-form-label with-tooltip">
      Höhe des Baumes (m)
      <img src="@/assets/icon/info-icon.svg" class="info-icon" alt="Info" @click.stop="toggleTooltip('height')" />
      <span v-if="activeTooltip === 'height'" class="tooltip-text">
        Gib die Höhe des Baums in Metern an.
      </span>
    </label>
    <input v-model="formData.measurement.height" placeholder="Höhe" min="1" type="number" class="formbold-form-input"
      required />

    <label class="formbold-form-label with-tooltip">
      Neigung (Grad)
      <img src="@/assets/icon/info-icon.svg" class="info-icon" alt="Info" @click.stop="toggleTooltip('inclination')" />
      <span v-if="activeTooltip === 'inclination'" class="tooltip-text">
        Trage die Neigung des Baums <br> in Grad ein (0-89).
      </span>
    </label>
    <input v-model="formData.measurement.inclination" placeholder="Neigung" min="0" max="89" type="number"
      class="formbold-form-input" required />

    <label class="formbold-form-label with-tooltip">
      Durchmesser des Stamms (cm)
      <img src="@/assets/icon/info-icon.svg" class="info-icon" alt="Info" @click.stop="toggleTooltip('trunk')" />
      <span v-if="activeTooltip === 'trunk'" class="tooltip-text">
        Miss den Stammdurchmesser in Zentimetern auf Brusthöhe.
      </span>
    </label>
    <input v-model="formData.measurement.trunk_diameter" placeholder="Durchmesser des Stamms" min="1" type="number"
      class="formbold-form-input" required />

    <label class="formbold-form-label with-tooltip">
      Notiz
      <img src="@/assets/icon/info-icon.svg" class="info-icon" alt="Info" @click.stop="toggleTooltip('notes')" />
      <span v-if="activeTooltip === 'notes'" class="tooltip-text">
        Hier kannst du eine optionale Notiz zum Baum hinterlassen.
      </span>
    </label>
    <input class="formbold-form-input" v-model="formData.measurement.notes" placeholder="Notiz" />

    <input type="file" @change="handleFileUpload($event, 0)" />
    <input type="file" @change="handleFileUpload($event, 1)" />

    <div v-if="location">
      <iframe :src="iframeUrl" style="border: 1px solid black"></iframe>
      <br />
    </div>
    <button type="submit" :disabled="isDisabled">Absenden</button>
  </form>
</template>

<script>
import { Geolocation } from '@capacitor/geolocation';
import Tutorial from '@/components/FirstTutorial.vue';

export default {
  components: {
    Tutorial,
  },
  data() {
    return {
      dropDownList: [],
      location: null,
      activeTooltip: null,
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
        files: [],
      },
    };
  },
  computed: {
    iframeUrl() {
      const { latitude, longitude } = this.location;
      return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude}%2C${latitude}%2C${longitude}%2C${latitude}&layer=mapnik&marker=${latitude}%2C${longitude}`;
    },
    isDisabled: function () {
      return (this.formData.latitude === 0 && this.formData.latitude === 0);
    }
  },
  methods: {
    toggleTooltip(field) {
      this.activeTooltip = this.activeTooltip === field ? null : field;
    },
    handleClickOutside(event) {
      const tooltipElements = document.querySelectorAll('.with-tooltip');
      const clickedInside = Array.from(tooltipElements).some(el => el.contains(event.target));
      if (!clickedInside) {
        this.activeTooltip = null;
      }
    },
    async submitForm() {
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.setItem("pendingTreeData", JSON.stringify(this.formData));
        alert("Sie müssen sich anmelden, um einen Baum zu registrieren.");
        this.$router.push("/login");
        return;
      }

      try {
        console.log(JSON.stringify(this.formData));
        const response = await fetch("https://treescope.cs.hs-fulda.de/api/v1/trees/create-tree", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(this.formData),
        });

        const result = await response.json();
        console.log("Antwort vom Server:", result);
        if (response.ok) {
          alert("Baum erfolgreich registriert!");
          this.resetFormData();
          localStorage.removeItem("pendingTreeData");
        } else {
          alert("Fehler beim Registrieren des Baums: " + result.message);
        }
      } catch (error) {
        console.error("Fehler beim Senden des Formulars:", error);
        alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
      }
    },
    resetFormData() {
      this.formData = {
        tree_type_id: 0,
        latitude: this.formData.latitude,
        longitude: this.formData.longitude,
        health_status_id: 1,
        measurement: {
          height: 0,
          inclination: 0,
          trunk_diameter: 0,
          notes: null,
        },
        files: [],
      };
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => (input.value = ""));
    },
    async fetchTreeTypes() {
      try {
        const response = await fetch("https://treescope.cs.hs-fulda.de/api/v1/trees/types", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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
        this.dropDownList = [];
      }
    },
    async getLocation() {
      try {
        const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
        if (position.coords) {
          this.location = position.coords;
          this.formData.latitude = Number(this.location.latitude.toFixed(6));
          this.formData.longitude = Number(this.location.longitude.toFixed(6));
        }
      } catch (error) {
        console.log("GeoLocation konnte nicht abgerufen werden:", error);
        alert("Standort konnte nicht bestimmt werden. Bitte versuche es erneut oder aktiviere den Standortdienst.")
      }
    },
    addFileInput() {
      this.formData.files.push({ filename: "", photo_data: "", description: "" });
    },
    handleFileUpload(event, index) {
      this.addFileInput();
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.formData.files[index].filename = file.name;
        this.formData.files[index].photo_data = reader.result;
      };

      reader.onerror = (error) => {
        console.error("Fehler beim Lesen der Datei:", error);
      };
    },
  },
  created() {
    this.getLocation();
    this.fetchTreeTypes();
    const pendingData = localStorage.getItem("pendingTreeData");
    const token = localStorage.getItem("token");
    if (pendingData && token) {
      this.formData = JSON.parse(pendingData);
      localStorage.removeItem("pendingTreeData");
      this.submitForm();
    }
    document.addEventListener('click', this.handleClickOutside);
  },
  unmounted() {
    document.removeEventListener('click', this.handleClickOutside);
  }

};
</script>

<style scoped>
@import './style.css';

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

.form-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.formbold-form-title {
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #343a40;
}

.formbold-form-label {
  font-weight: 600;
  margin-top: 1rem;
  display: block;
  color: #495057;
  position: relative;
}

.formbold-form-input {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border 0.3s ease;
}

.formbold-form-input:focus {
  border-color: #0d6efd;
  outline: none;
}

button[type="submit"] {
  width: 100%;
  background-color: #28a745;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: background-color 0.3s;
}

button[type="submit"]:disabled {
  background-color: #218838;
  opacity: 0.6;
  cursor: not-allowed;
}

button[type="submit"]:hover {
  background-color: #218838;
}

input[type="file"] {
  margin: 0.5rem 0;
}

iframe {
  width: 100%;
  height: 300px;
  margin-top: 1rem;
  border-radius: 0.5rem;
}

.info-icon {
  width: 16px;
  height: 16px;
  margin-left: 0.5rem;
  cursor: pointer;
  vertical-align: middle;
  filter: brightness(0) saturate(100%) invert(29%) sepia(99%) saturate(647%) hue-rotate(72deg) brightness(95%) contrast(94%);
}

.tooltip-text {
  display: block;
  background-color: #333;
  color: #fff;
  padding: 0.5rem;
  border-radius: 5px;
  position: absolute;
  z-index: 10;
  top: 100%;
  left: 0;
  width: max-content;
  max-width: 300px;
  margin-top: 0.3rem;
  font-size: 0.875rem;
  line-height: 1.2;
}

@media (max-width: 600px) {
  .form-container {
    margin: 1rem;
    padding: 1rem;
  }

  .formbold-form-title {
    font-size: 1.5rem;
  }

  button[type="submit"] {
    font-size: 1rem;
  }
}
</style>
