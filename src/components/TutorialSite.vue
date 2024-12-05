<template>
  <div class="faq">
    <h1>Häufig gestellte Fragen (FAQ)</h1>
    <div 
      v-for="(item, index) in faqs" 
      :key="index" 
      class="faq-item"
    >
      <h3 @click="toggle(index)" :class="{ active: activeIndex === index }">
        {{ item.question }}
      </h3>
      <p v-if="activeIndex === index">
        {{ item.answer }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "FAQ",
  data() {
    return {
      faqs: [
        { question: "Was ist Vue.js?", answer: "Vue.js ist ein progressives JavaScript-Framework für den Aufbau von Benutzeroberflächen." },
        { question: "Wie installiere ich Vue?", answer: "Du kannst Vue über ein CDN einbinden oder mit npm installieren: `npm install vue`." },
        { question: "Ist Vue.js schwer zu lernen?", answer: "Nein, Vue ist bekannt für seine Einfachheit und Einsteigerfreundlichkeit." },
      ],
      activeIndex: null, // Index der geöffneten Frage
    };
  },
  methods: {
    toggle(index) {
      this.activeIndex = this.activeIndex === index ? null : index;
    },
  },
};
</script>

<style scoped>
.faq {
  max-width: 600px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.faq-item {
  margin-bottom: 20px;
}

h3 {
  cursor: pointer;
  margin: 0;
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
}

h3.active {
  background-color: #d9edf7;
  color: #31708f;
}

p {
  margin: 10px 0 0;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-top: none;
}
</style>
