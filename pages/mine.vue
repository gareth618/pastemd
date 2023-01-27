<script>
import { auth, store } from '@/firebase';
import { onAuthStateChanged } from '@firebase/auth';
import { collection, query, where, orderBy, onSnapshot } from '@firebase/firestore';

const baseUrl
  = process.env.NODE_ENV === 'production'
  ? 'https://pastemd.netlify.app'
  : 'http://localhost:3000';

export default {
  data() {
    return {
      userId: '',
      pastes: [],
      unsubscribe: () => { }
    };
  },
  async mounted() {
    onAuthStateChanged(auth(), user => {
      this.userId = user?.uid || '';
      if (this.userId !== '') {
        this.unsubscribe = onSnapshot(query(
          collection(store(), 'pastes'),
          where('authorId', '==', this.userId),
          orderBy('title')
        ), documents => {
          const pastes = [];
          documents.forEach(document => pastes.push({
            url: `${baseUrl}/pastes/${document.id}`,
            title: document.data().title
          }));
          this.pastes = [...pastes];
        });
      }
    });
  },
  unmounted() {
    this.unsubscribe();
  }
};
</script>

<template>
  <Head>
    <Title>My Pastes</Title>
  </Head>
  <h1 class="gradient-text">My Pastes</h1>
  <p v-if="pastes.length === 0">you have no pastes yet</p>
  <TransitionGroup v-else tag="main">
    <NuxtLink v-for="paste of pastes" :to="paste.url" :key="paste.url">{{ paste.title }}</NuxtLink>
  </TransitionGroup>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all .5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

h1 {
  margin: 0 auto 2rem auto;
  width: fit-content;
  font-size: 3rem;
  text-align: center;
}

p, a {
  display: block;
  margin: 1rem;
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
}

a {
  border: 2px var(--bordground) solid;
  background-color: var(--middground);
  transition-duration: .5s;
  transition-timing-function: ease;
  transition-property: transform, background-color;
}

a:where(:hover, :focus-visible) {
  transform: scale(1.03);
  background-color: var(--bordground);
}

a:has(+ a:where(:hover, :focus-visible)), a:where(:hover, :focus-visible) + a {
  transform: scale(1.02);
  transition-duration: .75s;
}

a:has(+ a + a:where(:hover, :focus-visible)), a:where(:hover, :focus-visible) + a + a {
  transform: scale(1.01);
  transition-duration: 1s;
}

@media (max-width: 500px) {
  p, a {
    margin: 1rem 0;
    padding: .5rem;
    font-size: 1rem;
  }
}
</style>
