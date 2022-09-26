import { parser } from 'lezer-feel';
import lintAll from '../shared/index.js';

export function lintExpression(exp) {

  const syntaxTree = parser.parse(exp);

  const lintMessages = lintAll(syntaxTree);

  return lintMessages;
}