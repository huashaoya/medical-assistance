'use strict'

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.grid = grid

const _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'))

const _defineProperty2 = _interopRequireDefault(require('@babel/runtime/helpers/defineProperty'))

const _updater = require('../class/updater.class')

const _util = require('@jiaminghi/c-render/lib/plugin/util')

const _config = require('../config')

const _util2 = require('../util')

function ownKeys (object, enumerableOnly) { const keys = Object.keys(object); if (Object.getOwnPropertySymbols) { let symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable }); keys.push.apply(keys, symbols) } return keys }

function _objectSpread (target) { for (let i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]) }) } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)) }) } } return target }

function grid (chart) {
  const option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
  let grid = option.grid
  grid = (0, _util2.deepMerge)((0, _util.deepClone)(_config.gridConfig, true), grid || {});
  (0, _updater.doUpdate)({
    chart: chart,
    series: [grid],
    key: 'grid',
    getGraphConfig: getGridConfig
  })
}

function getGridConfig (gridItem, updater) {
  const animationCurve = gridItem.animationCurve
  const animationFrame = gridItem.animationFrame
  const rLevel = gridItem.rLevel
  const shape = getGridShape(gridItem, updater)
  const style = getGridStyle(gridItem)
  updater.chart.gridArea = _objectSpread({}, shape)
  return [{
    name: 'rect',
    index: rLevel,
    animationCurve: animationCurve,
    animationFrame: animationFrame,
    shape: shape,
    style: style
  }]
}

function getGridShape (gridItem, updater) {
  const _updater$chart$render = (0, _slicedToArray2.default)(updater.chart.render.area, 2)
  const w = _updater$chart$render[0]
  const h = _updater$chart$render[1]

  const left = getNumberValue(gridItem.left, w)
  const right = getNumberValue(gridItem.right, w)
  const top = getNumberValue(gridItem.top, h)
  const bottom = getNumberValue(gridItem.bottom, h)
  const width = w - left - right
  const height = h - top - bottom
  return {
    x: left,
    y: top,
    w: width,
    h: height
  }
}

function getNumberValue (val, all) {
  if (typeof val === 'number') return val
  if (typeof val !== 'string') return 0
  return all * parseInt(val) / 100
}

function getGridStyle (gridItem) {
  const style = gridItem.style
  return style
}
