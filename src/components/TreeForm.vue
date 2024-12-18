<template>
  <form action="" method="POST" class="form-container">
    <h2 class="formbold-form-title">Tree registration</h2>

    <div class="formbold-input-flex">
      <div>
        <label for="tree-type" class="formbold-form-label">Baumart</label>
        <input
          type="text"
          name="tree-type"
          id="tree-type"
          class="formbold-form-input"
        />
      </div>
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
        <label for="tree1" class="formbold-form-label">Tree1*</label>
        <input
          type="file"
          name="tree1"
          id="tree1"
          class="formbold-form-input"
        />
      </div>

      <div>
        <label for="tree2" class="formbold-form-label">Tree2*</label>
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
        <label for="location" class="formbold-form-label">Your location</label>
        <div v-if="location">
          <iframe :src="iframeUrl" style="border: 1px solid black"></iframe>
          <br />
        </div>
      </div>
    </div>

    <p class="formbold-policy">
      privacy policy oder so
      <a href="#">privacy policy.</a>
    </p>
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
        console.log("Test");
      }
    }
  },
  created: function(){
    this.getLocation()
  }
}
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.formbold-form-title {
  font-weight: 600;
  font-size: 28px;
  line-height: 35px;
  width: 100%;
  text-align: center;
  margin-bottom: 30px;
}

.formbold-form-input {
  text-align: center;
  width: 100%;
  padding: 8px 22px;
  border-radius: 5px;
  border: 1px solid #dde3ec;
  background: #ffffff;
  font-weight: 500;
  font-size: 15px;
  outline: none;
  resize: none;
}

.formbold-input-flex {
  display: contents;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.formbold-input-flex>div {
  width: 100%; 
  max-width: 300px; 
  margin-bottom: 10px;
}

.formbold-form-label {
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
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  margin-top: 25px;
}

.formbold-btn:hover {
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
}

.formbold-policy {
  font-size: 12px;
  margin-top: 20px;
  text-align: center;
}
</style>
