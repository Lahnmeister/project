<template>
  <div @click="closeDropdowns">
    <h1>Meine gemessenen Bäume</h1>

    <!-- Statistics -->
    <div>
      <p>Gesamtanzahl der Bäume: {{ filteredTrees.length }}</p>
      <p>Durchschnittliche Höhe: {{ averageHeight }} m</p>
    </div>

    <!-- Table -->
    <div class="table-wrapper">
      <table class="table-ui">
        <thead>
          <tr>
            <th>Bild</th>
            <th @click.stop="toggleDropdown('species', $event)">
              Baumart <span class="dropdown-arrow">&#9660;</span>
            </th>
            <th>CO₂ gespeichert</th>
            <th @click.stop="toggleDropdown('location', $event)">
              Standort <span class="dropdown-arrow">&#9660;</span>
            </th>
            <th @click="openNativeDatePicker">
              Datum <img src="@/assets/icon/calendar.svg" alt="" class="calendar-icon" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tree in filteredTrees" :key="tree.id">
            <td>
              <template v-if="getImageUrl(tree)">
                <img :src="getImageUrl(tree)" alt="Bild von {{ tree.tree_type.name }}" class="tree-image" />
              </template>
              <template v-else>
                Kein Bild vorhanden
              </template>
            </td>
            <td>{{ `${tree.tree_type.name} (${tree.tree_type.scientific_name})` }}</td>
            <td>{{ tree.co2_stored.toFixed(2) }} kg</td>
            <!-- Method Getlocation called -->
            <td>{{ getLocation(tree) }}</td>
            <td>{{ formatDate(tree.created_at) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Date element -->
      <input type="date" ref="dateInput" v-model="selectedDate" @change="updateFilteredTrees"
        style="visibility: hidden; position: absolute;" />

      <!-- Dropdown for tree species -->
      <div class="dropdown-container hover-dropdown" v-if="dropdownOpen === 'species'" :style="dropdownPosition"
        @click.stop>
        <div class="dropdown-menu small-dropdown">
          <input type="text" v-model="speciesSearch" placeholder="Suchen..." class="dropdown-search" />
          <label>
            <input type="checkbox" v-model="selectAllSpecies" @change="toggleSelectAllSpecies" />
            Alles auswählen
          </label>
          <div class="checkbox-list">
            <div v-for="species in filteredSpecies" :key="species">
              <label>
                <input type="checkbox" v-model="selectedSpecies" :value="species" @change="updateFilteredTrees" />
                {{ species }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Dropdown for locations -->
      <div class="dropdown-container hover-dropdown" v-if="dropdownOpen === 'location'" :style="dropdownPosition"
        @click.stop>
        <div class="dropdown-menu small-dropdown">
          <input type="text" v-model="locationSearch" placeholder="Suchen..." class="dropdown-search" />
          <label>
            <input type="checkbox" v-model="selectAllLocations" @change="toggleSelectAllLocations" />
            Alles auswählen
          </label>
          <div class="checkbox-list">
            <div v-for="location in filteredLocations" :key="location">
              <label>
                <input type="checkbox" v-model="selectedLocations" :value="location" @change="updateFilteredTrees" />
                {{ location }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableView",
  data() {
    return {
      selectedDate: "",
      selectedSpecies: [],
      selectedLocations: [],
      selectAllSpecies: false,
      selectAllLocations: false,
      speciesSearch: "",
      locationSearch: "",
      dropdownOpen: null,
      calendarOpen: false,
      dropdownPosition: {},
      filteredTrees: [],
      trees: []
    };
  },
  computed: {
    filteredSpecies() {
      return this.uniqueSpecies.filter(species =>
        species.toLowerCase().includes(this.speciesSearch.toLowerCase())
      );
    },
    filteredLocations() {
      return this.uniqueLocations.filter(location =>
        location.toLowerCase().includes(this.locationSearch.toLowerCase())
      );
    },
    uniqueSpecies() {
      return [...new Set(this.trees.map(tree => tree.tree_type.name))];
    },
    uniqueLocations() {
      return [
        ...new Set(
          this.trees.map(
            tree => tree.locationName || (tree.latitude + ", " + tree.longitude)
          )
        )
      ];
    },
    averageHeight() {
      if (!this.filteredTrees.length) return 0;
      // Calculate the average
      const totalHeight = this.filteredTrees.reduce((sum, tree) => {
        return sum + Number(tree.height);
      }, 0);
      return (totalHeight / this.filteredTrees.length).toFixed(2);
    }
  },
  methods: {
    openNativeDatePicker() {
      if (this.filteredTrees.length === 0) return;
      this.$nextTick(() => {
        if (this.$refs.dateInput.showPicker) {
          this.$refs.dateInput.showPicker();
        } else {
          this.$refs.dateInput.focus();
        }
      });
    },
    toggleDropdown(type, event) {
      if (this.filteredTrees.length === 0) return;
      this.dropdownOpen = this.dropdownOpen === type ? null : type;
      this.calendarOpen = false;
      this.setDropdownPosition(event);
    },
    toggleSelectAllSpecies() {
      this.selectedSpecies = this.selectAllSpecies ? [...this.uniqueSpecies] : [];
      this.updateFilteredTrees();
    },
    toggleSelectAllLocations() {
      this.selectedLocations = this.selectAllLocations ? [...this.uniqueLocations] : [];
      this.updateFilteredTrees();
    },
    updateFilteredTrees() {
      this.filteredTrees = this.trees.filter(tree => {
        const treeDate = tree.created_at ? tree.created_at.substring(0, 10) : "";
        const matchesDate = this.selectedDate ? treeDate === this.selectedDate : true;
        const matchesSpecies = this.selectedSpecies.length
          ? this.selectedSpecies.includes(tree.tree_type.name)
          : true;
        const treeLocation = tree.locationName || (tree.latitude + ", " + tree.longitude);
        const matchesLocation = this.selectedLocations.length
          ? this.selectedLocations.includes(treeLocation)
          : true;
        return matchesDate && matchesSpecies && matchesLocation;
      });
    },
    closeDropdowns() {
      this.dropdownOpen = null;
      this.calendarOpen = false;
    },
    setDropdownPosition(event) {
      const header = event.target.closest("th");
      const rect = header.getBoundingClientRect();
      const dropdownHeight = 250;
      let top = rect.bottom + window.scrollY - 200;
      let left = rect.left + window.scrollX;
      if (top + dropdownHeight > window.innerHeight) {
        top = rect.top + window.scrollY - dropdownHeight;
      }
      if (left + 250 > window.innerWidth) {
        left = rect.left + window.scrollX - 250;
      }
      this.dropdownPosition = {
        top: `${top}px`,
        left: `${left}px`
      };
    },
    async fetchTrees() {
      try {
        const token = localStorage.getItem("token");
        const url = "https://treescope.cs.hs-fulda.de/api/v1/trees/user-tree";
        const response = await fetch(url, {
          method: "GET",
          headers: {
            accept: "application/json",
            ...(token && { Authorization: `Bearer ${token}` })
          }
        });
        if (!response.ok) {
          console.error("Fehler beim Laden der Baumdaten");
          return;
        }
        const data = await response.json();
        console.log("Serverantwort:", data);
        let allTrees = data.trees || [];
        const currentUserId = this.getCurrentUserId(token);
        // Filters the trees of the registered user
        this.trees = allTrees.filter(tree =>
          tree.initial_creator_id === currentUserId &&
          tree.latitude && tree.longitude &&
          !isNaN(parseFloat(tree.latitude)) && !isNaN(parseFloat(tree.longitude))
        );
        //Set measurements, reverse geocoding and image
        await Promise.all(
          this.trees.map(async (tree) => {
            const measurement = (tree.measurements && tree.measurements.length > 0)
              ? tree.measurements[0]
              : null;
            tree.height = measurement ? measurement.height : "";
            tree.locationName = await this.reverseGeocode(parseFloat(tree.latitude), parseFloat(tree.longitude));
            tree.imageUrl = this.getImageUrl(tree);
          })
        );
        this.updateFilteredTrees();
        this.addMarkers();
      } catch (error) {
        console.error("Netzwerkfehler:", error);
      }
    },
    getCurrentUserId(token) {
      if (!token) return null;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
      } catch (error) {
        console.error("Fehler beim Auslesen der Benutzer-ID aus dem Token:", error);
        return null;
      }
    },
    async reverseGeocode(lat, lon) {
      try {
        if (!lat || !lon || isNaN(lat) || isNaN(lon)) return "";
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
        );
        const result = await response.json();
        if (result.address) {
          return result.address.city || result.address.town || result.address.village || "";
        }
        return "";
      } catch (error) {
        console.error("Reverse-Geocoding-Fehler:", error);
        return "";
      }
    },
    getImageUrl(tree) {
      // URL for the pictures
      const baseUrl = "https://treescope.cs.hs-fulda.de/static/uploads";
      if (tree.files && tree.files.length > 0 && tree.files[0].photo_path) {
        let photoPath = tree.files[0].photo_path.trim();
        if (photoPath.startsWith("/uploads/")) {
          photoPath = photoPath.replace(/^\/uploads\//, "");
        } else if (photoPath.startsWith("/static/uploads/")) {
          photoPath = photoPath.replace(/^\/static\/uploads\//, "");
        }
        return `${baseUrl}/${photoPath}`;
      }
      return null;
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    },
    addMarkers() {
    },
    //Method for the location edition
    getLocation(tree) {
      if (!tree.locationName || tree.locationName.trim() === "" || tree.locationName.trim() === "0") {
        return "Keine Angabe";
      }
      return tree.locationName;
    }
  },
  created() {
    this.fetchTrees();
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
.table-wrapper {
  position: relative;
}

.dropdown-container {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  width: 250px;
  max-height: 250px;
  overflow-y: auto;
  z-index: 1000;
}

.small-dropdown {
  padding: 5px;
}

.dropdown-search {
  width: 95%;
  padding: 5px;
  margin-bottom: 5px;
}

.checkbox-list label {
  display: block;
  margin-bottom: 5px;
}

.calendar-container {
  position: absolute;
  background: white;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.calendar-icon {
  width: 16px;
  height: 16px;
  margin-left: 5px;
  vertical-align: middle;
}

.table-ui {
  margin-top: 10px;
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 2px solid black;
  text-align: left;
  cursor: default;
}

th {
  position: relative;
  cursor: pointer;
  padding: 10px;
}

.dropdown-arrow {
  font-size: 0.8em;
  margin-left: 5px;
  color: #777;
}

.tree-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>
