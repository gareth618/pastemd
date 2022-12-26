<script>
import firestore from '@/firebase';
import { doc, getDoc } from '@firebase/firestore';

export default {
  data() {
    return {
      title: '',
      author: '',
      content: ''
    };
  },
  async mounted() {
    const document = await getDoc(doc(firestore, 'pastes', this.$route.params.id));
    if (!document.exists()) return navigateTo('/pastes');
    const data = document.data();
    this.title = data.title;
    this.author = data.author;
    this.content = data.content;
  }
};
</script>

<template>
  <h1>{{ title }}</h1>
  <p>{{ author }}</p>
  <article>
    <p v-for="paragraph of content.split('\n')">{{ paragraph }}</p>
  </article>
</template>
