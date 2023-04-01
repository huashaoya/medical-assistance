'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.mergeColor = mergeColor

const _config = require('../config')

const _util = require('@jiaminghi/c-render/lib/plugin/util')

const _util2 = require('../util')

function mergeColor (chart) {
  const option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
  const defaultColor = (0, _util.deepClone)(_config.colorConfig, true)
  let color = option.color
  let series = option.series
  if (!series) series = []
  if (!color) color = []
  option.color = color = (0, _util2.deepMerge)(defaultColor, color)
  if (!series.length) return
  const colorNum = color.length
  series.forEach(function (item, i) {
    if (item.color) return
    item.color = color[i % colorNum]
  })
  const pies = series.filter(function (_ref) {
    const type = _ref.type
    return type === 'pie'
  })
  pies.forEach(function (pie) {
    return pie.data.forEach(function (di, i) {
      return di.color = color[i % colorNum]
    })
  })
  const gauges = series.filter(function (_ref2) {
    const type = _ref2.type
    return type === 'gauge'
  })
  gauges.forEach(function (gauge) {
    return gauge.data.forEach(function (di, i) {
      return di.color = color[i % colorNum]
    })
  })
  const barWithIndependentColor = series.filter(function (_ref3) {
    const type = _ref3.type
    const independentColor = _ref3.independentColor
    return type === 'bar' && independentColor
  })
  barWithIndependentColor.forEach(function (bar) {
    if (bar.independentColors) return
    bar.independentColors = color
  })
}
