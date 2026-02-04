# Changelog

All notable changes to [feel-lint](https://github.com/bpmn-io/feel-lint) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 3.1.0

* `DEPS`: update to `@bpmn-io/lezer-feel@2.1.0`

## 3.0.0

* `CHORE`: turn into ES module ([#45](https://github.com/bpmn-io/feel-lint/pull/45))
* `CHORE`: drop CJS distribution ([#45](https://github.com/bpmn-io/feel-lint/pull/45))
* `DEPS`: update to `@bpmn-io/lang-feel@3.0.0` ([#45](https://github.com/bpmn-io/feel-lint/pull/45))

### Breaking Changes

* Drop CJS distribution. To require from CJS use `Node >= 20.12.0`

## 2.1.0

* `FEAT`: support multi-line strings in camunda dialect ([@bpmn-io/lezer-feel#2](https://github.com/bpmn-io/lezer-feel/pull/2))
* `DEPS`: update to `@bpmn-io/lang-feel@2.4.0`
* `DEPS`: update to `@bpmn-io/lezer-feel@1.9.0` fork of `lezer-feel`

## 2.0.1

* `FIX`: recognize unclosed string literal as syntax error
* `DEPS`: update to `lezer-feel@1.7.1`

## 2.0.0

* `FEAT`: `builtins` & `variables` can be configured directly instead of `context` ([#36](https://github.com/bpmn-io/feel-lint/pull/36))

### Breaking Changes

* `context` is no longer supported, use `builtins` and `variables` instead ([#36](https://github.com/bpmn-io/feel-lint/pull/36))

## 1.4.0

* `FEAT`: allow to configure language parsing ([#23](https://github.com/bpmn-io/feel-lint/pull/23))
* `FEAT`: add ability to lint unary tests ([#23](https://github.com/bpmn-io/feel-lint/pull/23))
* `FEAT`: add ability to lint FEEL flavors ([#23](https://github.com/bpmn-io/feel-lint/pull/23))
* `DEPS`: update to `@codemirror/language@6.10.8`
* `DEPS`: update to `lezer-feel@1.7.0`

## 1.3.1

* `FIX`: make `first-item` a warning

## 1.3.0

* `FEAT`: add `first-item` rule ([#25](https://github.com/bpmn-io/feel-lint/issues/25))

## 1.2.0

* `FEAT`: provide more user friendly messages ([#2](https://github.com/bpmn-io/feel-lint/pull/2))

## 1.1.0

* `DEPS`: update to `lezer-feel@1.2.0`

## 1.0.0

* re-release `v0.2.0` as stable

## 0.2.0

* `DEPS`: bump to `lezer-feel@1.0.1`

### Breaking Changes

* We now treat any FEEL expression as a single expression, not a list of expressions.

## 0.1.1

* `DEPS`: bump `lezer-feel@0.15.0`

## 0.1.0

* initial release