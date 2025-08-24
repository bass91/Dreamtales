<template>
  <main>
    <NuxtPage />
  </main>
</template>

<style>
:root {
  --surface-1: hsl(240, 100%, 4%);
  --surface-2: hsl(262, 100%, 8%);
  --surface-gradient: linear-gradient(to bottom, var(--surface-1), var(--surface-2));
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  /* Use AVIF/WebP for tiny files; fall back to PNG/JPG */
  background:
    radial-gradient(120% 120% at 70% 10%, rgba(255,140,255,.10), transparent 60%),
    radial-gradient(120% 120% at 20% 80%, rgba(90,150,255,.08), transparent 60%),
    image-set(
      /* url('/images/stars@1x.avif') type('image/avif') 1x,
      url('/images/stars@2x.avif') type('image/avif') 2x, */
      url('/images/stars-transparent@1x.webp') type('image/webp') 1x,
      url('/images/stars-transparent@2x.webp') type('image/webp') 2x
    );
  background-size: cover, cover, cover;
  background-position: center, center, center;
  background-repeat: no-repeat;
}

main {
  min-height: 100vh;
}
</style>
