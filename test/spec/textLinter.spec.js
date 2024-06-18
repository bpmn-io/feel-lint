

import { lintExpression } from '../../lib';

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


  it('should accept valid expression with contextual value', function() {

    // given
    const expression = 'get or else(10, 100)';

    // when
    const results = lintExpression(expression, {
      context: {
        'get or else': (value, _default) => typeof value === 'undefined' ? _default : value
      }
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
    const expression = '= 15';

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
    const expression = '15 == 15';

    // when
    const results = lintExpression(expression);

    // then
    expect(results).to.have.length(1);
    expect(results[0].severity).to.eql('error');
    expect(results[0].type).to.eql('Syntax Error');
    expect(results[0].message).to.eql('Unrecognized token <CompareOp> in <Comparison>');

  });

});
