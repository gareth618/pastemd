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
      const document = await addDoc(collection(firestore, 'pastes'), {
        title: this.title,
        author: this.author,
        content: this.content
      });
      navigator.clipboard.writeText(`http://localhost:3000/pastes/${document.id}`);
      navigateTo(`/pastes/${document.id}`);
    }
  }
};
</script>

<template>
  <main>
    <h1>PasteMd</h1>
    <form @submit.prevent="publish">
      <div class="inputs">
        <input v-model="title" placeholder="title" />
        <input v-model="author" placeholder="author" />
      </div>
      <textarea v-model="content" placeholder="content" />
      <div class="button">
        <button>publish</button>
      </div>
    </form>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 0 auto;
  width: min(100%, 800px);
}

h1 {
  padding: 1rem;
  width: fit-content;
  font-size: 3rem;
  font-family: 'Pacifico', cursive;
  color: transparent;
  background-clip: text;
  background-image: var(--gradient);
  user-select: none;
  transition: transform .25s;
}

h1:hover {
  transform: rotate(-5deg) scale(1.1);
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.inputs {
  display: flex;
  flex-grow: 1;
  gap: 1rem;
  width: 100%;
}

.button {
  display: flex;
  justify-content: right;
  width: 100%;
}

:where(button, input, textarea) {
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
  width: fit-content;
  font-weight: bold;
  background-size: 300%;
  background-image: linear-gradient(135deg, #333, #111);
  border-image: var(--gradient) 25;
  transition: background-position .5s;
}

button:where(:hover, :focus-visible) {
  background-position: 100%;
}

@media (max-width: 500px) {
  .inputs {
    flex-direction: column;
  }
}
</style>
