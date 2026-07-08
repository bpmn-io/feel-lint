import { syntaxTree } from '@codemirror/language';
import lintAll from '../shared/index.js';

/**
 * CodeMirror extension that provides linting for FEEL expressions.
 *
 * @param { {
 *   builtins?: import('../text/util.js').Variable[],
 *   engines?: Record<string, string>,
 * } } [options] enables version-compatibility linting when `engines` is set
 *
 * @returns {import('@codemirror/lint').LintSource} CodeMirror linting source
 */
export const cmFeelLinter = ({
  builtins = [],
  engines
} = {}) => editorView => {

  // don't lint if the Editor is empty
  if (editorView.state.doc.length === 0) {
    return [];
  }

  const tree = syntaxTree(editorView.state);

  const messages = lintAll({
    syntaxTree: tree,
    expression: editorView.state.doc.toString(),
    builtins,
    engines,
    readContent: (from, to) => editorView.state.sliceDoc(from, to),
    updateContent: (from, to, content) => editorView.dispatch({
      changes: { from, to, insert: content }
    })
  });

  return messages.map(message => ({
    ...message,
    source: message.type
  }));
};