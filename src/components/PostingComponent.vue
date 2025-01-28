<template>
    <div class="form-container">
        <h1>Teile einen Beitrag auf Social Media</h1>
        <button class="formbold-btn" @click="shareOnTwitter">Twitter</button>

    </div>
</template>

<script>
export default {
    methods: {
        shareOnTwitter() {
            const text = encodeURIComponent("Schau dir diesen coolen Baum an!");
            const url = encodeURIComponent("https://example.com");
            window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
        }
    }
};
</script>

<style scoped>
@import './style.css';

.container {
    text-align: center;
    margin-top: 50px;
}
</style>
