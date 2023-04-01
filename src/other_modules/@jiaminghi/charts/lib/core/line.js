'use strict'

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.line = line

const _typeof2 = _interopRequireDefault(require('@babel/runtime/helpers/typeof'))

const _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'))

const _toConsumableArray2 = _interopRequireDefault(require('@babel/runtime/helpers/toConsumableArray'))

const _defineProperty2 = _interopRequireDefault(require('@babel/runtime/helpers/defineProperty'))

const _updater = require('../class/updater.class')

const _config = require('../config')

const _bezierCurve = _interopRequireDefault(require('@jiaminghi/bezier-curve'))

const _util = require('../util')

function ownKeys (object, enumerableOnly) { const keys = Object.keys(object); if (Object.getOwnPropertySymbols) { let symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable }); keys.push.apply(keys, symbols) } return keys }

function _objectSpread (target) { for (let i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]) }) } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)) }) } } return target }

const polylineToBezierCurve = _bezierCurve.default.polylineToBezierCurve
const getBezierCurveLength = _bezierCurve.default.getBezierCurveLength

function line (chart) {
  const option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
  const xAxis = option.xAxis
  const yAxis = option.yAxis
  const series = option.series
  let lines = []

  if (xAxis && yAxis && series) {
    lines = (0, _util.initNeedSeries)(series, _config.lineConfig, 'line')
    lines = calcLinesPosition(lines, chart)
  }

  (0, _updater.doUpdate)({
    chart: chart,
    series: lines,
    key: 'lineArea',
    getGraphConfig: getLineAreaConfig,
    getStartGraphConfig: getStartLineAreaConfig,
    beforeUpdate: beforeUpdateLineAndArea,
    beforeChange: beforeChangeLineAndArea
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: lines,
    key: 'line',
    getGraphConfig: getLineConfig,
    getStartGraphConfig: getStartLineConfig,
    beforeUpdate: beforeUpdateLineAndArea,
    beforeChange: beforeChangeLineAndArea
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: lines,
    key: 'linePoint',
    getGraphConfig: getPointConfig,
    getStartGraphConfig: getStartPointConfig
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: lines,
    key: 'lineLabel',
    getGraphConfig: getLabelConfig
  })
}

function calcLinesPosition (lines, chart) {
  const axisData = chart.axisData
  return lines.map(function (lineItem) {
    let lineData = (0, _util.mergeSameStackData)(lineItem, lines)
    lineData = mergeNonNumber(lineItem, lineData)
    const lineAxis = getLineAxis(lineItem, axisData)
    const linePosition = getLinePosition(lineData, lineAxis)
    const lineFillBottomPos = getLineFillBottomPos(lineAxis)
    return _objectSpread({}, lineItem, {
      linePosition: linePosition.filter(function (p) {
        return p
      }),
      lineFillBottomPos: lineFillBottomPos
    })
  })
}

function mergeNonNumber (lineItem, lineData) {
  const data = lineItem.data
  return lineData.map(function (v, i) {
    return typeof data[i] === 'number' ? v : null
  })
}

function getLineAxis (line, axisData) {
  const xAxisIndex = line.xAxisIndex
  const yAxisIndex = line.yAxisIndex
  const xAxis = axisData.find(function (_ref) {
    const axis = _ref.axis
    const index = _ref.index
    return axis === 'x' && index === xAxisIndex
  })
  const yAxis = axisData.find(function (_ref2) {
    const axis = _ref2.axis
    const index = _ref2.index
    return axis === 'y' && index === yAxisIndex
  })
  return [xAxis, yAxis]
}

function getLinePosition (lineData, lineAxis) {
  const valueAxisIndex = lineAxis.findIndex(function (_ref3) {
    const data = _ref3.data
    return data === 'value'
  })
  const valueAxis = lineAxis[valueAxisIndex]
  const labelAxis = lineAxis[1 - valueAxisIndex]
  const linePosition = valueAxis.linePosition
  const axis = valueAxis.axis
  const tickPosition = labelAxis.tickPosition
  const tickNum = tickPosition.length
  const valueAxisPosIndex = axis === 'x' ? 0 : 1
  const valueAxisStartPos = linePosition[0][valueAxisPosIndex]
  const valueAxisEndPos = linePosition[1][valueAxisPosIndex]
  const valueAxisPosMinus = valueAxisEndPos - valueAxisStartPos
  const maxValue = valueAxis.maxValue
  const minValue = valueAxis.minValue
  const valueMinus = maxValue - minValue
  const position = new Array(tickNum).fill(0).map(function (foo, i) {
    const v = lineData[i]
    if (typeof v !== 'number') return null
    let valuePercent = (v - minValue) / valueMinus
    if (valueMinus === 0) valuePercent = 0
    return valuePercent * valueAxisPosMinus + valueAxisStartPos
  })
  return position.map(function (vPos, i) {
    if (i >= tickNum || typeof vPos !== 'number') return null
    const pos = [vPos, tickPosition[i][1 - valueAxisPosIndex]]
    if (valueAxisPosIndex === 0) return pos
    pos.reverse()
    return pos
  })
}

function getLineFillBottomPos (lineAxis) {
  const valueAxis = lineAxis.find(function (_ref4) {
    const data = _ref4.data
    return data === 'value'
  })
  const axis = valueAxis.axis
  const linePosition = valueAxis.linePosition
  const minValue = valueAxis.minValue
  const maxValue = valueAxis.maxValue
  const changeIndex = axis === 'x' ? 0 : 1
  let changeValue = linePosition[0][changeIndex]

  if (minValue < 0 && maxValue > 0) {
    const valueMinus = maxValue - minValue
    const posMinus = Math.abs(linePosition[0][changeIndex] - linePosition[1][changeIndex])
    let offset = Math.abs(minValue) / valueMinus * posMinus
    if (axis === 'y') offset *= -1
    changeValue += offset
  }

  return {
    changeIndex: changeIndex,
    changeValue: changeValue
  }
}

function getLineAreaConfig (lineItem) {
  const animationCurve = lineItem.animationCurve
  const animationFrame = lineItem.animationFrame
  const lineFillBottomPos = lineItem.lineFillBottomPos
  const rLevel = lineItem.rLevel
  return [{
    name: getLineGraphName(lineItem),
    index: rLevel,
    animationCurve: animationCurve,
    animationFrame: animationFrame,
    visible: lineItem.lineArea.show,
    lineFillBottomPos: lineFillBottomPos,
    shape: getLineAndAreaShape(lineItem),
    style: getLineAreaStyle(lineItem),
    drawed: lineAreaDrawed
  }]
}

function getLineAndAreaShape (lineItem) {
  const linePosition = lineItem.linePosition
  return {
    points: linePosition
  }
}

function getLineAreaStyle (lineItem) {
  const lineArea = lineItem.lineArea
  const color = lineItem.color
  const gradient = lineArea.gradient
  let style = lineArea.style
  const fillColor = [style.fill || color]
  const gradientColor = (0, _util.deepMerge)(fillColor, gradient)
  if (gradientColor.length === 1) gradientColor.push(gradientColor[0])
  const gradientParams = getGradientParams(lineItem)
  style = _objectSpread({}, style, {
    stroke: 'rgba(0, 0, 0, 0)'
  })
  return (0, _util.deepMerge)({
    gradientColor: gradientColor,
    gradientParams: gradientParams,
    gradientType: 'linear',
    gradientWith: 'fill'
  }, style)
}

function getGradientParams (lineItem) {
  const lineFillBottomPos = lineItem.lineFillBottomPos
  const linePosition = lineItem.linePosition
  const changeIndex = lineFillBottomPos.changeIndex
  const changeValue = lineFillBottomPos.changeValue
  const mainPos = linePosition.map(function (p) {
    return p[changeIndex]
  })
  const maxPos = Math.max.apply(Math, (0, _toConsumableArray2.default)(mainPos))
  const minPos = Math.min.apply(Math, (0, _toConsumableArray2.default)(mainPos))
  let beginPos = maxPos
  if (changeIndex === 1) beginPos = minPos

  if (changeIndex === 1) {
    return [0, beginPos, 0, changeValue]
  } else {
    return [beginPos, 0, changeValue, 0]
  }
}

function lineAreaDrawed (_ref5, _ref6) {
  const lineFillBottomPos = _ref5.lineFillBottomPos
  const shape = _ref5.shape
  const ctx = _ref6.ctx
  const points = shape.points
  const changeIndex = lineFillBottomPos.changeIndex
  const changeValue = lineFillBottomPos.changeValue
  const linePoint1 = (0, _toConsumableArray2.default)(points[points.length - 1])
  const linePoint2 = (0, _toConsumableArray2.default)(points[0])
  linePoint1[changeIndex] = changeValue
  linePoint2[changeIndex] = changeValue
  ctx.lineTo.apply(ctx, (0, _toConsumableArray2.default)(linePoint1))
  ctx.lineTo.apply(ctx, (0, _toConsumableArray2.default)(linePoint2))
  ctx.closePath()
  ctx.fill()
}

function getStartLineAreaConfig (lineItem) {
  const config = getLineAreaConfig(lineItem)[0]

  const style = _objectSpread({}, config.style)

  style.opacity = 0
  config.style = style
  return [config]
}

function beforeUpdateLineAndArea (graphs, lineItem, i, updater) {
  const cache = graphs[i]
  if (!cache) return
  const currentName = getLineGraphName(lineItem)
  const render = updater.chart.render
  const name = cache[0].name
  const delAll = currentName !== name
  if (!delAll) return
  cache.forEach(function (g) {
    return render.delGraph(g)
  })
  graphs[i] = null
}

function beforeChangeLineAndArea (graph, config) {
  const points = config.shape.points
  const graphPoints = graph.shape.points
  const graphPointsNum = graphPoints.length
  const pointsNum = points.length

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

function getLineConfig (lineItem) {
  const animationCurve = lineItem.animationCurve
  const animationFrame = lineItem.animationFrame
  const rLevel = lineItem.rLevel
  return [{
    name: getLineGraphName(lineItem),
    index: rLevel + 1,
    animationCurve: animationCurve,
    animationFrame: animationFrame,
    shape: getLineAndAreaShape(lineItem),
    style: getLineStyle(lineItem)
  }]
}

function getLineGraphName (lineItem) {
  const smooth = lineItem.smooth
  return smooth ? 'smoothline' : 'polyline'
}

function getLineStyle (lineItem) {
  const lineStyle = lineItem.lineStyle
  const color = lineItem.color
  const smooth = lineItem.smooth
  const linePosition = lineItem.linePosition
  const lineLength = getLineLength(linePosition, smooth)
  return (0, _util.deepMerge)({
    stroke: color,
    lineDash: [lineLength, 0]
  }, lineStyle)
}

function getLineLength (points) {
  const smooth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false
  if (!smooth) return (0, _util.getPolylineLength)(points)
  const curve = polylineToBezierCurve(points)
  return getBezierCurveLength(curve)
}

function getStartLineConfig (lineItem) {
  const lineDash = lineItem.lineStyle.lineDash
  const config = getLineConfig(lineItem)[0]
  let realLineDash = config.style.lineDash

  if (lineDash) {
    realLineDash = [0, 0]
  } else {
    realLineDash = (0, _toConsumableArray2.default)(realLineDash).reverse()
  }

  config.style.lineDash = realLineDash
  return [config]
}

function getPointConfig (lineItem) {
  const animationCurve = lineItem.animationCurve
  const animationFrame = lineItem.animationFrame
  const rLevel = lineItem.rLevel
  const shapes = getPointShapes(lineItem)
  const style = getPointStyle(lineItem)
  return shapes.map(function (shape) {
    return {
      name: 'circle',
      index: rLevel + 2,
      visible: lineItem.linePoint.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: shape,
      style: style
    }
  })
}

function getPointShapes (lineItem) {
  const linePosition = lineItem.linePosition
  const radius = lineItem.linePoint.radius
  return linePosition.map(function (_ref7) {
    const _ref8 = (0, _slicedToArray2.default)(_ref7, 2)
    const rx = _ref8[0]
    const ry = _ref8[1]

    return {
      r: radius,
      rx: rx,
      ry: ry
    }
  })
}

function getPointStyle (lineItem) {
  const color = lineItem.color
  const style = lineItem.linePoint.style
  return (0, _util.deepMerge)({
    stroke: color
  }, style)
}

function getStartPointConfig (lineItem) {
  const configs = getPointConfig(lineItem)
  configs.forEach(function (config) {
    config.shape.r = 0.1
  })
  return configs
}

function getLabelConfig (lineItem) {
  const animationCurve = lineItem.animationCurve
  const animationFrame = lineItem.animationFrame
  const rLevel = lineItem.rLevel
  const shapes = getLabelShapes(lineItem)
  const style = getLabelStyle(lineItem)
  return shapes.map(function (shape, i) {
    return {
      name: 'text',
      index: rLevel + 3,
      visible: lineItem.label.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: shape,
      style: style
    }
  })
}

function getLabelShapes (lineItem) {
  const contents = formatterLabel(lineItem)
  const position = getLabelPosition(lineItem)
  return contents.map(function (content, i) {
    return {
      content: content,
      position: position[i]
    }
  })
}

function getLabelPosition (lineItem) {
  const linePosition = lineItem.linePosition
  const lineFillBottomPos = lineItem.lineFillBottomPos
  const label = lineItem.label
  const position = label.position
  const offset = label.offset
  const changeIndex = lineFillBottomPos.changeIndex
  const changeValue = lineFillBottomPos.changeValue
  return linePosition.map(function (pos) {
    if (position === 'bottom') {
      pos = (0, _toConsumableArray2.default)(pos)
      pos[changeIndex] = changeValue
    }

    if (position === 'center') {
      const bottom = (0, _toConsumableArray2.default)(pos)
      bottom[changeIndex] = changeValue
      pos = getCenterLabelPoint(pos, bottom)
    }

    return getOffsetedPoint(pos, offset)
  })
}

function getOffsetedPoint (_ref9, _ref10) {
  const _ref11 = (0, _slicedToArray2.default)(_ref9, 2)
  const x = _ref11[0]
  const y = _ref11[1]

  const _ref12 = (0, _slicedToArray2.default)(_ref10, 2)
  const ox = _ref12[0]
  const oy = _ref12[1]

  return [x + ox, y + oy]
}

function getCenterLabelPoint (_ref13, _ref14) {
  const _ref15 = (0, _slicedToArray2.default)(_ref13, 2)
  const ax = _ref15[0]
  const ay = _ref15[1]

  const _ref16 = (0, _slicedToArray2.default)(_ref14, 2)
  const bx = _ref16[0]
  const by = _ref16[1]

  return [(ax + bx) / 2, (ay + by) / 2]
}

function formatterLabel (lineItem) {
  let data = lineItem.data
  const formatter = lineItem.label.formatter
  data = data.filter(function (d) {
    return typeof d === 'number'
  }).map(function (d) {
    return d.toString()
  })
  if (!formatter) return data
  const type = (0, _typeof2.default)(formatter)
  if (type === 'string') {
    return data.map(function (d) {
      return formatter.replace('{value}', d)
    })
  }
  if (type === 'function') {
    return data.map(function (value, index) {
      return formatter({
        value: value,
        index: index
      })
    })
  }
  return data
}

function getLabelStyle (lineItem) {
  const color = lineItem.color
  const style = lineItem.label.style
  return (0, _util.deepMerge)({
    fill: color
  }, style)
}
