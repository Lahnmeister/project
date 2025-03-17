<template>
  <div class="scroll-container">
    <div class="card" v-for="tree in filteredTrees" :key="tree.id">
      <img :src="tree.imageUrl" alt="Bild von {{ tree.tree_type.name }}" class="card-image"
        @click="toggleImage(tree)" />
      <div class="card-content">
        <h2>{{ `${tree.tree_type.name} (${tree.tree_type.scientific_name})` }}</h2>
        <p>
          <strong>Standort:</strong>
          {{ tree.locationName ? tree.locationName : "Keine Angaben" }}
        </p>
        <p><strong>Höhe:</strong> {{ tree.height }} m</p>
        <p><strong>Datum:</strong> {{ formatDate(tree.created_at) }}</p>
        <p><strong>CO₂ Gespeichert:</strong> {{ tree.co2_stored.toFixed(2) }} kg</p>
        <p>
          <button class="social-button" @click="shareOnTwitter(tree.imageUrl)">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg" alt="Twitter" />
          </button>
          &nbsp;
          <button class="social-button" @click="shareToInstagram(tree.imageUrl)">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Twitter" />
          </button>
        </p>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardView",
  data() {
    return {
      selectedDate: "",
      filteredTrees: [],
      trees: []
    };
  },
  computed: {
    uniqueSpecies() {
      return [...new Set(this.trees.map(tree => tree.tree_type))];
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
      const totalHeight = this.filteredTrees.reduce((sum, tree) => sum + Number(tree.height), 0);
      return (totalHeight / this.filteredTrees.length).toFixed(2);
    }
  },
  methods: {
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
        // Only shows the trees of the registered user
        this.trees = allTrees.filter(tree =>
          tree.initial_creator_id === currentUserId &&
          tree.latitude && tree.longitude &&
          !isNaN(parseFloat(tree.latitude)) &&
          !isNaN(parseFloat(tree.longitude))
        );
        // measurements, Reverse-Geocoding und imageUrl
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
      } catch (error) {
        console.error("Netzwerkfehler:", error);
      }
    },
    updateFilteredTrees() {
      //Filters by date
      this.filteredTrees = this.trees.filter(tree => {
        const treeDate = tree.created_at ? tree.created_at.substring(0, 10) : "";
        return this.selectedDate ? treeDate === this.selectedDate : true;
      });
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
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
          {
            headers: {
              "User-Agent": "BaumMessung/1.0 (test@domain.com)"
            }
          }
        );
        const result = await response.json();
        if (result.address) {
          // Zusätzlich County und State abfragen, falls keine Stadt vorhanden ist
          return result.address.city ||
            result.address.town ||
            result.address.village ||
            result.address.county ||
            result.address.state ||
            "";
        }
        return "";
      } catch (error) {
        console.error("Reverse-Geocoding-Fehler:", error);
        return "";
      }
    },
    getImageUrl(tree) {
      const baseUrl = "https://treescope.cs.hs-fulda.de/static/uploads";
      if (tree.files && tree.files.length > 0 && tree.files[0].photo_path) {
        // preferred image index
        const key = `preferredImage-${tree.id}`;
        let preferredIndex = localStorage.getItem(key);
        preferredIndex = preferredIndex ? parseInt(preferredIndex, 10) : 0;
        if (preferredIndex >= tree.files.length) {
          preferredIndex = 0;
        }
        let photoPath = tree.files[preferredIndex].photo_path.trim();
        if (photoPath.startsWith("/uploads/")) {
          photoPath = photoPath.replace(/^\/uploads\//, "");
        } else if (photoPath.startsWith("/static/uploads/")) {
          photoPath = photoPath.replace(/^\/static\/uploads\//, "");
        }
        return `${baseUrl}/${photoPath}`;
      }
      return null;
    },
    toggleImage(tree) {
      // Change the image with a click
      if (tree.files && tree.files.length > 1) {
        const key = `preferredImage-${tree.id}`;
        let preferredIndex = localStorage.getItem(key);
        preferredIndex = preferredIndex ? parseInt(preferredIndex, 10) : 0;
        preferredIndex = (preferredIndex + 1) % tree.files.length;
        localStorage.setItem(key, preferredIndex);
        tree.imageUrl = this.getImageUrl(tree);
      }
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    },
    shareOnTwitter(treehash) {
      const text = encodeURIComponent("Schau dir diesen coolen Baum an!");
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${treehash}`, "_blank");
    },
    shareToInstagram(imageUrl) {
      const isAndroid = /Android/i.test(navigator.userAgent);
      if (!isAndroid) {
        alert("Diese Funktion funktioniert nur auf Android-Geräten mit installierter Instagram-App.");
        return;
      }
      const encodedImageUrl = encodeURIComponent(imageUrl);
      const url = `intent://story?source_url=${encodedImageUrl}#Intent;package=com.instagram.android;scheme=instagram;end`;
      window.location.href = url;
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
/* Standard styling for mobile devices */
.scroll-container {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  margin: 0 auto;
  max-width: 800px;
}

/* Card design */
.card {
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  color: #333;
  text-align: center;
  position: relative;
  padding: 10px;
}

/* Adapted image sizes:*/
.card-image {
  width: 100%;
  max-width: 400px;
  height: 250px;
  object-fit: cover;
  border-radius: 5px;
  cursor: pointer;
}

.card-content {
  padding: 10px;
  margin-top: 10px;
  background: transparent;
  border-radius: 5px;
  width: 95%;
  color: #333;
}

.card h2 {
  font-size: 1.8em;
  margin-bottom: 10px;
}

.card p {
  font-size: 1.2em;
  margin: 5px 0;
}

.social-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.social-button img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.social-button img:hover {
  transform: scale(1.1);
}

/* Adapted styling for desktop (from 768px) */
@media (min-width: 768px) {
  .scroll-container {
    height: auto;
    overflow-y: visible;
    scroll-snap-type: none;
  }

  .card {
    height: auto;
    margin: 20px auto;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}
</style>
