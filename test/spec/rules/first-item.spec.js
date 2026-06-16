import { parser } from '@bpmn-io/lezer-feel';
import firstItem from '../../../rules/first-item.js';

import { expect } from 'chai';


describe('lint - Rules - first-item', function() {

  it('should accept valid expression', function() {

    // given
    const { messages } = lintRule(firstItem, 'foo[1]');

    // when
    const results = messages;

    // then
    expect(results).to.have.length(0);

  });


  it('should detect issue', function() {

    // given
    const { messages } = lintRule(firstItem, 'foo[0]');

    // when
    const results = messages;

    // then
    expect(results).to.have.length(1);
    expect(results[0].severity).to.eql('warning');
    expect(results[0].type).to.eql('first-item');
    expect(results[0].message).to.eql('First item is accessed via [1]');
  });


  it('should detect issue (space is used)', function() {

    // given
    const { messages } = lintRule(firstItem, 'foo[ 0 ]');

    // when
    const results = messages;

    // then
    expect(results).to.have.length(1);
    expect(results[0].severity).to.eql('warning');
    expect(results[0].type).to.eql('first-item');
    expect(results[0].message).to.eql('First item is accessed via [1]');
  });


  it('should apply fix on editor', function() {

    // given
    const {
      messages,
      readExpression
    } = lintRule(firstItem, 'foo[0]');

    // when
    const results = messages;
    results[0].actions[0].apply();

    // then
    expect(readExpression()).to.eql('foo[1]');
  });
});

// helpers //////////

function lintRule(rule, expression) {
  let updatedExpression = expression;

  const messages = [];
  const visitor = rule.create({
    readContent: (from, to) => updatedExpression.slice(from, to),
    report: message => messages.push(message),
    updateContent: (from, to, content) => {
      updatedExpression = `${updatedExpression.slice(0, from)}${content}${updatedExpression.slice(to)}`;
    }
  });

  parser.configure({ top: 'Expression' }).parse(expression).iterate({
    enter: ref => {
      visitor.enter && visitor.enter(ref);
    },
    leave: ref => {
      visitor.leave && visitor.leave(ref);
    }
  });

  return {
    messages,
    readExpression: () => updatedExpression
  };
}

