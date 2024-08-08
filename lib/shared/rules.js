import firstItem from '../../rules/first-item.js';

/**
 * @typedef {import('@lezer/common').Tree} Tree
 * @typedef {import('@codemirror/lint').Diagnostic} LintMessage
 * @typedef {import('./index').LintAllContext} LintAllContext
 */

const RULES = [
  firstItem
];

/**
 * Create an array of messages reported from rules in the given tree.
 *
 * @param {LintAllContext} context
 * @returns {LintMessage[]} array of syntax errors
 */
export function lintRules(context) {
  const {
    readContent,
    syntaxTree
  } = context;

  const lintMessages = [];

  const ruleContext = {
    readContent,
    report: message => {
      lintMessages.push(message);
    }
  };

  const rules = RULES.map(rule => rule.create(ruleContext));

  syntaxTree.iterate({
    enter: ref => {
      for (const rule of rules) {
        rule.enter && rule.enter(ref);
      }
    },
    leave: ref => {
      for (const rule of rules) {
        rule.leave && rule.leave(ref);
      }
    }
  });

  return lintMessages;
}
