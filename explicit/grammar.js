export default {
  'display header': {
    pattern: /(?<=^ *)#{2,6}(?= +\S)/m
  },
  'display image': {
    pattern: /(?<=^ *)!\[(?=\S).+(?<=\S)\]\[[1-9]\d*\]\((?=\S).+\.(png|jpeg|jpg)(?<=\S)\)(?= *$)/m
  },
  'display video': {
    pattern: /(?<=^ *)!\(https:\/\/www\.youtube\.com\/\S+\)(?= *$)/m
  },
  'display pdf': {
    pattern: /(?<=^ *)!\((?=\S).+(?<=\S)\.pdf\)(?= *$)/m
  },
  'block form': {
    pattern: /(?<=^ *):::(?=( +\S.*)?(?= *$))/m
  },
  'block list-beg': {
    pattern: /(?<=^ *)\+\+\+( +([1aAiI]|\*\*[1aAiI]\*\*))?(?= *$)/m
  },
  'block list-end': {
    pattern: /(?<=^ *)---(?= *$)/m
  },
  'block list-item': {
    pattern: /(?<=^ *)>(?= +\S.*$)/m
  },
  'block table': {
    pattern: /(?<=^ *)(\?\?\?|!!!)(?= *$)/m
  },
  'leaf link-beg': {
    pattern: /(?<=[ ([„_*~^]|^)\[(?=\S)/m
  },
  'leaf link-end': {
    pattern: /(?<=\S)\]\(\S+?\)(?=[ )\]”_*~^,;:.?!\/]|$)/m
  },
  'inline ital-beg': {
    pattern: /(?<=([^_]|^)(?<=\S))__(?=[^_]|$)/m
  },
  'inline bold-beg': {
    pattern: /(?<=([^*]|^)(?<=\S))\*\*(?=[^*]|$)/m
  },
  'inline strk-beg': {
    pattern: /(?<=([^~]|^)(?<=\S))~~(?=[^~]|$)/m
  },
  'inline high-beg': {
    pattern: /(?<=([^^]|^)(?<=\S))\^\^(?=[^^]|$)/m
  },
  'inline ital-end': {
    pattern: /(?<=[^_]|^)__(?=(?=\S)([^_]|$))/m
  },
  'inline bold-end': {
    pattern: /(?<=[^*]|^)\*\*(?=(?=\S)([^*]|$))/m
  },
  'inline strk-end': {
    pattern: /(?<=[^~]|^)~~(?=(?=\S)([^~]|$))/m
  },
  'inline high-end': {
    pattern: /(?<=[^^]|^)\^\^(?=(?=\S)([^^]|$))/m
  }
};
