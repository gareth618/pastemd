<template>
  <nav class="flex-col">
    <NuxtLink class="gradient-button" title="new paste" to="/"><FontAwesomeIcon :icon="['fas', 'feather']" /></NuxtLink>
    <NuxtLink class="gradient-button" title="my pastes" to="/mine"><FontAwesomeIcon :icon="['fas', 'user']" /></NuxtLink>
  </nav>
</template>

<style scoped>
nav {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 1;
  gap: .5rem;
}

a {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  color: var(--bordground);
  background-color: var(--middground);
  border: 1px solid var(--bordground);
  border-radius: .25rem;
}
</style>
