<template>
    <div id="app" class="faq-container">
      <h1>Häufig gestellte Fragen (FAQ)</h1>
      <div v-for="(item, index) in faqItems" :key="index" class="faq-item">
        <div class="faq-question" @click="toggleAnswer(index)">
          <h3>{{ item.question }}</h3>
          <span>{{ item.showAnswer ? '-' : '+' }}</span>
        </div>
        <div v-if="item.showAnswer" class="faq-answer">
          <p>{{ item.answer }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        faqItems: [
          {
            question: 'What tools do I need to measure a tree?',
            answer: 'Baum.',
            showAnswer: false,
          },
          {
            question: 'Can I measure trees in any location?',
            answer: 'Bauum".',
            showAnswer: false,
          },
          {
            question: 'Is the app free to use?',
            answer: 'Baum.',
            showAnswer: false,
          },
        ],
      };
    },
    methods: {
      toggleAnswer(index) {
        this.faqItems[index].showAnswer = !this.faqItems[index].showAnswer;
      },
    },
  };
  </script>
  
  <style>
  .faq-container {
    font-family: Arial, sans-serif;
    margin: 20px auto;
    max-width: 600px;
  }
  
  h1 {
    text-align: center;
  }
  
  .faq-item {
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
  }
  
  .faq-question {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    font-weight: bold;
  }
  
  .faq-answer {
    margin-top: 5px;
    padding-left: 10px;
    color: #555;
  }
  </style>
  