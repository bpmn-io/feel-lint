import { syntaxTree } from '@codemirror/language';
import lintAll from '../shared';

/**
 * CodeMirror extension that provides linting for FEEL expressions.
 *
 * @param {EditorView} editorView
 * @returns {Source} CodeMirror linting source
 */
export const cmFeelLinter = () => editorView => {

  // don't lint if the Editor is empty
  if (editorView.state.doc.length === 0) {
    return [];
  }

  const tree = syntaxTree(editorView.state);

  const messages = lintAll({
    syntaxTree: tree,
    readContent: (from, to) => editorView.state.sliceDoc(from, to)
  });

  return messages.map(message => ({
    ...message,
    source: message.type
  }));
};