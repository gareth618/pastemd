<script>
import highlight from '@/prism';

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
    highlight,
    syncScrollInput() {
      this.$refs.output.scrollTop = this.$refs.input.scrollTop;
    },
    syncScrollOutput() {
      this.$refs.input.scrollTop = this.$refs.output.scrollTop;
    },
    getSelection() {
      return [this.$refs.input.selectionStart, this.$refs.input.selectionEnd];
    },
    setSelection(lo, hi) {
      setTimeout(() => {
        this.$refs.input.selectionStart = lo;
        this.$refs.input.selectionEnd = hi;
      }, 0);
    },
    getSelectedLines(lo, hi) {
      let realLo = lo;
      while (this.content[realLo - 1] !== '\n' && realLo > 0) realLo--;
      let realHi = hi - 1;
      while (this.content[realHi] !== '\n' && realHi < this.content.length) realHi++;
      return [realLo, realHi];
    },
    indentSelectedLines(lo, hi, indent, sign) {
      const [realLo, realHi] = this.getSelectedLines(lo, hi);
      const lines = this.content.slice(realLo, realHi).split('\n');
      let spaceCount = indent(lines, 0);
      const newLo = lo + sign * spaceCount;
      for (let i = 1; i < lines.length; i++) {
        spaceCount += indent(lines, i);
      }
      const newHi = hi + sign * spaceCount;
      this.content = this.content.slice(0, realLo) + lines.join('\n') + this.content.slice(realHi);
      this.setSelection(Math.max(newLo, realLo), newHi);
    },
    tabSelection(event) {
      if (event.shiftKey) return;
      const [lo, hi] = this.getSelection();
      if (lo === hi) {
        this.content = this.content.slice(0, lo) + '  ' + this.content.slice(hi);
        this.setSelection(lo + 2, hi + 2);
        return;
      }
      const tab = (lines, index) => {
        if (lines[index] === '') return 0;
        lines[index] = '  ' + lines[index];
        return 2;
      };
      this.indentSelectedLines(lo, hi, tab, +1);
    },
    untabSelection() {
      const [lo, hi] = this.getSelection();
      if (lo == hi) return;
      const untab = (lines, index) => {
        if (lines[index].slice(0, 2) === '  ') {
          lines[index] = lines[index].slice(2);
          return 2;
        }
        if (lines[index].slice(0, 1) === ' ') {
          lines[index] = lines[index].slice(1);
          return 1;
        }
        return 0;
      };
      this.indentSelectedLines(lo, hi, untab, -1);
    },
    formatSelection(event) {
      const [lo, hi] = this.getSelection();
      if ('<([{$*_~`\'"'.includes(event.key) && lo !== hi) {
        const open = event.key;
        const close
          = event.key === '<' ? '>'
          : event.key === '(' ? ')'
          : event.key === '[' ? ']'
          : event.key === '{' ? '}'
          : event.key;
        this.content
          = this.content.slice(0, lo) + open
          + this.content.slice(lo, hi) + close
          + this.content.slice(hi);
        this.setSelection(lo + 1, hi + 1);
        event.preventDefault();
      }
    },
    tabbedEnter(event) {
      const [lo, hi] = this.getSelection();
      if (lo !== hi) return;
      const [realLo, _realHi] = this.getSelectedLines(lo, hi + 1);
      const tabSize = this.content.slice(realLo).match(/[\S\n]/)?.index || 0;
      this.content = this.content.slice(0, lo) + '\n' + ' '.repeat(tabSize) + this.content.slice(hi);
      this.setSelection(lo + tabSize + 1, hi + tabSize + 1);
      event.preventDefault();
    },
    trimContent() {
      this.content = this.content.trim().split('\n').map(line => line.trimRight()).join('\n');
      this.setSelection(0, 0);
    }
  }
};
</script>

<template>
  <div>
    <pre ref="output" @scroll="syncScrollOutput"><code
      class="language-markdown"
      v-html="highlight(content + (content.slice(-1) === '\n' ? ' ' : ''), 'markdown')"
    /></pre>
    <textarea
      ref="input"
      :placeholder="placeholder"
      v-model="content"
      @scroll="syncScrollInput"
      @keydown="formatSelection"
      @keydown.enter="tabbedEnter"
      @keydown.ctrl.t="trimContent"
      @keydown.ctrl.i="tabSelection"
      @keydown.ctrl.shift.i="untabSelection"
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
