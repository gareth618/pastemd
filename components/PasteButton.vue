<script>
export default {
  props: {
    icon: String,
    title: String
  }
};
</script>

<template>
  <button class="soft-button gradient-button" :title="title">
    <FontAwesomeIcon class="fa-fw" :icon="['fas', icon]" />
    <slot />
  </button>
</template>
