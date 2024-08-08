/**
 * @typedef {import('@lezer/common').Tree} Tree
 * @typedef {import('@codemirror/lint').Diagnostic} LintMessage
 */

/**
 * Create an array of syntax errors in the given tree.
 *
 * @param {Tree} syntaxTree
 * @returns {LintMessage[]} array of syntax errors
 */
export default function lintSyntax(syntaxTree) {

  const lintMessages = [];

  syntaxTree.iterate({
    enter: ref => {
      const node = ref.node;

      if (!node.type.isError) {
        return;
      }

      const parent = node.parent;
      const next = getNextNode(node);

      const message = {
        from: node.from,
        to: node.to,
        severity: 'error',
        type: 'Syntax Error'
      };

      if (node.from !== node.to) {
        message.message = `Unrecognized token in <${parent.name}>`;
      } else if (next) {
        message.message = `Unrecognized token <${next.name}> in <${parent.name}>`;
        message.to = next.to;
      } else {
        const before = parent.enterUnfinishedNodesBefore(node.to);
        message.message = `Incomplete <${ (before || parent).name }>`;
      }

      lintMessages.push(message);
    }
  });

  return lintMessages;
}

function getNextNode(node) {
  if (!node) {
    return null;
  }

  return node.nextSibling || getNextNode(node.parent);
}