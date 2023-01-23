<script>
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
  props: {
    modelValue: String,
    placeholder: String
  },
  emits: ['update:modelValue'],
  computed: {
    content: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
  methods: {
    highlight(code) {
      return code;
      // return prism.highlight(code, prism.languages.markdown, 'markdown');
    },
    onScroll() {
      this.$refs.output.scrollTop = this.$refs.input.scrollTop;
    },
    indent() {
      const start = this.$refs.input.selectionStart;
      this.content = this.content.slice(0, start) + '  ' + this.content.slice(start);
      setTimeout(() => {
        this.$refs.input.selectionStart = start + 2;
        this.$refs.input.selectionEnd = start + 2;
      }, 0);
    }
  }
};
</script>

<template>
  <div>
    <pre ref="output"><code
      class="language-markdown"
      v-html="highlight(content + (content.slice(-1) === '\n' ? ' ' : ''))"
    /></pre>
    <textarea
      ref="input"
      :placeholder="placeholder"
      v-model="content"
      @scroll="onScroll"
      @keydown.ctrl.i="indent"
    />
  </div>
</template>

<style scoped>
div {
  position: relative;
}

:where(textarea, pre) {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  padding: 1rem;
  background-color: transparent;
  border: 2px solid var(--bordground);
  white-space: pre-wrap;
  overflow-wrap: break-word;
  overflow: auto;
}

textarea {
  color: transparent;
  caret-color: var(--foreground);
  z-index: 1;
}

textarea::selection {
  color: var(--background);
  background-color: var(--foreground);
}

textarea::-webkit-scrollbar {
  width: .5rem;
}

textarea::-webkit-scrollbar-thumb {
  background-color: var(--bordground);
}

pre {
  user-select: none;
  background-color: var(--middground);
}

pre::-webkit-scrollbar {
  width: .5rem;
}

pre::-webkit-scrollbar-thumb {
  background-color: transparent;
}

code {
  color: var(--foreground);
}
</style>
