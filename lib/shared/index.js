import lintSyntax from './syntax.js';

/**
 * Generates lint messages for the given syntax tree.
 *
 * @param {Tree} syntaxTree
 * @returns {LintMessage[]} array of all lint messages
 */
export default function lintAll(syntaxTree) {

  const lintMessages = [
    ...lintSyntax(syntaxTree)
  ];

  return lintMessages;
}