'use strict'

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.title = title

const _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'))

const _updater = require('../class/updater.class')

const _util = require('@jiaminghi/c-render/lib/plugin/util')

const _config = require('../config')

const _util2 = require('../util')

function title (chart) {
  const option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
  const title = []

  if (option.title) {
    title[0] = (0, _util2.deepMerge)((0, _util.deepClone)(_config.titleConfig, true), option.title)
  }

  (0, _updater.doUpdate)({
    chart: chart,
    series: title,
    key: 'title',
    getGraphConfig: getTitleConfig
  })
}

function getTitleConfig (titleItem, updater) {
  const animationCurve = _config.titleConfig.animationCurve
  const animationFrame = _config.titleConfig.animationFrame
  const rLevel = _config.titleConfig.rLevel
  const shape = getTitleShape(titleItem, updater)
  const style = getTitleStyle(titleItem)
  return [{
    name: 'text',
    index: rLevel,
    visible: titleItem.show,
    animationCurve: animationCurve,
    animationFrame: animationFrame,
    shape: shape,
    style: style
  }]
}

function getTitleShape (titleItem, updater) {
  const offset = titleItem.offset
  const text = titleItem.text
  const _updater$chart$gridAr = updater.chart.gridArea
  const x = _updater$chart$gridAr.x
  const y = _updater$chart$gridAr.y
  const w = _updater$chart$gridAr.w

  const _offset = (0, _slicedToArray2.default)(offset, 2)
  const ox = _offset[0]
  const oy = _offset[1]

  return {
    content: text,
    position: [x + w / 2 + ox, y + oy]
  }
}

function getTitleStyle (titleItem) {
  const style = titleItem.style
  return style
}
