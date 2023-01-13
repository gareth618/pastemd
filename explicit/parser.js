export default function parse(content) {
  const TAB = '  ';
  const BLOCKS = ['+', '#'];

  const lines = content.trim().split('\n').map(line => line.trimRight().replace('\t', TAB));
  let indent = 0;
  const ast = [];
  for (let i = 0; i < lines.length; i++) {
    for (const block of BLOCKS) {
      const blockDelim = TAB.repeat(indent) + block.repeat(3);
      const blockInner = TAB.repeat(indent + 1);
      const blockLines = [];
      let j = i;
      while (j < lines.length) {
        if (lines[j].startsWith(blockDelim)) blockLines.push({ type: 'delim', content: lines[j]});
        if (lines[j].startsWith(blockInner)) blockLines.push({ type: 'inner', content: lines[j]});
        j++;
      }
      if (blockLines.length !== 0 && blockLines[0].type === 'delim') {
        ast.push({
          type: 'block',
          content: blockLines
        });
        break;
      }
    }
  }
  return ast;
};
