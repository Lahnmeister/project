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
            const url = encodeURIComponent("http://treescope.cs.hs-fulda.de/static/uploads/d6466207b1824bfeecb1945c6e1a39afdb662b11cf55f1e3a4c45376f68f15f3.png");
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
