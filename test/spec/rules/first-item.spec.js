import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { LanguageSupport } from '@codemirror/language';
import { feelLanguage } from '@bpmn-io/lang-feel';
import { cmFeelLinter } from '../../../lib';

import { expect } from 'chai';


describe('lint - Rules - first-item', function() {

  it('should accept valid expression', function() {

    // given
    const view = createFeelViewer('foo[1]');
    const linter = cmFeelLinter();

    // when
    const results = linter(view);

    // then
    expect(results).to.have.length(0);

  });


  it('should detect issue', function() {

    // given
    const view = createFeelViewer('foo[0]');
    const lint = cmFeelLinter();

    // when
    const results = lint(view);

    // then
    expect(results).to.have.length(1);
    expect(results[0].severity).to.eql('warning');
    expect(results[0].source).to.eql('first-item');
    expect(results[0].message).to.eql('First item is accessed via [1]');
  });


  it('should detect issue (space is used)', function() {

    // given
    const view = createFeelViewer('foo[ 0 ]');
    const lint = cmFeelLinter();

    // when
    const results = lint(view);

    // then
    expect(results).to.have.length(1);
    expect(results[0].severity).to.eql('warning');
    expect(results[0].source).to.eql('first-item');
    expect(results[0].message).to.eql('First item is accessed via [1]');
  });


  it('should apply fix on editor', function() {

    // given
    const view = createFeelViewer('foo[0]');
    const lint = cmFeelLinter();

    // when
    const results = lint(view);
    results[0].actions[0].apply();

    // then
    expect(view.state.sliceDoc()).to.eql('foo[1]');
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

