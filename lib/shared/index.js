import lintSyntax from './syntax.js';
import { lintRules } from './rules.js';
import lintCompatibility from '../../rules/compatibility.js';

/**
 * @typedef {import('@lezer/common').Tree} Tree
 * @typedef {import('@codemirror/lint').Diagnostic} LintMessage
 * @typedef {import('../text/util.js').Variable} Variable
 */

/**
 * @typedef {object} LintAllContext
 * @property {Tree} syntaxTree
 * @property {(from: number, to: number) => string} readContent
 * @property {(from: number, to: number, content: string) => void} updateContent
 * @property {string} [expression] source the tree was parsed from (for compatibility linting)
 * @property {Record<string, string>} [engines] provided engine versions, e.g. `{ camunda: '8.6' }`
 * @property {Variable[]} [builtins]
 */

/**
 * Generates lint messages for the given context.
 *
 * @param {LintAllContext} context
 * @returns {LintMessage[]} array of all lint messages
 */
export default function lintAll(context) {

  const lintMessages = [
    ...lintSyntax(context.syntaxTree),
    ...lintRules(context),
    ...lintCompatibility(context)
  ];

  return lintMessages;
}