// Change leading indentation only; preserve selectors, values and line breaks.
// Braces inside strings and comments are not CSS block delimiters.
export function indentCss(css) {
  let depth = 0;
  let quote = '';
  let comment = false;
  let escaped = false;
  return css.split('\n').map(line => {
    const content = line.replace(/^[ \t]+/, '');
    const result = quote || comment ? line : '  '.repeat(Math.max(0, depth - (content.startsWith('}') ? 1 : 0))) + content;
    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      if (comment) {
        if (char === '*' && content[i + 1] === '/') { comment = false; i++; }
      } else if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (quote) {
        if (char === quote) quote = '';
      } else if (char === '/' && content[i + 1] === '*') {
        comment = true; i++;
      } else if (char === '"' || char === "'") {
        quote = char;
      } else if (char === '{') {
        depth++;
      } else if (char === '}') {
        depth--;
        if (depth < 0) throw new Error('Accolade CSS fermante sans ouverture.');
      }
    }
    escaped = false;
    return result;
  }).join('\n');
}
