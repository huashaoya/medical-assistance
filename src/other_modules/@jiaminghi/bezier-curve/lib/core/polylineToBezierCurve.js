'use strict'

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0

const _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'))

const _toConsumableArray2 = _interopRequireDefault(require('@babel/runtime/helpers/toConsumableArray'))

/**
 * @description Abstract the polyline formed by N points into a set of bezier curve
 * @param {Array} polyline A set of points that make up a polyline
 * @param {Boolean} close  Closed curve
 * @param {Number} offsetA Smoothness
 * @param {Number} offsetB Smoothness
 * @return {Array|Boolean} A set of bezier curve (Invalid input will return false)
 */
function polylineToBezierCurve (polyline) {
  const close = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false
  const offsetA = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.25
  const offsetB = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.25

  if (!(polyline instanceof Array)) {
    console.error('polylineToBezierCurve: Parameter polyline must be an array!')
    return false
  }

  if (polyline.length <= 2) {
    console.error('polylineToBezierCurve: Converting to a curve requires at least 3 points!')
    return false
  }

  const startPoint = polyline[0]
  const bezierCurveLineNum = polyline.length - 1
  const bezierCurvePoints = new Array(bezierCurveLineNum).fill(0).map(function (foo, i) {
    return [].concat((0, _toConsumableArray2.default)(getBezierCurveLineControlPoints(polyline, i, close, offsetA, offsetB)), [polyline[i + 1]])
  })
  if (close) closeBezierCurve(bezierCurvePoints, startPoint)
  bezierCurvePoints.unshift(polyline[0])
  return bezierCurvePoints
}
/**
 * @description Get the control points of the Bezier curve
 * @param {Array} polyline A set of points that make up a polyline
 * @param {Number} index   The index of which get controls points's point in polyline
 * @param {Boolean} close  Closed curve
 * @param {Number} offsetA Smoothness
 * @param {Number} offsetB Smoothness
 * @return {Array} Control points
 */

function getBezierCurveLineControlPoints (polyline, index) {
  const close = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false
  const offsetA = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.25
  const offsetB = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.25
  const pointNum = polyline.length
  if (pointNum < 3 || index >= pointNum) return
  let beforePointIndex = index - 1
  if (beforePointIndex < 0) beforePointIndex = close ? pointNum + beforePointIndex : 0
  let afterPointIndex = index + 1
  if (afterPointIndex >= pointNum) afterPointIndex = close ? afterPointIndex - pointNum : pointNum - 1
  let afterNextPointIndex = index + 2
  if (afterNextPointIndex >= pointNum) afterNextPointIndex = close ? afterNextPointIndex - pointNum : pointNum - 1
  const pointBefore = polyline[beforePointIndex]
  const pointMiddle = polyline[index]
  const pointAfter = polyline[afterPointIndex]
  const pointAfterNext = polyline[afterNextPointIndex]
  return [[pointMiddle[0] + offsetA * (pointAfter[0] - pointBefore[0]), pointMiddle[1] + offsetA * (pointAfter[1] - pointBefore[1])], [pointAfter[0] - offsetB * (pointAfterNext[0] - pointMiddle[0]), pointAfter[1] - offsetB * (pointAfterNext[1] - pointMiddle[1])]]
}
/**
 * @description Get the last curve of the closure
 * @param {Array} bezierCurve A set of sub-curve
 * @param {Array} startPoint  Start point
 * @return {Array} The last curve for closure
 */

function closeBezierCurve (bezierCurve, startPoint) {
  const firstSubCurve = bezierCurve[0]
  const lastSubCurve = bezierCurve.slice(-1)[0]
  bezierCurve.push([getSymmetryPoint(lastSubCurve[1], lastSubCurve[2]), getSymmetryPoint(firstSubCurve[0], startPoint), startPoint])
  return bezierCurve
}
/**
 * @description Get the symmetry point
 * @param {Array} point       Symmetric point
 * @param {Array} centerPoint Symmetric center
 * @return {Array} Symmetric point
 */

function getSymmetryPoint (point, centerPoint) {
  const _point = (0, _slicedToArray2.default)(point, 2)
  const px = _point[0]
  const py = _point[1]

  const _centerPoint = (0, _slicedToArray2.default)(centerPoint, 2)
  const cx = _centerPoint[0]
  const cy = _centerPoint[1]

  const minusX = cx - px
  const minusY = cy - py
  return [cx + minusX, cy + minusY]
}

const _default = polylineToBezierCurve
exports.default = _default
