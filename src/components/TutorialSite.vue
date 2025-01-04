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
@import './style.css';

</style>
