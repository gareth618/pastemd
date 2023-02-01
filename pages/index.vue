<script>
import { auth, store } from '@/firebase';
import { doc, addDoc, getDoc, updateDoc, collection } from '@firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from '@firebase/auth';

export default {
  data() {
    return {
      title: '',
      author: '',
      content: '',
      pasteId: '',
      userId: '',
      published: false
    };
  },
  async mounted() {
    onAuthStateChanged(auth(), user => this.userId = user?.uid || '');
    const localPasteId = localStorage.getItem('editing');
    if (localPasteId == null) return;
    this.pasteId = localPasteId;
    const paste = (await getDoc(doc(store(), 'pastes', this.pasteId))).data();
    this.title = paste.title;
    this.author = paste.author;
    this.content = paste.content;
  },
  computed: {
    previewError() {
      return this.content === '' ? 'the paste is empty' : '';
    },
    publishError() {
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
      if (this.userId === '') {
        try {
          this.userId = (await signInWithPopup(auth(), new GoogleAuthProvider())).user.uid;
        }
        catch (_) {
          alert('there was an error at sign-in');
          return;
        }
      }
      if (this.pasteId === '') {
        const document = await addDoc(collection(store(), 'pastes'), {
          title: this.title,
          author: this.author,
          content: this.content,
          likeCount: 0,
          authorId: this.userId
        });
        this.pasteId = document.id;
      }
      else {
        await updateDoc(doc(store(), 'pastes', this.pasteId), {
          title: this.title,
          author: this.author,
          content: this.content
        });
        localStorage.removeItem('editing');
      }
      this.published = true;
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
      <MarkdownEditor
        class="editor"
        v-model="content"
        placeholder="content"
      />
      <div class="bottom flex-right">
        <EditorButton icon="eye" @click="preview" :error="previewError">
          preview
        </EditorButton>
        <EditorButton class="gradient-border" icon="paper-plane" @click="publish" :error="publishError">
          {{ pasteId === '' ? 'publish' : 'update' }}
        </EditorButton>
      </div>
    </form>
  </main>
  <Transition>
    <OverlayMessage v-if="published" :pasteId="pasteId" />
  </Transition>
  <NavBar />
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
  height: 350px;
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
  .editor {
    height: 300px;
  }

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
