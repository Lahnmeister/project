<template>
  <div class="scroll-container">
    <div class="card" v-for="tree in filteredTrees" :key="tree.id">
      <img :src="tree.imageUrl" alt="Bild von {{ tree.species }}" class="card-image" />
      <div class="card-content">
        <h2>{{ tree.species }}</h2>
        <p><strong>Standort:</strong> {{ tree.location }}</p>
        <p><strong>Höhe:</strong> {{ tree.height }} m</p>
        <p><strong>Datum:</strong> {{ tree.date }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: '',
      filteredTrees: [],
      trees: [
        { id: 1, species: 'Eiche', height: 15.5, location: 'Fulda', date: '2024-12-01', imageUrl: require('@/assets/img/Eiche.jpg') },
        { id: 2, species: 'Buche', height: 20.2, location: 'Berlin', date: '2024-11-20', imageUrl: require('@/assets/img/Buche.jpg') },
        { id: 3, species: 'Ahorn', height: 10.8, location: 'Hamburg', date: '2024-12-05', imageUrl: require('@/assets/img/Ahorn.jpg') },
        { id: 4, species: 'Kirsche', height: 30.2, location: 'München', date: '2024-12-05', imageUrl: require('@/assets/img/Kirsche.jpg') }
      ]
    };
  },
  methods: {
    updateFilteredTrees() {
      this.filteredTrees = this.trees.filter(tree => {
        return this.selectedDate ? tree.date === this.selectedDate : true;
      });
    }
  },
  created() {
    this.updateFilteredTrees();
  }
};
</script>

<style scoped>
.scroll-container {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
}

.card {
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: black;
  color: white;
  text-align: center;
  position: relative;
}

.card-image {
  width: 100%;
  height: 60%;
  object-fit: cover;
}

.card-content {
  padding: 20px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  width: 90%;
  color: white;
}

.card h2 {
  font-size: 2em;
  margin-bottom: 10px;
}

.card p {
  font-size: 1.2em;
}
</style>
