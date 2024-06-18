import { parser, trackVariables } from 'lezer-feel';
import lintAll from '../shared/index.js';

/**
 * Create an array of syntax errors for the given expression.
 *
 * @param {String} expression
 * @param { {
 *   dialect?: 'expression' | 'unaryTests',
 *   context?: Record<string, any>
 * } } [lintOptions]
 *
 * @returns {LintMessage[]} array of syntax errors
 */
export function lintExpression(expression, {
  dialect = 'expression',
  context = {}
} = {}) {

  const syntaxTree = parser.configure({
    top: dialect === 'unaryTests' ? 'UnaryTests' : 'Expression',
    contextTracker: trackVariables(context)
  }).parse(expression);

  const lintMessages = lintAll({
    syntaxTree,
    readContent: (from, to) => expression.slice(from, to),
    updateContent: (from, to, content) => {

      // not implemented
    }
  });

  return lintMessages;
}