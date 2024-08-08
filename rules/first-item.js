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

        if (zeroIndexPattern().test(content)) {
          const {
            from,
            to
          } = node;

          context.report({
            from,
            to,
            message: 'First item is accessed via [1]',
            severity: 'error',
            type: RULE_NAME,
            actions: [
              {
                name: 'fix',
                apply(_, start = from, end = to) {
                  context.updateContent(start, end, content.replace(zeroIndexPattern(), '[1]'));
                }
              }
            ]
          });
        }
      }
    };
  }
};

function zeroIndexPattern() {
  return /\[\s*0\s*\]$/;
}
