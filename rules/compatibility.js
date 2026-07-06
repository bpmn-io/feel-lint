import { FeelAnalyzer } from '@bpmn-io/feel-analyzer';
import { isCompatible } from '@bpmn-io/semver-compat';

/**
 * @typedef {import('../lib/text/util.js').Variable} Variable
 * @typedef {import('../lib/shared/index.js').LintMessage} LintMessage
 *
 * @typedef {object} CompatibilityContext
 * @property {string} expression the full expression text
 * @property {Record<string, string>} [engines] provided engine versions, e.g. `{ camunda: '8.6' }`
 * @property {Variable[]} [builtins] built-ins, carrying `engines` requirements
 * @property {Variable[]} [reservedNameBuiltins] built-ins using reserved names (for parsing)
 * @property {'expression' | 'unaryTests'} [dialect]
 * @property {string} [parserDialect]
 */

const RULE_NAME = 'compatibility';

/**
 * Reports calls to built-in functions that are not available in the provided
 * engine version(s).
 *
 * No-op unless `engines` is provided and built-ins carry `engines` metadata.
 *
 * @param {CompatibilityContext} context
 *
 * @returns {LintMessage[]}
 */
export default function lintCompatibility(context = {}) {
  const {
    expression,
    engines,
    builtins = [],
    reservedNameBuiltins = [],
    dialect,
    parserDialect
  } = context;

  if (!engines || !Object.keys(engines).length || !builtins.length) {
    return [];
  }

  const unavailable = getUnavailableBuiltins(builtins, engines);

  if (!unavailable.size) {
    return [];
  }

  const analyzer = new FeelAnalyzer({
    dialect,
    parserDialect,
    builtins,
    reservedNameBuiltins
  });

  const { valid, functions = [] } = analyzer.analyzeExpression(expression);

  // syntax errors are reported separately; don't double-report on broken input
  if (!valid) {
    return [];
  }

  return functions.reduce((messages, fn) => {
    if (fn.type !== 'builtin') {
      return messages;
    }

    const builtin = unavailable.get(fn.name);

    if (!builtin) {
      return messages;
    }

    messages.push({
      from: fn.from,
      to: fn.to,
      severity: 'warning',
      type: RULE_NAME,
      message: `Function '${ fn.name }' requires ${ formatEngines(builtin.engines) }`
    });

    return messages;
  }, []);
}

// helpers //////////

function getUnavailableBuiltins(builtins, engines) {
  const unavailable = new Map();

  for (const builtin of builtins) {
    if (builtin.engines && !isCompatible(builtin.engines, engines)) {
      unavailable.set(builtin.name, builtin);
    }
  }

  return unavailable;
}

function formatEngines(engines) {
  return Object.entries(engines)
    .map(([ name, range ]) => `${ capitalize(name) } ${ range }`)
    .join(', ');
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
