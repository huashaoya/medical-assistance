'use strict'

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

const _toConsumableArray2 = _interopRequireDefault(require('@babel/runtime/helpers/toConsumableArray'))

const _cRender = require('@jiaminghi/c-render')

const _util = require('@jiaminghi/c-render/lib/plugin/util')

const _color = require('@jiaminghi/color')

const _index = require('../util/index')

const pie = {
  shape: {
    rx: 0,
    ry: 0,
    ir: 0,
    or: 0,
    startAngle: 0,
    endAngle: 0,
    clockWise: true
  },
  validator: function validator (_ref) {
    const shape = _ref.shape
    const keys = ['rx', 'ry', 'ir', 'or', 'startAngle', 'endAngle']

    if (keys.find(function (key) {
      return typeof shape[key] !== 'number'
    })) {
      console.error('Pie shape configuration is abnormal!')
      return false
    }

    return true
  },
  draw: function draw (_ref2, _ref3) {
    const ctx = _ref2.ctx
    const shape = _ref3.shape
    ctx.beginPath()
    let rx = shape.rx
    let ry = shape.ry
    const ir = shape.ir
    const or = shape.or
    const startAngle = shape.startAngle
    const endAngle = shape.endAngle
    const clockWise = shape.clockWise
    rx = parseInt(rx) + 0.5
    ry = parseInt(ry) + 0.5
    ctx.arc(rx, ry, ir > 0 ? ir : 0, startAngle, endAngle, !clockWise)
    const connectPoint1 = (0, _util.getCircleRadianPoint)(rx, ry, or, endAngle).map(function (p) {
      return parseInt(p) + 0.5
    })
    const connectPoint2 = (0, _util.getCircleRadianPoint)(rx, ry, ir, startAngle).map(function (p) {
      return parseInt(p) + 0.5
    })
    ctx.lineTo.apply(ctx, (0, _toConsumableArray2.default)(connectPoint1))
    ctx.arc(rx, ry, or > 0 ? or : 0, endAngle, startAngle, clockWise)
    ctx.lineTo.apply(ctx, (0, _toConsumableArray2.default)(connectPoint2))
    ctx.closePath()
    ctx.stroke()
    ctx.fill()
  }
}
const agArc = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0,
    startAngle: 0,
    endAngle: 0,
    gradientStartAngle: null,
    gradientEndAngle: null
  },
  validator: function validator (_ref4) {
    const shape = _ref4.shape
    const keys = ['rx', 'ry', 'r', 'startAngle', 'endAngle']

    if (keys.find(function (key) {
      return typeof shape[key] !== 'number'
    })) {
      console.error('AgArc shape configuration is abnormal!')
      return false
    }

    return true
  },
  draw: function draw (_ref5, _ref6) {
    const ctx = _ref5.ctx
    const shape = _ref6.shape
    const style = _ref6.style
    let gradient = style.gradient
    gradient = gradient.map(function (cv) {
      return (0, _color.getColorFromRgbValue)(cv)
    })

    if (gradient.length === 1) {
      gradient = [gradient[0], gradient[0]]
    }

    const gradientArcNum = gradient.length - 1
    let gradientStartAngle = shape.gradientStartAngle
    let gradientEndAngle = shape.gradientEndAngle
    const startAngle = shape.startAngle
    const endAngle = shape.endAngle
    const r = shape.r
    const rx = shape.rx
    const ry = shape.ry
    if (gradientStartAngle === null) gradientStartAngle = startAngle
    if (gradientEndAngle === null) gradientEndAngle = endAngle
    let angleGap = (gradientEndAngle - gradientStartAngle) / gradientArcNum
    if (angleGap === Math.PI * 2) angleGap = Math.PI * 2 - 0.001

    for (let i = 0; i < gradientArcNum; i++) {
      ctx.beginPath()
      const startPoint = (0, _util.getCircleRadianPoint)(rx, ry, r, startAngle + angleGap * i)
      const endPoint = (0, _util.getCircleRadianPoint)(rx, ry, r, startAngle + angleGap * (i + 1))
      const color = (0, _index.getLinearGradientColor)(ctx, startPoint, endPoint, [gradient[i], gradient[i + 1]])
      const arcStartAngle = startAngle + angleGap * i
      let arcEndAngle = startAngle + angleGap * (i + 1)
      let doBreak = false

      if (arcEndAngle > endAngle) {
        arcEndAngle = endAngle
        doBreak = true
      }

      ctx.arc(rx, ry, r, arcStartAngle, arcEndAngle)
      ctx.strokeStyle = color
      ctx.stroke()
      if (doBreak) break
    }
  }
}
const numberText = {
  shape: {
    number: [],
    content: '',
    position: [0, 0],
    toFixed: 0
  },
  validator: function validator (_ref7) {
    const shape = _ref7.shape
    const number = shape.number
    const content = shape.content
    const position = shape.position

    if (!(number instanceof Array) || typeof content !== 'string' || !(position instanceof Array)) {
      console.error('NumberText shape configuration is abnormal!')
      return false
    }

    return true
  },
  draw: function draw (_ref8, _ref9) {
    const ctx = _ref8.ctx
    const shape = _ref9.shape
    ctx.beginPath()
    const number = shape.number
    const content = shape.content
    const position = shape.position
    const toFixed = shape.toFixed
    const textSegments = content.split('{nt}')
    const lastSegmentIndex = textSegments.length - 1
    let textString = ''
    textSegments.forEach(function (t, i) {
      let currentNumber = number[i]
      if (i === lastSegmentIndex) currentNumber = ''
      if (typeof currentNumber === 'number') currentNumber = currentNumber.toFixed(toFixed)
      textString += t + (currentNumber || '')
    })
    ctx.closePath()
    ctx.strokeText.apply(ctx, [textString].concat((0, _toConsumableArray2.default)(position)))
    ctx.fillText.apply(ctx, [textString].concat((0, _toConsumableArray2.default)(position)))
  }
}
const lineIcon = {
  shape: {
    x: 0,
    y: 0,
    w: 0,
    h: 0
  },
  validator: function validator (_ref10) {
    const shape = _ref10.shape
    const x = shape.x
    const y = shape.y
    const w = shape.w
    const h = shape.h

    if (typeof x !== 'number' || typeof y !== 'number' || typeof w !== 'number' || typeof h !== 'number') {
      console.error('lineIcon shape configuration is abnormal!')
      return false
    }

    return true
  },
  draw: function draw (_ref11, _ref12) {
    const ctx = _ref11.ctx
    const shape = _ref12.shape
    ctx.beginPath()
    const x = shape.x
    const y = shape.y
    const w = shape.w
    const h = shape.h
    const halfH = h / 2
    ctx.strokeStyle = ctx.fillStyle
    ctx.moveTo(x, y + halfH)
    ctx.lineTo(x + w, y + halfH)
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.beginPath()
    let radius = halfH - 5 * 2
    if (radius <= 0) radius = 3
    ctx.arc(x + w / 2, y + halfH, radius, 0, Math.PI * 2)
    ctx.lineWidth = 5
    ctx.stroke()
    ctx.fillStyle = '#fff'
    ctx.fill()
  },
  hoverCheck: function hoverCheck (position, _ref13) {
    const shape = _ref13.shape
    const x = shape.x
    const y = shape.y
    const w = shape.w
    const h = shape.h
    return (0, _util.checkPointIsInRect)(position, x, y, w, h)
  },
  setGraphCenter: function setGraphCenter (e, _ref14) {
    const shape = _ref14.shape
    const style = _ref14.style
    const x = shape.x
    const y = shape.y
    const w = shape.w
    const h = shape.h
    style.graphCenter = [x + w / 2, y + h / 2]
  }
};
(0, _cRender.extendNewGraph)('pie', pie);
(0, _cRender.extendNewGraph)('agArc', agArc);
(0, _cRender.extendNewGraph)('numberText', numberText);
(0, _cRender.extendNewGraph)('lineIcon', lineIcon)
