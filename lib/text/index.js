import { parser } from 'lezer-feel';
import lintAll from '../shared/index.js';

/**
 * Create an array of syntax errors for the given expression.
 *
 * @param {String} expression
 * @returns {LintMessage[]} array of syntax errors
 */
export function lintExpression(expression) {

  const syntaxTree = parser.parse(expression);

  const lintMessages = lintAll({
    syntaxTree,
    readContent: (from, to) => expression.slice(from, to),
    updateContent: (from, to, content) => {

      // not implemented
    }
  });

  return lintMessages;
}