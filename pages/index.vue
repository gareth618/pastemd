<script>
import firestore from '@/firebase';
import { addDoc, collection } from '@firebase/firestore';

export default {
  data() {
    return {
      title: '',
      author: '',
      content: ''
    };
  },
  methods: {
    async publish() {
      await addDoc(collection(firestore, 'pastes'), {
        title: this.title,
        author: this.author,
        content: this.content
      });
    }
  }
};
</script>

<template>
  <h1>PasteMd</h1>
  <form @submit.prevent="publish">
    <input v-model="title" placeholder="title" />
    <input v-model="author" placeholder="author" />
    <textarea v-model="content" placeholder="content" />
    <button>publish</button>
  </form>
</template>
