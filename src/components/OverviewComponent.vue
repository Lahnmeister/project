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
              <img :src="tree.imageUrl" alt="Bild von {{ tree.species }}" class="tree-image" />
            </td>
            <td>{{ tree.species }}</td>
            <td>{{ tree.location }}</td>
            <td>{{ tree.date }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Unsichtbares Datumselement -->
      <input
        type="date"
        ref="dateInput"
        v-model="selectedDate"
        @change="updateFilteredTrees"
        style="visibility: hidden; position: absolute;"
      />

      <!-- Tree species dropdown -->
      <div
        class="dropdown-container hover-dropdown"
        v-if="dropdownOpen === 'species'"
        :style="dropdownPosition"
        @click.stop
      >
        <div class="dropdown-menu small-dropdown">
          <input
            type="text"
            v-model="speciesSearch"
            placeholder="Suchen..."
            class="dropdown-search"
          />
          <label>
            <input type="checkbox" v-model="selectAllSpecies" @change="toggleSelectAllSpecies" />
            Alles auswählen
          </label>
          <div class="checkbox-list">
            <div v-for="species in filteredSpecies" :key="species">
              <label>
                <input
                  type="checkbox"
                  v-model="selectedSpecies"
                  :value="species"
                  @change="updateFilteredTrees"
                />
                {{ species }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Location dropdown -->
      <div
        class="dropdown-container hover-dropdown"
        v-if="dropdownOpen === 'location'"
        :style="dropdownPosition"
        @click.stop
      >
        <div class="dropdown-menu small-dropdown">
          <input
            type="text"
            v-model="locationSearch"
            placeholder="Suchen..."
            class="dropdown-search"
          />
          <label>
            <input
              type="checkbox"
              v-model="selectAllLocations"
              @change="toggleSelectAllLocations"
            />
            Alles auswählen
          </label>
          <div class="checkbox-list">
            <div v-for="location in filteredLocations" :key="location">
              <label>
                <input
                  type="checkbox"
                  v-model="selectedLocations"
                  :value="location"
                  @change="updateFilteredTrees"
                />
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
  data() {
    return {
      selectedDate: '',
      selectedSpecies: [],
      selectedLocations: [],
      selectAllSpecies: false,
      selectAllLocations: false,
      speciesSearch: '',
      locationSearch: '',
      dropdownOpen: null, // 'species' or 'location'
      calendarOpen: false,
      dropdownPosition: {},
      filteredTrees: [],
      trees: [
        { id: 1, species: 'Eiche', height: 15.5, location: 'Fulda', date: '2024-12-01', imageUrl: require('@/assets/img/Eiche.jpg') },
        { id: 2, species: 'Buche', height: 20.2, location: 'Berlin', date: '2024-11-20', imageUrl: require('@/assets/img/Buche.jpg') },
        { id: 3, species: 'Ahorn', height: 10.8, location: 'Hamburg', date: '2024-12-05', imageUrl: require('@/assets/img/Ahorn.jpg') },
        { id: 4, species: 'Kirsche', height: 30.2, location: 'München', date: '2024-12-05', imageUrl: require('@/assets/img/Kirsche.jpg') }
      ]
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
      return [...new Set(this.trees.map(tree => tree.species))];
    },
    uniqueLocations() {
      return [...new Set(this.trees.map(tree => tree.location))];
    },
    averageHeight() {
      if (!this.filteredTrees.length) return 0;
      const totalHeight = this.filteredTrees.reduce((sum, tree) => sum + tree.height, 0);
      return (totalHeight / this.filteredTrees.length).toFixed(2);
    }
  },
  methods: {
    openNativeDatePicker() {
      this.$nextTick(() => {
        if (this.$refs.dateInput.showPicker) {
          this.$refs.dateInput.showPicker();
        } else {
          this.$refs.dateInput.focus();
        }
      });
    },
    toggleDropdown(type, event) {
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
        const matchesDate = this.selectedDate ? tree.date === this.selectedDate : true;
        const matchesSpecies = this.selectedSpecies.length
          ? this.selectedSpecies.includes(tree.species)
          : true;
        const matchesLocation = this.selectedLocations.length
          ? this.selectedLocations.includes(tree.location)
          : true;
        return matchesDate && matchesSpecies && matchesLocation;
      });
    },
    closeDropdowns() {
      this.dropdownOpen = null;
      this.calendarOpen = false;
    },   

    setDropdownPosition(event) {
      // Stelle sicher, dass das Dropdown relativ zum <th>-Element ausgerichtet wird
      const header = event.target.closest('th'); // Findet das übergeordnete th-Element
      const rect = header.getBoundingClientRect(); // Position des th-Elements
      const dropdownHeight = 250;

      const top = rect.bottom + window.scrollY - 200; // Basis für die vertikale Position
      const left = rect.left + window.scrollX; // Horizontale Position

      this.dropdownPosition = {
        top: `${top}px`,
        left: `${left}px`,
      };

      // Prüfen, ob das Dropdown aus dem Fenster ragt
      if (top + dropdownHeight > window.innerHeight) {
        this.dropdownPosition.top = `${rect.top + window.scrollY - dropdownHeight}px`;
      }

      if (left + 250 > window.innerWidth) {
        this.dropdownPosition.left = `${rect.left + window.scrollX - 250}px`;
      }
    }
  },
  created() {
    this.updateFilteredTrees();
  },
};
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

th, td {
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
  width: 75px;
  height: 75px;
  object-fit: cover;
}

.calendar-container {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  width: 250px;
}
</style>
