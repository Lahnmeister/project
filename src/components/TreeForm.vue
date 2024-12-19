<template>
  <form action="" method="POST">
    <h2 class="formbold-form-title">Tree registration</h2>

    <p class="formbold-policy">
      Schwieriegkeiten beim ausfüllen? Kein Problem. Klick
      <a href="/how-to-page">hier</a>
      für hilfe.
    </p>

    <div class="formbold-input-flex">
      <div>
        <label for="name-of-measurer" class="formbold-form-label">
          Name of the Measurer*
        </label>
        <div class="input-with-icon">
          <input type="text" name="name-of-measurer" id="name-of-measurer" class="formbold-form-input" />
          <img src="@/assets/info-icon-50.png" class="icon" title="Your Name" alt="Info Icon">
        </div>
      </div>
      <div>
        <label for="tree-type" class="formbold-form-label">
          Tree type* </label>
        <div class="input-with-icon">
          <input type="text" name="tree-type" id="tree-type" class="formbold-form-input" />
          <img src="@/assets/info-icon-50.png" class="icon" title="Baumart" alt="Info Icon">
        </div>

      </div>
    </div>

    <div class="formbold-input-flex">
      <div>
        <label for="Tree Height" class="formbold-form-label">
          Tree Height* </label>
        <div class="input-with-icon">
          <input type="number" name="tree-height" id="tree-height" class="formbold-form-input" />
          <img src="@/assets/info-icon-50.png" class="icon" title="Baumhöhe" alt="Info Icon">
        </div>

      </div>
      <div>
        <label for="phone" class="formbold-form-label">
          Inclination in degrees* </label>
        <div class="input-with-icon">
          <input type="number" name="inclination-in-degrees" id="inclination-in-degrees" class="formbold-form-input" />
          <img src="@/assets/info-icon-50.png" class="icon" title="Um wie viel Grad der Baum geneigt ist"
            alt="Info Icon">
        </div>

      </div>
    </div>

    <div class="formbold-input-flex">
      <div>
        <label for="trunk-diameter-in-cm" class="formbold-form-label">
          Trunk Diameter in cm* </label>
        <div class="input-with-icon">
          <input type="text" name="trunk-diameter-in-cm" id="trunk-diameter-in-cm" class="formbold-form-input" />
          <img src="@/assets/info-icon-50.png" class="icon" title="Baumdurchmesser in cm" alt="Info Icon">
        </div>

      </div>
    </div>

    <div class="formbold-input-flex">
      <div>
        <label for="tree1" class="formbold-form-label">
          Tree1* </label>
        <div class="input-with-icon">
          <input type="file" name="tree1" id="tree1" class="formbold-form-input" />
          <img src="@/assets/info-icon-50.png" class="icon" title="Erstes Bild vom Baum" alt="Info Icon">
        </div>

      </div>

      <div>
        <label for="tree2" class="formbold-form-label">
          Tree2* </label>
        <div class="input-with-icon">
          <input type="file" name="tree2" id="tree2" class="formbold-form-input" />
          <img src="@/assets/info-icon-50.png" class="icon" title="Zweites Bild vom Baum" alt="Info Icon">
        </div>

      </div>
    </div>

    <div class="formbold-input-flex">
      <div>
        <label for="location" class="formbold-form-label">
          Your location </label>
        <!-- Anzeige der Karte -->
        <div v-if="location">
          <iframe :src="iframeUrl" style="border: 1px solid black"></iframe>
          <br />
        </div>
      </div>
    </div>




    <button class="formbold-btn">Register tree</button>
  </form>
</template>

<script>
import { Geolocation } from '@capacitor/geolocation';

export default {
  name: 'DistanceForm',
  data() {
    // Initialisierung
    return {
      distance: '',
      submitted: false,
      location: null,
    };
  },
  computed: {
    // Karte mit gegebenem Standort ausgeben
    iframeUrl() {
      const { latitude, longitude } = this.location;
      return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude}%2C${latitude}%2C${longitude}%2C${latitude}&layer=mapnik&marker=${latitude}%2C${longitude}`;
    }
  }, methods: {
    async handleSubmit() {
      // Umschreiben der JSON
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

    // Standort abrufen
    async getLocation() {
      try {
        const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
        if (position.coords) {
          this.location = position.coords;
        } else {
          console.log("Test");
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


<style>
.formbold-form-title {
  color: #07074d;
  font-weight: 600;
  font-size: 28px;
  line-height: 35px;
  width: 60%;
  margin-bottom: 30px;
}

.formbold-form-input {
  text-align: center;
  width: 70%;
  padding: 8px 22px;
  border-radius: 5px;
  border: 1px solid #dde3ec;
  background: #ffffff;
  font-weight: 500;
  font-size: 15px;
  color: #536387;
  outline: none;
  resize: none;
}

.formbold-input-flex {
  display: flex;
  gap: 5px;
  margin-bottom: 15px;
}

.formbold-input-flex>div {
  width: 50%;
}

.formbold-form-label {
  color: #536387;
  font-size: 14px;
  line-height: 24px;
  display: block;
  margin-bottom: 10px;
}

.formbold-btn {
  text-align: center;
  width: 100%;
  font-size: 16px;
  border-radius: 5px;
  padding: 14px 25px;
  border: none;
  font-weight: 500;
  background-color: #6a64f1;
  color: white;
  cursor: pointer;
  margin-top: 25px;
}

.formbold-btn:hover {
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
}

.tooltip-icon {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.input-with-icon {
  display: flex;
  align-items: center;
}

.input-with-icon input {
  flex: 1;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.input-with-icon .icon {
  width: 15px;
  /* Festlegen einer festen Größe für das Icon */
  height: 15px;
  /* Sicherstellen, dass das Bild eine feste Größe hat */
  object-fit: contain;
  /* Bild passt sich ohne Verzerrung an */
  margin-left: 8px;
  /* Abstand zwischen Input und Icon */
}
</style>