import test from 'node:test';
import assert from 'node:assert/strict';
import { indentCss } from './indent-css.mjs';

test('Indentation stable avec fermetures en fin de déclaration et règles imbriquées', () => {
  const input = '.a {\n          color:red}\n          @media (width > 1px) {\n.a .b {\ncolor:blue}\n}\n';
  const output = indentCss(input);
  assert.equal(output, '.a {\n  color:red}\n@media (width > 1px) {\n  .a .b {\n    color:blue}\n}\n');
  assert.equal(indentCss(output), output);
  assert.equal(output.replace(/^[ \t]+/gm, ''), input.replace(/^[ \t]+/gm, ''));
});

test('Les accolades de chaînes et commentaires ne changent pas la profondeur', () => {
  const input = '.a {\ncontent:"}"; /* { */\nbackground:url("data:image/svg+xml;{x}");\n}\n.b {\ncolor:red}\n';
  assert.equal(indentCss(input), '.a {\n  content:"}"; /* { */\n  background:url("data:image/svg+xml;{x}");\n}\n.b {\n  color:red}\n');
});
