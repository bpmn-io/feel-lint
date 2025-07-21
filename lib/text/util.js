/**
 * @typedef {object} Variable
 * @property {string} name name or key of the variable
 * @property {string} [info] longer description of the variable content
 * @property {string} [detail] short information about the variable, e.g. type
 * @property {boolean} [isList] whether the variable is a list
 * @property {Array<Variable>} [schema] array of child variables if the variable is a context or list
 * @property {Array<{name: string, type: string}>} [params] function parameters
 */

/**
 * @param { Variable[] } variables
 *
 * @return {Record<string, any>}
 */
export function createContext(variables) {
  return variables.slice().reverse().reduce((context, variable) => {
    context[variable.name] = () => {};

    return context;
  }, {});
}
