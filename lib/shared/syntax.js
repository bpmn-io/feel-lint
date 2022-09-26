/**
 * Create an array of syntax errors in the given tree.
 *
 * @param {Tree} syntaxTree
 * @returns {LintMessage[]} array of syntax errors
 */
export default function lintSyntax(syntaxTree) {

  const lintMessages = [];

  syntaxTree.iterate({
    enter: node => {
      if (node.type.isError) {

        const error = node.toString();

        /* The error has the pattern [⚠ || ⚠(NodeType)]. The regex extracts the node type from inside the brackets */
        const match = /\((.*?)\)/.exec(error);
        const nodeType = match && match[1];

        let message;

        if (nodeType) {
          message = 'unexpected ' + nodeType;
        } else {
          message = 'expression expected';
        }

        lintMessages.push(
          {
            from: node.from,
            to: node.to,
            severity: 'error',
            message: message,
            type: 'syntaxError'
          }
        );
      }
    }
  });

  return lintMessages;
}