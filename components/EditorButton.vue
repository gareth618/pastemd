<script>
export default {
  props: {
    icon: String,
    error: String
  }
};
</script>

<template>
  <button class="gradient-button iconed" :title="error" :disabled="error !== ''">
    <slot />
    <FontAwesomeIcon :icon="['fas', icon]" />
  </button>
</template>
