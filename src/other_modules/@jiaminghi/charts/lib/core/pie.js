'use strict'

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.pie = pie

const _defineProperty2 = _interopRequireDefault(require('@babel/runtime/helpers/defineProperty'))

const _typeof2 = _interopRequireDefault(require('@babel/runtime/helpers/typeof'))

const _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'))

const _toConsumableArray2 = _interopRequireDefault(require('@babel/runtime/helpers/toConsumableArray'))

const _updater = require('../class/updater.class')

const _pie = require('../config/pie')

const _util = require('@jiaminghi/c-render/lib/plugin/util')

const _util2 = require('../util')

function ownKeys (object, enumerableOnly) { const keys = Object.keys(object); if (Object.getOwnPropertySymbols) { let symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable }); keys.push.apply(keys, symbols) } return keys }

function _objectSpread (target) { for (let i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]) }) } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)) }) } } return target }

function pie (chart) {
  const option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
  let series = option.series
  if (!series) series = []
  let pies = (0, _util2.initNeedSeries)(series, _pie.pieConfig, 'pie')
  pies = calcPiesCenter(pies, chart)
  pies = calcPiesRadius(pies, chart)
  pies = calcRosePiesRadius(pies, chart)
  pies = calcPiesPercent(pies)
  pies = calcPiesAngle(pies, chart)
  pies = calcPiesInsideLabelPos(pies)
  pies = calcPiesEdgeCenterPos(pies)
  pies = calcPiesOutSideLabelPos(pies);
  (0, _updater.doUpdate)({
    chart: chart,
    series: pies,
    key: 'pie',
    getGraphConfig: getPieConfig,
    getStartGraphConfig: getStartPieConfig,
    beforeChange: beforeChangePie
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: pies,
    key: 'pieInsideLabel',
    getGraphConfig: getInsideLabelConfig
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: pies,
    key: 'pieOutsideLabelLine',
    getGraphConfig: getOutsideLabelLineConfig,
    getStartGraphConfig: getStartOutsideLabelLineConfig
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: pies,
    key: 'pieOutsideLabel',
    getGraphConfig: getOutsideLabelConfig,
    getStartGraphConfig: getStartOutsideLabelConfig
  })
}

function calcPiesCenter (pies, chart) {
  const area = chart.render.area
  pies.forEach(function (pie) {
    let center = pie.center
    center = center.map(function (pos, i) {
      if (typeof pos === 'number') return pos
      return parseInt(pos) / 100 * area[i]
    })
    pie.center = center
  })
  return pies
}

function calcPiesRadius (pies, chart) {
  const maxRadius = Math.min.apply(Math, (0, _toConsumableArray2.default)(chart.render.area)) / 2
  pies.forEach(function (pie) {
    let radius = pie.radius
    const data = pie.data
    radius = getNumberRadius(radius, maxRadius)
    data.forEach(function (item) {
      let itemRadius = item.radius
      if (!itemRadius) itemRadius = radius
      itemRadius = getNumberRadius(itemRadius, maxRadius)
      item.radius = itemRadius
    })
    pie.radius = radius
  })
  return pies
}

function getNumberRadius (radius, maxRadius) {
  if (!(radius instanceof Array)) radius = [0, radius]
  radius = radius.map(function (r) {
    if (typeof r === 'number') return r
    return parseInt(r) / 100 * maxRadius
  })
  return radius
}

function calcRosePiesRadius (pies, chart) {
  const rosePie = pies.filter(function (_ref) {
    const roseType = _ref.roseType
    return roseType
  })
  rosePie.forEach(function (pie) {
    const radius = pie.radius
    let data = pie.data
    const roseSort = pie.roseSort
    const roseIncrement = getRoseIncrement(pie)
    const dataCopy = (0, _toConsumableArray2.default)(data)
    data = sortData(data)
    data.forEach(function (item, i) {
      item.radius[1] = radius[1] - roseIncrement * i
    })

    if (roseSort) {
      data.reverse()
    } else {
      pie.data = dataCopy
    }

    pie.roseIncrement = roseIncrement
  })
  return pies
}

function sortData (data) {
  return data.sort(function (_ref2, _ref3) {
    const a = _ref2.value
    const b = _ref3.value
    if (a === b) return 0
    if (a > b) return -1
    if (a < b) return 1
  })
}

function getRoseIncrement (pie) {
  const radius = pie.radius
  const roseIncrement = pie.roseIncrement
  if (typeof roseIncrement === 'number') return roseIncrement

  if (roseIncrement === 'auto') {
    const data = pie.data
    const allRadius = data.reduce(function (all, _ref4) {
      const radius = _ref4.radius
      return [].concat((0, _toConsumableArray2.default)(all), (0, _toConsumableArray2.default)(radius))
    }, [])
    const minRadius = Math.min.apply(Math, (0, _toConsumableArray2.default)(allRadius))
    const maxRadius = Math.max.apply(Math, (0, _toConsumableArray2.default)(allRadius))
    return (maxRadius - minRadius) * 0.6 / (data.length - 1 || 1)
  }

  return parseInt(roseIncrement) / 100 * radius[1]
}

function calcPiesPercent (pies) {
  pies.forEach(function (pie) {
    const data = pie.data
    const percentToFixed = pie.percentToFixed
    const sum = getDataSum(data)
    data.forEach(function (item) {
      const value = item.value
      item.percent = toFixedNoCeil(value / sum * 100, percentToFixed)
    })
    const percentSumNoLast = (0, _util2.mulAdd)(data.slice(0, -1).map(function (_ref5) {
      const percent = _ref5.percent
      return percent
    }))
    data.slice(-1)[0].percent = toFixedNoCeil(100 - percentSumNoLast, percentToFixed)
  })
  return pies
}

function toFixedNoCeil (number) {
  const toFixed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0
  const stringNumber = number.toString()
  const splitedNumber = stringNumber.split('.')
  const decimal = splitedNumber[1] || '0'
  const fixedDecimal = decimal.slice(0, toFixed)
  splitedNumber[1] = fixedDecimal
  return parseFloat(splitedNumber.join('.'))
}

function getDataSum (data) {
  return (0, _util2.mulAdd)(data.map(function (_ref6) {
    const value = _ref6.value
    return value
  }))
}

function calcPiesAngle (pies) {
  pies.forEach(function (pie) {
    const start = pie.startAngle
    const data = pie.data
    data.forEach(function (item, i) {
      const _getDataAngle = getDataAngle(data, i)
      const _getDataAngle2 = (0, _slicedToArray2.default)(_getDataAngle, 2)
      const startAngle = _getDataAngle2[0]
      const endAngle = _getDataAngle2[1]

      item.startAngle = start + startAngle
      item.endAngle = start + endAngle
    })
  })
  return pies
}

function getDataAngle (data, i) {
  const fullAngle = Math.PI * 2
  const needAddData = data.slice(0, i + 1)
  const percentSum = (0, _util2.mulAdd)(needAddData.map(function (_ref7) {
    const percent = _ref7.percent
    return percent
  }))
  const percent = data[i].percent
  const startPercent = percentSum - percent
  return [fullAngle * startPercent / 100, fullAngle * percentSum / 100]
}

function calcPiesInsideLabelPos (pies) {
  pies.forEach(function (pieItem) {
    const data = pieItem.data
    data.forEach(function (item) {
      item.insideLabelPos = getPieInsideLabelPos(pieItem, item)
    })
  })
  return pies
}

function getPieInsideLabelPos (pieItem, dataItem) {
  const center = pieItem.center

  const startAngle = dataItem.startAngle
  const endAngle = dataItem.endAngle
  const _dataItem$radius = (0, _slicedToArray2.default)(dataItem.radius, 2)
  const ir = _dataItem$radius[0]
  const or = _dataItem$radius[1]

  const radius = (ir + or) / 2
  const angle = (startAngle + endAngle) / 2
  return _util.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2.default)(center).concat([radius, angle]))
}

function calcPiesEdgeCenterPos (pies) {
  pies.forEach(function (pie) {
    const data = pie.data
    const center = pie.center
    data.forEach(function (item) {
      const startAngle = item.startAngle
      const endAngle = item.endAngle
      const radius = item.radius
      const centerAngle = (startAngle + endAngle) / 2

      const pos = _util.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2.default)(center).concat([radius[1], centerAngle]))

      item.edgeCenterPos = pos
    })
  })
  return pies
}

function calcPiesOutSideLabelPos (pies) {
  pies.forEach(function (pieItem) {
    let leftPieDataItems = getLeftOrRightPieDataItems(pieItem)
    let rightPieDataItems = getLeftOrRightPieDataItems(pieItem, false)
    leftPieDataItems = sortPiesFromTopToBottom(leftPieDataItems)
    rightPieDataItems = sortPiesFromTopToBottom(rightPieDataItems)
    addLabelLineAndAlign(leftPieDataItems, pieItem)
    addLabelLineAndAlign(rightPieDataItems, pieItem, false)
  })
  return pies
}

function getLabelLineBendRadius (pieItem) {
  let labelLineBendGap = pieItem.outsideLabel.labelLineBendGap
  const maxRadius = getPieMaxRadius(pieItem)

  if (typeof labelLineBendGap !== 'number') {
    labelLineBendGap = parseInt(labelLineBendGap) / 100 * maxRadius
  }

  return labelLineBendGap + maxRadius
}

function getPieMaxRadius (pieItem) {
  const data = pieItem.data
  const radius = data.map(function (_ref8) {
    const _ref8$radius = (0, _slicedToArray2.default)(_ref8.radius, 2)
    const foo = _ref8$radius[0]
    const r = _ref8$radius[1]

    return r
  })
  return Math.max.apply(Math, (0, _toConsumableArray2.default)(radius))
}

function getLeftOrRightPieDataItems (pieItem) {
  const left = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true
  const data = pieItem.data
  const center = pieItem.center
  const centerXPos = center[0]
  return data.filter(function (_ref9) {
    const edgeCenterPos = _ref9.edgeCenterPos
    const xPos = edgeCenterPos[0]
    if (left) return xPos <= centerXPos
    return xPos > centerXPos
  })
}

function sortPiesFromTopToBottom (dataItem) {
  dataItem.sort(function (_ref10, _ref11) {
    const _ref10$edgeCenterPos = (0, _slicedToArray2.default)(_ref10.edgeCenterPos, 2)
    const t = _ref10$edgeCenterPos[0]
    const ay = _ref10$edgeCenterPos[1]

    const _ref11$edgeCenterPos = (0, _slicedToArray2.default)(_ref11.edgeCenterPos, 2)
    const tt = _ref11$edgeCenterPos[0]
    const by = _ref11$edgeCenterPos[1]

    if (ay > by) return 1
    if (ay < by) return -1
    if (ay === by) return 0
  })
  return dataItem
}

function addLabelLineAndAlign (dataItem, pieItem) {
  const left = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true
  const center = pieItem.center
  const outsideLabel = pieItem.outsideLabel
  const radius = getLabelLineBendRadius(pieItem)
  dataItem.forEach(function (item) {
    const edgeCenterPos = item.edgeCenterPos
    const startAngle = item.startAngle
    const endAngle = item.endAngle
    const labelLineEndLength = outsideLabel.labelLineEndLength
    const angle = (startAngle + endAngle) / 2

    const bendPoint = _util.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2.default)(center).concat([radius, angle]))

    const endPoint = (0, _toConsumableArray2.default)(bendPoint)
    endPoint[0] += labelLineEndLength * (left ? -1 : 1)
    item.labelLine = [edgeCenterPos, bendPoint, endPoint]
    item.labelLineLength = (0, _util2.getPolylineLength)(item.labelLine)
    item.align = {
      textAlign: 'left',
      textBaseline: 'middle'
    }
    if (left) item.align.textAlign = 'right'
  })
}

function getPieConfig (pieItem) {
  const data = pieItem.data
  const animationCurve = pieItem.animationCurve
  const animationFrame = pieItem.animationFrame
  const rLevel = pieItem.rLevel
  return data.map(function (foo, i) {
    return {
      name: 'pie',
      index: rLevel,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getPieShape(pieItem, i),
      style: getPieStyle(pieItem, i)
    }
  })
}

function getStartPieConfig (pieItem) {
  const animationDelayGap = pieItem.animationDelayGap
  const startAnimationCurve = pieItem.startAnimationCurve
  const configs = getPieConfig(pieItem)
  configs.forEach(function (config, i) {
    config.animationCurve = startAnimationCurve
    config.animationDelay = i * animationDelayGap
    config.shape.or = config.shape.ir
  })
  return configs
}

function beforeChangePie (graph) {
  graph.animationDelay = 0
}

function getPieShape (pieItem, i) {
  const center = pieItem.center
  const data = pieItem.data
  const dataItem = data[i]
  const radius = dataItem.radius
  const startAngle = dataItem.startAngle
  const endAngle = dataItem.endAngle
  return {
    startAngle: startAngle,
    endAngle: endAngle,
    ir: radius[0],
    or: radius[1],
    rx: center[0],
    ry: center[1]
  }
}

function getPieStyle (pieItem, i) {
  const pieStyle = pieItem.pieStyle
  const data = pieItem.data
  const dataItem = data[i]
  const color = dataItem.color
  return (0, _util2.deepMerge)({
    fill: color
  }, pieStyle)
}

function getInsideLabelConfig (pieItem) {
  const animationCurve = pieItem.animationCurve
  const animationFrame = pieItem.animationFrame
  const data = pieItem.data
  const rLevel = pieItem.rLevel
  return data.map(function (foo, i) {
    return {
      name: 'text',
      index: rLevel,
      visible: pieItem.insideLabel.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getInsideLabelShape(pieItem, i),
      style: getInsideLabelStyle(pieItem, i)
    }
  })
}

function getInsideLabelShape (pieItem, i) {
  const insideLabel = pieItem.insideLabel
  const data = pieItem.data
  const formatter = insideLabel.formatter
  const dataItem = data[i]
  const formatterType = (0, _typeof2.default)(formatter)
  let label = ''

  if (formatterType === 'string') {
    label = formatter.replace('{name}', dataItem.name)
    label = label.replace('{percent}', dataItem.percent)
    label = label.replace('{value}', dataItem.value)
  }

  if (formatterType === 'function') {
    label = formatter(dataItem)
  }

  return {
    content: label,
    position: dataItem.insideLabelPos
  }
}

function getInsideLabelStyle (pieItem, i) {
  const style = pieItem.insideLabel.style
  return style
}

function getOutsideLabelLineConfig (pieItem) {
  const animationCurve = pieItem.animationCurve
  const animationFrame = pieItem.animationFrame
  const data = pieItem.data
  const rLevel = pieItem.rLevel
  return data.map(function (foo, i) {
    return {
      name: 'polyline',
      index: rLevel,
      visible: pieItem.outsideLabel.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getOutsideLabelLineShape(pieItem, i),
      style: getOutsideLabelLineStyle(pieItem, i)
    }
  })
}

function getStartOutsideLabelLineConfig (pieItem) {
  const data = pieItem.data
  const configs = getOutsideLabelLineConfig(pieItem)
  configs.forEach(function (config, i) {
    config.style.lineDash = [0, data[i].labelLineLength]
  })
  return configs
}

function getOutsideLabelLineShape (pieItem, i) {
  const data = pieItem.data
  const dataItem = data[i]
  return {
    points: dataItem.labelLine
  }
}

function getOutsideLabelLineStyle (pieItem, i) {
  const outsideLabel = pieItem.outsideLabel
  const data = pieItem.data
  const labelLineStyle = outsideLabel.labelLineStyle
  const color = data[i].color
  return (0, _util2.deepMerge)({
    stroke: color,
    lineDash: [data[i].labelLineLength, 0]
  }, labelLineStyle)
}

function getOutsideLabelConfig (pieItem) {
  const animationCurve = pieItem.animationCurve
  const animationFrame = pieItem.animationFrame
  const data = pieItem.data
  const rLevel = pieItem.rLevel
  return data.map(function (foo, i) {
    return {
      name: 'text',
      index: rLevel,
      visible: pieItem.outsideLabel.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getOutsideLabelShape(pieItem, i),
      style: getOutsideLabelStyle(pieItem, i)
    }
  })
}

function getStartOutsideLabelConfig (pieItem) {
  const data = pieItem.data
  const configs = getOutsideLabelConfig(pieItem)
  configs.forEach(function (config, i) {
    config.shape.position = data[i].labelLine[1]
  })
  return configs
}

function getOutsideLabelShape (pieItem, i) {
  const outsideLabel = pieItem.outsideLabel
  const data = pieItem.data
  const formatter = outsideLabel.formatter
  const _data$i = data[i]
  const labelLine = _data$i.labelLine
  const name = _data$i.name
  const percent = _data$i.percent
  const value = _data$i.value
  const formatterType = (0, _typeof2.default)(formatter)
  let label = ''

  if (formatterType === 'string') {
    label = formatter.replace('{name}', name)
    label = label.replace('{percent}', percent)
    label = label.replace('{value}', value)
  }

  if (formatterType === 'function') {
    label = formatter(data[i])
  }

  return {
    content: label,
    position: labelLine[2]
  }
}

function getOutsideLabelStyle (pieItem, i) {
  const outsideLabel = pieItem.outsideLabel
  const data = pieItem.data
  const _data$i2 = data[i]
  const color = _data$i2.color
  const align = _data$i2.align
  const style = outsideLabel.style
  return (0, _util2.deepMerge)(_objectSpread({
    fill: color
  }, align), style)
}
