<script>
import firestore from '@/firebase';
import { doc, getDoc } from '@firebase/firestore';

export default {
  data() {
    return {
      title: '',
      author: '',
      content: '',
      found: false
    };
  },
  async mounted() {
    const document = await getDoc(doc(firestore, 'pastes', this.$route.params.id));
    if (!document.exists()) return;
    const documentData = document.data();
    this.title = documentData.title;
    this.author = documentData.author;
    this.content = documentData.content;
  }
};
</script>

<template>
  <div v-if="found">
    <p>paste not found</p>
  </div>
  <div v-else>
    <h1>{{ title }}</h1>
    <p>{{ author }}</p>
    <article>
      <p v-for="paragraph of content.split('\n')">{{ paragraph }}</p>
    </article>
  </div>
</template>
