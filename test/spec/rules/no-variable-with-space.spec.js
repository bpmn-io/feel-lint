import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { LanguageSupport } from '@codemirror/language';
import { feelLanguage } from 'lang-feel';
import { cmFeelLinter } from '../../../lib';

describe('lint - Rules - no-variable-with-space', function() {

  it('should accept valid expression', function() {

    // given
    const view = createFeelViewer('{ myVariable: 1 }');
    const linter = cmFeelLinter();

    // when
    const results = linter(view);

    // then
    expect(results).to.have.length(0);

  });


  it('should return no-variable-with-space error', function() {

    // given
    const view = createFeelViewer('{ my variable: 1 }');
    const lint = cmFeelLinter();

    // when
    const results = lint(view);

    // then
    expect(results).to.have.length(1);
    expect(results[0].severity).to.eql('error');
    expect(results[0].source).to.eql('no-variable-with-space');
    expect(results[0].message).to.eql('Variable with space is not allowed');
  });


  it('should apply fix on editor', function() {

    // given
    const view = createFeelViewer('{ my variable: 1 }');
    const lint = cmFeelLinter();

    // when
    const results = lint(view);
    results[0].actions[0].apply();

    // then
    expect(view.state.sliceDoc()).to.eql('{ myVariable: 1 }');
  });
});

// helpers //////////

function createFeelViewer(doc) {
  return new EditorView({
    state:  EditorState.create({
      doc,
      extensions: [
        new LanguageSupport(feelLanguage, [ ])
      ]
    })
  });
}

