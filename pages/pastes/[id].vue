<script>
import { auth, store } from '@/firebase';
import { onAuthStateChanged } from '@firebase/auth';
import { doc, updateDoc, deleteDoc, onSnapshot } from '@firebase/firestore';

import MarkdownIt from 'markdown-it';
import twemoji from 'twemoji';
import highlight from '@/prism';
import katex from '@traptitech/markdown-it-katex';

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
      authorId: '',
      likeCount: 0,
      pasteId: this.$route.params.id,
      userId: '',
      pasteReview: '',
      markdown,
      unsubscribe: () => { }
    };
  },
  computed: {
    html() {
      let headerCount = 0;
      let code = this.markdown.render(this.content);
      code = code.replace(/<a href="/g, '<a target="_blank" href="');
      code = code.replace(/<h([1-6])>(.+?)<\/h([1-6])>/g, (_, level, title) => {
        const headerId = `header-${++headerCount}`;
        return `<h${level} id="${headerId}"><a href="#${headerId}">${title}</a></h${level}>`;
      });
      code = twemoji.parse(code, { folder: 'svg', ext: '.svg' });
      code = code.replaceAll('https://twemoji.maxcdn.com/v/14.0.2/svg/', 'https://abs-0.twimg.com/emoji/v2/svg/');
      return code;
    }
  },
  async mounted() {
    onAuthStateChanged(auth(), user => this.userId = user?.uid || '');
    if (this.pasteId === 'preview') {
      this.title = localStorage.getItem('preview.title') || '';
      this.author = localStorage.getItem('preview.author') || '';
      this.content = localStorage.getItem('preview.content') || '';
      if (this.title === '') this.title = 'untitled';
      if (this.author === '') this.author = 'anonymous';
      return;
    }
    const localPasteReview = localStorage.getItem(this.pasteId);
    if (localPasteReview != null) this.pasteReview = localPasteReview;
    this.unsubscribe = onSnapshot(doc(store(), 'pastes', this.pasteId), document => {
      if (!document.exists()) return this.$router.replace('/404');
      const paste = document.data();
      this.title = paste.title;
      this.author = paste.author;
      this.content = paste.content;
      this.authorId = paste.authorId;
      this.likeCount = paste.likeCount;
    });
  },
  unmounted() {
    this.unsubscribe();
  },
  methods: {
    async like() {
      await updateDoc(doc(store(), 'pastes', this.pasteId), {
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
        await deleteDoc(doc(store(), 'pastes', this.pasteId));
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
    <article ref="article" class="markdown" v-html="html" />
    <div v-if="pasteId !== 'preview'" class="buttons">
      <PasteButton
        :class="{ active: pasteReview === 'like' }"
        icon="heart" title="like" @click="like"
      >
        <span v-if="likeCount > 0">{{ likeCount }}</span>
      </PasteButton>
      <PasteButton v-if="userId === authorId" icon="pencil" title="edit" @click="edit" />
      <PasteButton v-if="userId === authorId" icon="trash" title="delete" @click="remove" />
    </div>
  </main>
  <NavBar />
</template>

<style scoped>
main {
  margin: 0 auto;
  width: min(100%, 800px);
  color: var(--foreground);
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
  margin: 1rem 0;
  width: 100%;
}

article:deep(img.emoji) {
  height: 1.2em;
  margin-bottom: -.25em;
}

.buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
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
  cursor: default;
}
</style>

<style>
@media print {
  .title {
    color: black;
  }

  .author {
    color: #080808;
  }

  .markdown {
    color: #222;
  }

  .markdown :where(h1, h2, h3, h4, h5, h6) {
    color: black;
  }

  .markdown pre {
    white-space: pre-wrap;
  }

  .markdown hr {
    border-bottom: 2px solid var(--bordground);
  }

  .buttons {
    display: none !important;
  }

  nav {
    display: none !important;
  }
}
</style>
