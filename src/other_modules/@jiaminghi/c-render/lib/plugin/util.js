'use strict'

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.deepClone = deepClone
exports.eliminateBlur = eliminateBlur
exports.checkPointIsInCircle = checkPointIsInCircle
exports.getTwoPointDistance = getTwoPointDistance
exports.checkPointIsInPolygon = checkPointIsInPolygon
exports.checkPointIsInSector = checkPointIsInSector
exports.checkPointIsNearPolyline = checkPointIsNearPolyline
exports.checkPointIsInRect = checkPointIsInRect
exports.getRotatePointPos = getRotatePointPos
exports.getScalePointPos = getScalePointPos
exports.getTranslatePointPos = getTranslatePointPos
exports.getDistanceBetweenPointAndLine = getDistanceBetweenPointAndLine
exports.getCircleRadianPoint = getCircleRadianPoint
exports.getRegularPolygonPoints = getRegularPolygonPoints
exports.default = void 0

const _toConsumableArray2 = _interopRequireDefault(require('@babel/runtime/helpers/toConsumableArray'))

const _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'))

const _typeof2 = _interopRequireDefault(require('@babel/runtime/helpers/typeof'))

const abs = Math.abs
const sqrt = Math.sqrt
const sin = Math.sin
const cos = Math.cos
const max = Math.max
const min = Math.min
const PI = Math.PI
/**
 * @description Clone an object or array
 * @param {Object|Array} object Cloned object
 * @param {Boolean} recursion   Whether to use recursive cloning
 * @return {Object|Array} Clone object
 */

function deepClone (object) {
  const recursion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false
  if (!object) return object
  const parse = JSON.parse
  const stringify = JSON.stringify
  if (!recursion) return parse(stringify(object))
  const clonedObj = object instanceof Array ? [] : {}

  if (object && (0, _typeof2.default)(object) === 'object') {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        if (object[key] && (0, _typeof2.default)(object[key]) === 'object') {
          clonedObj[key] = deepClone(object[key], true)
        } else {
          clonedObj[key] = object[key]
        }
      }
    }
  }

  return clonedObj
}
/**
 * @description Eliminate line blur due to 1px line width
 * @param {Array} points Line points
 * @return {Array} Line points after processed
 */

function eliminateBlur (points) {
  return points.map(function (_ref) {
    const _ref2 = (0, _slicedToArray2.default)(_ref, 2)
    const x = _ref2[0]
    const y = _ref2[1]

    return [parseInt(x) + 0.5, parseInt(y) + 0.5]
  })
}
/**
 * @description Check if the point is inside the circle
 * @param {Array} point Postion of point
 * @param {Number} rx   Circle x coordinate
 * @param {Number} ry   Circle y coordinate
 * @param {Number} r    Circle radius
 * @return {Boolean} Result of check
 */

function checkPointIsInCircle (point, rx, ry, r) {
  return getTwoPointDistance(point, [rx, ry]) <= r
}
/**
 * @description Get the distance between two points
 * @param {Array} point1 point1
 * @param {Array} point2 point2
 * @return {Number} Distance between two points
 */

function getTwoPointDistance (_ref3, _ref4) {
  const _ref5 = (0, _slicedToArray2.default)(_ref3, 2)
  const xa = _ref5[0]
  const ya = _ref5[1]

  const _ref6 = (0, _slicedToArray2.default)(_ref4, 2)
  const xb = _ref6[0]
  const yb = _ref6[1]

  const minusX = abs(xa - xb)
  const minusY = abs(ya - yb)
  return sqrt(minusX * minusX + minusY * minusY)
}
/**
 * @description Check if the point is inside the polygon
 * @param {Array} point  Postion of point
 * @param {Array} points The points that makes up a polyline
 * @return {Boolean} Result of check
 */

function checkPointIsInPolygon (point, polygon) {
  let counter = 0

  const _point = (0, _slicedToArray2.default)(point, 2)
  const x = _point[0]
  const y = _point[1]

  const pointNum = polygon.length

  for (let i = 1, p1 = polygon[0]; i <= pointNum; i++) {
    const p2 = polygon[i % pointNum]

    if (x > min(p1[0], p2[0]) && x <= max(p1[0], p2[0])) {
      if (y <= max(p1[1], p2[1])) {
        if (p1[0] !== p2[0]) {
          const xinters = (x - p1[0]) * (p2[1] - p1[1]) / (p2[0] - p1[0]) + p1[1]

          if (p1[1] === p2[1] || y <= xinters) {
            counter++
          }
        }
      }
    }

    p1 = p2
  }

  return counter % 2 === 1
}
/**
 * @description Check if the point is inside the sector
 * @param {Array} point       Postion of point
 * @param {Number} rx         Sector x coordinate
 * @param {Number} ry         Sector y coordinate
 * @param {Number} r          Sector radius
 * @param {Number} startAngle Sector start angle
 * @param {Number} endAngle   Sector end angle
 * @param {Boolean} clockWise Whether the sector angle is clockwise
 * @return {Boolean} Result of check
 */

function checkPointIsInSector (point, rx, ry, r, startAngle, endAngle, clockWise) {
  if (!point) return false
  if (getTwoPointDistance(point, [rx, ry]) > r) return false

  if (!clockWise) {
    const _deepClone = deepClone([endAngle, startAngle])

    const _deepClone2 = (0, _slicedToArray2.default)(_deepClone, 2)

    startAngle = _deepClone2[0]
    endAngle = _deepClone2[1]
  }

  const reverseBE = startAngle > endAngle

  if (reverseBE) {
    const _ref7 = [endAngle, startAngle]
    startAngle = _ref7[0]
    endAngle = _ref7[1]
  }

  const minus = endAngle - startAngle
  if (minus >= PI * 2) return true

  const _point2 = (0, _slicedToArray2.default)(point, 2)
  const x = _point2[0]
  const y = _point2[1]

  const _getCircleRadianPoint = getCircleRadianPoint(rx, ry, r, startAngle)
  const _getCircleRadianPoint2 = (0, _slicedToArray2.default)(_getCircleRadianPoint, 2)
  const bx = _getCircleRadianPoint2[0]
  const by = _getCircleRadianPoint2[1]

  const _getCircleRadianPoint3 = getCircleRadianPoint(rx, ry, r, endAngle)
  const _getCircleRadianPoint4 = (0, _slicedToArray2.default)(_getCircleRadianPoint3, 2)
  const ex = _getCircleRadianPoint4[0]
  const ey = _getCircleRadianPoint4[1]

  const vPoint = [x - rx, y - ry]
  let vBArm = [bx - rx, by - ry]
  let vEArm = [ex - rx, ey - ry]
  const reverse = minus > PI

  if (reverse) {
    const _deepClone3 = deepClone([vEArm, vBArm])

    const _deepClone4 = (0, _slicedToArray2.default)(_deepClone3, 2)

    vBArm = _deepClone4[0]
    vEArm = _deepClone4[1]
  }

  let inSector = isClockWise(vBArm, vPoint) && !isClockWise(vEArm, vPoint)
  if (reverse) inSector = !inSector
  if (reverseBE) inSector = !inSector
  return inSector
}
/**
 * @description Determine if the point is in the clockwise direction of the vector
 * @param {Array} vArm   Vector
 * @param {Array} vPoint Point
 * @return {Boolean} Result of check
 */

function isClockWise (vArm, vPoint) {
  const _vArm = (0, _slicedToArray2.default)(vArm, 2)
  const ax = _vArm[0]
  const ay = _vArm[1]

  const _vPoint = (0, _slicedToArray2.default)(vPoint, 2)
  const px = _vPoint[0]
  const py = _vPoint[1]

  return -ay * px + ax * py > 0
}
/**
 * @description Check if the point is inside the polyline
 * @param {Array} point      Postion of point
 * @param {Array} polyline   The points that makes up a polyline
 * @param {Number} lineWidth Polyline linewidth
 * @return {Boolean} Result of check
 */

function checkPointIsNearPolyline (point, polyline, lineWidth) {
  const halfLineWidth = lineWidth / 2
  const moveUpPolyline = polyline.map(function (_ref8) {
    const _ref9 = (0, _slicedToArray2.default)(_ref8, 2)
    const x = _ref9[0]
    const y = _ref9[1]

    return [x, y - halfLineWidth]
  })
  const moveDownPolyline = polyline.map(function (_ref10) {
    const _ref11 = (0, _slicedToArray2.default)(_ref10, 2)
    const x = _ref11[0]
    const y = _ref11[1]

    return [x, y + halfLineWidth]
  })
  const polygon = [].concat((0, _toConsumableArray2.default)(moveUpPolyline), (0, _toConsumableArray2.default)(moveDownPolyline.reverse()))
  return checkPointIsInPolygon(point, polygon)
}
/**
 * @description Check if the point is inside the rect
 * @param {Array} point   Postion of point
 * @param {Number} x      Rect start x coordinate
 * @param {Number} y      Rect start y coordinate
 * @param {Number} width  Rect width
 * @param {Number} height Rect height
 * @return {Boolean} Result of check
 */

function checkPointIsInRect (_ref12, x, y, width, height) {
  const _ref13 = (0, _slicedToArray2.default)(_ref12, 2)
  const px = _ref13[0]
  const py = _ref13[1]

  if (px < x) return false
  if (py < y) return false
  if (px > x + width) return false
  if (py > y + height) return false
  return true
}
/**
 * @description Get the coordinates of the rotated point
 * @param {Number} rotate Degree of rotation
 * @param {Array} point   Postion of point
 * @param {Array} origin  Rotation center
 * @param {Array} origin  Rotation center
 * @return {Number} Coordinates after rotation
 */

function getRotatePointPos () {
  let rotate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0
  const point = arguments.length > 1 ? arguments[1] : undefined
  const origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0]
  if (!point) return false
  if (rotate % 360 === 0) return point

  const _point3 = (0, _slicedToArray2.default)(point, 2)
  const x = _point3[0]
  const y = _point3[1]

  const _origin = (0, _slicedToArray2.default)(origin, 2)
  const ox = _origin[0]
  const oy = _origin[1]

  rotate *= PI / 180
  return [(x - ox) * cos(rotate) - (y - oy) * sin(rotate) + ox, (x - ox) * sin(rotate) + (y - oy) * cos(rotate) + oy]
}
/**
 * @description Get the coordinates of the scaled point
 * @param {Array} scale  Scale factor
 * @param {Array} point  Postion of point
 * @param {Array} origin Scale center
 * @return {Number} Coordinates after scale
 */

function getScalePointPos () {
  const scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [1, 1]
  const point = arguments.length > 1 ? arguments[1] : undefined
  const origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0]
  if (!point) return false
  if (scale === 1) return point

  const _point4 = (0, _slicedToArray2.default)(point, 2)
  const x = _point4[0]
  const y = _point4[1]

  const _origin2 = (0, _slicedToArray2.default)(origin, 2)
  const ox = _origin2[0]
  const oy = _origin2[1]

  const _scale = (0, _slicedToArray2.default)(scale, 2)
  const xs = _scale[0]
  const ys = _scale[1]

  const relativePosX = x - ox
  const relativePosY = y - oy
  return [relativePosX * xs + ox, relativePosY * ys + oy]
}
/**
 * @description Get the coordinates of the scaled point
 * @param {Array} translate Translation distance
 * @param {Array} point     Postion of point
 * @return {Number} Coordinates after translation
 */

function getTranslatePointPos (translate, point) {
  if (!translate || !point) return false

  const _point5 = (0, _slicedToArray2.default)(point, 2)
  const x = _point5[0]
  const y = _point5[1]

  const _translate = (0, _slicedToArray2.default)(translate, 2)
  const tx = _translate[0]
  const ty = _translate[1]

  return [x + tx, y + ty]
}
/**
 * @description Get the distance from the point to the line
 * @param {Array} point     Postion of point
 * @param {Array} lineBegin Line start position
 * @param {Array} lineEnd   Line end position
 * @return {Number} Distance between point and line
 */

function getDistanceBetweenPointAndLine (point, lineBegin, lineEnd) {
  if (!point || !lineBegin || !lineEnd) return false

  const _point6 = (0, _slicedToArray2.default)(point, 2)
  const x = _point6[0]
  const y = _point6[1]

  const _lineBegin = (0, _slicedToArray2.default)(lineBegin, 2)
  const x1 = _lineBegin[0]
  const y1 = _lineBegin[1]

  const _lineEnd = (0, _slicedToArray2.default)(lineEnd, 2)
  const x2 = _lineEnd[0]
  const y2 = _lineEnd[1]

  const a = y2 - y1
  const b = x1 - x2
  const c = y1 * (x2 - x1) - x1 * (y2 - y1)
  const molecule = abs(a * x + b * y + c)
  const denominator = sqrt(a * a + b * b)
  return molecule / denominator
}
/**
 * @description Get the coordinates of the specified radian on the circle
 * @param {Number} x      Circle x coordinate
 * @param {Number} y      Circle y coordinate
 * @param {Number} radius Circle radius
 * @param {Number} radian Specfied radian
 * @return {Array} Postion of point
 */

function getCircleRadianPoint (x, y, radius, radian) {
  return [x + cos(radian) * radius, y + sin(radian) * radius]
}
/**
 * @description Get the points that make up a regular polygon
 * @param {Number} x     X coordinate of the polygon inscribed circle
 * @param {Number} y     Y coordinate of the polygon inscribed circle
 * @param {Number} r     Radius of the polygon inscribed circle
 * @param {Number} side  Side number
 * @param {Number} minus Radian offset
 * @return {Array} Points that make up a regular polygon
 */

function getRegularPolygonPoints (rx, ry, r, side) {
  const minus = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : PI * -0.5
  const radianGap = PI * 2 / side
  const radians = new Array(side).fill('').map(function (t, i) {
    return i * radianGap + minus
  })
  return radians.map(function (radian) {
    return getCircleRadianPoint(rx, ry, r, radian)
  })
}

const _default = {
  deepClone: deepClone,
  eliminateBlur: eliminateBlur,
  checkPointIsInCircle: checkPointIsInCircle,
  checkPointIsInPolygon: checkPointIsInPolygon,
  checkPointIsInSector: checkPointIsInSector,
  checkPointIsNearPolyline: checkPointIsNearPolyline,
  getTwoPointDistance: getTwoPointDistance,
  getRotatePointPos: getRotatePointPos,
  getScalePointPos: getScalePointPos,
  getTranslatePointPos: getTranslatePointPos,
  getCircleRadianPoint: getCircleRadianPoint,
  getRegularPolygonPoints: getRegularPolygonPoints,
  getDistanceBetweenPointAndLine: getDistanceBetweenPointAndLine
}
exports.default = _default
