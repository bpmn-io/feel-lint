// configures browsers to run test against
// any of [ 'ChromeHeadless', 'Chrome', 'Firefox' ]
const browsers = (process.env.TEST_BROWSERS || 'ChromeHeadless').split(',');

const singleStart = process.env.SINGLE_START;

const coverage = process.env.COVERAGE;

// use puppeteer provided Chrome for testing
process.env.CHROME_BIN = require('puppeteer').executablePath();

const suite = coverage ? 'coverageBundle.js' : 'testBundle.js';

module.exports = function(karma) {

  const config = {
    frameworks: [
      'webpack',
      'mocha'
    ],

    files: [
      suite
    ],

    preprocessors: {
      [ suite ]: [ 'webpack', 'env' ]
    },

    reporters: [ 'progress' ].concat(coverage ? 'coverage' : []),

    coverageReporter: {
      reporters: [
        { type: 'lcov', subdir: '.' },
      ]
    },

    browsers,

    singleRun: true,
    autoWatch: false,

    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /test\/globals\.js$/,
            sideEffects: true
          },
          {
            test: /\.(css|html)$/,
            type: 'asset/source'
          },
          {
            test: /\.json$/,
            type: 'json'
          }
        ]
      },
      resolve: {
        mainFields: [
          'browser',
          'module',
          'main'
        ],
        modules: [
          'node_modules',
          __dirname
        ]
      },
      devtool: 'eval-source-map'
    }
  };

  if (singleStart) {
    config.browsers = [].concat(config.browsers, 'Debug');
    config.envPreprocessor = [].concat(config.envPreprocessor || [], 'SINGLE_START');
  }

  karma.set(config);
};
