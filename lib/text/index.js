import { parser, trackVariables } from 'lezer-feel';
import lintAll from '../shared/index.js';
import { createContext } from './util.js';

/**
 * Create an array of syntax errors for the given expression.
 *
 * @param {String} expression
 * @param { {
 *   dialect?: 'expression' | 'unaryTests',
 *   parserDialect?: string,
 *   builtins?: import("./util.js").Variable[],
 *   variables?: import("./util.js").Variable[],
 * } } [lintOptions]
 *
 * @returns {import("../shared").LintMessage[]} array of syntax errors
 */
export function lintExpression(expression, {
  dialect = 'expression',
  parserDialect,
  builtins = [],
  variables = [],
} = {}) {

  const context = createContext([ ...builtins, ...variables ]);

  const syntaxTree = parser.configure({
    top: dialect === 'unaryTests' ? 'UnaryTests' : 'Expression',
    dialect: parserDialect,
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