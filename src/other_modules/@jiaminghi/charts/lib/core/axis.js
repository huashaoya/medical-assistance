'use strict'

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.axis = axis

const _typeof2 = _interopRequireDefault(require('@babel/runtime/helpers/typeof'))

const _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'))

const _defineProperty2 = _interopRequireDefault(require('@babel/runtime/helpers/defineProperty'))

const _toConsumableArray2 = _interopRequireDefault(require('@babel/runtime/helpers/toConsumableArray'))

const _updater = require('../class/updater.class')

const _config = require('../config')

const _util = require('../util')

const _util2 = require('@jiaminghi/c-render/lib/plugin/util')

function ownKeys (object, enumerableOnly) { const keys = Object.keys(object); if (Object.getOwnPropertySymbols) { let symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable }); keys.push.apply(keys, symbols) } return keys }

function _objectSpread (target) { for (let i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]) }) } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)) }) } } return target }

const axisConfig = {
  xAxisConfig: _config.xAxisConfig,
  yAxisConfig: _config.yAxisConfig
}
const min = Math.min
const max = Math.max
const abs = Math.abs
const pow = Math.pow

function axis (chart) {
  const option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
  const xAxis = option.xAxis
  const yAxis = option.yAxis
  const series = option.series
  let allAxis = []

  if (xAxis && yAxis && series) {
    allAxis = getAllAxis(xAxis, yAxis)
    allAxis = mergeDefaultAxisConfig(allAxis)
    allAxis = allAxis.filter(function (_ref) {
      const show = _ref.show
      return show
    })
    allAxis = mergeDefaultBoundaryGap(allAxis)
    allAxis = calcAxisLabelData(allAxis, series)
    allAxis = setAxisPosition(allAxis)
    allAxis = calcAxisLinePosition(allAxis, chart)
    allAxis = calcAxisTickPosition(allAxis, chart)
    allAxis = calcAxisNamePosition(allAxis, chart)
    allAxis = calcSplitLinePosition(allAxis, chart)
  }

  (0, _updater.doUpdate)({
    chart: chart,
    series: allAxis,
    key: 'axisLine',
    getGraphConfig: getLineConfig
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: allAxis,
    key: 'axisTick',
    getGraphConfig: getTickConfig
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: allAxis,
    key: 'axisLabel',
    getGraphConfig: getLabelConfig
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: allAxis,
    key: 'axisName',
    getGraphConfig: getNameConfig
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: allAxis,
    key: 'splitLine',
    getGraphConfig: getSplitLineConfig
  })
  chart.axisData = allAxis
}

function getAllAxis (xAxis, yAxis) {
  let allXAxis = []
  let allYAxis = []

  if (xAxis instanceof Array) {
    let _allXAxis;

    (_allXAxis = allXAxis).push.apply(_allXAxis, (0, _toConsumableArray2.default)(xAxis))
  } else {
    allXAxis.push(xAxis)
  }

  if (yAxis instanceof Array) {
    let _allYAxis;

    (_allYAxis = allYAxis).push.apply(_allYAxis, (0, _toConsumableArray2.default)(yAxis))
  } else {
    allYAxis.push(yAxis)
  }

  allXAxis.splice(2)
  allYAxis.splice(2)
  allXAxis = allXAxis.map(function (axis, i) {
    return _objectSpread({}, axis, {
      index: i,
      axis: 'x'
    })
  })
  allYAxis = allYAxis.map(function (axis, i) {
    return _objectSpread({}, axis, {
      index: i,
      axis: 'y'
    })
  })
  return [].concat((0, _toConsumableArray2.default)(allXAxis), (0, _toConsumableArray2.default)(allYAxis))
}

function mergeDefaultAxisConfig (allAxis) {
  let xAxis = allAxis.filter(function (_ref2) {
    const axis = _ref2.axis
    return axis === 'x'
  })
  let yAxis = allAxis.filter(function (_ref3) {
    const axis = _ref3.axis
    return axis === 'y'
  })
  xAxis = xAxis.map(function (axis) {
    return (0, _util.deepMerge)((0, _util2.deepClone)(_config.xAxisConfig), axis)
  })
  yAxis = yAxis.map(function (axis) {
    return (0, _util.deepMerge)((0, _util2.deepClone)(_config.yAxisConfig), axis)
  })
  return [].concat((0, _toConsumableArray2.default)(xAxis), (0, _toConsumableArray2.default)(yAxis))
}

function mergeDefaultBoundaryGap (allAxis) {
  const valueAxis = allAxis.filter(function (_ref4) {
    const data = _ref4.data
    return data === 'value'
  })
  const labelAxis = allAxis.filter(function (_ref5) {
    const data = _ref5.data
    return data !== 'value'
  })
  valueAxis.forEach(function (axis) {
    if (typeof axis.boundaryGap === 'boolean') return
    axis.boundaryGap = false
  })
  labelAxis.forEach(function (axis) {
    if (typeof axis.boundaryGap === 'boolean') return
    axis.boundaryGap = true
  })
  return [].concat((0, _toConsumableArray2.default)(valueAxis), (0, _toConsumableArray2.default)(labelAxis))
}

function calcAxisLabelData (allAxis, series) {
  let valueAxis = allAxis.filter(function (_ref6) {
    const data = _ref6.data
    return data === 'value'
  })
  let labelAxis = allAxis.filter(function (_ref7) {
    const data = _ref7.data
    return data instanceof Array
  })
  valueAxis = calcValueAxisLabelData(valueAxis, series)
  labelAxis = calcLabelAxisLabelData(labelAxis)
  return [].concat((0, _toConsumableArray2.default)(valueAxis), (0, _toConsumableArray2.default)(labelAxis))
}

function calcValueAxisLabelData (valueAxis, series) {
  return valueAxis.map(function (axis) {
    const minMaxValue = getValueAxisMaxMinValue(axis, series)

    const _getTrueMinMax = getTrueMinMax(axis, minMaxValue)
    const _getTrueMinMax2 = (0, _slicedToArray2.default)(_getTrueMinMax, 2)
    const min = _getTrueMinMax2[0]
    const max = _getTrueMinMax2[1]

    const interval = getValueInterval(min, max, axis)
    const formatter = axis.axisLabel.formatter
    let label = []

    if (minMaxValue[0] === minMaxValue[1]) {
      label = minMaxValue
    } else if (min < 0 && max > 0) {
      label = getValueAxisLabelFromZero(min, max, interval)
    } else {
      label = getValueAxisLabelFromMin(min, max, interval)
    }

    label = label.map(function (l) {
      return parseFloat(l.toFixed(2))
    })
    return _objectSpread({}, axis, {
      maxValue: label.slice(-1)[0],
      minValue: label[0],
      label: getAfterFormatterLabel(label, formatter)
    })
  })
}

function getValueAxisMaxMinValue (axis, series) {
  series = series.filter(function (_ref8) {
    const show = _ref8.show
    const type = _ref8.type
    if (show === false) return false
    if (type === 'pie') return false
    return true
  })
  if (series.length === 0) return [0, 0]
  const index = axis.index
  const axisType = axis.axis
  series = mergeStackData(series)
  const axisName = axisType + 'Axis'
  let valueSeries = series.filter(function (s) {
    return s[axisName] === index
  })
  if (!valueSeries.length) valueSeries = series
  return getSeriesMinMaxValue(valueSeries)
}

function getSeriesMinMaxValue (series) {
  if (!series) return
  const minValue = Math.min.apply(Math, (0, _toConsumableArray2.default)(series.map(function (_ref9) {
    const data = _ref9.data
    return Math.min.apply(Math, (0, _toConsumableArray2.default)((0, _util.filterNonNumber)(data)))
  })))
  const maxValue = Math.max.apply(Math, (0, _toConsumableArray2.default)(series.map(function (_ref10) {
    const data = _ref10.data
    return Math.max.apply(Math, (0, _toConsumableArray2.default)((0, _util.filterNonNumber)(data)))
  })))
  return [minValue, maxValue]
}

function mergeStackData (series) {
  const seriesCloned = (0, _util2.deepClone)(series, true)
  series.forEach(function (item, i) {
    const data = (0, _util.mergeSameStackData)(item, series)
    seriesCloned[i].data = data
  })
  return seriesCloned
}

function getTrueMinMax (_ref11, _ref12) {
  let min = _ref11.min
  let max = _ref11.max
  const axis = _ref11.axis

  const _ref13 = (0, _slicedToArray2.default)(_ref12, 2)
  const minValue = _ref13[0]
  const maxValue = _ref13[1]

  let minType = (0, _typeof2.default)(min)
  let maxType = (0, _typeof2.default)(max)

  if (!testMinMaxType(min)) {
    min = axisConfig[axis + 'AxisConfig'].min
    minType = 'string'
  }

  if (!testMinMaxType(max)) {
    max = axisConfig[axis + 'AxisConfig'].max
    maxType = 'string'
  }

  if (minType === 'string') {
    min = parseInt(minValue - abs(minValue * parseFloat(min) / 100))
    const lever = getValueLever(min)
    min = parseFloat((min / lever - 0.1).toFixed(1)) * lever
  }

  if (maxType === 'string') {
    max = parseInt(maxValue + abs(maxValue * parseFloat(max) / 100))

    const _lever = getValueLever(max)

    max = parseFloat((max / _lever + 0.1).toFixed(1)) * _lever
  }

  return [min, max]
}

function getValueLever (value) {
  const valueString = abs(value).toString()
  const valueLength = valueString.length
  const firstZeroIndex = valueString.replace(/0*$/g, '').indexOf('0')
  let pow10Num = valueLength - 1
  if (firstZeroIndex !== -1) pow10Num -= firstZeroIndex
  return pow(10, pow10Num)
}

function testMinMaxType (val) {
  const valType = (0, _typeof2.default)(val)
  const isValidString = valType === 'string' && /^\d+%$/.test(val)
  const isValidNumber = valType === 'number'
  return isValidString || isValidNumber
}

function getValueAxisLabelFromZero (min, max, interval) {
  const negative = []
  const positive = []
  let currentNegative = 0
  let currentPositive = 0

  do {
    negative.push(currentNegative -= interval)
  } while (currentNegative > min)

  do {
    positive.push(currentPositive += interval)
  } while (currentPositive < max)

  return [].concat((0, _toConsumableArray2.default)(negative.reverse()), [0], (0, _toConsumableArray2.default)(positive))
}

function getValueAxisLabelFromMin (min, max, interval) {
  const label = [min]
  let currentValue = min

  do {
    label.push(currentValue += interval)
  } while (currentValue < max)

  return label
}

function getAfterFormatterLabel (label, formatter) {
  if (!formatter) return label
  if (typeof formatter === 'string') {
    label = label.map(function (l) {
      return formatter.replace('{value}', l)
    })
  }
  if (typeof formatter === 'function') {
    label = label.map(function (value, index) {
      return formatter({
        value: value,
        index: index
      })
    })
  }
  return label
}

function calcLabelAxisLabelData (labelAxis) {
  return labelAxis.map(function (axis) {
    const data = axis.data
    const formatter = axis.axisLabel.formatter
    return _objectSpread({}, axis, {
      label: getAfterFormatterLabel(data, formatter)
    })
  })
}

function getValueInterval (min, max, axis) {
  let interval = axis.interval
  let minInterval = axis.minInterval
  let maxInterval = axis.maxInterval
  let splitNumber = axis.splitNumber
  const axisType = axis.axis
  const config = axisConfig[axisType + 'AxisConfig']
  if (typeof interval !== 'number') interval = config.interval
  if (typeof minInterval !== 'number') minInterval = config.minInterval
  if (typeof maxInterval !== 'number') maxInterval = config.maxInterval
  if (typeof splitNumber !== 'number') splitNumber = config.splitNumber
  if (typeof interval === 'number') return interval
  let valueInterval = parseInt((max - min) / (splitNumber - 1))
  if (valueInterval.toString().length > 1) valueInterval = parseInt(valueInterval.toString().replace(/\d$/, '0'))
  if (valueInterval === 0) valueInterval = 1
  if (typeof minInterval === 'number' && valueInterval < minInterval) return minInterval
  if (typeof maxInterval === 'number' && valueInterval > maxInterval) return maxInterval
  return valueInterval
}

function setAxisPosition (allAxis) {
  const xAxis = allAxis.filter(function (_ref14) {
    const axis = _ref14.axis
    return axis === 'x'
  })
  const yAxis = allAxis.filter(function (_ref15) {
    const axis = _ref15.axis
    return axis === 'y'
  })
  if (xAxis[0] && !xAxis[0].position) xAxis[0].position = _config.xAxisConfig.position

  if (xAxis[1] && !xAxis[1].position) {
    xAxis[1].position = xAxis[0].position === 'bottom' ? 'top' : 'bottom'
  }

  if (yAxis[0] && !yAxis[0].position) yAxis[0].position = _config.yAxisConfig.position

  if (yAxis[1] && !yAxis[1].position) {
    yAxis[1].position = yAxis[0].position === 'left' ? 'right' : 'left'
  }

  return [].concat((0, _toConsumableArray2.default)(xAxis), (0, _toConsumableArray2.default)(yAxis))
}

function calcAxisLinePosition (allAxis, chart) {
  const _chart$gridArea = chart.gridArea
  const x = _chart$gridArea.x
  const y = _chart$gridArea.y
  const w = _chart$gridArea.w
  const h = _chart$gridArea.h
  allAxis = allAxis.map(function (axis) {
    const position = axis.position
    let linePosition = []

    if (position === 'left') {
      linePosition = [[x, y], [x, y + h]].reverse()
    } else if (position === 'right') {
      linePosition = [[x + w, y], [x + w, y + h]].reverse()
    } else if (position === 'top') {
      linePosition = [[x, y], [x + w, y]]
    } else if (position === 'bottom') {
      linePosition = [[x, y + h], [x + w, y + h]]
    }

    return _objectSpread({}, axis, {
      linePosition: linePosition
    })
  })
  return allAxis
}

function calcAxisTickPosition (allAxis, chart) {
  return allAxis.map(function (axisItem) {
    const axis = axisItem.axis
    const linePosition = axisItem.linePosition
    const position = axisItem.position
    const label = axisItem.label
    let boundaryGap = axisItem.boundaryGap
    if (typeof boundaryGap !== 'boolean') boundaryGap = axisConfig[axis + 'AxisConfig'].boundaryGap
    const labelNum = label.length

    const _linePosition = (0, _slicedToArray2.default)(linePosition, 2)
    const _linePosition$ = (0, _slicedToArray2.default)(_linePosition[0], 2)
    const startX = _linePosition$[0]
    const startY = _linePosition$[1]
    const _linePosition$2 = (0, _slicedToArray2.default)(_linePosition[1], 2)
    const endX = _linePosition$2[0]
    const endY = _linePosition$2[1]

    const gapLength = axis === 'x' ? endX - startX : endY - startY
    const gap = gapLength / (boundaryGap ? labelNum : labelNum - 1)
    const tickPosition = new Array(labelNum).fill(0).map(function (foo, i) {
      if (axis === 'x') {
        return [startX + gap * (boundaryGap ? i + 0.5 : i), startY]
      }

      return [startX, startY + gap * (boundaryGap ? i + 0.5 : i)]
    })
    const tickLinePosition = getTickLinePosition(axis, boundaryGap, position, tickPosition, gap)
    return _objectSpread({}, axisItem, {
      tickPosition: tickPosition,
      tickLinePosition: tickLinePosition,
      tickGap: gap
    })
  })
}

function getTickLinePosition (axisType, boundaryGap, position, tickPosition, gap) {
  let index = axisType === 'x' ? 1 : 0
  let plus = 5
  if (axisType === 'x' && position === 'top') plus = -5
  if (axisType === 'y' && position === 'left') plus = -5
  const tickLinePosition = tickPosition.map(function (lineStart) {
    const lineEnd = (0, _util2.deepClone)(lineStart)
    lineEnd[index] += plus
    return [(0, _util2.deepClone)(lineStart), lineEnd]
  })
  if (!boundaryGap) return tickLinePosition
  index = axisType === 'x' ? 0 : 1
  plus = gap / 2
  tickLinePosition.forEach(function (_ref16) {
    const _ref17 = (0, _slicedToArray2.default)(_ref16, 2)
    const lineStart = _ref17[0]
    const lineEnd = _ref17[1]

    lineStart[index] += plus
    lineEnd[index] += plus
  })
  return tickLinePosition
}

function calcAxisNamePosition (allAxis, chart) {
  return allAxis.map(function (axisItem) {
    const nameGap = axisItem.nameGap
    const nameLocation = axisItem.nameLocation
    const position = axisItem.position
    const linePosition = axisItem.linePosition

    const _linePosition2 = (0, _slicedToArray2.default)(linePosition, 2)
    const lineStart = _linePosition2[0]
    const lineEnd = _linePosition2[1]

    let namePosition = (0, _toConsumableArray2.default)(lineStart)
    if (nameLocation === 'end') namePosition = (0, _toConsumableArray2.default)(lineEnd)

    if (nameLocation === 'center') {
      namePosition[0] = (lineStart[0] + lineEnd[0]) / 2
      namePosition[1] = (lineStart[1] + lineEnd[1]) / 2
    }

    let index = 0
    if (position === 'top' && nameLocation === 'center') index = 1
    if (position === 'bottom' && nameLocation === 'center') index = 1
    if (position === 'left' && nameLocation !== 'center') index = 1
    if (position === 'right' && nameLocation !== 'center') index = 1
    let plus = nameGap
    if (position === 'top' && nameLocation !== 'end') plus *= -1
    if (position === 'left' && nameLocation !== 'start') plus *= -1
    if (position === 'bottom' && nameLocation === 'start') plus *= -1
    if (position === 'right' && nameLocation === 'end') plus *= -1
    namePosition[index] += plus
    return _objectSpread({}, axisItem, {
      namePosition: namePosition
    })
  })
}

function calcSplitLinePosition (allAxis, chart) {
  const _chart$gridArea2 = chart.gridArea
  const w = _chart$gridArea2.w
  const h = _chart$gridArea2.h
  return allAxis.map(function (axisItem) {
    const tickLinePosition = axisItem.tickLinePosition
    const position = axisItem.position
    const boundaryGap = axisItem.boundaryGap
    let index = 0
    let plus = w
    if (position === 'top' || position === 'bottom') index = 1
    if (position === 'top' || position === 'bottom') plus = h
    if (position === 'right' || position === 'bottom') plus *= -1
    const splitLinePosition = tickLinePosition.map(function (_ref18) {
      const _ref19 = (0, _slicedToArray2.default)(_ref18, 1)
      const startPoint = _ref19[0]

      const endPoint = (0, _toConsumableArray2.default)(startPoint)
      endPoint[index] += plus
      return [(0, _toConsumableArray2.default)(startPoint), endPoint]
    })
    if (!boundaryGap) splitLinePosition.shift()
    return _objectSpread({}, axisItem, {
      splitLinePosition: splitLinePosition
    })
  })
}

function getLineConfig (axisItem) {
  const animationCurve = axisItem.animationCurve
  const animationFrame = axisItem.animationFrame
  const rLevel = axisItem.rLevel
  return [{
    name: 'polyline',
    index: rLevel,
    visible: axisItem.axisLine.show,
    animationCurve: animationCurve,
    animationFrame: animationFrame,
    shape: getLineShape(axisItem),
    style: getLineStyle(axisItem)
  }]
}

function getLineShape (axisItem) {
  const linePosition = axisItem.linePosition
  return {
    points: linePosition
  }
}

function getLineStyle (axisItem) {
  return axisItem.axisLine.style
}

function getTickConfig (axisItem) {
  const animationCurve = axisItem.animationCurve
  const animationFrame = axisItem.animationFrame
  const rLevel = axisItem.rLevel
  const shapes = getTickShapes(axisItem)
  const style = getTickStyle(axisItem)
  return shapes.map(function (shape) {
    return {
      name: 'polyline',
      index: rLevel,
      visible: axisItem.axisTick.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: shape,
      style: style
    }
  })
}

function getTickShapes (axisItem) {
  const tickLinePosition = axisItem.tickLinePosition
  return tickLinePosition.map(function (points) {
    return {
      points: points
    }
  })
}

function getTickStyle (axisItem) {
  return axisItem.axisTick.style
}

function getLabelConfig (axisItem) {
  const animationCurve = axisItem.animationCurve
  const animationFrame = axisItem.animationFrame
  const rLevel = axisItem.rLevel
  const shapes = getLabelShapes(axisItem)
  const styles = getLabelStyle(axisItem, shapes)
  return shapes.map(function (shape, i) {
    return {
      name: 'text',
      index: rLevel,
      visible: axisItem.axisLabel.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: shape,
      style: styles[i],
      setGraphCenter: function setGraphCenter () {
        return void 0
      }
    }
  })
}

function getLabelShapes (axisItem) {
  const label = axisItem.label
  const tickPosition = axisItem.tickPosition
  const position = axisItem.position
  return tickPosition.map(function (point, i) {
    return {
      position: getLabelRealPosition(point, position),
      content: label[i].toString()
    }
  })
}

function getLabelRealPosition (points, position) {
  let index = 0
  let plus = 10
  if (position === 'top' || position === 'bottom') index = 1
  if (position === 'top' || position === 'left') plus = -10
  points = (0, _util2.deepClone)(points)
  points[index] += plus
  return points
}

function getLabelStyle (axisItem, shapes) {
  const position = axisItem.position
  let style = axisItem.axisLabel.style
  const align = getAxisLabelRealAlign(position)
  style = (0, _util.deepMerge)(align, style)
  const styles = shapes.map(function (_ref20) {
    const position = _ref20.position
    return _objectSpread({}, style, {
      graphCenter: position
    })
  })
  return styles
}

function getAxisLabelRealAlign (position) {
  if (position === 'left') {
    return {
      textAlign: 'right',
      textBaseline: 'middle'
    }
  }
  if (position === 'right') {
    return {
      textAlign: 'left',
      textBaseline: 'middle'
    }
  }
  if (position === 'top') {
    return {
      textAlign: 'center',
      textBaseline: 'bottom'
    }
  }
  if (position === 'bottom') {
    return {
      textAlign: 'center',
      textBaseline: 'top'
    }
  }
}

function getNameConfig (axisItem) {
  const animationCurve = axisItem.animationCurve
  const animationFrame = axisItem.animationFrame
  const rLevel = axisItem.rLevel
  return [{
    name: 'text',
    index: rLevel,
    animationCurve: animationCurve,
    animationFrame: animationFrame,
    shape: getNameShape(axisItem),
    style: getNameStyle(axisItem)
  }]
}

function getNameShape (axisItem) {
  const name = axisItem.name
  const namePosition = axisItem.namePosition
  return {
    content: name,
    position: namePosition
  }
}

function getNameStyle (axisItem) {
  const nameLocation = axisItem.nameLocation
  const position = axisItem.position
  const style = axisItem.nameTextStyle
  const align = getNameRealAlign(position, nameLocation)
  return (0, _util.deepMerge)(align, style)
}

function getNameRealAlign (position, location) {
  if (position === 'top' && location === 'start' || position === 'bottom' && location === 'start' || position === 'left' && location === 'center') {
    return {
      textAlign: 'right',
      textBaseline: 'middle'
    }
  }
  if (position === 'top' && location === 'end' || position === 'bottom' && location === 'end' || position === 'right' && location === 'center') {
    return {
      textAlign: 'left',
      textBaseline: 'middle'
    }
  }
  if (position === 'top' && location === 'center' || position === 'left' && location === 'end' || position === 'right' && location === 'end') {
    return {
      textAlign: 'center',
      textBaseline: 'bottom'
    }
  }
  if (position === 'bottom' && location === 'center' || position === 'left' && location === 'start' || position === 'right' && location === 'start') {
    return {
      textAlign: 'center',
      textBaseline: 'top'
    }
  }
}

function getSplitLineConfig (axisItem) {
  const animationCurve = axisItem.animationCurve
  const animationFrame = axisItem.animationFrame
  const rLevel = axisItem.rLevel
  const shapes = getSplitLineShapes(axisItem)
  const style = getSplitLineStyle(axisItem)
  return shapes.map(function (shape) {
    return {
      name: 'polyline',
      index: rLevel,
      visible: axisItem.splitLine.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: shape,
      style: style
    }
  })
}

function getSplitLineShapes (axisItem) {
  const splitLinePosition = axisItem.splitLinePosition
  return splitLinePosition.map(function (points) {
    return {
      points: points
    }
  })
}

function getSplitLineStyle (axisItem) {
  return axisItem.splitLine.style
}
