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
    preview() {
      localStorage.setItem('preview.title', this.title);
      localStorage.setItem('preview.author', this.author);
      localStorage.setItem('preview.content', this.content);
      window.open('/pastes/preview', 'preview');
    },
    async publish() {
      const document = await addDoc(collection(firestore, 'pastes'), {
        title: this.title,
        author: this.author,
        content: this.content,
        likeCount: 0,
        dislikeCount: 0
      });
      this.documentId = document.id;
    }
  }
};
</script>

<template>
  <Head>
    <Title>PasteMd</Title>
  </Head>
  <main class="flex-col">
    <h1 class="gradient-text">PasteMd</h1>
    <form class="flex-col" @submit.prevent>
      <div class="top flex-row">
        <input v-model="title" placeholder="title" />
        <input v-model="author" placeholder="author" />
      </div>
      <ExplicitEditor class="editor" v-model="content" placeholder="content" />
      <div class="bottom flex-right">
        <button class="gradient-button iconed" @click="preview" :disabled="error !== ''" :title="error">
          preview
          <FontAwesomeIcon :icon="['fas', 'eye']" />
        </button>
        <button class="gradient-button gradient-border iconed" @click="publish" :disabled="error !== ''" :title="error">
          publish
          <FontAwesomeIcon :icon="['fas', 'paper-plane']" />
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

input {
  width: 100%;
  padding: 1rem;
  background-color: var(--middground);
  border: 2px solid var(--bordground);
}

input::selection {
  color: var(--background);
  background-color: var(--foreground);
}

.editor {
  width: 100%;
  height: 300px;
}

button {
  padding: 1rem 1.618rem;
  font-weight: bold;
}

button:not(.gradient-border) {
  background-color: var(--middground);
  border: 2px solid var(--bordground);
}

@media (max-width: 500px) {
  .top {
    flex-direction: column;
  }

  .bottom {
    justify-content: center;
  }

  button {
    width: 50%;
  }
}

@media (max-width: 350px) {
  .bottom {
    flex-direction: column;
  }

  button {
    width: 100%;
  }
}
</style>
