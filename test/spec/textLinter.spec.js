import { lintExpression } from '../../lib/index.js';

import { expect } from 'chai';


describe('lint - Text', function() {

  it('should accept valid expression', function() {

    // given
    const expression = 'foo = bar';

    // when
    const results = lintExpression(expression);

    // then
    expect(results).to.have.length(0);

  });


  it('should accept valid unaryTests', function() {

    // given
    const expression = '> 10, 100, "FOOBAR"';

    // when
    const results = lintExpression(expression, {
      dialect: 'unaryTests'
    });

    // then
    expect(results).to.have.length(0);
  });


  it('should accept valid with parserDialect=camunda', function() {

    // given
    const expression = 'a.`b - c`';

    // when
    const results = lintExpression(expression, {
      parserDialect: 'camunda'
    });

    // then
    expect(results).to.have.length(0);
  });


  it('should accept valid expression with builtins', function() {

    // given
    const expression = 'get or else(10, 100)';

    // when
    const results = lintExpression(expression, {
      builtins: [
        { name: 'get or else', params: [ { name: 'value' }, { name: 'default' } ] }
      ]
    });

    // then
    expect(results).to.have.length(0);
  });


  it('should return syntax error on empty document', function() {

    // given
    const expression = '';

    // when
    const results = lintExpression(expression);

    // then
    expect(results).to.have.length(1);
    expect(results[0].severity).to.eql('error');
    expect(results[0].type).to.eql('Syntax Error');
    expect(results[0].message).to.eql('Incomplete <Expression>');

  });


  it('should return syntax error', function() {

    // given
    const expression = '^15';

    // when
    const results = lintExpression(expression);

    // then
    expect(results).to.have.length(1);
    expect(results[0].severity).to.eql('error');
    expect(results[0].type).to.eql('Syntax Error');
    expect(results[0].message).to.eql('Unrecognized token in <Expression>');

  });


  it('should return 0-width syntax error', function() {

    // given
    const expression = '15 =^15';

    // when
    const results = lintExpression(expression);

    // then
    expect(results).to.have.length(1);
    expect(results[0].severity).to.eql('error');
    expect(results[0].type).to.eql('Syntax Error');
    expect(results[0].message).to.eql('Unrecognized token <ArithOp> in <Comparison>');

  });


  describe('compatibility', function() {

    const builtins = [ { name: 'from json', engines: { camunda: '>=8.9' } } ];


    it('should warn on version-incompatible builtin', function() {

      // given
      const expression = 'from json("x")';

      // when
      const results = lintExpression(expression, {
        parserDialect: 'camunda',
        builtins,
        engines: { camunda: '8.6' }
      });

      // then
      expect(results).to.have.length(1);
      expect(results[0].severity).to.eql('warning');
      expect(results[0].type).to.eql('compatibility');
      expect(results[0].message).to.eql('Function \'from json\' requires Camunda >=8.9');
    });


    it('should not warn when the version satisfies', function() {

      // given
      const expression = 'from json("x")';

      // when
      const results = lintExpression(expression, {
        parserDialect: 'camunda',
        builtins,
        engines: { camunda: '8.9' }
      });

      // then
      expect(results).to.have.length(0);
    });


    it('should not warn without engines configured', function() {

      // given
      const expression = 'from json("x")';

      // when
      const results = lintExpression(expression, {
        parserDialect: 'camunda',
        builtins
      });

      // then
      expect(results).to.have.length(0);
    });
  });

});
