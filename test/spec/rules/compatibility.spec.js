import { parser, trackVariables } from '@bpmn-io/lezer-feel';

import { createContext } from '../../../lib/text/util.js';
import lintCompatibility from '../../../rules/compatibility.js';

import { expect } from 'chai';


const BUILTINS = [
  { name: 'from json', engines: { camunda: '>=8.9' } },
  { name: 'to json', engines: { camunda: '>=8.9' } },
  { name: 'get or else' }
];

function lint(expression, options = {}) {
  const { builtins = BUILTINS, engines } = options;

  const syntaxTree = parser.configure({
    top: 'Expression',
    dialect: 'camunda',
    contextTracker: trackVariables(createContext(builtins))
  }).parse(expression);

  return lintCompatibility({ syntaxTree, expression, builtins, engines });
}


describe('lint - Rules - compatibility', function() {

  describe('no-op', function() {

    it('should not lint without engines', function() {

      // given
      const expression = 'from json("x")';

      // when
      const results = lint(expression);

      // then
      expect(results).to.have.length(0);
    });


    it('should not lint with empty engines', function() {

      // given
      const expression = 'from json("x")';

      // when
      const results = lint(expression, { engines: {} });

      // then
      expect(results).to.have.length(0);
    });


    it('should not lint without builtins', function() {

      // given
      const expression = 'from json("x")';

      // when
      const results = lint(expression, { builtins: [], engines: { camunda: '8.6' } });

      // then
      expect(results).to.have.length(0);
    });


    it('should not lint compatible version', function() {

      // given
      const expression = 'from json("x")';

      // when
      const results = lint(expression, { engines: { camunda: '8.9' } });

      // then
      expect(results).to.have.length(0);
    });


    it('should not lint builtin without engines requirement', function() {

      // given
      const expression = 'get or else(1, 2)';

      // when
      const results = lint(expression, { engines: { camunda: '8.6' } });

      // then
      expect(results).to.have.length(0);
    });


    it('should not lint invalid expression', function() {

      // given
      const expression = 'from json(';

      // when
      const results = lint(expression, { engines: { camunda: '8.6' } });

      // then
      expect(results).to.have.length(0);
    });
  });


  describe('incompatible built-ins', function() {

    it('should report incompatible built-in', function() {

      // given
      const expression = 'from json("x")';

      // when
      const results = lint(expression, { engines: { camunda: '8.6' } });

      // then
      expect(results).to.have.length(1);
      expect(results[0]).to.include({
        from: 0,
        to: 9,
        severity: 'warning',
        type: 'compatibility',
        message: 'Function \'from json\' requires Camunda >=8.9'
      });
    });


    it('should report each invocation separately', function() {

      // given
      const expression = 'from json("x") + from json("y")';

      // when
      const results = lint(expression, { engines: { camunda: '8.6' } });

      // then
      expect(results).to.have.length(2);
      expect(results.map(r => [ r.from, r.to ])).to.eql([ [ 0, 9 ], [ 17, 26 ] ]);
    });


    it('should report multiple distinct built-ins', function() {

      // given
      const expression = 'from json(to json(x))';

      // when
      const results = lint(expression, { engines: { camunda: '8.6' } });

      // then
      expect(results).to.have.length(2);
      expect(results.map(r => r.message)).to.eql([
        'Function \'from json\' requires Camunda >=8.9',
        'Function \'to json\' requires Camunda >=8.9'
      ]);
    });
  });


  describe('scope awareness', function() {

    it('should not report a user-defined function shadowing a built-in', function() {

      // given
      const expression = '{ from json: function(v) v, a: from json("x") }';

      // when
      const results = lint(expression, { engines: { camunda: '8.6' } });

      // then
      expect(results).to.have.length(0);
    });


    it('should report only the built-in invocation when a name is both', function() {

      // given
      const expression = '{ a: from json("x"), b: { from json: function(v) v, c: from json("y") } }';

      // when
      const results = lint(expression, { engines: { camunda: '8.6' } });

      // then
      expect(results).to.have.length(1);
      expect(results[0].from).to.eql(5);
      expect(results[0].to).to.eql(14);
    });
  });


  describe('message', function() {

    it('should format multiple engine requirements', function() {

      // given
      const builtins = [ { name: 'from json', engines: { camunda: '>=8.9', zeebe: '>=8.9' } } ];

      // when
      const results = lint('from json("x")', { builtins, engines: { camunda: '8.6' } });

      // then
      expect(results).to.have.length(1);
      expect(results[0].message).to.eql('Function \'from json\' requires Camunda >=8.9, Zeebe >=8.9');
    });
  });
});
