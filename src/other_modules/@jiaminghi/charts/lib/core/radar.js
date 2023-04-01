'use strict'

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.radar = radar

const _defineProperty2 = _interopRequireDefault(require('@babel/runtime/helpers/defineProperty'))

const _typeof2 = _interopRequireDefault(require('@babel/runtime/helpers/typeof'))

const _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'))

const _toConsumableArray2 = _interopRequireDefault(require('@babel/runtime/helpers/toConsumableArray'))

const _updater = require('../class/updater.class')

const _index = require('../config/index')

const _util = require('@jiaminghi/c-render/lib/plugin/util')

const _color = require('@jiaminghi/color')

const _util2 = require('../util')

function ownKeys (object, enumerableOnly) { const keys = Object.keys(object); if (Object.getOwnPropertySymbols) { let symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable }); keys.push.apply(keys, symbols) } return keys }

function _objectSpread (target) { for (let i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]) }) } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)) }) } } return target }

function radar (chart) {
  const option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
  let series = option.series
  if (!series) series = []
  let radars = (0, _util2.initNeedSeries)(series, _index.radarConfig, 'radar')
  radars = calcRadarPosition(radars, chart)
  radars = calcRadarLabelPosition(radars, chart)
  radars = calcRadarLabelAlign(radars, chart);
  (0, _updater.doUpdate)({
    chart: chart,
    series: radars,
    key: 'radar',
    getGraphConfig: getRadarConfig,
    getStartGraphConfig: getStartRadarConfig,
    beforeChange: beforeChangeRadar
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: radars,
    key: 'radarPoint',
    getGraphConfig: getPointConfig,
    getStartGraphConfig: getStartPointConfig
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: radars,
    key: 'radarLabel',
    getGraphConfig: getLabelConfig
  })
}

function calcRadarPosition (radars, chart) {
  const radarAxis = chart.radarAxis
  if (!radarAxis) return []
  const indicator = radarAxis.indicator
  const axisLineAngles = radarAxis.axisLineAngles
  const radius = radarAxis.radius
  const centerPos = radarAxis.centerPos
  radars.forEach(function (radarItem) {
    const data = radarItem.data
    radarItem.dataRadius = []
    radarItem.radarPosition = indicator.map(function (_ref, i) {
      let max = _ref.max
      let min = _ref.min
      let v = data[i]
      if (typeof max !== 'number') max = v
      if (typeof min !== 'number') min = 0
      if (typeof v !== 'number') v = min
      const dataRadius = (v - min) / (max - min) * radius
      radarItem.dataRadius[i] = dataRadius
      return _util.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2.default)(centerPos).concat([dataRadius, axisLineAngles[i]]))
    })
  })
  return radars
}

function calcRadarLabelPosition (radars, chart) {
  const radarAxis = chart.radarAxis
  if (!radarAxis) return []
  const centerPos = radarAxis.centerPos
  const axisLineAngles = radarAxis.axisLineAngles
  radars.forEach(function (radarItem) {
    const dataRadius = radarItem.dataRadius
    const label = radarItem.label
    const labelGap = label.labelGap
    radarItem.labelPosition = dataRadius.map(function (r, i) {
      return _util.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2.default)(centerPos).concat([r + labelGap, axisLineAngles[i]]))
    })
  })
  return radars
}

function calcRadarLabelAlign (radars, chart) {
  const radarAxis = chart.radarAxis
  if (!radarAxis) return []

  const _radarAxis$centerPos = (0, _slicedToArray2.default)(radarAxis.centerPos, 2)
  const x = _radarAxis$centerPos[0]
  const y = _radarAxis$centerPos[1]

  radars.forEach(function (radarItem) {
    const labelPosition = radarItem.labelPosition
    const labelAlign = labelPosition.map(function (_ref2) {
      const _ref3 = (0, _slicedToArray2.default)(_ref2, 2)
      const lx = _ref3[0]
      const ly = _ref3[1]

      const textAlign = lx > x ? 'left' : 'right'
      const textBaseline = ly > y ? 'top' : 'bottom'
      return {
        textAlign: textAlign,
        textBaseline: textBaseline
      }
    })
    radarItem.labelAlign = labelAlign
  })
  return radars
}

function getRadarConfig (radarItem) {
  const animationCurve = radarItem.animationCurve
  const animationFrame = radarItem.animationFrame
  const rLevel = radarItem.rLevel
  return [{
    name: 'polyline',
    index: rLevel,
    animationCurve: animationCurve,
    animationFrame: animationFrame,
    shape: getRadarShape(radarItem),
    style: getRadarStyle(radarItem)
  }]
}

function getStartRadarConfig (radarItem, updater) {
  const centerPos = updater.chart.radarAxis.centerPos
  const config = getRadarConfig(radarItem)[0]
  const pointNum = config.shape.points.length
  const points = new Array(pointNum).fill(0).map(function (foo) {
    return (0, _toConsumableArray2.default)(centerPos)
  })
  config.shape.points = points
  return [config]
}

function getRadarShape (radarItem) {
  const radarPosition = radarItem.radarPosition
  return {
    points: radarPosition,
    close: true
  }
}

function getRadarStyle (radarItem) {
  const radarStyle = radarItem.radarStyle
  const color = radarItem.color
  const colorRgbaValue = (0, _color.getRgbaValue)(color)
  colorRgbaValue[3] = 0.5
  const radarDefaultColor = {
    stroke: color,
    fill: (0, _color.getColorFromRgbValue)(colorRgbaValue)
  }
  return (0, _util2.deepMerge)(radarDefaultColor, radarStyle)
}

function beforeChangeRadar (graph, _ref4) {
  const shape = _ref4.shape
  const graphPoints = graph.shape.points
  const graphPointsNum = graphPoints.length
  const pointsNum = shape.points.length

  if (pointsNum > graphPointsNum) {
    const lastPoint = graphPoints.slice(-1)[0]
    const newAddPoints = new Array(pointsNum - graphPointsNum).fill(0).map(function (foo) {
      return (0, _toConsumableArray2.default)(lastPoint)
    })
    graphPoints.push.apply(graphPoints, (0, _toConsumableArray2.default)(newAddPoints))
  } else if (pointsNum < graphPointsNum) {
    graphPoints.splice(pointsNum)
  }
}

function getPointConfig (radarItem) {
  const radarPosition = radarItem.radarPosition
  const animationCurve = radarItem.animationCurve
  const animationFrame = radarItem.animationFrame
  const rLevel = radarItem.rLevel
  return radarPosition.map(function (foo, i) {
    return {
      name: 'circle',
      index: rLevel,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      visible: radarItem.point.show,
      shape: getPointShape(radarItem, i),
      style: getPointStyle(radarItem, i)
    }
  })
}

function getStartPointConfig (radarItem) {
  const configs = getPointConfig(radarItem)
  configs.forEach(function (config) {
    return config.shape.r = 0.01
  })
  return configs
}

function getPointShape (radarItem, i) {
  const radarPosition = radarItem.radarPosition
  const point = radarItem.point
  const radius = point.radius
  const position = radarPosition[i]
  return {
    rx: position[0],
    ry: position[1],
    r: radius
  }
}

function getPointStyle (radarItem, i) {
  const point = radarItem.point
  const color = radarItem.color
  const style = point.style
  return (0, _util2.deepMerge)({
    stroke: color
  }, style)
}

function getLabelConfig (radarItem) {
  const labelPosition = radarItem.labelPosition
  const animationCurve = radarItem.animationCurve
  const animationFrame = radarItem.animationFrame
  const rLevel = radarItem.rLevel
  return labelPosition.map(function (foo, i) {
    return {
      name: 'text',
      index: rLevel,
      visible: radarItem.label.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getLabelShape(radarItem, i),
      style: getLabelStyle(radarItem, i)
    }
  })
}

function getLabelShape (radarItem, i) {
  const labelPosition = radarItem.labelPosition
  const label = radarItem.label
  const data = radarItem.data
  const offset = label.offset
  const formatter = label.formatter
  const position = mergePointOffset(labelPosition[i], offset)
  let labelText = data[i] ? data[i].toString() : '0'
  const formatterType = (0, _typeof2.default)(formatter)
  if (formatterType === 'string') labelText = formatter.replace('{value}', labelText)
  if (formatterType === 'function') labelText = formatter(labelText)
  return {
    content: labelText,
    position: position
  }
}

function mergePointOffset (_ref5, _ref6) {
  const _ref7 = (0, _slicedToArray2.default)(_ref5, 2)
  const x = _ref7[0]
  const y = _ref7[1]

  const _ref8 = (0, _slicedToArray2.default)(_ref6, 2)
  const ox = _ref8[0]
  const oy = _ref8[1]

  return [x + ox, y + oy]
}

function getLabelStyle (radarItem, i) {
  const label = radarItem.label
  const color = radarItem.color
  const labelAlign = radarItem.labelAlign
  const style = label.style

  const defaultColorAndAlign = _objectSpread({
    fill: color
  }, labelAlign[i])

  return (0, _util2.deepMerge)(defaultColorAndAlign, style)
}
