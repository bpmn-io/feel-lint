/**
 * @typedef {object} Context
 * @property {function} report
 * @property {(from: number, to: number) => string} readContent
 * @property {(from: number, to: number, content: string) => void} updateContent
 */

const RULE_NAME = 'first-item';

export default {
  create(/** @type {Context} */ context) {
    return {
      enter(node) {
        if (node.name !== 'FilterExpression') {
          return;
        }

        const content = context.readContent(node.from, node.to);

        if (/\[0\]$/.test(content)) {
          context.report({
            from: node.from,
            to: node.to,
            message: 'First item is accessed via [1]',
            severity: 'error',
            type: RULE_NAME,
            actions: [
              {
                name: 'fix',
                apply(_, from = node.from, to = node.to) {
                  context.updateContent(from, to, content.replace(/\[0\]$/, '[1]'));
                }
              }
            ]
          });
        }
      }
    };
  }
};
