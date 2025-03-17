<template>
  <div v-if="showTutorial" class="tutorial-overlay">
    <div class="tutorial-content">
      <h2>Citizen Science - Baummessung</h2>
      <div v-if="currentPage === 1">
        <h3>Erklärung des Projekts</h3>
        <p>Tutorial zur Accounterstellung</p>
        <ul>
          <li>Erklärung der Citizen Science</li>
          <li>Benutzername festlegen</li>
          <ul>
            <li>Der Benutzername muss einzigartig sein</li>
            <li>Der Benutzername darf keine Sonderzeichen enthalten</li>
          </ul>
          <li>E-Mail festlegen</li>
          <ul>
            <li>Die E-Mail-Adresse wird genutzt, um evtl. Passwort zurückzusetzen</li>
          </ul>
          <li>Passwort festlegen</li>
          <ul>
            <li>Das Passwort muss mindestens 8 Zeichen lang sein</li>
          </ul>
        </ul>
        <button @click="closeTutorial">Tutorial schließen</button>
        <!--<button @click="nextPage">Nächste Seite</button>-->
      </div>
      <!--<div v-else-if="currentPage === 2">
        <h3>Messanleitung</h3>
        <p>[Detaillierte Anleitung]</p>
        <button @click="prevPage">Vorherige Seite</button>
        <button @click="nextPage">Nächste Seite</button>
      </div>
      <div v-else-if="currentPage === 3">
        <h3>Zusätzliche Hilfe findest du bei [...]</h3>
        <button @click="prevPage">Vorherige Seite</button>
        <button @click="closeTutorial">Tutorial schließen</button>
      </div>-->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showTutorial: true,
      currentPage: 1,
    };
  },
  mounted() {
    if (localStorage.getItem('tutorialShown')) {
      this.showTutorial = false;
    }
  },
  methods: {
    nextPage() {
      if (this.currentPage < 3) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    closeTutorial() {
      this.showTutorial = false;
      localStorage.setItem('tutorialShown', 'true');
    },
  },
};
</script>

<style scoped>
.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.tutorial-content {
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  width: 80%;
  max-width: 600px;
  max-height: 90%;
  overflow-y: auto;
}

.tutorial-image {
  width: 100%;
  height: auto;
  margin-top: 20px;
  border-radius: 8px;
}
</style>
