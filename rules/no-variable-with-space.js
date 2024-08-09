/**
 * @typedef {object} Context
 * @property {function} report
 * @property {(from: number, to: number) => string} readContent
 * @property {(from: number, to: number, content: string) => void} updateContent
 */

const RULE_NAME = 'no-variable-with-space';

export default {
  create(/** @type {Context} */ context) {
    return {
      enter(node) {
        if (node.name !== 'Key') {
          return;
        }

        const content = context.readContent(node.from, node.to);

        if (/\s/.test(content)) {
          const {
            from,
            to
          } = node;

          context.report({
            from,
            to,
            message: 'Variable with space is not allowed',
            severity: 'error',
            type: RULE_NAME,
            actions: [
              {
                name: 'fix',
                apply(_, start = from, end = to) {
                  const content = context.readContent(start, end);
                  const camelCaseContent = content.replace(/\s+\w/g, match => match.trim().toUpperCase());
                  context.updateContent(from, to, camelCaseContent);
                }
              }
            ]
          });
        }
      }
    };
  }
};
