<script>
import firestore from '@/firebase';
import { doc, updateDoc, deleteDoc, onSnapshot } from '@firebase/firestore';

import MarkdownIt from 'markdown-it';
import twemoji from 'twemoji';
import highlight from '@/prism';
import katex from '@iktakahiro/markdown-it-katex';

export default {
  data() {
    const markdown = new MarkdownIt({
      langPrefix: 'language-',
      highlight
    });
    markdown.use(katex);
    return {
      title: '',
      author: '',
      content: '',
      likeCount: 0,
      pasteId: this.$route.params.id,
      pasteReview: '',
      markdown,
      unsubscribe: () => { }
    };
  },
  async mounted() {
    if (this.pasteId === 'preview') {
      this.title = localStorage.getItem('preview.title') || '';
      this.author = localStorage.getItem('preview.author') || '';
      this.content = localStorage.getItem('preview.content') || '';
      if (this.title === '') this.title = 'untitled';
      if (this.author === '') this.author = 'anonymous';
      return;
    }
    const localReview = localStorage.getItem(this.pasteId);
    if (localReview != null) this.pasteReview = localReview;
    this.unsubscribe = onSnapshot(doc(firestore, 'pastes', this.pasteId), document => {
      if (!document.exists()) return this.$router.replace('/pastes');
      const data = document.data();
      this.title = data.title;
      this.author = data.author;
      this.content = data.content;
      this.likeCount = data.likeCount;
    });
  },
  unmounted() {
    this.unsubscribe();
  },
  updated() {
    twemoji.parse(this.$refs.article, {
      folder: 'svg',
      ext: '.svg'
    });
  },
  methods: {
    async like() {
      await updateDoc(doc(firestore, 'pastes', this.pasteId), {
        likeCount: this.likeCount + (this.pasteReview === 'like' ? -1 : +1)
      });
      if (this.pasteReview === 'like') {
        this.pasteReview = '';
        localStorage.removeItem(this.pasteId);
      }
      else {
        this.pasteReview = 'like';
        localStorage.setItem(this.pasteId, 'like');
      }
    },
    edit() {
      localStorage.setItem('editing', this.pasteId);
      this.$router.push('/');
    },
    async remove() {
      if (confirm('are you sure you want to delete this paste?')) {
        await deleteDoc(doc(firestore, 'pastes', this.pasteId));
        alert('paste deleted successfully!');
        this.$router.replace('/');
      }
    }
  }
};
</script>

<template>
  <Head>
    <Title>{{ title }}</Title>
  </Head>
  <main class="flex-col">
    <h1 class="title gradient-text">{{ title }}</h1>
    <div class="author">{{ author }}</div>
    <article
      ref="article"
      class="markdown"
      v-html="markdown.render(content)"
    />
    <div v-if="pasteId !== 'preview'" class="buttons">
      <button
        class="soft-button gradient-button"
        :class="{ active: pasteReview === 'like' }"
        title="like"
        @click="like"
      >
        <FontAwesomeIcon class="fa-fw" :icon="['fas', 'heart']" />
        <span v-if="likeCount > 0">{{ likeCount }}</span>
      </button>
      <button class="soft-button gradient-button" title="edit" @click="edit">
        <FontAwesomeIcon class="fa-fw" :icon="['fas', 'pencil']" />
      </button>
      <button class="soft-button gradient-button" title="delete" @click="remove">
        <FontAwesomeIcon class="fa-fw" :icon="['fas', 'trash']" />
      </button>
    </div>
  </main>
</template>

<style scoped>
main {
  margin: 2rem auto;
  width: min(100%, 800px);
  color: var(--foreground);
  font-family: 'Merriweather', serif;
}

.title {
  padding: .25rem;
  font-size: 3rem;
  text-align: center;
}

.author {
  font-size: 2rem;
  text-align: center;
  opacity: .75;
}

article {
  margin: 2rem 0;
  width: 100%;
}

article:deep(img.emoji) {
  height: 1.2em;
  margin-bottom: -.25em;
}

.buttons {
  display: flex;
  gap: 1rem;
}

.buttons button {
  position: relative;
  font-size: 1.5rem;
}

.buttons button:nth-child(1).active {
  color: red;
  border-color: red;
}

.buttons button:nth-child(2):where(:hover, :focus-visible) {
  color: greenyellow;
  border-color: greenyellow;
}

.buttons button:nth-child(3):where(:hover, :focus-visible) {
  color: cornflowerblue;
  border-color: cornflowerblue;
}

.buttons span {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2rem;
  font-size: 1rem;
  text-align: center;
  color: var(--bordground);
  font-family: 'Montserrat Alternates', sans-serif;
  cursor: default;
}
</style>
