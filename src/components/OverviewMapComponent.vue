<template>
  <div id="app">
    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
      trees: [
        {
          id: 1,
          species: "Eiche",
          height: 15.5,
          location: "Fulda",
          date: "01.12.2024",
          imageUrl: require("@/assets/img/Eiche.jpg"),
          latitude: 50.5655,
          longitude: 9.6806,
        },
        {
          id: 2,
          species: "Buche",
          height: 20.2,
          location: "Fulda",
          date: "20.12.2024",
          imageUrl: require("@/assets/img/Buche.jpg"),
          latitude: 50.5656,
          longitude: 9.6808,
        },
        {
          id: 3,
          species: "Ahorn",
          height: 10.8,
          location: "Hamburg",
          date: "21.11.2024",
          imageUrl: require("@/assets/img/Ahorn.jpg"),
          latitude: 53.5511,
          longitude: 9.9937,
        },
        {
          id: 4,
          species: "Kirsche",
          height: 30.2,
          location: "München",
          date: "05.12.2024",
          imageUrl: require("@/assets/img/Kirsche.jpg"),
          latitude: 48.1351,
          longitude: 11.582,
        },
      ],
      map: null,         
      markers: [],        
    };
  },
  mounted() {
    // Karte initialisieren
    this.initMap();
  },
  beforeUnmount() {

    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  },
  methods: {
     
    initMap() {
      //Karte erstellen
      this.map = L.map(this.$refs.mapContainer, {
        center: [51.1657, 10.4515], // Deutschland
        zoom: 6,
      });

      
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 19,
      }).addTo(this.map);

      // Marker und Popups erzeugen
      this.trees.forEach((tree) => {
        if (tree.latitude && tree.longitude) {
          const marker = L.marker([tree.latitude, tree.longitude]).addTo(
            this.map
          );

          // Popup-Inhalt
          const popupContent = `
            <div style="text-align:center;">
              <h3 style="margin-bottom:0.3em;">${tree.species}</h3>
              <img 
                src="${tree.imageUrl}"
                alt="${tree.species}"
                style="width:100px; max-height:80px; object-fit:cover; margin-bottom:0.5em;"
              />
              <p style="margin:0;"><strong>Ort:</strong> ${tree.location}</p>
              <p style="margin:0;"><strong>Höhe:</strong> ${tree.height} m</p>
              <p style="margin:0;"><strong>Datum:</strong> ${tree.date}</p>
            </div>
          `;
          marker.bindPopup(popupContent);

          this.markers.push(marker);
        }
      });
    },

  },
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
