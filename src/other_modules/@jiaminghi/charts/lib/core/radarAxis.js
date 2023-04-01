'use strict'

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.radarAxis = radarAxis

const _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'))

const _defineProperty2 = _interopRequireDefault(require('@babel/runtime/helpers/defineProperty'))

const _toConsumableArray2 = _interopRequireDefault(require('@babel/runtime/helpers/toConsumableArray'))

const _updater = require('../class/updater.class')

const _index = require('../config/index')

const _util = require('@jiaminghi/c-render/lib/plugin/util')

const _util2 = require('../util')

function ownKeys (object, enumerableOnly) { const keys = Object.keys(object); if (Object.getOwnPropertySymbols) { let symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable }); keys.push.apply(keys, symbols) } return keys }

function _objectSpread (target) { for (let i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]) }) } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)) }) } } return target }

function radarAxis (chart) {
  const option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
  const radar = option.radar
  let radarAxis = []

  if (radar) {
    radarAxis = mergeRadarAxisDefaultConfig(radar)
    radarAxis = calcRadarAxisCenter(radarAxis, chart)
    radarAxis = calcRadarAxisRingRadius(radarAxis, chart)
    radarAxis = calcRadarAxisLinePosition(radarAxis)
    radarAxis = calcRadarAxisAreaRadius(radarAxis)
    radarAxis = calcRadarAxisLabelPosition(radarAxis)
    radarAxis = [radarAxis]
  }

  let radarAxisForUpdate = radarAxis
  if (radarAxis.length && !radarAxis[0].show) radarAxisForUpdate = [];
  (0, _updater.doUpdate)({
    chart: chart,
    series: radarAxisForUpdate,
    key: 'radarAxisSplitArea',
    getGraphConfig: getSplitAreaConfig,
    beforeUpdate: beforeUpdateSplitArea,
    beforeChange: beforeChangeSplitArea
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: radarAxisForUpdate,
    key: 'radarAxisSplitLine',
    getGraphConfig: getSplitLineConfig,
    beforeUpdate: beforeUpdateSplitLine,
    beforeChange: beforeChangeSplitLine
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: radarAxisForUpdate,
    key: 'radarAxisLine',
    getGraphConfig: getAxisLineConfig
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: radarAxisForUpdate,
    key: 'radarAxisLable',
    getGraphConfig: getAxisLabelConfig
  })
  chart.radarAxis = radarAxis[0]
}

function mergeRadarAxisDefaultConfig (radar) {
  return (0, _util2.deepMerge)((0, _util.deepClone)(_index.radarAxisConfig), radar)
}

function calcRadarAxisCenter (radarAxis, chart) {
  const area = chart.render.area
  const center = radarAxis.center
  radarAxis.centerPos = center.map(function (v, i) {
    if (typeof v === 'number') return v
    return parseInt(v) / 100 * area[i]
  })
  return radarAxis
}

function calcRadarAxisRingRadius (radarAxis, chart) {
  const area = chart.render.area
  const splitNum = radarAxis.splitNum
  let radius = radarAxis.radius
  const maxRadius = Math.min.apply(Math, (0, _toConsumableArray2.default)(area)) / 2
  if (typeof radius !== 'number') radius = parseInt(radius) / 100 * maxRadius
  const splitGap = radius / splitNum
  radarAxis.ringRadius = new Array(splitNum).fill(0).map(function (foo, i) {
    return splitGap * (i + 1)
  })
  radarAxis.radius = radius
  return radarAxis
}

function calcRadarAxisLinePosition (radarAxis) {
  const indicator = radarAxis.indicator
  const centerPos = radarAxis.centerPos
  const radius = radarAxis.radius
  const startAngle = radarAxis.startAngle
  const fullAngle = Math.PI * 2
  const indicatorNum = indicator.length
  const indicatorGap = fullAngle / indicatorNum
  const angles = new Array(indicatorNum).fill(0).map(function (foo, i) {
    return indicatorGap * i + startAngle
  })
  radarAxis.axisLineAngles = angles
  radarAxis.axisLinePosition = angles.map(function (g) {
    return _util.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2.default)(centerPos).concat([radius, g]))
  })
  return radarAxis
}

function calcRadarAxisAreaRadius (radarAxis) {
  const ringRadius = radarAxis.ringRadius
  const subRadius = ringRadius[0] / 2
  radarAxis.areaRadius = ringRadius.map(function (r) {
    return r - subRadius
  })
  return radarAxis
}

function calcRadarAxisLabelPosition (radarAxis) {
  const axisLineAngles = radarAxis.axisLineAngles
  const centerPos = radarAxis.centerPos
  let radius = radarAxis.radius
  const axisLabel = radarAxis.axisLabel
  radius += axisLabel.labelGap
  radarAxis.axisLabelPosition = axisLineAngles.map(function (angle) {
    return _util.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2.default)(centerPos).concat([radius, angle]))
  })
  return radarAxis
}

function getSplitAreaConfig (radarAxis) {
  const areaRadius = radarAxis.areaRadius
  const polygon = radarAxis.polygon
  const animationCurve = radarAxis.animationCurve
  const animationFrame = radarAxis.animationFrame
  const rLevel = radarAxis.rLevel
  const name = polygon ? 'regPolygon' : 'ring'
  return areaRadius.map(function (foo, i) {
    return {
      name: name,
      index: rLevel,
      visible: radarAxis.splitArea.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getSplitAreaShape(radarAxis, i),
      style: getSplitAreaStyle(radarAxis, i)
    }
  })
}

function getSplitAreaShape (radarAxis, i) {
  const polygon = radarAxis.polygon
  const areaRadius = radarAxis.areaRadius
  const indicator = radarAxis.indicator
  const centerPos = radarAxis.centerPos
  const indicatorNum = indicator.length
  const shape = {
    rx: centerPos[0],
    ry: centerPos[1],
    r: areaRadius[i]
  }
  if (polygon) shape.side = indicatorNum
  return shape
}

function getSplitAreaStyle (radarAxis, i) {
  const splitArea = radarAxis.splitArea
  const ringRadius = radarAxis.ringRadius
  const axisLineAngles = radarAxis.axisLineAngles
  const polygon = radarAxis.polygon
  const centerPos = radarAxis.centerPos
  const color = splitArea.color
  let style = splitArea.style
  style = _objectSpread({
    fill: 'rgba(0, 0, 0, 0)'
  }, style)
  let lineWidth = ringRadius[0] - 0

  if (polygon) {
    const point1 = _util.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2.default)(centerPos).concat([ringRadius[0], axisLineAngles[0]]))

    const point2 = _util.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2.default)(centerPos).concat([ringRadius[0], axisLineAngles[1]]))

    lineWidth = (0, _util2.getPointToLineDistance)(centerPos, point1, point2)
  }

  style = (0, _util2.deepMerge)((0, _util.deepClone)(style, true), {
    lineWidth: lineWidth
  })
  if (!color.length) return style
  const colorNum = color.length
  return (0, _util2.deepMerge)(style, {
    stroke: color[i % colorNum]
  })
}

function beforeUpdateSplitArea (graphs, radarAxis, i, updater) {
  const cache = graphs[i]
  if (!cache) return
  const render = updater.chart.render
  const polygon = radarAxis.polygon
  const name = cache[0].name
  const currentName = polygon ? 'regPolygon' : 'ring'
  const delAll = currentName !== name
  if (!delAll) return
  cache.forEach(function (g) {
    return render.delGraph(g)
  })
  graphs[i] = null
}

function beforeChangeSplitArea (graph, config) {
  const side = config.shape.side
  if (typeof side !== 'number') return
  graph.shape.side = side
}

function getSplitLineConfig (radarAxis) {
  const ringRadius = radarAxis.ringRadius
  const polygon = radarAxis.polygon
  const animationCurve = radarAxis.animationCurve
  const animationFrame = radarAxis.animationFrame
  const rLevel = radarAxis.rLevel
  const name = polygon ? 'regPolygon' : 'ring'
  return ringRadius.map(function (foo, i) {
    return {
      name: name,
      index: rLevel,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      visible: radarAxis.splitLine.show,
      shape: getSplitLineShape(radarAxis, i),
      style: getSplitLineStyle(radarAxis, i)
    }
  })
}

function getSplitLineShape (radarAxis, i) {
  const ringRadius = radarAxis.ringRadius
  const centerPos = radarAxis.centerPos
  const indicator = radarAxis.indicator
  const polygon = radarAxis.polygon
  const shape = {
    rx: centerPos[0],
    ry: centerPos[1],
    r: ringRadius[i]
  }
  const indicatorNum = indicator.length
  if (polygon) shape.side = indicatorNum
  return shape
}

function getSplitLineStyle (radarAxis, i) {
  const splitLine = radarAxis.splitLine
  const color = splitLine.color
  let style = splitLine.style
  style = _objectSpread({
    fill: 'rgba(0, 0, 0, 0)'
  }, style)
  if (!color.length) return style
  const colorNum = color.length
  return (0, _util2.deepMerge)(style, {
    stroke: color[i % colorNum]
  })
}

function beforeUpdateSplitLine (graphs, radarAxis, i, updater) {
  const cache = graphs[i]
  if (!cache) return
  const render = updater.chart.render
  const polygon = radarAxis.polygon
  const name = cache[0].name
  const currenName = polygon ? 'regPolygon' : 'ring'
  const delAll = currenName !== name
  if (!delAll) return
  cache.forEach(function (g) {
    return render.delGraph(g)
  })
  graphs[i] = null
}

function beforeChangeSplitLine (graph, config) {
  const side = config.shape.side
  if (typeof side !== 'number') return
  graph.shape.side = side
}

function getAxisLineConfig (radarAxis) {
  const axisLinePosition = radarAxis.axisLinePosition
  const animationCurve = radarAxis.animationCurve
  const animationFrame = radarAxis.animationFrame
  const rLevel = radarAxis.rLevel
  return axisLinePosition.map(function (foo, i) {
    return {
      name: 'polyline',
      index: rLevel,
      visible: radarAxis.axisLine.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getAxisLineShape(radarAxis, i),
      style: getAxisLineStyle(radarAxis, i)
    }
  })
}

function getAxisLineShape (radarAxis, i) {
  const centerPos = radarAxis.centerPos
  const axisLinePosition = radarAxis.axisLinePosition
  const points = [centerPos, axisLinePosition[i]]
  return {
    points: points
  }
}

function getAxisLineStyle (radarAxis, i) {
  const axisLine = radarAxis.axisLine
  const color = axisLine.color
  const style = axisLine.style
  if (!color.length) return style
  const colorNum = color.length
  return (0, _util2.deepMerge)(style, {
    stroke: color[i % colorNum]
  })
}

function getAxisLabelConfig (radarAxis) {
  const axisLabelPosition = radarAxis.axisLabelPosition
  const animationCurve = radarAxis.animationCurve
  const animationFrame = radarAxis.animationFrame
  const rLevel = radarAxis.rLevel
  return axisLabelPosition.map(function (foo, i) {
    return {
      name: 'text',
      index: rLevel,
      visible: radarAxis.axisLabel.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getAxisLableShape(radarAxis, i),
      style: getAxisLableStyle(radarAxis, i)
    }
  })
}

function getAxisLableShape (radarAxis, i) {
  const axisLabelPosition = radarAxis.axisLabelPosition
  const indicator = radarAxis.indicator
  return {
    content: indicator[i].name,
    position: axisLabelPosition[i]
  }
}

function getAxisLableStyle (radarAxis, i) {
  const axisLabel = radarAxis.axisLabel
  const _radarAxis$centerPos = (0, _slicedToArray2.default)(radarAxis.centerPos, 2)
  const x = _radarAxis$centerPos[0]
  const y = _radarAxis$centerPos[1]
  const axisLabelPosition = radarAxis.axisLabelPosition

  const color = axisLabel.color
  let style = axisLabel.style

  const _axisLabelPosition$i = (0, _slicedToArray2.default)(axisLabelPosition[i], 2)
  const labelXpos = _axisLabelPosition$i[0]
  const labelYPos = _axisLabelPosition$i[1]

  const textAlign = labelXpos > x ? 'left' : 'right'
  const textBaseline = labelYPos > y ? 'top' : 'bottom'
  style = (0, _util2.deepMerge)({
    textAlign: textAlign,
    textBaseline: textBaseline
  }, style)
  if (!color.length) return style
  const colorNum = color.length
  return (0, _util2.deepMerge)(style, {
    fill: color[i % colorNum]
  })
}
