'use strict'

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.gauge = gauge

const _defineProperty2 = _interopRequireDefault(require('@babel/runtime/helpers/defineProperty'))

const _typeof2 = _interopRequireDefault(require('@babel/runtime/helpers/typeof'))

const _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'))

const _toConsumableArray2 = _interopRequireDefault(require('@babel/runtime/helpers/toConsumableArray'))

const _updater = require('../class/updater.class')

const _gauge = require('../config/gauge')

const _util = require('@jiaminghi/c-render/lib/plugin/util')

const _util2 = require('../util')

const _color = require('@jiaminghi/color')

function ownKeys (object, enumerableOnly) { const keys = Object.keys(object); if (Object.getOwnPropertySymbols) { let symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable }); keys.push.apply(keys, symbols) } return keys }

function _objectSpread (target) { for (let i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]) }) } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)) }) } } return target }

function gauge (chart) {
  const option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
  let series = option.series
  if (!series) series = []
  let gauges = (0, _util2.initNeedSeries)(series, _gauge.gaugeConfig, 'gauge')
  gauges = calcGaugesCenter(gauges, chart)
  gauges = calcGaugesRadius(gauges, chart)
  gauges = calcGaugesDataRadiusAndLineWidth(gauges, chart)
  gauges = calcGaugesDataAngles(gauges, chart)
  gauges = calcGaugesDataGradient(gauges, chart)
  gauges = calcGaugesAxisTickPosition(gauges, chart)
  gauges = calcGaugesLabelPositionAndAlign(gauges, chart)
  gauges = calcGaugesLabelData(gauges, chart)
  gauges = calcGaugesDetailsPosition(gauges, chart)
  gauges = calcGaugesDetailsContent(gauges, chart);
  (0, _updater.doUpdate)({
    chart: chart,
    series: gauges,
    key: 'gaugeAxisTick',
    getGraphConfig: getAxisTickConfig
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: gauges,
    key: 'gaugeAxisLabel',
    getGraphConfig: getAxisLabelConfig
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: gauges,
    key: 'gaugeBackgroundArc',
    getGraphConfig: getBackgroundArcConfig,
    getStartGraphConfig: getStartBackgroundArcConfig
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: gauges,
    key: 'gaugeArc',
    getGraphConfig: getArcConfig,
    getStartGraphConfig: getStartArcConfig,
    beforeChange: beforeChangeArc
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: gauges,
    key: 'gaugePointer',
    getGraphConfig: getPointerConfig,
    getStartGraphConfig: getStartPointerConfig
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: gauges,
    key: 'gaugeDetails',
    getGraphConfig: getDetailsConfig
  })
}

function calcGaugesCenter (gauges, chart) {
  const area = chart.render.area
  gauges.forEach(function (gaugeItem) {
    let center = gaugeItem.center
    center = center.map(function (pos, i) {
      if (typeof pos === 'number') return pos
      return parseInt(pos) / 100 * area[i]
    })
    gaugeItem.center = center
  })
  return gauges
}

function calcGaugesRadius (gauges, chart) {
  const area = chart.render.area
  const maxRadius = Math.min.apply(Math, (0, _toConsumableArray2.default)(area)) / 2
  gauges.forEach(function (gaugeItem) {
    let radius = gaugeItem.radius

    if (typeof radius !== 'number') {
      radius = parseInt(radius) / 100 * maxRadius
    }

    gaugeItem.radius = radius
  })
  return gauges
}

function calcGaugesDataRadiusAndLineWidth (gauges, chart) {
  const area = chart.render.area
  const maxRadius = Math.min.apply(Math, (0, _toConsumableArray2.default)(area)) / 2
  gauges.forEach(function (gaugeItem) {
    const radius = gaugeItem.radius
    const data = gaugeItem.data
    const arcLineWidth = gaugeItem.arcLineWidth
    data.forEach(function (item) {
      let arcRadius = item.radius
      let lineWidth = item.lineWidth
      if (!arcRadius) arcRadius = radius
      if (typeof arcRadius !== 'number') arcRadius = parseInt(arcRadius) / 100 * maxRadius
      item.radius = arcRadius
      if (!lineWidth) lineWidth = arcLineWidth
      item.lineWidth = lineWidth
    })
  })
  return gauges
}

function calcGaugesDataAngles (gauges, chart) {
  gauges.forEach(function (gaugeItem) {
    const startAngle = gaugeItem.startAngle
    const endAngle = gaugeItem.endAngle
    const data = gaugeItem.data
    const min = gaugeItem.min
    const max = gaugeItem.max
    const angleMinus = endAngle - startAngle
    const valueMinus = max - min
    data.forEach(function (item) {
      const value = item.value
      const itemAngle = Math.abs((value - min) / valueMinus * angleMinus)
      item.startAngle = startAngle
      item.endAngle = startAngle + itemAngle
    })
  })
  return gauges
}

function calcGaugesDataGradient (gauges, chart) {
  gauges.forEach(function (gaugeItem) {
    const data = gaugeItem.data
    data.forEach(function (item) {
      const color = item.color
      let gradient = item.gradient
      if (!gradient || !gradient.length) gradient = color
      if (!(gradient instanceof Array)) gradient = [gradient]
      item.gradient = gradient
    })
  })
  return gauges
}

function calcGaugesAxisTickPosition (gauges, chart) {
  gauges.forEach(function (gaugeItem) {
    const startAngle = gaugeItem.startAngle
    const endAngle = gaugeItem.endAngle
    const splitNum = gaugeItem.splitNum
    const center = gaugeItem.center
    const radius = gaugeItem.radius
    const arcLineWidth = gaugeItem.arcLineWidth
    const axisTick = gaugeItem.axisTick
    const tickLength = axisTick.tickLength
    const lineWidth = axisTick.style.lineWidth
    const angles = endAngle - startAngle
    const outerRadius = radius - arcLineWidth / 2
    const innerRadius = outerRadius - tickLength
    const angleGap = angles / (splitNum - 1)
    const arcLength = 2 * Math.PI * radius * angles / (Math.PI * 2)
    const offset = Math.ceil(lineWidth / 2) / arcLength * angles
    gaugeItem.tickAngles = []
    gaugeItem.tickInnerRadius = []
    gaugeItem.tickPosition = new Array(splitNum).fill(0).map(function (foo, i) {
      let angle = startAngle + angleGap * i
      if (i === 0) angle += offset
      if (i === splitNum - 1) angle -= offset
      gaugeItem.tickAngles[i] = angle
      gaugeItem.tickInnerRadius[i] = innerRadius
      return [_util.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2.default)(center).concat([outerRadius, angle])), _util.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2.default)(center).concat([innerRadius, angle]))]
    })
  })
  return gauges
}

function calcGaugesLabelPositionAndAlign (gauges, chart) {
  gauges.forEach(function (gaugeItem) {
    const center = gaugeItem.center
    const tickInnerRadius = gaugeItem.tickInnerRadius
    const tickAngles = gaugeItem.tickAngles
    const labelGap = gaugeItem.axisLabel.labelGap
    const position = tickAngles.map(function (angle, i) {
      return _util.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2.default)(center).concat([tickInnerRadius[i] - labelGap, tickAngles[i]]))
    })
    const align = position.map(function (_ref) {
      const _ref2 = (0, _slicedToArray2.default)(_ref, 2)
      const x = _ref2[0]
      const y = _ref2[1]

      return {
        textAlign: x > center[0] ? 'right' : 'left',
        textBaseline: y > center[1] ? 'bottom' : 'top'
      }
    })
    gaugeItem.labelPosition = position
    gaugeItem.labelAlign = align
  })
  return gauges
}

function calcGaugesLabelData (gauges, chart) {
  gauges.forEach(function (gaugeItem) {
    const axisLabel = gaugeItem.axisLabel
    const min = gaugeItem.min
    const max = gaugeItem.max
    const splitNum = gaugeItem.splitNum
    let data = axisLabel.data
    const formatter = axisLabel.formatter
    const valueGap = (max - min) / (splitNum - 1)
    const value = new Array(splitNum).fill(0).map(function (foo, i) {
      return parseInt(min + valueGap * i)
    })
    const formatterType = (0, _typeof2.default)(formatter)
    data = (0, _util2.deepMerge)(value, data).map(function (v, i) {
      let label = v

      if (formatterType === 'string') {
        label = formatter.replace('{value}', v)
      }

      if (formatterType === 'function') {
        label = formatter({
          value: v,
          index: i
        })
      }

      return label
    })
    axisLabel.data = data
  })
  return gauges
}

function calcGaugesDetailsPosition (gauges, chart) {
  gauges.forEach(function (gaugeItem) {
    const data = gaugeItem.data
    const details = gaugeItem.details
    const center = gaugeItem.center
    const position = details.position
    const offset = details.offset
    const detailsPosition = data.map(function (_ref3) {
      const startAngle = _ref3.startAngle
      const endAngle = _ref3.endAngle
      const radius = _ref3.radius
      let point = null

      if (position === 'center') {
        point = center
      } else if (position === 'start') {
        point = _util.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2.default)(center).concat([radius, startAngle]))
      } else if (position === 'end') {
        point = _util.getCircleRadianPoint.apply(void 0, (0, _toConsumableArray2.default)(center).concat([radius, endAngle]))
      }

      return getOffsetedPoint(point, offset)
    })
    gaugeItem.detailsPosition = detailsPosition
  })
  return gauges
}

function calcGaugesDetailsContent (gauges, chart) {
  gauges.forEach(function (gaugeItem) {
    const data = gaugeItem.data
    const details = gaugeItem.details
    const formatter = details.formatter
    const formatterType = (0, _typeof2.default)(formatter)
    const contents = data.map(function (dataItem) {
      let content = dataItem.value

      if (formatterType === 'string') {
        content = formatter.replace('{value}', '{nt}')
        content = content.replace('{name}', dataItem.name)
      }

      if (formatterType === 'function') content = formatter(dataItem)
      return content.toString()
    })
    gaugeItem.detailsContent = contents
  })
  return gauges
}

function getOffsetedPoint (_ref4, _ref5) {
  const _ref6 = (0, _slicedToArray2.default)(_ref4, 2)
  const x = _ref6[0]
  const y = _ref6[1]

  const _ref7 = (0, _slicedToArray2.default)(_ref5, 2)
  const ox = _ref7[0]
  const oy = _ref7[1]

  return [x + ox, y + oy]
}

function getAxisTickConfig (gaugeItem) {
  const tickPosition = gaugeItem.tickPosition
  const animationCurve = gaugeItem.animationCurve
  const animationFrame = gaugeItem.animationFrame
  const rLevel = gaugeItem.rLevel
  return tickPosition.map(function (foo, i) {
    return {
      name: 'polyline',
      index: rLevel,
      visible: gaugeItem.axisTick.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getAxisTickShape(gaugeItem, i),
      style: getAxisTickStyle(gaugeItem, i)
    }
  })
}

function getAxisTickShape (gaugeItem, i) {
  const tickPosition = gaugeItem.tickPosition
  return {
    points: tickPosition[i]
  }
}

function getAxisTickStyle (gaugeItem, i) {
  const style = gaugeItem.axisTick.style
  return style
}

function getAxisLabelConfig (gaugeItem) {
  const labelPosition = gaugeItem.labelPosition
  const animationCurve = gaugeItem.animationCurve
  const animationFrame = gaugeItem.animationFrame
  const rLevel = gaugeItem.rLevel
  return labelPosition.map(function (foo, i) {
    return {
      name: 'text',
      index: rLevel,
      visible: gaugeItem.axisLabel.show,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getAxisLabelShape(gaugeItem, i),
      style: getAxisLabelStyle(gaugeItem, i)
    }
  })
}

function getAxisLabelShape (gaugeItem, i) {
  const labelPosition = gaugeItem.labelPosition
  const data = gaugeItem.axisLabel.data
  return {
    content: data[i].toString(),
    position: labelPosition[i]
  }
}

function getAxisLabelStyle (gaugeItem, i) {
  const labelAlign = gaugeItem.labelAlign
  const axisLabel = gaugeItem.axisLabel
  const style = axisLabel.style
  return (0, _util2.deepMerge)(_objectSpread({}, labelAlign[i]), style)
}

function getBackgroundArcConfig (gaugeItem) {
  const animationCurve = gaugeItem.animationCurve
  const animationFrame = gaugeItem.animationFrame
  const rLevel = gaugeItem.rLevel
  return [{
    name: 'arc',
    index: rLevel,
    visible: gaugeItem.backgroundArc.show,
    animationCurve: animationCurve,
    animationFrame: animationFrame,
    shape: getGaugeBackgroundArcShape(gaugeItem),
    style: getGaugeBackgroundArcStyle(gaugeItem)
  }]
}

function getGaugeBackgroundArcShape (gaugeItem) {
  const startAngle = gaugeItem.startAngle
  const endAngle = gaugeItem.endAngle
  const center = gaugeItem.center
  const radius = gaugeItem.radius
  return {
    rx: center[0],
    ry: center[1],
    r: radius,
    startAngle: startAngle,
    endAngle: endAngle
  }
}

function getGaugeBackgroundArcStyle (gaugeItem) {
  const backgroundArc = gaugeItem.backgroundArc
  const arcLineWidth = gaugeItem.arcLineWidth
  const style = backgroundArc.style
  return (0, _util2.deepMerge)({
    lineWidth: arcLineWidth
  }, style)
}

function getStartBackgroundArcConfig (gaugeItem) {
  const config = getBackgroundArcConfig(gaugeItem)[0]

  const shape = _objectSpread({}, config.shape)

  shape.endAngle = config.shape.startAngle
  config.shape = shape
  return [config]
}

function getArcConfig (gaugeItem) {
  const data = gaugeItem.data
  const animationCurve = gaugeItem.animationCurve
  const animationFrame = gaugeItem.animationFrame
  const rLevel = gaugeItem.rLevel
  return data.map(function (foo, i) {
    return {
      name: 'agArc',
      index: rLevel,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getGaugeArcShape(gaugeItem, i),
      style: getGaugeArcStyle(gaugeItem, i)
    }
  })
}

function getGaugeArcShape (gaugeItem, i) {
  const data = gaugeItem.data
  const center = gaugeItem.center
  let gradientEndAngle = gaugeItem.endAngle
  const _data$i = data[i]
  const radius = _data$i.radius
  const startAngle = _data$i.startAngle
  const endAngle = _data$i.endAngle
  const localGradient = _data$i.localGradient
  if (localGradient) gradientEndAngle = endAngle
  return {
    rx: center[0],
    ry: center[1],
    r: radius,
    startAngle: startAngle,
    endAngle: endAngle,
    gradientEndAngle: gradientEndAngle
  }
}

function getGaugeArcStyle (gaugeItem, i) {
  const data = gaugeItem.data
  const dataItemStyle = gaugeItem.dataItemStyle
  const _data$i2 = data[i]
  const lineWidth = _data$i2.lineWidth
  let gradient = _data$i2.gradient
  gradient = gradient.map(function (c) {
    return (0, _color.getRgbaValue)(c)
  })
  return (0, _util2.deepMerge)({
    lineWidth: lineWidth,
    gradient: gradient
  }, dataItemStyle)
}

function getStartArcConfig (gaugeItem) {
  const configs = getArcConfig(gaugeItem)
  configs.map(function (config) {
    const shape = _objectSpread({}, config.shape)

    shape.endAngle = config.shape.startAngle
    config.shape = shape
  })
  return configs
}

function beforeChangeArc (graph, config) {
  const graphGradient = graph.style.gradient
  const cacheNum = graphGradient.length
  const needNum = config.style.gradient.length

  if (cacheNum > needNum) {
    graphGradient.splice(needNum)
  } else {
    const last = graphGradient.slice(-1)[0]
    graphGradient.push.apply(graphGradient, (0, _toConsumableArray2.default)(new Array(needNum - cacheNum).fill(0).map(function (foo) {
      return (0, _toConsumableArray2.default)(last)
    })))
  }
}

function getPointerConfig (gaugeItem) {
  const animationCurve = gaugeItem.animationCurve
  const animationFrame = gaugeItem.animationFrame
  const center = gaugeItem.center
  const rLevel = gaugeItem.rLevel
  return [{
    name: 'polyline',
    index: rLevel,
    visible: gaugeItem.pointer.show,
    animationCurve: animationCurve,
    animationFrame: animationFrame,
    shape: getPointerShape(gaugeItem),
    style: getPointerStyle(gaugeItem),
    setGraphCenter: function setGraphCenter (foo, graph) {
      graph.style.graphCenter = center
    }
  }]
}

function getPointerShape (gaugeItem) {
  const center = gaugeItem.center
  return {
    points: getPointerPoints(center),
    close: true
  }
}

function getPointerStyle (gaugeItem) {
  const startAngle = gaugeItem.startAngle
  const endAngle = gaugeItem.endAngle
  const min = gaugeItem.min
  const max = gaugeItem.max
  const data = gaugeItem.data
  const pointer = gaugeItem.pointer
  const center = gaugeItem.center
  const valueIndex = pointer.valueIndex
  const style = pointer.style
  const value = data[valueIndex] ? data[valueIndex].value : 0
  const angle = (value - min) / (max - min) * (endAngle - startAngle) + startAngle + Math.PI / 2
  return (0, _util2.deepMerge)({
    rotate: (0, _util2.radianToAngle)(angle),
    scale: [1, 1],
    graphCenter: center
  }, style)
}

function getPointerPoints (_ref8) {
  const _ref9 = (0, _slicedToArray2.default)(_ref8, 2)
  const x = _ref9[0]
  const y = _ref9[1]

  const point1 = [x, y - 40]
  const point2 = [x + 5, y]
  const point3 = [x, y + 10]
  const point4 = [x - 5, y]
  return [point1, point2, point3, point4]
}

function getStartPointerConfig (gaugeItem) {
  const startAngle = gaugeItem.startAngle
  const config = getPointerConfig(gaugeItem)[0]
  config.style.rotate = (0, _util2.radianToAngle)(startAngle + Math.PI / 2)
  return [config]
}

function getDetailsConfig (gaugeItem) {
  const detailsPosition = gaugeItem.detailsPosition
  const animationCurve = gaugeItem.animationCurve
  const animationFrame = gaugeItem.animationFrame
  const rLevel = gaugeItem.rLevel
  const visible = gaugeItem.details.show
  return detailsPosition.map(function (foo, i) {
    return {
      name: 'numberText',
      index: rLevel,
      visible: visible,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getDetailsShape(gaugeItem, i),
      style: getDetailsStyle(gaugeItem, i)
    }
  })
}

function getDetailsShape (gaugeItem, i) {
  const detailsPosition = gaugeItem.detailsPosition
  const detailsContent = gaugeItem.detailsContent
  const data = gaugeItem.data
  const details = gaugeItem.details
  const position = detailsPosition[i]
  const content = detailsContent[i]
  const dataValue = data[i].value
  const toFixed = details.valueToFixed
  return {
    number: [dataValue],
    content: content,
    position: position,
    toFixed: toFixed
  }
}

function getDetailsStyle (gaugeItem, i) {
  const details = gaugeItem.details
  const data = gaugeItem.data
  const style = details.style
  const color = data[i].color
  return (0, _util2.deepMerge)({
    fill: color
  }, style)
}
