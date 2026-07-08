import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { LanguageSupport } from '@codemirror/language';
import { feelLanguage } from '@bpmn-io/lang-feel';
import { cmFeelLinter } from '../../lib/index.js';

import { expect } from 'chai';


describe('lint - Editor', function() {

  it('should accept valid expression', function() {

    // given
    const view = createFeelViewer('foo = bar');
    const linter = cmFeelLinter();

    // when
    const results = linter(view);

    // then
    expect(results).to.have.length(0);

  });


  it('should accept valid with parserDialect=camunda', function() {

    // when
    const view = createFeelViewer('a.`b - c`', { dialect: 'camunda' });
    const lint = cmFeelLinter();

    // when
    const results = lint(view);

    // then
    expect(results).to.have.length(0);
  });


  it('should accept multiline with parserDialect=camunda', function() {

    // when
    const view = createFeelViewer('"multiline\nstring"', { dialect: 'camunda' });
    const lint = cmFeelLinter();

    // when
    const results = lint(view);

    // then
    expect(results).to.have.length(0);
  });


  it('should not return syntax error on empty document', function() {

    // given
    const view = createFeelViewer('');
    const lint = cmFeelLinter();

    // when
    const results = lint(view);

    // then
    expect(results).to.have.length(0);

  });


  it('should return syntax error', function() {

    // given
    const view = createFeelViewer('^15');
    const lint = cmFeelLinter();

    // when
    const results = lint(view);

    // then
    expect(results).to.have.length(1);
    expect(results[0].severity).to.eql('error');
    expect(results[0].source).to.eql('Syntax Error');
    expect(results[0].message).to.eql('Unrecognized token in <Expression>');

  });


  it('should return 0-width syntax error', function() {

    // given
    const view = createFeelViewer('15 =^ 15');
    const lint = cmFeelLinter();

    // when
    const results = lint(view);

    // then
    expect(results).to.have.length(1);
    expect(results[0].severity).to.eql('error');
    expect(results[0].source).to.eql('Syntax Error');
    expect(results[0].message).to.eql('Unrecognized token <ArithOp> in <Comparison>');

  });


  it('should return syntax error for unclosed string literal', function() {

    // given
    const view = createFeelViewer('"unclosed string');
    const lint = cmFeelLinter();

    // when
    const results = lint(view);

    // then
    expect(results).to.have.length(1);
    expect(results[0].severity).to.eql('error');
    expect(results[0].source).to.eql('Syntax Error');
    expect(results[0].message).to.eql('Unrecognized token in <Expression>');
  });


  describe('compatibility', function() {

    const builtins = [ { name: 'from json', engines: { camunda: '>=8.9' } } ];


    it('should warn on version-incompatible builtin', function() {

      // given
      const view = createFeelViewer('from json("x")', { dialect: 'camunda' });
      const lint = cmFeelLinter({ builtins, engines: { camunda: '8.6' } });

      // when
      const results = lint(view);

      // then
      expect(results).to.have.length(1);
      expect(results[0].severity).to.eql('warning');
      expect(results[0].source).to.eql('compatibility');
      expect(results[0].message).to.eql('Function \'from json\' requires Camunda >=8.9');
    });


    it('should not warn when the version satisfies', function() {

      // given
      const view = createFeelViewer('from json("x")', { dialect: 'camunda' });
      const lint = cmFeelLinter({ builtins, engines: { camunda: '8.9' } });

      // when
      const results = lint(view);

      // then
      expect(results).to.have.length(0);
    });


    it('should not warn without options', function() {

      // given
      const view = createFeelViewer('from json("x")', { dialect: 'camunda' });
      const lint = cmFeelLinter();

      // when
      const results = lint(view);

      // then
      expect(results).to.have.length(0);
    });
  });

});

// helpers //////////

function createFeelViewer(doc, config = {}) {
  return new EditorView({
    state:  EditorState.create({
      doc,
      extensions: [
        new LanguageSupport(feelLanguage.configure(config), [ ])
      ]
    })
  });
}
