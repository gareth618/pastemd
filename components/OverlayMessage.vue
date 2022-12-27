<script>
export default {
  data() {
    return {
      copied: false
    };
  },
  props: {
    pasteId: String
  },
  methods: {
    copyLink() {
      navigator.clipboard.writeText(`https://pastemd.netlify.com/pastes/${this.pasteId}`);
      this.copied = true;
      setTimeout(() => this.copied = false, 3000);
    }
  }
};
</script>

<template>
  <div class="overlay full-screen">
    <div class="message gradient-border">
      <div class="text">
        <p>done! your paste is available at the following link:</p>
        <p><NuxtLink class="gradient-text" :to="`/pastes/${pasteId}`">{{ `/pastes/${pasteId}` }}</NuxtLink></p>
      </div>
      <div class="text">
        <p>
          done! your paste is available at
          <NuxtLink class="gradient-text" :to="`/pastes/${pasteId}`">this</NuxtLink> link
        </p>
      </div>
      <button class="soft-button gradient-button" @click="copyLink" :disabled="copied" title="copy link">
        <FontAwesomeIcon :icon="[copied ? 'fas' : 'far', 'clipboard']" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.overlay {
  z-index: 1;
  padding: 2rem;
  backdrop-filter: brightness(30%);
}

.message {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  font-weight: bold;
  background-color: var(--background);
}

.text {
  display: flex;
  flex-direction: column;
  gap: .5rem;
}

a:where(:hover, :focus-visible) {
  text-decoration: underline;
  text-decoration-color: var(--foreground);
}

button {
  font-size: 1.2rem;
}

@media (max-width: 600px) {
  .text:nth-child(1) {
    display: none;
  }
}

@media (min-width: 601px) {
  .text:nth-child(2) {
    display: none;
  }
}
</style>
