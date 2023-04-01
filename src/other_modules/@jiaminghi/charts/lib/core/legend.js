'use strict'

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.legend = legend

const _defineProperty2 = _interopRequireDefault(require('@babel/runtime/helpers/defineProperty'))

const _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'))

const _typeof2 = _interopRequireDefault(require('@babel/runtime/helpers/typeof'))

const _updater = require('../class/updater.class')

const _util = require('@jiaminghi/c-render/lib/plugin/util')

const _config = require('../config')

const _util2 = require('../util')

function legend (chart) {
  const option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
  let legend = option.legend

  if (legend) {
    legend = (0, _util2.deepMerge)((0, _util.deepClone)(_config.legendConfig, true), legend)
    legend = initLegendData(legend)
    legend = filterInvalidData(legend, option, chart)
    legend = calcLegendTextWidth(legend, chart)
    legend = calcLegendPosition(legend, chart)
    legend = [legend]
  } else {
    legend = []
  }

  (0, _updater.doUpdate)({
    chart: chart,
    series: legend,
    key: 'legendIcon',
    getGraphConfig: getIconConfig
  });
  (0, _updater.doUpdate)({
    chart: chart,
    series: legend,
    key: 'legendText',
    getGraphConfig: getTextConfig
  })
}

function initLegendData (legend) {
  const data = legend.data
  legend.data = data.map(function (item) {
    const itemType = (0, _typeof2.default)(item)

    if (itemType === 'string') {
      return {
        name: item
      }
    } else if (itemType === 'object') {
      return item
    }

    return {
      name: ''
    }
  })
  return legend
}

function filterInvalidData (legend, option, chart) {
  const series = option.series
  let legendStatus = chart.legendStatus
  const data = legend.data.filter(function (item) {
    const name = item.name
    const result = series.find(function (_ref) {
      const sn = _ref.name
      return name === sn
    })
    if (!result) return false
    if (!item.color) item.color = result.color
    if (!item.icon) item.icon = result.type
    return item
  })
  if (!legendStatus || legendStatus.length !== legend.data.length) legendStatus = new Array(legend.data.length).fill(true)
  data.forEach(function (item, i) {
    return item.status = legendStatus[i]
  })
  legend.data = data
  chart.legendStatus = legendStatus
  return legend
}

function calcLegendTextWidth (legend, chart) {
  const ctx = chart.render.ctx
  const data = legend.data
  const textStyle = legend.textStyle
  const textUnselectedStyle = legend.textUnselectedStyle
  data.forEach(function (item) {
    const status = item.status
    const name = item.name
    item.textWidth = getTextWidth(ctx, name, status ? textStyle : textUnselectedStyle)
  })
  return legend
}

function getTextWidth (ctx, text, style) {
  ctx.font = getFontConfig(style)
  return ctx.measureText(text).width
}

function getFontConfig (style) {
  const fontFamily = style.fontFamily
  const fontSize = style.fontSize
  return ''.concat(fontSize, 'px ').concat(fontFamily)
}

function calcLegendPosition (legend, chart) {
  const orient = legend.orient

  if (orient === 'vertical') {
    calcVerticalPosition(legend, chart)
  } else {
    calcHorizontalPosition(legend, chart)
  }

  return legend
}

function calcHorizontalPosition (legend, chart) {
  const iconHeight = legend.iconHeight
  const itemGap = legend.itemGap
  const lines = calcDefaultHorizontalPosition(legend, chart)
  const xOffsets = lines.map(function (line) {
    return getHorizontalXOffset(line, legend, chart)
  })
  const yOffset = getHorizontalYOffset(legend, chart)
  const align = {
    textAlign: 'left',
    textBaseline: 'middle'
  }
  lines.forEach(function (line, i) {
    return line.forEach(function (item) {
      const iconPosition = item.iconPosition
      const textPosition = item.textPosition
      const xOffset = xOffsets[i]
      const realYOffset = yOffset + i * (itemGap + iconHeight)
      item.iconPosition = mergeOffset(iconPosition, [xOffset, realYOffset])
      item.textPosition = mergeOffset(textPosition, [xOffset, realYOffset])
      item.align = align
    })
  })
}

function calcDefaultHorizontalPosition (legend, chart) {
  const data = legend.data
  const iconWidth = legend.iconWidth
  const w = chart.render.area[0]
  let startIndex = 0
  const lines = [[]]
  data.forEach(function (item, i) {
    let beforeWidth = getBeforeWidth(startIndex, i, legend)
    const endXPos = beforeWidth + iconWidth + 5 + item.textWidth

    if (endXPos >= w) {
      startIndex = i
      beforeWidth = getBeforeWidth(startIndex, i, legend)
      lines.push([])
    }

    item.iconPosition = [beforeWidth, 0]
    item.textPosition = [beforeWidth + iconWidth + 5, 0]
    lines.slice(-1)[0].push(item)
  })
  return lines
}

function getBeforeWidth (startIndex, currentIndex, legend) {
  const data = legend.data
  const iconWidth = legend.iconWidth
  const itemGap = legend.itemGap
  const beforeItem = data.slice(startIndex, currentIndex)
  return (0, _util2.mulAdd)(beforeItem.map(function (_ref2) {
    const textWidth = _ref2.textWidth
    return textWidth
  })) + (currentIndex - startIndex) * (itemGap + 5 + iconWidth)
}

function getHorizontalXOffset (data, legend, chart) {
  const left = legend.left
  let right = legend.right
  const iconWidth = legend.iconWidth
  const itemGap = legend.itemGap
  const w = chart.render.area[0]
  const dataNum = data.length
  const allWidth = (0, _util2.mulAdd)(data.map(function (_ref3) {
    const textWidth = _ref3.textWidth
    return textWidth
  })) + dataNum * (5 + iconWidth) + (dataNum - 1) * itemGap
  const horizontal = [left, right].findIndex(function (pos) {
    return pos !== 'auto'
  })

  if (horizontal === -1) {
    return (w - allWidth) / 2
  } else if (horizontal === 0) {
    if (typeof left === 'number') return left
    return parseInt(left) / 100 * w
  } else {
    if (typeof right !== 'number') right = parseInt(right) / 100 * w
    return w - (allWidth + right)
  }
}

function getHorizontalYOffset (legend, chart) {
  const top = legend.top
  let bottom = legend.bottom
  const iconHeight = legend.iconHeight
  const h = chart.render.area[1]
  const vertical = [top, bottom].findIndex(function (pos) {
    return pos !== 'auto'
  })
  const halfIconHeight = iconHeight / 2

  if (vertical === -1) {
    const _chart$gridArea = chart.gridArea
    const y = _chart$gridArea.y
    const height = _chart$gridArea.h
    return y + height + 45 - halfIconHeight
  } else if (vertical === 0) {
    if (typeof top === 'number') return top - halfIconHeight
    return parseInt(top) / 100 * h - halfIconHeight
  } else {
    if (typeof bottom !== 'number') bottom = parseInt(bottom) / 100 * h
    return h - bottom - halfIconHeight
  }
}

function mergeOffset (_ref4, _ref5) {
  const _ref6 = (0, _slicedToArray2.default)(_ref4, 2)
  const x = _ref6[0]
  const y = _ref6[1]

  const _ref7 = (0, _slicedToArray2.default)(_ref5, 2)
  const ox = _ref7[0]
  const oy = _ref7[1]

  return [x + ox, y + oy]
}

function calcVerticalPosition (legend, chart) {
  const _getVerticalXOffset = getVerticalXOffset(legend, chart)
  const _getVerticalXOffset2 = (0, _slicedToArray2.default)(_getVerticalXOffset, 2)
  const isRight = _getVerticalXOffset2[0]
  const xOffset = _getVerticalXOffset2[1]

  const yOffset = getVerticalYOffset(legend, chart)
  calcDefaultVerticalPosition(legend, isRight)
  const align = {
    textAlign: 'left',
    textBaseline: 'middle'
  }
  legend.data.forEach(function (item) {
    const textPosition = item.textPosition
    const iconPosition = item.iconPosition
    item.textPosition = mergeOffset(textPosition, [xOffset, yOffset])
    item.iconPosition = mergeOffset(iconPosition, [xOffset, yOffset])
    item.align = align
  })
}

function getVerticalXOffset (legend, chart) {
  const left = legend.left
  const right = legend.right
  const w = chart.render.area[0]
  const horizontal = [left, right].findIndex(function (pos) {
    return pos !== 'auto'
  })

  if (horizontal === -1) {
    return [true, w - 10]
  } else {
    let offset = [left, right][horizontal]
    if (typeof offset !== 'number') offset = parseInt(offset) / 100 * w
    return [Boolean(horizontal), offset]
  }
}

function getVerticalYOffset (legend, chart) {
  const iconHeight = legend.iconHeight
  const itemGap = legend.itemGap
  const data = legend.data
  const top = legend.top
  const bottom = legend.bottom
  const h = chart.render.area[1]
  const dataNum = data.length
  const allHeight = dataNum * iconHeight + (dataNum - 1) * itemGap
  const vertical = [top, bottom].findIndex(function (pos) {
    return pos !== 'auto'
  })

  if (vertical === -1) {
    return (h - allHeight) / 2
  } else {
    let offset = [top, bottom][vertical]
    if (typeof offset !== 'number') offset = parseInt(offset) / 100 * h
    if (vertical === 1) offset = h - offset - allHeight
    return offset
  }
}

function calcDefaultVerticalPosition (legend, isRight) {
  const data = legend.data
  const iconWidth = legend.iconWidth
  const iconHeight = legend.iconHeight
  const itemGap = legend.itemGap
  const halfIconHeight = iconHeight / 2
  data.forEach(function (item, i) {
    const textWidth = item.textWidth
    const yPos = (iconHeight + itemGap) * i + halfIconHeight
    const iconXPos = isRight ? 0 - iconWidth : 0
    const textXpos = isRight ? iconXPos - 5 - textWidth : iconWidth + 5
    item.iconPosition = [iconXPos, yPos]
    item.textPosition = [textXpos, yPos]
  })
}

function getIconConfig (legendItem, updater) {
  const data = legendItem.data
  const selectAble = legendItem.selectAble
  const animationCurve = legendItem.animationCurve
  const animationFrame = legendItem.animationFrame
  const rLevel = legendItem.rLevel
  return data.map(function (item, i) {
    return (0, _defineProperty2.default)({
      name: item.icon === 'line' ? 'lineIcon' : 'rect',
      index: rLevel,
      visible: legendItem.show,
      hover: selectAble,
      click: selectAble,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      shape: getIconShape(legendItem, i),
      style: getIconStyle(legendItem, i)
    }, 'click', createClickCallBack(legendItem, i, updater))
  })
}

function getIconShape (legendItem, i) {
  const data = legendItem.data
  const iconWidth = legendItem.iconWidth
  const iconHeight = legendItem.iconHeight

  const _data$i$iconPosition = (0, _slicedToArray2.default)(data[i].iconPosition, 2)
  const x = _data$i$iconPosition[0]
  const y = _data$i$iconPosition[1]

  const halfIconHeight = iconHeight / 2
  return {
    x: x,
    y: y - halfIconHeight,
    w: iconWidth,
    h: iconHeight
  }
}

function getIconStyle (legendItem, i) {
  const data = legendItem.data
  const iconStyle = legendItem.iconStyle
  const iconUnselectedStyle = legendItem.iconUnselectedStyle
  const _data$i = data[i]
  const status = _data$i.status
  const color = _data$i.color
  const style = status ? iconStyle : iconUnselectedStyle
  return (0, _util2.deepMerge)({
    fill: color
  }, style)
}

function getTextConfig (legendItem, updater) {
  const data = legendItem.data
  const selectAble = legendItem.selectAble
  const animationCurve = legendItem.animationCurve
  const animationFrame = legendItem.animationFrame
  const rLevel = legendItem.rLevel
  return data.map(function (foo, i) {
    return {
      name: 'text',
      index: rLevel,
      visible: legendItem.show,
      hover: selectAble,
      animationCurve: animationCurve,
      animationFrame: animationFrame,
      hoverRect: getTextHoverRect(legendItem, i),
      shape: getTextShape(legendItem, i),
      style: getTextStyle(legendItem, i),
      click: createClickCallBack(legendItem, i, updater)
    }
  })
}

function getTextShape (legendItem, i) {
  const _legendItem$data$i = legendItem.data[i]
  const textPosition = _legendItem$data$i.textPosition
  const name = _legendItem$data$i.name
  return {
    content: name,
    position: textPosition
  }
}

function getTextStyle (legendItem, i) {
  const textStyle = legendItem.textStyle
  const textUnselectedStyle = legendItem.textUnselectedStyle
  const _legendItem$data$i2 = legendItem.data[i]
  const status = _legendItem$data$i2.status
  const align = _legendItem$data$i2.align
  const style = status ? textStyle : textUnselectedStyle
  return (0, _util2.deepMerge)((0, _util.deepClone)(style, true), align)
}

function getTextHoverRect (legendItem, i) {
  const textStyle = legendItem.textStyle
  const textUnselectedStyle = legendItem.textUnselectedStyle

  const _legendItem$data$i3 = legendItem.data[i]
  const status = _legendItem$data$i3.status
  const _legendItem$data$i3$t = (0, _slicedToArray2.default)(_legendItem$data$i3.textPosition, 2)
  const x = _legendItem$data$i3$t[0]
  const y = _legendItem$data$i3$t[1]
  const textWidth = _legendItem$data$i3.textWidth

  const style = status ? textStyle : textUnselectedStyle
  const fontSize = style.fontSize
  return [x, y - fontSize / 2, textWidth, fontSize]
}

function createClickCallBack (legendItem, index, updater) {
  const name = legendItem.data[index].name
  return function () {
    const _updater$chart = updater.chart
    const legendStatus = _updater$chart.legendStatus
    const option = _updater$chart.option
    const status = !legendStatus[index]
    const change = option.series.find(function (_ref9) {
      const sn = _ref9.name
      return sn === name
    })
    change.show = status
    legendStatus[index] = status
    updater.chart.setOption(option)
  }
}
