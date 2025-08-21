import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';
import { Compartment, EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { feel } from '@bpmn-io/lang-feel';

import { cmFeelLinter } from '../../lib';
import TEMPLATE from './example.html';

const start = window.__env__ && window.__env__.SINGLE_START;



describe('example', function() {

  (start ? it.only : it.skip)('should run the example', function() {

    // given
    document.body.innerHTML = TEMPLATE;

    // when
    const editor = createFeelViewer('', {
      parent: document.getElementById('editor')
    });
    const json = createJsonViewer('{ "foo": "bar" }', {
      parent: document.getElementById('json'),
      onChange: (value) => {
        try {
          JSON.parse(value);
          editor.updateContext(value);
        } catch (e) {

          // ignore
        }
      }
    });

    // then
    expect(editor).to.exist;
    expect(json).to.exist;
  });
});

// helpers //////////
function createJsonViewer(doc, options = {}) {
  const changeHandler = EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      options.onChange && options.onChange(update.state.doc.toString());
    }
  });

  return new EditorView({
    parent: options.parent,
    state:  EditorState.create({
      doc,
      extensions: [
        json(),
        linter(jsonParseLinter()),
        changeHandler
      ]
    })
  });
}

function createFeelViewer(doc, options = {}) {
  const language = new Compartment();

  const extensions = [
    language.of(feel({
      dialect: 'expression',
      context
    })),
    linter(cmFeelLinter())
  ];

  const editor = new EditorView({
    ...options,
    state:  EditorState.create({
      doc,
      extensions
    })
  });


  const updateContext = context => editor.dispatch({
    effects: language.reconfigure(
      feel({
        dialect: 'expression',
        context
      })
    ),
    changes: {
      from: 0,
      to: doc.length,
      insert: doc
    }
  });

  return {
    instance: editor,
    updateContext
  };
}
