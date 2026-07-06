import { parser, trackVariables } from '@bpmn-io/lezer-feel';
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
 *   reservedNameBuiltins?: import("./util.js").Variable[],
 *   engines?: Record<string, string>,
 * } } [lintOptions]
 *
 * @returns {import("../shared").LintMessage[]} array of lint messages
 */
export function lintExpression(expression, {
  dialect = 'expression',
  parserDialect,
  builtins = [],
  variables = [],
  reservedNameBuiltins = [],
  engines,
} = {}) {

  const context = createContext([ ...builtins, ...variables ]);

  const syntaxTree = parser.configure({
    top: dialect === 'unaryTests' ? 'UnaryTests' : 'Expression',
    dialect: parserDialect,
    contextTracker: trackVariables(context)
  }).parse(expression);

  const lintMessages = lintAll({
    syntaxTree,
    expression,
    dialect,
    parserDialect,
    builtins,
    reservedNameBuiltins,
    engines,
    readContent: (from, to) => expression.slice(from, to),
    updateContent: (from, to, content) => {

      // not implemented
    }
  });

  return lintMessages;
}