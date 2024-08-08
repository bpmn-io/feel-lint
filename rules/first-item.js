/**
 * @typedef {object} Context
 * @property {boolean} report
 * @property {(from: number, to: number) => string} readContent
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
            type: RULE_NAME
          });
        }
      }
    };
  }
};
