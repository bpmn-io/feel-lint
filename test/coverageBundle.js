import './globals.js';

// @ts-ignore-next-line
const allTests = import.meta.webpackContext('.', {
  recursive: true,
  regExp: /.spec\.js$/
});

allTests.keys().forEach(allTests);

// @ts-ignore-next-line
const allSources = import.meta.webpackContext('../lib', {
  recursive: true,
  regExp: /.*\.js$/
});

allSources.keys().forEach(allSources);