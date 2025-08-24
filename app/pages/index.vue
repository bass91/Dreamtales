<template>
  <section class="home">
    <h1>DreamTales</h1>

    <textarea name="query" id="query" rows="5" v-model="query" placeholder="Tell me a story about a cat"></textarea>

    <button class="button" @click="generate" :disabled="query.length === 0 || isLoading">Generate</button>

    <audio ref="audioPlayer" controls v-if="audioUrl" :src="audioUrl"></audio>
  </section>
</template>

<script setup lang="ts">
const query = ref('')
const audioUrl = ref('');
const audioPlayer = ref<HTMLAudioElement | null>(null);
const isLoading = ref(false);

const generate = async () => {
  isLoading.value = true;
  const response = await fetch('http://192.168.68.149:5678/webhook/76d5b686-addb-4d44-846b-ed717f8ed0c0', {
    method: 'POST',
    headers: {
      // 'Accept': 'audio/mpeg',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: query.value
    })
  });
  
  // Get the response as a blob
  const audioBlob = await response.blob();
  
  // Create a URL for the blob
  audioUrl.value = URL.createObjectURL(audioBlob);
    
  // Optional: Auto-play the audio
  nextTick(() => {
    if (audioPlayer.value) {
      audioPlayer.value.src = audioUrl.value;
      audioPlayer.value.load(); // Required for some browsers
      audioPlayer.value.play().catch(e => console.error('Playback failed:', e));
    }
    isLoading.value = false;
  });
}
</script>

<style scoped>
.home {
  min-height: 100dvh;
  display: grid;
  place-content: center;
  gap: 2rem;
  margin-inline: auto;
}

h1 {
  font-family: var(--font-serif);
  font-weight: var(--font-weight-semibold);
}

textarea {
  padding: .5rem;
  height: 6rem;
  resize: none;
  background-color: hsl(0 0 0 / .4);
  background-image: linear-gradient(to bottom, hsl(0 0 0 / .4), hsl(0 0 100% / .1));

  @supports (corner-shape: squircle) {
    border-radius: 1rem / 1.5rem;
    corner-shape: squircle;
  }
}

</style>
