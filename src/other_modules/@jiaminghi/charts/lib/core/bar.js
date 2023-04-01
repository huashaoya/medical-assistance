'use strict'

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.bar = bar

const _typeof2 = _interopRequireDefault(require('@babel/runtime/helpers/typeof'))

const _defineProperty2 = _interopRequireDefault(require('@babel/runtime/helpers/defineProperty'))

const _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'))

const _toConsumableArray2 = _interopRequireDefault(require('@babel/runtime/helpers/toConsumableArray'))

const _updater = require('../class/updater.class')

const _config = require('../config')

const _util = require('@jiaminghi/c-render/lib/plugin/util')

const _util2 = require('../util')

function ownKeys (object, enumerableOnly) { const keys = Object.keys(object); if (Object.getOwnPropertySymbols) { let symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable }); keys.push.apply(keys, symbols) } return keys }

function _objectSpread (target) { for (let i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]) }) } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)) }) } } return target }

function bar (chart) {
  const option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
  const xAxis = option.xAxis
  const yAxis = option.yAxis
  const series = option.series
  let bars = []

  if (xAxis && yAxis && series) {
    bars = (0, _util2.initNeedSeries)(series, _config.barConfig, 'bar')
    bars = setBarAxis(bars, chart)
    bars = setBarPositionData(bars, chart)
    bars = calcBarsPosition(bars, chart)
  }

  (0, _updater.doUpdate)({
    chart: chart,
    series: bars.slice(-1),
    key: 'backgroundBar',
    getGraphConfig: getBackgroundBarConfig
  })
  bars.reverse();
  (0, _updater.doUpdate)({
    chart: chart,
    series: bars,
    key: 'bar',
    getGraphConfig: getBarConfig,
    getStartGraphConfig: getStartBarConfig,
    beforeUpdate: beforeUpdateBar
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: bars,
    key: 'barLabel',
    getGraphConfig: getLabelConfig
  })
}

function setBarAxis (bars, chart) {
  const axisData = chart.axisData
  bars.forEach(function (bar) {
    let xAxisIndex = bar.xAxisIndex
    let yAxisIndex = bar.yAxisIndex
    if (typeof xAxisIndex !== 'number') xAxisIndex = 0
    if (typeof yAxisIndex !== 'number') yAxisIndex = 0
    const xAxis = axisData.find(function (_ref) {
      const axis = _ref.axis
      const index = _ref.index
      return ''.concat(axis).concat(index) === 'x'.concat(xAxisIndex)
    })
    const yAxis = axisData.find(function (_ref2) {
      const axis = _ref2.axis
      const index = _ref2.index
      return ''.concat(axis).concat(index) === 'y'.concat(yAxisIndex)
    })
    const axis = [xAxis, yAxis]
    const valueAxisIndex = axis.findIndex(function (_ref3) {
      const data = _ref3.data
      return data === 'value'
    })
    bar.valueAxis = axis[valueAxisIndex]
    bar.labelAxis = axis[1 - valueAxisIndex]
  })
  return bars
}

function setBarPositionData (bars, chart) {
  const labelBarGroup = groupBarByLabelAxis(bars)
  labelBarGroup.forEach(function (group) {
    setBarIndex(group)
    setBarNum(group)
    setBarCategoryWidth(group, chart)
    setBarWidthAndGap(group)
    setBarAllWidthAndGap(group)
  })
  return bars
}

function setBarIndex (bars) {
  let stacks = getBarStack(bars)
  stacks = stacks.map(function (stack) {
    return {
      stack: stack,
      index: -1
    }
  })
  let currentIndex = 0
  bars.forEach(function (bar) {
    const stack = bar.stack

    if (!stack) {
      bar.barIndex = currentIndex
      currentIndex++
    } else {
      const stackData = stacks.find(function (_ref4) {
        const s = _ref4.stack
        return s === stack
      })

      if (stackData.index === -1) {
        stackData.index = currentIndex
        currentIndex++
      }

      bar.barIndex = stackData.index
    }
  })
}

function groupBarByLabelAxis (bars) {
  let labelAxis = bars.map(function (_ref5) {
    const _ref5$labelAxis = _ref5.labelAxis
    const axis = _ref5$labelAxis.axis
    const index = _ref5$labelAxis.index
    return axis + index
  })
  labelAxis = (0, _toConsumableArray2.default)(new Set(labelAxis))
  return labelAxis.map(function (axisIndex) {
    return bars.filter(function (_ref6) {
      const _ref6$labelAxis = _ref6.labelAxis
      const axis = _ref6$labelAxis.axis
      const index = _ref6$labelAxis.index
      return axis + index === axisIndex
    })
  })
}

function getBarStack (bars) {
  const stacks = []
  bars.forEach(function (_ref7) {
    const stack = _ref7.stack
    if (stack) stacks.push(stack)
  })
  return (0, _toConsumableArray2.default)(new Set(stacks))
}

function setBarNum (bars) {
  const barNum = (0, _toConsumableArray2.default)(new Set(bars.map(function (_ref8) {
    const barIndex = _ref8.barIndex
    return barIndex
  }))).length
  bars.forEach(function (bar) {
    return bar.barNum = barNum
  })
}

function setBarCategoryWidth (bars) {
  const lastBar = bars.slice(-1)[0]
  const barCategoryGap = lastBar.barCategoryGap
  const tickGap = lastBar.labelAxis.tickGap
  let barCategoryWidth = 0

  if (typeof barCategoryGap === 'number') {
    barCategoryWidth = barCategoryGap
  } else {
    barCategoryWidth = (1 - parseInt(barCategoryGap) / 100) * tickGap
  }

  bars.forEach(function (bar) {
    return bar.barCategoryWidth = barCategoryWidth
  })
}

function setBarWidthAndGap (bars) {
  const _bars$slice$ = bars.slice(-1)[0]
  const barCategoryWidth = _bars$slice$.barCategoryWidth
  const barWidth = _bars$slice$.barWidth
  const barGap = _bars$slice$.barGap
  const barNum = _bars$slice$.barNum
  let widthAndGap = []

  if (typeof barWidth === 'number' || barWidth !== 'auto') {
    widthAndGap = getBarWidthAndGapWithPercentOrNumber(barCategoryWidth, barWidth, barGap, barNum)
  } else if (barWidth === 'auto') {
    widthAndGap = getBarWidthAndGapWidthAuto(barCategoryWidth, barWidth, barGap, barNum)
  }

  const _widthAndGap = widthAndGap
  const _widthAndGap2 = (0, _slicedToArray2.default)(_widthAndGap, 2)
  const width = _widthAndGap2[0]
  const gap = _widthAndGap2[1]

  bars.forEach(function (bar) {
    bar.barWidth = width
    bar.barGap = gap
  })
}

function getBarWidthAndGapWithPercentOrNumber (barCategoryWidth, barWidth, barGap) {
  let width = 0
  let gap = 0

  if (typeof barWidth === 'number') {
    width = barWidth
  } else {
    width = parseInt(barWidth) / 100 * barCategoryWidth
  }

  if (typeof barGap === 'number') {
    gap = barGap
  } else {
    gap = parseInt(barGap) / 100 * width
  }

  return [width, gap]
}

function getBarWidthAndGapWidthAuto (barCategoryWidth, barWidth, barGap, barNum) {
  let width = 0
  let gap = 0
  const barItemWidth = barCategoryWidth / barNum

  if (typeof barGap === 'number') {
    gap = barGap
    width = barItemWidth - gap
  } else {
    const percent = 10 + parseInt(barGap) / 10

    if (percent === 0) {
      width = barItemWidth * 2
      gap = -width
    } else {
      width = barItemWidth / percent * 10
      gap = barItemWidth - width
    }
  }

  return [width, gap]
}

function setBarAllWidthAndGap (bars) {
  const _bars$slice$2 = bars.slice(-1)[0]
  const barGap = _bars$slice$2.barGap
  const barWidth = _bars$slice$2.barWidth
  const barNum = _bars$slice$2.barNum
  const barAllWidthAndGap = (barGap + barWidth) * barNum - barGap
  bars.forEach(function (bar) {
    return bar.barAllWidthAndGap = barAllWidthAndGap
  })
}

function calcBarsPosition (bars, chart) {
  bars = calcBarValueAxisCoordinate(bars)
  bars = calcBarLabelAxisCoordinate(bars)
  bars = eliminateNullBarLabelAxis(bars)
  bars = keepSameNumBetweenBarAndData(bars)
  return bars
}

function calcBarLabelAxisCoordinate (bars) {
  return bars.map(function (bar) {
    const labelAxis = bar.labelAxis
    const barAllWidthAndGap = bar.barAllWidthAndGap
    const barGap = bar.barGap
    const barWidth = bar.barWidth
    const barIndex = bar.barIndex
    const tickGap = labelAxis.tickGap
    const tickPosition = labelAxis.tickPosition
    const axis = labelAxis.axis
    const coordinateIndex = axis === 'x' ? 0 : 1
    const barLabelAxisPos = tickPosition.map(function (tick, i) {
      const barCategoryStartPos = tickPosition[i][coordinateIndex] - tickGap / 2
      const barItemsStartPos = barCategoryStartPos + (tickGap - barAllWidthAndGap) / 2
      return barItemsStartPos + (barIndex + 0.5) * barWidth + barIndex * barGap
    })
    return _objectSpread({}, bar, {
      barLabelAxisPos: barLabelAxisPos
    })
  })
}

function calcBarValueAxisCoordinate (bars) {
  return bars.map(function (bar) {
    let data = (0, _util2.mergeSameStackData)(bar, bars)
    data = eliminateNonNumberData(bar, data)
    const _bar$valueAxis = bar.valueAxis
    const axis = _bar$valueAxis.axis
    const minValue = _bar$valueAxis.minValue
    const maxValue = _bar$valueAxis.maxValue
    const linePosition = _bar$valueAxis.linePosition
    const startPos = getValuePos(minValue, maxValue, minValue < 0 ? 0 : minValue, linePosition, axis)
    const endPos = data.map(function (v) {
      return getValuePos(minValue, maxValue, v, linePosition, axis)
    })
    const barValueAxisPos = endPos.map(function (p) {
      return [startPos, p]
    })
    return _objectSpread({}, bar, {
      barValueAxisPos: barValueAxisPos
    })
  })
}

function eliminateNonNumberData (barItem, barData) {
  const data = barItem.data
  return barData.map(function (v, i) {
    return typeof data[i] === 'number' ? v : null
  }).filter(function (d) {
    return d !== null
  })
}

function eliminateNullBarLabelAxis (bars) {
  return bars.map(function (bar) {
    const barLabelAxisPos = bar.barLabelAxisPos
    const data = bar.data
    data.forEach(function (d, i) {
      if (typeof d === 'number') return
      barLabelAxisPos[i] = null
    })
    return _objectSpread({}, bar, {
      barLabelAxisPos: barLabelAxisPos.filter(function (p) {
        return p !== null
      })
    })
  })
}

function keepSameNumBetweenBarAndData (bars) {
  bars.forEach(function (bar) {
    const data = bar.data
    const barLabelAxisPos = bar.barLabelAxisPos
    const barValueAxisPos = bar.barValueAxisPos
    const dataNum = data.filter(function (d) {
      return typeof d === 'number'
    }).length
    const axisPosNum = barLabelAxisPos.length

    if (axisPosNum > dataNum) {
      barLabelAxisPos.splice(dataNum)
      barValueAxisPos.splice(dataNum)
    }
  })
  return bars
}

function getValuePos (min, max, value, linePosition, axis) {
  if (typeof value !== 'number') return null
  const valueMinus = max - min
  const coordinateIndex = axis === 'x' ? 0 : 1
  const posMinus = linePosition[1][coordinateIndex] - linePosition[0][coordinateIndex]
  let percent = (value - min) / valueMinus
  if (valueMinus === 0) percent = 0
  const pos = percent * posMinus
  return pos + linePosition[0][coordinateIndex]
}

function getBackgroundBarConfig (barItem) {
  const animationCurve = barItem.animationCurve
  const animationFrame = barItem.animationFrame
  const rLevel = barItem.rLevel
  const shapes = getBackgroundBarShapes(barItem)
  const style = getBackgroundBarStyle(barItem)
  return shapes.map(function (shape) {
    return {
      name: 'rect',
      index: rLevel,
      visible: barItem.backgroundBar.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: shape,
      style: style
    }
  })
}

function getBackgroundBarShapes (barItem) {
  const labelAxis = barItem.labelAxis
  const valueAxis = barItem.valueAxis
  const tickPosition = labelAxis.tickPosition
  const axis = valueAxis.axis
  const linePosition = valueAxis.linePosition
  const width = getBackgroundBarWidth(barItem)
  const haltWidth = width / 2
  const posIndex = axis === 'x' ? 0 : 1
  const centerPos = tickPosition.map(function (p) {
    return p[1 - posIndex]
  })
  const _ref9 = [linePosition[0][posIndex], linePosition[1][posIndex]]
  const start = _ref9[0]
  const end = _ref9[1]
  return centerPos.map(function (center) {
    if (axis === 'x') {
      return {
        x: start,
        y: center - haltWidth,
        w: end - start,
        h: width
      }
    } else {
      return {
        x: center - haltWidth,
        y: end,
        w: width,
        h: start - end
      }
    }
  })
}

function getBackgroundBarWidth (barItem) {
  const barAllWidthAndGap = barItem.barAllWidthAndGap
  const barCategoryWidth = barItem.barCategoryWidth
  const backgroundBar = barItem.backgroundBar
  const width = backgroundBar.width
  if (typeof width === 'number') return width
  if (width === 'auto') return barAllWidthAndGap
  return parseInt(width) / 100 * barCategoryWidth
}

function getBackgroundBarStyle (barItem) {
  return barItem.backgroundBar.style
}

function getBarConfig (barItem) {
  const barLabelAxisPos = barItem.barLabelAxisPos
  const animationCurve = barItem.animationCurve
  const animationFrame = barItem.animationFrame
  const rLevel = barItem.rLevel
  const name = getBarName(barItem)
  return barLabelAxisPos.map(function (foo, i) {
    return {
      name: name,
      index: rLevel,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getBarShape(barItem, i),
      style: getBarStyle(barItem, i)
    }
  })
}

function getBarName (barItem) {
  const shapeType = barItem.shapeType
  if (shapeType === 'leftEchelon' || shapeType === 'rightEchelon') return 'polyline'
  return 'rect'
}

function getBarShape (barItem, i) {
  const shapeType = barItem.shapeType

  if (shapeType === 'leftEchelon') {
    return getLeftEchelonShape(barItem, i)
  } else if (shapeType === 'rightEchelon') {
    return getRightEchelonShape(barItem, i)
  } else {
    return getNormalBarShape(barItem, i)
  }
}

function getLeftEchelonShape (barItem, i) {
  const barValueAxisPos = barItem.barValueAxisPos
  const barLabelAxisPos = barItem.barLabelAxisPos
  const barWidth = barItem.barWidth
  const echelonOffset = barItem.echelonOffset

  const _barValueAxisPos$i = (0, _slicedToArray2.default)(barValueAxisPos[i], 2)
  const start = _barValueAxisPos$i[0]
  const end = _barValueAxisPos$i[1]

  const labelAxisPos = barLabelAxisPos[i]
  const halfWidth = barWidth / 2
  const valueAxis = barItem.valueAxis.axis
  const points = []

  if (valueAxis === 'x') {
    points[0] = [end, labelAxisPos - halfWidth]
    points[1] = [end, labelAxisPos + halfWidth]
    points[2] = [start, labelAxisPos + halfWidth]
    points[3] = [start + echelonOffset, labelAxisPos - halfWidth]
    if (end - start < echelonOffset) points.splice(3, 1)
  } else {
    points[0] = [labelAxisPos - halfWidth, end]
    points[1] = [labelAxisPos + halfWidth, end]
    points[2] = [labelAxisPos + halfWidth, start]
    points[3] = [labelAxisPos - halfWidth, start - echelonOffset]
    if (start - end < echelonOffset) points.splice(3, 1)
  }

  return {
    points: points,
    close: true
  }
}

function getRightEchelonShape (barItem, i) {
  const barValueAxisPos = barItem.barValueAxisPos
  const barLabelAxisPos = barItem.barLabelAxisPos
  const barWidth = barItem.barWidth
  const echelonOffset = barItem.echelonOffset

  const _barValueAxisPos$i2 = (0, _slicedToArray2.default)(barValueAxisPos[i], 2)
  const start = _barValueAxisPos$i2[0]
  const end = _barValueAxisPos$i2[1]

  const labelAxisPos = barLabelAxisPos[i]
  const halfWidth = barWidth / 2
  const valueAxis = barItem.valueAxis.axis
  const points = []

  if (valueAxis === 'x') {
    points[0] = [end, labelAxisPos + halfWidth]
    points[1] = [end, labelAxisPos - halfWidth]
    points[2] = [start, labelAxisPos - halfWidth]
    points[3] = [start + echelonOffset, labelAxisPos + halfWidth]
    if (end - start < echelonOffset) points.splice(2, 1)
  } else {
    points[0] = [labelAxisPos + halfWidth, end]
    points[1] = [labelAxisPos - halfWidth, end]
    points[2] = [labelAxisPos - halfWidth, start]
    points[3] = [labelAxisPos + halfWidth, start - echelonOffset]
    if (start - end < echelonOffset) points.splice(2, 1)
  }

  return {
    points: points,
    close: true
  }
}

function getNormalBarShape (barItem, i) {
  const barValueAxisPos = barItem.barValueAxisPos
  const barLabelAxisPos = barItem.barLabelAxisPos
  const barWidth = barItem.barWidth

  const _barValueAxisPos$i3 = (0, _slicedToArray2.default)(barValueAxisPos[i], 2)
  const start = _barValueAxisPos$i3[0]
  const end = _barValueAxisPos$i3[1]

  const labelAxisPos = barLabelAxisPos[i]
  const valueAxis = barItem.valueAxis.axis
  const shape = {}

  if (valueAxis === 'x') {
    shape.x = start
    shape.y = labelAxisPos - barWidth / 2
    shape.w = end - start
    shape.h = barWidth
  } else {
    shape.x = labelAxisPos - barWidth / 2
    shape.y = end
    shape.w = barWidth
    shape.h = start - end
  }

  return shape
}

function getBarStyle (barItem, i) {
  const barStyle = barItem.barStyle
  const gradient = barItem.gradient
  const color = barItem.color
  const independentColor = barItem.independentColor
  const independentColors = barItem.independentColors
  const fillColor = [barStyle.fill || color]
  let gradientColor = (0, _util2.deepMerge)(fillColor, gradient.color)

  if (independentColor) {
    const idtColor = independentColors[i % independentColors.length]
    gradientColor = idtColor instanceof Array ? idtColor : [idtColor]
  }

  if (gradientColor.length === 1) gradientColor.push(gradientColor[0])
  const gradientParams = getGradientParams(barItem, i)
  return (0, _util2.deepMerge)({
    gradientColor: gradientColor,
    gradientParams: gradientParams,
    gradientType: 'linear',
    gradientWith: 'fill'
  }, barStyle)
}

function getGradientParams (barItem, i) {
  const barValueAxisPos = barItem.barValueAxisPos
  const barLabelAxisPos = barItem.barLabelAxisPos
  const data = barItem.data
  const _barItem$valueAxis = barItem.valueAxis
  const linePosition = _barItem$valueAxis.linePosition
  const axis = _barItem$valueAxis.axis

  const _barValueAxisPos$i4 = (0, _slicedToArray2.default)(barValueAxisPos[i], 2)
  const start = _barValueAxisPos$i4[0]
  const end = _barValueAxisPos$i4[1]

  const labelAxisPos = barLabelAxisPos[i]
  const value = data[i]

  const _linePosition = (0, _slicedToArray2.default)(linePosition, 2)
  const lineStart = _linePosition[0]
  const lineEnd = _linePosition[1]

  const valueAxisIndex = axis === 'x' ? 0 : 1
  let endPos = end

  if (!barItem.gradient.local) {
    endPos = value < 0 ? lineStart[valueAxisIndex] : lineEnd[valueAxisIndex]
  }

  if (axis === 'y') {
    return [labelAxisPos, endPos, labelAxisPos, start]
  } else {
    return [endPos, labelAxisPos, start, labelAxisPos]
  }
}

function getStartBarConfig (barItem) {
  const configs = getBarConfig(barItem)
  const shapeType = barItem.shapeType
  configs.forEach(function (config) {
    let shape = config.shape

    if (shapeType === 'leftEchelon') {
      shape = getStartLeftEchelonShape(shape, barItem)
    } else if (shapeType === 'rightEchelon') {
      shape = getStartRightEchelonShape(shape, barItem)
    } else {
      shape = getStartNormalBarShape(shape, barItem)
    }

    config.shape = shape
  })
  return configs
}

function getStartLeftEchelonShape (shape, barItem) {
  const axis = barItem.valueAxis.axis
  shape = (0, _util.deepClone)(shape)
  const _shape = shape
  const points = _shape.points
  const index = axis === 'x' ? 0 : 1
  const start = points[2][index]
  points.forEach(function (point) {
    return point[index] = start
  })
  return shape
}

function getStartRightEchelonShape (shape, barItem) {
  const axis = barItem.valueAxis.axis
  shape = (0, _util.deepClone)(shape)
  const _shape2 = shape
  const points = _shape2.points
  const index = axis === 'x' ? 0 : 1
  const start = points[2][index]
  points.forEach(function (point) {
    return point[index] = start
  })
  return shape
}

function getStartNormalBarShape (shape, barItem) {
  const axis = barItem.valueAxis.axis
  const x = shape.x
  let y = shape.y
  let w = shape.w
  let h = shape.h

  if (axis === 'x') {
    w = 0
  } else {
    y = y + h
    h = 0
  }

  return {
    x: x,
    y: y,
    w: w,
    h: h
  }
}

function beforeUpdateBar (graphs, barItem, i, updater) {
  const render = updater.chart.render
  const name = getBarName(barItem)

  if (graphs[i] && graphs[i][0].name !== name) {
    graphs[i].forEach(function (g) {
      return render.delGraph(g)
    })
    graphs[i] = null
  }
}

function getLabelConfig (barItem) {
  const animationCurve = barItem.animationCurve
  const animationFrame = barItem.animationFrame
  const rLevel = barItem.rLevel
  const shapes = getLabelShapes(barItem)
  const style = getLabelStyle(barItem)
  return shapes.map(function (shape) {
    return {
      name: 'text',
      index: rLevel,
      visible: barItem.label.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: shape,
      style: style
    }
  })
}

function getLabelShapes (barItem) {
  const contents = getFormatterLabels(barItem)
  const position = getLabelsPosition(barItem)
  return position.map(function (pos, i) {
    return {
      position: pos,
      content: contents[i]
    }
  })
}

function getFormatterLabels (barItem) {
  let data = barItem.data
  const label = barItem.label
  const formatter = label.formatter
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
    return data.map(function (d, i) {
      return formatter({
        value: d,
        index: i
      })
    })
  }
  return data
}

function getLabelsPosition (barItem) {
  const label = barItem.label
  const barValueAxisPos = barItem.barValueAxisPos
  const barLabelAxisPos = barItem.barLabelAxisPos
  const position = label.position
  const offset = label.offset
  const axis = barItem.valueAxis.axis
  return barValueAxisPos.map(function (_ref10, i) {
    const _ref11 = (0, _slicedToArray2.default)(_ref10, 2)
    const start = _ref11[0]
    const end = _ref11[1]

    const labelAxisPos = barLabelAxisPos[i]
    let pos = [end, labelAxisPos]

    if (position === 'bottom') {
      pos = [start, labelAxisPos]
    }

    if (position === 'center') {
      pos = [(start + end) / 2, labelAxisPos]
    }

    if (axis === 'y') pos.reverse()
    return getOffsetedPoint(pos, offset)
  })
}

function getOffsetedPoint (_ref12, _ref13) {
  const _ref14 = (0, _slicedToArray2.default)(_ref12, 2)
  const x = _ref14[0]
  const y = _ref14[1]

  const _ref15 = (0, _slicedToArray2.default)(_ref13, 2)
  const ox = _ref15[0]
  const oy = _ref15[1]

  return [x + ox, y + oy]
}

function getLabelStyle (barItem) {
  let color = barItem.color
  let style = barItem.label.style
  const gc = barItem.gradient.color
  if (gc.length) color = gc[0]
  style = (0, _util2.deepMerge)({
    fill: color
  }, style)
  return style
}
