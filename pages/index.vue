<script>
import firestore from '@/firebase';
import { addDoc, collection } from '@firebase/firestore';

export default {
  data() {
    return {
      title: '',
      author: '',
      content: '',
      documentId: ''
    };
  },
  computed: {
    error() {
      if (this.title === '') return 'no title specified';
      if (this.author === '') return 'no author specified';
      if (this.content === '') return 'the paste is empty';
      return '';
    }
  },
  methods: {
    async publish() {
      const document = await addDoc(collection(firestore, 'pastes'), {
        title: this.title,
        author: this.author,
        content: this.content
      });
      this.documentId = document.id;
    }
  }
};
</script>

<template>
  <main class="flex-col">
    <h1 class="gradient-text">PasteMd</h1>
    <form class="flex-col" @submit.prevent="publish">
      <div class="top flex-row">
        <input v-model="title" placeholder="title" />
        <input v-model="author" placeholder="author" />
      </div>
      <textarea v-model="content" placeholder="content" />
      <div class="bottom flex-right">
        <button class="gradient-button gradient-border iconed-button" :disabled="error !== ''" :title="error">
          publish <FontAwesomeIcon :icon="['fas', 'paper-plane']" />
        </button>
      </div>
    </form>
  </main>
  <Transition>
    <OverlayMessage v-if="documentId !== ''" :pasteId="documentId" />
  </Transition>
</template>

<style scoped>
main {
  margin: 0 auto;
  width: min(100%, 800px);
}

h1 {
  padding: 1rem;
  width: fit-content;
  font-size: 3rem;
  font-family: 'Pacifico', cursive;
  user-select: none;
  transition: transform .25s;
}

h1:hover {
  transform: rotate(-5deg) scale(1.1);
}

form {
  width: 100%;
}

:where(input, textarea) {
  width: 100%;
  padding: 1rem;
  background-color: var(--middground);
  border: 2px solid var(--bordground);
}

:where(input, textarea)::selection {
  color: var(--background);
  background-color: var(--foreground);
}

textarea {
  height: 300px;
}

textarea::-webkit-scrollbar {
  width: .5rem;
}

textarea::-webkit-scrollbar-thumb {
  background-color: var(--bordground);
}

button {
  padding: 1rem 2rem;
  font-weight: bold;
}

@media (max-width: 500px) {
  .top {
    flex-direction: column;
  }

  .bottom {
    justify-content: center;
  }
}
</style>
