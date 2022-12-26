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
    },
    copyLink() {
      navigator.clipboard.writeText(`http://localhost:3000/pastes/${this.documentId}`);
    }
  }
};
</script>

<template>
  <main>
    <h1>PasteMd</h1>
    <form @submit.prevent="publish">
      <div class="top">
        <input v-model="title" placeholder="title" />
        <input v-model="author" placeholder="author" />
      </div>
      <textarea v-model="content" placeholder="content" />
      <div class="bottom">
        <button :disabled="error !== ''" :title="error">
          publish <FontAwesomeIcon :icon="['fas', 'paper-plane']" />
        </button>
      </div>
    </form>
  </main>
  <Transition>
    <div class="overlay" v-if="documentId !== ''">
      <div class="message">
        <div class="text">
          <p>done! your paste is available at the following link:</p>
          <p><NuxtLink :to="`/pastes/${documentId}`">{{ `/pastes/${documentId}` }}</NuxtLink></p>
        </div>
        <div class="text">
          <p>done! your paste is available at <NuxtLink :to="`/pastes/${documentId}`">this</NuxtLink> link</p>
        </div>
        <button @click="copyLink">
          <FontAwesomeIcon :icon="['far', 'clipboard']" />
        </button>
      </div>
    </div>
  </Transition>
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

.top {
  display: flex;
  flex-grow: 1;
  gap: 1rem;
  width: 100%;
}

.bottom {
  display: flex;
  justify-content: right;
  align-items: center;
  width: 100%;
}

form :where(button, input, textarea) {
  width: 100%;
  padding: 1rem;
  background-color: var(--middground);
  border: 2px solid var(--bordground);
}

form :where(input, textarea)::selection {
  color: var(--background);
  background-color: var(--foreground);
}

form textarea {
  height: 300px;
}

form textarea::-webkit-scrollbar {
  width: .5rem;
}

form textarea::-webkit-scrollbar-thumb {
  background-color: var(--bordground);
}

form button {
  padding: 1rem 2rem;
  width: fit-content;
  font-weight: bold;
  background-size: 300%;
  background-image: linear-gradient(135deg, #333, #111);
  border-image: var(--gradient) 25;
  transition-duration: .3s;
  transition-property: background-position, opacity;
}

form button:not([disabled]):where(:hover, :focus-visible) {
  background-position: 100%;
}

form button svg {
  margin-left: .25rem;
}

.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  padding: 2rem;
  backdrop-filter: brightness(30%);
}

.message {
  max-width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  font-weight: bold;
  border-width: 2px;
  border-style: solid;
  border-image: var(--gradient) 25;
  background-color: var(--background);
}

.text {
  display: flex;
  flex-direction: column;
  gap: .5rem;
}

.text a {
  color: transparent;
  background-clip: text;
  background-image: var(--gradient);
}

.text a:where(:hover, :focus-visible) {
  text-decoration: underline;
  text-decoration-color: var(--foreground);
}

.message button {
  padding: .4rem .6rem;
  font-size: 1.2rem;
  color: var(--foreground);
  background-color: var(--middground);
  border: 1px solid var(--foreground);
  border-radius: .25rem;
  transition: background-color .3s;
}

.message button:where(:hover, :focus-visible) {
  background-color: var(--background);
}

@media (max-width: 500px) {
  .top {
    flex-direction: column;
  }

  .bottom {
    justify-content: center;
  }

  .text:nth-child(1) {
    display: none;
  }
}

@media (min-width: 501px) {
  .text:nth-child(2) {
    display: none;
  }
}
</style>
