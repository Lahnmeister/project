<template>
  <div class="explanation">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
  </div>
</template>
<script>
export default {
  name: "Explanation-Site",
  data() {
    return {
      title: "Tutorial",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque expedita eos beatae repellat cum. Similique, nisi vitae fugiat libero odit qui nemo quaerat quia impedit, modi ipsum adipisci iste cumque!"

    };
  }
};
</script>

<style scoped>
.explanation {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

p {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #555;
}
</style>
