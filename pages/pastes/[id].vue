<script>
import firestore from '@/firebase';
import { doc, onSnapshot, updateDoc } from '@firebase/firestore';
import parse from '@/explicit/parser.js';

export default {
  data() {
    return {
      title: '',
      author: '',
      content: '',
      likeCount: 0,
      dislikeCount: 0,
      pasteId: this.$route.params.id,
      review: '',
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
  methods: {
    parse,
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
    <article class="flex-col">
      <p v-for="paragraph of content.split('\n')">{{ paragraph }}</p>
      <!-- <pre>{{ JSON.stringify(parse(content), null, 2) }}</pre> -->
    </article>
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
  line-height: 1.618;
  text-align: justify;
}

p {
  width: 100%;
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

@media (max-width: 700px) {
  article {
    text-align: left;
  }
}
</style>
