import lintSyntax from './syntax.js';
import { lintRules } from './rules.js';

/**
 * @typedef {import('@lezer/common').Tree} Tree
 * @typedef {import('@codemirror/lint').Diagnostic} LintMessage
 */

/**
 * @typedef {object} LintAllContext
 * @property {Tree} syntaxTree
 * @property {(from: number, to: number) => string} readContent
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
    ...lintRules(context)
  ];

  return lintMessages;
}