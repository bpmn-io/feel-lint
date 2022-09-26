import lintSyntax from './syntax.js';

/**
 *
 */
export default function lintAll(syntaxTree) {

  const lintMessages = [
    ... lintSyntax(syntaxTree)
  ];

  return lintMessages;
}