<template>
  <div id="app">
    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Configure standard icons from Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default {
  name: "TreesMap",
  data() {
    return {
      trees: [], 
      map: null,
      markers: [],
    };
  },
  mounted() {
    // Make sure the DOM is completely rendered before the card is initialized
    this.$nextTick(() => {
      this.initMap();
      this.fetchTrees();
    });
  },
  beforeUnmount() {
    // Stop all current animations and remove the card
    if (this.map) {
      this.map.stop();
      this.map.off();
      this.map.remove();
      this.map = null;
    }
  },
  methods: {
    initMap() {
      if (!this.$refs.mapContainer) {
        console.warn("Map-Container ist nicht vorhanden.");
        return;
      }
      if (this.map) {
        console.warn("Die Karte wurde bereits initialisiert.");
        return;
      }
      // Create the map with zoomAnimation disabled to prevent errors on popup close
      this.map = L.map(this.$refs.mapContainer, {
        center: [51.1657, 10.4515], // Centered on Germany
        zoom: 6,
        zoomAnimation: false, //To avoid _animatezoom errors
        minZoom: 2, // Minimum zoom level
        maxBounds: [
          [-90, -180],
          [90, 180]
        ],
        maxBoundsViscosity: 1.0,
      });
      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 19,
        noWrap: true,
      }).addTo(this.map);
    },
    async fetchTrees() {
      try {
        const token = localStorage.getItem("token");

        const url = "https://treescope.cs.hs-fulda.de/api/v1/trees/user-tree-wm";
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

        let allTrees = data.tree_wm || [];
        // Filters trees so that only those of the logged-in user are displayed
        const currentUserId = this.getCurrentUserId(token);
        this.trees = allTrees.filter(tree => tree.initial_creator_id === currentUserId);
        // Transfer height from measurements, perform reverse geocoding and set imageUrl
        await Promise.all(
          this.trees.map(async (tree) => {
            // measurements
            const measurement = (tree.measurements && tree.measurements.length > 0)
              ? tree.measurements[0]
              : null;
            tree.height = measurement ? measurement.height : "Keine Höhe gefunden";
            tree.locationName = await this.reverseGeocode(parseFloat(tree.latitude), parseFloat(tree.longitude));
            tree.imageUrl = this.getImageUrl(tree);
          })
        );
        this.updateFilteredTrees();
        // Add markers to the map
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
    updateFilteredTrees() {
      // Filter by date if several trees are at the same location
      this.filteredTrees = this.trees.filter(tree => {
        const treeDate = tree.created_at ? tree.created_at.substring(0, 10) : "";
        return this.selectedDate ? treeDate === this.selectedDate : true;
      });
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
      // URL for the images 
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
      // Remove existing markers
      this.markers.forEach(marker => this.map.removeLayer(marker));
      this.markers = [];
      if (!this.map) {
        console.warn("Die Karte ist nicht vorhanden. Marker können nicht hinzugefügt werden.");
        return;
      }
      this.trees.forEach((tree) => {
        if (tree.latitude && tree.longitude) {
          const marker = L.marker([tree.latitude, tree.longitude]).addTo(this.map);
          const popupContent = `
            <div style="text-align:center;">
              <h3 style="margin-bottom:0.3em;">${tree.tree_type}</h3>
              <img 
                src="${this.getImageUrl(tree) || ''}"
                alt="${tree.tree_type}"
                style="width:100px; max-height:80px; object-fit:cover; margin-bottom:0.5em;"
              />
              <p style="margin:0;"><strong>Ort:</strong> ${
                tree.locationName
                  ? `${tree.locationName} (${tree.latitude}, ${tree.longitude})`
                  : `${tree.latitude}, ${tree.longitude}`
              }</p>
              <p style="margin:0;"><strong>Höhe:</strong> ${tree.height} m</p>
              <p style="margin:0;"><strong>Datum:</strong> ${this.formatDate(tree.created_at)}</p>
            </div>
          `;
          marker.bindPopup(popupContent);
          this.markers.push(marker);
        }
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
    }
  },
  created() {
    this.fetchTrees();
  }
};
</script>

<style scoped>
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#map {
  width: 100%;
  height: 100%;
}
</style>
