<script>
import firestore from '@/firebase';
import { doc, onSnapshot, updateDoc } from '@firebase/firestore';

import twemoji from 'twemoji';
import MarkdownIt from 'markdown-it';
import katex from '@iktakahiro/markdown-it-katex';

import prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-latex';
import 'prismjs/components/prism-markdown';
prism.highlightAll = () => { };

export default {
  data() {
    const markdown = new MarkdownIt({
      langPrefix: 'language-',
      highlight: (code, language) => prism.highlight(code, prism.languages[language], language)
    });
    markdown.use(katex);
    return {
      title: '',
      author: '',
      content: '',
      likeCount: 0,
      dislikeCount: 0,
      pasteId: this.$route.params.id,
      review: '',
      markdown,
      unsubscribe: () => { }
    };
  },
  async mounted() {
    if (this.pasteId === 'preview') {
      this.title = localStorage.getItem('preview.title') || '';
      this.author = localStorage.getItem('preview.author') || '';
      this.content = localStorage.getItem('preview.content') || '';
      return;
    }
    const localReview = localStorage.getItem(this.pasteId);
    if (localReview != null) this.review = localReview;
    this.unsubscribe = onSnapshot(doc(firestore, 'pastes', this.pasteId), document => {
      if (!document.exists()) return navigateTo('/pastes');
      const data = document.data();
      this.title = data.title;
      this.author = data.author;
      this.content = data.content;
      this.likeCount = data.likeCount;
      this.dislikeCount = data.dislikeCount;
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
        likeCount: this.likeCount + (this.review === 'like' ? -1 : +1)
      });
      if (this.review === 'like') {
        this.review = '';
        localStorage.removeItem(this.pasteId);
      }
      else {
        this.review = 'like';
        localStorage.setItem(this.pasteId, 'like');
      }
    },
    async dislike() {
      await updateDoc(doc(firestore, 'pastes', this.pasteId), {
        dislikeCount: this.dislikeCount + (this.review === 'dislike' ? -1 : +1)
      });
      if (this.review === 'dislike') {
        this.review = '';
        localStorage.removeItem(this.pasteId);
      }
      else {
        this.review = 'dislike';
        localStorage.setItem(this.pasteId, 'dislike');
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
    <div class="author iconed">
      {{ author }}
      <FontAwesomeIcon :icon="['fas', 'pen-nib']" />
    </div>
    <article
      ref="article"
      class="markdown"
      v-html="markdown.render(content)"
    />
    <div v-if="pasteId !== 'preview'" class="buttons">
      <button
        class="soft-button gradient-button" :class="{ active: review === 'like' }"
        @click="like" :disabled="review === 'dislike'" title="like"
      >
        <FontAwesomeIcon class="fa-fw" :icon="['fas', 'heart']" />
        <span v-if="likeCount > 0">{{ likeCount }}</span>
      </button>
      <button
        class="soft-button gradient-button" :class="{ active: review === 'dislike' }"
        @click="dislike" :disabled="review === 'like'" title="dislike"
      >
        <FontAwesomeIcon class="fa-fw" :icon="['fas', 'trash']" />
        <span v-if="dislikeCount > 0">{{ dislikeCount }}</span>
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
  font-size: 2rem;
  text-align: center;
}

.author {
  font-size: 1.5rem;
  text-align: center;
  opacity: .75;
}

.author:not(:hover) svg {
  display: none;
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

.buttons button:nth-child(2).active {
  color: royalblue;
  border-color: royalblue;
}

.buttons span {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2rem;
  font-size: 1rem;
  text-align: center;
  color: var(--bordground);
  font-family: 'Montserrat', sans-serif;
  cursor: default;
}
</style>
