<template>
  <div>
    <h1>Meine gemessenen Bäume</h1>

    <!-- Search function -->
    <input v-model="searchQuery" placeholder="Baumart suchen" />

    <!-- Statistics -->
    <div>
      <p>Gesamtanzahl der Bäume: {{ trees.length }}</p>
      <p>Durchschnittliche Höhe: {{ averageHeight }} m</p>
    </div>

    <!-- Table -->
    <table class="table-ui">
      <thead>
        <tr>
          <th>Bild</th>
          <th>Baumart</th>
          <th>Höhe (m)</th>
          <th>Standort</th>
          <th>Datum</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tree in filteredTrees" :key="tree.id">
          <td><img :src="tree.imageUrl" alt="Bild von {{ tree.species }}" class="tree-image" /></td>
          <td>{{ tree.species }}</td>
          <td>{{ tree.height }}</td>
          <td>{{ tree.location }}</td>
          <td>{{ tree.date }}</td>
        </tr>
      </tbody>
    </table>

    
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      trees: [
        { id: 1, species: 'Eiche', height: 15.5, location: 'Fulda', date: '2024-12-01', imageUrl: require('@/assets/img/Eiche.jpg') },
        { id: 2, species: 'Buche', height: 20.2, location: 'Berlin', date: '2024-11-20', imageUrl: require('@/assets/img/Buche.jpg') },
        { id: 3, species: 'Ahorn', height: 10.8, location: 'Hamburg', date: '2024-12-05', imageUrl: require('@/assets/img/Ahorn.jpg') },
        { id: 4, species: 'Kirsche', height: 30.2, location: 'München', date: '2024-12-05', imageUrl: require('@/assets/img/Kirsche.jpg') }
      ],
    };
  },
  computed: {
    filteredTrees() {
      return this.trees.filter(tree =>
        tree.species.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    averageHeight() {
      if (!this.trees.length) return 0;
      const totalHeight = this.trees.reduce((sum, tree) => sum + tree.height, 0);
      return (totalHeight / this.trees.length).toFixed(2);
    },
  },
};
</script>

<style scoped>
table {
  margin-top: 20px;
}

th, td {
  border: 1px solid black;
  padding: 10px;
}

th {
  background-color: #f4f4f4;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

.table-ui {
  border: 1px solid black;
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.tree-image {
  width: 100px;
  height: 100px;
  object-fit: cover; 
}
</style>
