'use strict'

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.extendNewGraph = extendNewGraph
exports.default = exports.text = exports.bezierCurve = exports.smoothline = exports.polyline = exports.regPolygon = exports.sector = exports.arc = exports.ring = exports.rect = exports.ellipse = exports.circle = void 0

const _toConsumableArray2 = _interopRequireDefault(require('@babel/runtime/helpers/toConsumableArray'))

const _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'))

const _bezierCurve2 = _interopRequireDefault(require('@jiaminghi/bezier-curve'))

const _util = require('../plugin/util')

const _canvas = require('../plugin/canvas')

const polylineToBezierCurve = _bezierCurve2.default.polylineToBezierCurve
const bezierCurveToPolyline = _bezierCurve2.default.bezierCurveToPolyline
const circle = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0
  },
  validator: function validator (_ref) {
    const shape = _ref.shape
    const rx = shape.rx
    const ry = shape.ry
    const r = shape.r

    if (typeof rx !== 'number' || typeof ry !== 'number' || typeof r !== 'number') {
      console.error('Circle shape configuration is abnormal!')
      return false
    }

    return true
  },
  draw: function draw (_ref2, _ref3) {
    const ctx = _ref2.ctx
    const shape = _ref3.shape
    ctx.beginPath()
    const rx = shape.rx
    const ry = shape.ry
    const r = shape.r
    ctx.arc(rx, ry, r > 0 ? r : 0.01, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
  },
  hoverCheck: function hoverCheck (position, _ref4) {
    const shape = _ref4.shape
    const rx = shape.rx
    const ry = shape.ry
    const r = shape.r
    return (0, _util.checkPointIsInCircle)(position, rx, ry, r)
  },
  setGraphCenter: function setGraphCenter (e, _ref5) {
    const shape = _ref5.shape
    const style = _ref5.style
    const rx = shape.rx
    const ry = shape.ry
    style.graphCenter = [rx, ry]
  },
  move: function move (_ref6, _ref7) {
    const movementX = _ref6.movementX
    const movementY = _ref6.movementY
    const shape = _ref7.shape
    this.attr('shape', {
      rx: shape.rx + movementX,
      ry: shape.ry + movementY
    })
  }
}
exports.circle = circle
const ellipse = {
  shape: {
    rx: 0,
    ry: 0,
    hr: 0,
    vr: 0
  },
  validator: function validator (_ref8) {
    const shape = _ref8.shape
    const rx = shape.rx
    const ry = shape.ry
    const hr = shape.hr
    const vr = shape.vr

    if (typeof rx !== 'number' || typeof ry !== 'number' || typeof hr !== 'number' || typeof vr !== 'number') {
      console.error('Ellipse shape configuration is abnormal!')
      return false
    }

    return true
  },
  draw: function draw (_ref9, _ref10) {
    const ctx = _ref9.ctx
    const shape = _ref10.shape
    ctx.beginPath()
    const rx = shape.rx
    const ry = shape.ry
    const hr = shape.hr
    const vr = shape.vr
    ctx.ellipse(rx, ry, hr > 0 ? hr : 0.01, vr > 0 ? vr : 0.01, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
  },
  hoverCheck: function hoverCheck (position, _ref11) {
    const shape = _ref11.shape
    const rx = shape.rx
    const ry = shape.ry
    const hr = shape.hr
    const vr = shape.vr
    const a = Math.max(hr, vr)
    const b = Math.min(hr, vr)
    const c = Math.sqrt(a * a - b * b)
    const leftFocusPoint = [rx - c, ry]
    const rightFocusPoint = [rx + c, ry]
    const distance = (0, _util.getTwoPointDistance)(position, leftFocusPoint) + (0, _util.getTwoPointDistance)(position, rightFocusPoint)
    return distance <= 2 * a
  },
  setGraphCenter: function setGraphCenter (e, _ref12) {
    const shape = _ref12.shape
    const style = _ref12.style
    const rx = shape.rx
    const ry = shape.ry
    style.graphCenter = [rx, ry]
  },
  move: function move (_ref13, _ref14) {
    const movementX = _ref13.movementX
    const movementY = _ref13.movementY
    const shape = _ref14.shape
    this.attr('shape', {
      rx: shape.rx + movementX,
      ry: shape.ry + movementY
    })
  }
}
exports.ellipse = ellipse
const rect = {
  shape: {
    x: 0,
    y: 0,
    w: 0,
    h: 0
  },
  validator: function validator (_ref15) {
    const shape = _ref15.shape
    const x = shape.x
    const y = shape.y
    const w = shape.w
    const h = shape.h

    if (typeof x !== 'number' || typeof y !== 'number' || typeof w !== 'number' || typeof h !== 'number') {
      console.error('Rect shape configuration is abnormal!')
      return false
    }

    return true
  },
  draw: function draw (_ref16, _ref17) {
    const ctx = _ref16.ctx
    const shape = _ref17.shape
    ctx.beginPath()
    const x = shape.x
    const y = shape.y
    const w = shape.w
    const h = shape.h
    ctx.rect(x, y, w, h)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
  },
  hoverCheck: function hoverCheck (position, _ref18) {
    const shape = _ref18.shape
    const x = shape.x
    const y = shape.y
    const w = shape.w
    const h = shape.h
    return (0, _util.checkPointIsInRect)(position, x, y, w, h)
  },
  setGraphCenter: function setGraphCenter (e, _ref19) {
    const shape = _ref19.shape
    const style = _ref19.style
    const x = shape.x
    const y = shape.y
    const w = shape.w
    const h = shape.h
    style.graphCenter = [x + w / 2, y + h / 2]
  },
  move: function move (_ref20, _ref21) {
    const movementX = _ref20.movementX
    const movementY = _ref20.movementY
    const shape = _ref21.shape
    this.attr('shape', {
      x: shape.x + movementX,
      y: shape.y + movementY
    })
  }
}
exports.rect = rect
const ring = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0
  },
  validator: function validator (_ref22) {
    const shape = _ref22.shape
    const rx = shape.rx
    const ry = shape.ry
    const r = shape.r

    if (typeof rx !== 'number' || typeof ry !== 'number' || typeof r !== 'number') {
      console.error('Ring shape configuration is abnormal!')
      return false
    }

    return true
  },
  draw: function draw (_ref23, _ref24) {
    const ctx = _ref23.ctx
    const shape = _ref24.shape
    ctx.beginPath()
    const rx = shape.rx
    const ry = shape.ry
    const r = shape.r
    ctx.arc(rx, ry, r > 0 ? r : 0.01, 0, Math.PI * 2)
    ctx.stroke()
    ctx.closePath()
  },
  hoverCheck: function hoverCheck (position, _ref25) {
    const shape = _ref25.shape
    const style = _ref25.style
    const rx = shape.rx
    const ry = shape.ry
    const r = shape.r
    const lineWidth = style.lineWidth
    const halfLineWidth = lineWidth / 2
    const minDistance = r - halfLineWidth
    const maxDistance = r + halfLineWidth
    const distance = (0, _util.getTwoPointDistance)(position, [rx, ry])
    return distance >= minDistance && distance <= maxDistance
  },
  setGraphCenter: function setGraphCenter (e, _ref26) {
    const shape = _ref26.shape
    const style = _ref26.style
    const rx = shape.rx
    const ry = shape.ry
    style.graphCenter = [rx, ry]
  },
  move: function move (_ref27, _ref28) {
    const movementX = _ref27.movementX
    const movementY = _ref27.movementY
    const shape = _ref28.shape
    this.attr('shape', {
      rx: shape.rx + movementX,
      ry: shape.ry + movementY
    })
  }
}
exports.ring = ring
const arc = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0,
    startAngle: 0,
    endAngle: 0,
    clockWise: true
  },
  validator: function validator (_ref29) {
    const shape = _ref29.shape
    const keys = ['rx', 'ry', 'r', 'startAngle', 'endAngle']

    if (keys.find(function (key) {
      return typeof shape[key] !== 'number'
    })) {
      console.error('Arc shape configuration is abnormal!')
      return false
    }

    return true
  },
  draw: function draw (_ref30, _ref31) {
    const ctx = _ref30.ctx
    const shape = _ref31.shape
    ctx.beginPath()
    const rx = shape.rx
    const ry = shape.ry
    const r = shape.r
    const startAngle = shape.startAngle
    const endAngle = shape.endAngle
    const clockWise = shape.clockWise
    ctx.arc(rx, ry, r > 0 ? r : 0.001, startAngle, endAngle, !clockWise)
    ctx.stroke()
    ctx.closePath()
  },
  hoverCheck: function hoverCheck (position, _ref32) {
    const shape = _ref32.shape
    const style = _ref32.style
    const rx = shape.rx
    const ry = shape.ry
    const r = shape.r
    const startAngle = shape.startAngle
    const endAngle = shape.endAngle
    const clockWise = shape.clockWise
    const lineWidth = style.lineWidth
    const halfLineWidth = lineWidth / 2
    const insideRadius = r - halfLineWidth
    const outsideRadius = r + halfLineWidth
    return !(0, _util.checkPointIsInSector)(position, rx, ry, insideRadius, startAngle, endAngle, clockWise) && (0, _util.checkPointIsInSector)(position, rx, ry, outsideRadius, startAngle, endAngle, clockWise)
  },
  setGraphCenter: function setGraphCenter (e, _ref33) {
    const shape = _ref33.shape
    const style = _ref33.style
    const rx = shape.rx
    const ry = shape.ry
    style.graphCenter = [rx, ry]
  },
  move: function move (_ref34, _ref35) {
    const movementX = _ref34.movementX
    const movementY = _ref34.movementY
    const shape = _ref35.shape
    this.attr('shape', {
      rx: shape.rx + movementX,
      ry: shape.ry + movementY
    })
  }
}
exports.arc = arc
const sector = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0,
    startAngle: 0,
    endAngle: 0,
    clockWise: true
  },
  validator: function validator (_ref36) {
    const shape = _ref36.shape
    const keys = ['rx', 'ry', 'r', 'startAngle', 'endAngle']

    if (keys.find(function (key) {
      return typeof shape[key] !== 'number'
    })) {
      console.error('Sector shape configuration is abnormal!')
      return false
    }

    return true
  },
  draw: function draw (_ref37, _ref38) {
    const ctx = _ref37.ctx
    const shape = _ref38.shape
    ctx.beginPath()
    const rx = shape.rx
    const ry = shape.ry
    const r = shape.r
    const startAngle = shape.startAngle
    const endAngle = shape.endAngle
    const clockWise = shape.clockWise
    ctx.arc(rx, ry, r > 0 ? r : 0.01, startAngle, endAngle, !clockWise)
    ctx.lineTo(rx, ry)
    ctx.closePath()
    ctx.stroke()
    ctx.fill()
  },
  hoverCheck: function hoverCheck (position, _ref39) {
    const shape = _ref39.shape
    const rx = shape.rx
    const ry = shape.ry
    const r = shape.r
    const startAngle = shape.startAngle
    const endAngle = shape.endAngle
    const clockWise = shape.clockWise
    return (0, _util.checkPointIsInSector)(position, rx, ry, r, startAngle, endAngle, clockWise)
  },
  setGraphCenter: function setGraphCenter (e, _ref40) {
    const shape = _ref40.shape
    const style = _ref40.style
    const rx = shape.rx
    const ry = shape.ry
    style.graphCenter = [rx, ry]
  },
  move: function move (_ref41, _ref42) {
    const movementX = _ref41.movementX
    const movementY = _ref41.movementY
    const shape = _ref42.shape
    const rx = shape.rx
    const ry = shape.ry
    this.attr('shape', {
      rx: rx + movementX,
      ry: ry + movementY
    })
  }
}
exports.sector = sector
const regPolygon = {
  shape: {
    rx: 0,
    ry: 0,
    r: 0,
    side: 0
  },
  validator: function validator (_ref43) {
    const shape = _ref43.shape
    const side = shape.side
    const keys = ['rx', 'ry', 'r', 'side']

    if (keys.find(function (key) {
      return typeof shape[key] !== 'number'
    })) {
      console.error('RegPolygon shape configuration is abnormal!')
      return false
    }

    if (side < 3) {
      console.error('RegPolygon at least trigon!')
      return false
    }

    return true
  },
  draw: function draw (_ref44, _ref45) {
    const ctx = _ref44.ctx
    const shape = _ref45.shape
    const cache = _ref45.cache
    ctx.beginPath()
    const rx = shape.rx
    const ry = shape.ry
    const r = shape.r
    const side = shape.side

    if (!cache.points || cache.rx !== rx || cache.ry !== ry || cache.r !== r || cache.side !== side) {
      const _points = (0, _util.getRegularPolygonPoints)(rx, ry, r, side)

      Object.assign(cache, {
        points: _points,
        rx: rx,
        ry: ry,
        r: r,
        side: side
      })
    }

    const points = cache.points;
    (0, _canvas.drawPolylinePath)(ctx, points)
    ctx.closePath()
    ctx.stroke()
    ctx.fill()
  },
  hoverCheck: function hoverCheck (position, _ref46) {
    const cache = _ref46.cache
    const points = cache.points
    return (0, _util.checkPointIsInPolygon)(position, points)
  },
  setGraphCenter: function setGraphCenter (e, _ref47) {
    const shape = _ref47.shape
    const style = _ref47.style
    const rx = shape.rx
    const ry = shape.ry
    style.graphCenter = [rx, ry]
  },
  move: function move (_ref48, _ref49) {
    const movementX = _ref48.movementX
    const movementY = _ref48.movementY
    const shape = _ref49.shape
    const cache = _ref49.cache
    const rx = shape.rx
    const ry = shape.ry
    cache.rx += movementX
    cache.ry += movementY
    this.attr('shape', {
      rx: rx + movementX,
      ry: ry + movementY
    })
    cache.points = cache.points.map(function (_ref50) {
      const _ref51 = (0, _slicedToArray2.default)(_ref50, 2)
      const x = _ref51[0]
      const y = _ref51[1]

      return [x + movementX, y + movementY]
    })
  }
}
exports.regPolygon = regPolygon
const polyline = {
  shape: {
    points: [],
    close: false
  },
  validator: function validator (_ref52) {
    const shape = _ref52.shape
    const points = shape.points

    if (!(points instanceof Array)) {
      console.error('Polyline points should be an array!')
      return false
    }

    return true
  },
  draw: function draw (_ref53, _ref54) {
    const ctx = _ref53.ctx
    const shape = _ref54.shape
    const lineWidth = _ref54.style.lineWidth
    ctx.beginPath()
    let points = shape.points
    const close = shape.close
    if (lineWidth === 1) points = (0, _util.eliminateBlur)(points);
    (0, _canvas.drawPolylinePath)(ctx, points)

    if (close) {
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    } else {
      ctx.stroke()
    }
  },
  hoverCheck: function hoverCheck (position, _ref55) {
    const shape = _ref55.shape
    const style = _ref55.style
    const points = shape.points
    const close = shape.close
    const lineWidth = style.lineWidth

    if (close) {
      return (0, _util.checkPointIsInPolygon)(position, points)
    } else {
      return (0, _util.checkPointIsNearPolyline)(position, points, lineWidth)
    }
  },
  setGraphCenter: function setGraphCenter (e, _ref56) {
    const shape = _ref56.shape
    const style = _ref56.style
    const points = shape.points
    style.graphCenter = points[0]
  },
  move: function move (_ref57, _ref58) {
    const movementX = _ref57.movementX
    const movementY = _ref57.movementY
    const shape = _ref58.shape
    const points = shape.points
    const moveAfterPoints = points.map(function (_ref59) {
      const _ref60 = (0, _slicedToArray2.default)(_ref59, 2)
      const x = _ref60[0]
      const y = _ref60[1]

      return [x + movementX, y + movementY]
    })
    this.attr('shape', {
      points: moveAfterPoints
    })
  }
}
exports.polyline = polyline
const smoothline = {
  shape: {
    points: [],
    close: false
  },
  validator: function validator (_ref61) {
    const shape = _ref61.shape
    const points = shape.points

    if (!(points instanceof Array)) {
      console.error('Smoothline points should be an array!')
      return false
    }

    return true
  },
  draw: function draw (_ref62, _ref63) {
    const ctx = _ref62.ctx
    const shape = _ref63.shape
    const cache = _ref63.cache
    const points = shape.points
    const close = shape.close

    if (!cache.points || cache.points.toString() !== points.toString()) {
      const _bezierCurve = polylineToBezierCurve(points, close)

      const hoverPoints = bezierCurveToPolyline(_bezierCurve)
      Object.assign(cache, {
        points: (0, _util.deepClone)(points, true),
        bezierCurve: _bezierCurve,
        hoverPoints: hoverPoints
      })
    }

    const bezierCurve = cache.bezierCurve
    ctx.beginPath();
    (0, _canvas.drawBezierCurvePath)(ctx, bezierCurve.slice(1), bezierCurve[0])

    if (close) {
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    } else {
      ctx.stroke()
    }
  },
  hoverCheck: function hoverCheck (position, _ref64) {
    const cache = _ref64.cache
    const shape = _ref64.shape
    const style = _ref64.style
    const hoverPoints = cache.hoverPoints
    const close = shape.close
    const lineWidth = style.lineWidth

    if (close) {
      return (0, _util.checkPointIsInPolygon)(position, hoverPoints)
    } else {
      return (0, _util.checkPointIsNearPolyline)(position, hoverPoints, lineWidth)
    }
  },
  setGraphCenter: function setGraphCenter (e, _ref65) {
    const shape = _ref65.shape
    const style = _ref65.style
    const points = shape.points
    style.graphCenter = points[0]
  },
  move: function move (_ref66, _ref67) {
    const movementX = _ref66.movementX
    const movementY = _ref66.movementY
    const shape = _ref67.shape
    const cache = _ref67.cache
    const points = shape.points
    const moveAfterPoints = points.map(function (_ref68) {
      const _ref69 = (0, _slicedToArray2.default)(_ref68, 2)
      const x = _ref69[0]
      const y = _ref69[1]

      return [x + movementX, y + movementY]
    })
    cache.points = moveAfterPoints

    const _cache$bezierCurve$ = (0, _slicedToArray2.default)(cache.bezierCurve[0], 2)
    const fx = _cache$bezierCurve$[0]
    const fy = _cache$bezierCurve$[1]

    const curves = cache.bezierCurve.slice(1)
    cache.bezierCurve = [[fx + movementX, fy + movementY]].concat((0, _toConsumableArray2.default)(curves.map(function (curve) {
      return curve.map(function (_ref70) {
        const _ref71 = (0, _slicedToArray2.default)(_ref70, 2)
        const x = _ref71[0]
        const y = _ref71[1]

        return [x + movementX, y + movementY]
      })
    })))
    cache.hoverPoints = cache.hoverPoints.map(function (_ref72) {
      const _ref73 = (0, _slicedToArray2.default)(_ref72, 2)
      const x = _ref73[0]
      const y = _ref73[1]

      return [x + movementX, y + movementY]
    })
    this.attr('shape', {
      points: moveAfterPoints
    })
  }
}
exports.smoothline = smoothline
const bezierCurve = {
  shape: {
    points: [],
    close: false
  },
  validator: function validator (_ref74) {
    const shape = _ref74.shape
    const points = shape.points

    if (!(points instanceof Array)) {
      console.error('BezierCurve points should be an array!')
      return false
    }

    return true
  },
  draw: function draw (_ref75, _ref76) {
    const ctx = _ref75.ctx
    const shape = _ref76.shape
    const cache = _ref76.cache
    const points = shape.points
    const close = shape.close

    if (!cache.points || cache.points.toString() !== points.toString()) {
      const hoverPoints = bezierCurveToPolyline(points, 20)
      Object.assign(cache, {
        points: (0, _util.deepClone)(points, true),
        hoverPoints: hoverPoints
      })
    }

    ctx.beginPath();
    (0, _canvas.drawBezierCurvePath)(ctx, points.slice(1), points[0])

    if (close) {
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    } else {
      ctx.stroke()
    }
  },
  hoverCheck: function hoverCheck (position, _ref77) {
    const cache = _ref77.cache
    const shape = _ref77.shape
    const style = _ref77.style
    const hoverPoints = cache.hoverPoints
    const close = shape.close
    const lineWidth = style.lineWidth

    if (close) {
      return (0, _util.checkPointIsInPolygon)(position, hoverPoints)
    } else {
      return (0, _util.checkPointIsNearPolyline)(position, hoverPoints, lineWidth)
    }
  },
  setGraphCenter: function setGraphCenter (e, _ref78) {
    const shape = _ref78.shape
    const style = _ref78.style
    const points = shape.points
    style.graphCenter = points[0]
  },
  move: function move (_ref79, _ref80) {
    const movementX = _ref79.movementX
    const movementY = _ref79.movementY
    const shape = _ref80.shape
    const cache = _ref80.cache
    const points = shape.points

    const _points$ = (0, _slicedToArray2.default)(points[0], 2)
    const fx = _points$[0]
    const fy = _points$[1]

    const curves = points.slice(1)
    const bezierCurve = [[fx + movementX, fy + movementY]].concat((0, _toConsumableArray2.default)(curves.map(function (curve) {
      return curve.map(function (_ref81) {
        const _ref82 = (0, _slicedToArray2.default)(_ref81, 2)
        const x = _ref82[0]
        const y = _ref82[1]

        return [x + movementX, y + movementY]
      })
    })))
    cache.points = bezierCurve
    cache.hoverPoints = cache.hoverPoints.map(function (_ref83) {
      const _ref84 = (0, _slicedToArray2.default)(_ref83, 2)
      const x = _ref84[0]
      const y = _ref84[1]

      return [x + movementX, y + movementY]
    })
    this.attr('shape', {
      points: bezierCurve
    })
  }
}
exports.bezierCurve = bezierCurve
const text = {
  shape: {
    content: '',
    position: [],
    maxWidth: undefined,
    rowGap: 0
  },
  validator: function validator (_ref85) {
    const shape = _ref85.shape
    const content = shape.content
    const position = shape.position
    const rowGap = shape.rowGap

    if (typeof content !== 'string') {
      console.error('Text content should be a string!')
      return false
    }

    if (!(position instanceof Array)) {
      console.error('Text position should be an array!')
      return false
    }

    if (typeof rowGap !== 'number') {
      console.error('Text rowGap should be a number!')
      return false
    }

    return true
  },
  draw: function draw (_ref86, _ref87) {
    const ctx = _ref86.ctx
    const shape = _ref87.shape
    let content = shape.content
    let position = shape.position
    const maxWidth = shape.maxWidth
    const rowGap = shape.rowGap
    const textBaseline = ctx.textBaseline
    const font = ctx.font
    const fontSize = parseInt(font.replace(/\D/g, ''))

    const _position = position
    const _position2 = (0, _slicedToArray2.default)(_position, 2)
    const x = _position2[0]
    let y = _position2[1]

    content = content.split('\n')
    const rowNum = content.length
    const lineHeight = fontSize + rowGap
    const allHeight = rowNum * lineHeight - rowGap
    let offset = 0

    if (textBaseline === 'middle') {
      offset = allHeight / 2
      y += fontSize / 2
    }

    if (textBaseline === 'bottom') {
      offset = allHeight
      y += fontSize
    }

    position = new Array(rowNum).fill(0).map(function (foo, i) {
      return [x, y + i * lineHeight - offset]
    })
    ctx.beginPath()
    content.forEach(function (text, i) {
      ctx.fillText.apply(ctx, [text].concat((0, _toConsumableArray2.default)(position[i]), [maxWidth]))
      ctx.strokeText.apply(ctx, [text].concat((0, _toConsumableArray2.default)(position[i]), [maxWidth]))
    })
    ctx.closePath()
  },
  hoverCheck: function hoverCheck (position, _ref88) {
    const shape = _ref88.shape
    const style = _ref88.style
    return false
  },
  setGraphCenter: function setGraphCenter (e, _ref89) {
    const shape = _ref89.shape
    const style = _ref89.style
    const position = shape.position
    style.graphCenter = (0, _toConsumableArray2.default)(position)
  },
  move: function move (_ref90, _ref91) {
    const movementX = _ref90.movementX
    const movementY = _ref90.movementY
    const shape = _ref91.shape

    const _shape$position = (0, _slicedToArray2.default)(shape.position, 2)
    const x = _shape$position[0]
    const y = _shape$position[1]

    this.attr('shape', {
      position: [x + movementX, y + movementY]
    })
  }
}
exports.text = text
const graphs = new Map([['circle', circle], ['ellipse', ellipse], ['rect', rect], ['ring', ring], ['arc', arc], ['sector', sector], ['regPolygon', regPolygon], ['polyline', polyline], ['smoothline', smoothline], ['bezierCurve', bezierCurve], ['text', text]])
const _default = graphs
/**
 * @description Extend new graph
 * @param {String} name   Name of Graph
 * @param {Object} config Configuration of Graph
 * @return {Undefined} Void
 */

exports.default = _default

function extendNewGraph (name, config) {
  if (!name || !config) {
    console.error('ExtendNewGraph Missing Parameters!')
    return
  }

  if (!config.shape) {
    console.error('Required attribute of shape to extendNewGraph!')
    return
  }

  if (!config.validator) {
    console.error('Required function of validator to extendNewGraph!')
    return
  }

  if (!config.draw) {
    console.error('Required function of draw to extendNewGraph!')
    return
  }

  graphs.set(name, config)
}
