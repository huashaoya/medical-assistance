'use strict'

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.filterNonNumber = filterNonNumber
exports.deepMerge = deepMerge
exports.mulAdd = mulAdd
exports.mergeSameStackData = mergeSameStackData
exports.getTwoPointDistance = getTwoPointDistance
exports.getLinearGradientColor = getLinearGradientColor
exports.getPolylineLength = getPolylineLength
exports.getPointToLineDistance = getPointToLineDistance
exports.initNeedSeries = initNeedSeries
exports.radianToAngle = radianToAngle

const _toConsumableArray2 = _interopRequireDefault(require('@babel/runtime/helpers/toConsumableArray'))

const _typeof2 = _interopRequireDefault(require('@babel/runtime/helpers/typeof'))

const _util = require('@jiaminghi/c-render/lib/plugin/util')

function filterNonNumber (array) {
  return array.filter(function (n) {
    return typeof n === 'number'
  })
}

function deepMerge (target, merged) {
  for (const key in merged) {
    if (target[key] && (0, _typeof2.default)(target[key]) === 'object') {
      deepMerge(target[key], merged[key])
      continue
    }

    if ((0, _typeof2.default)(merged[key]) === 'object') {
      target[key] = (0, _util.deepClone)(merged[key], true)
      continue
    }

    target[key] = merged[key]
  }

  return target
}

function mulAdd (nums) {
  nums = filterNonNumber(nums)
  return nums.reduce(function (all, num) {
    return all + num
  }, 0)
}

function mergeSameStackData (item, series) {
  const stack = item.stack
  if (!stack) return (0, _toConsumableArray2.default)(item.data)
  const stacks = series.filter(function (_ref) {
    const s = _ref.stack
    return s === stack
  })
  const index = stacks.findIndex(function (_ref2) {
    const d = _ref2.data
    return d === item.data
  })
  const datas = stacks.splice(0, index + 1).map(function (_ref3) {
    const data = _ref3.data
    return data
  })
  const dataLength = datas[0].length
  return new Array(dataLength).fill(0).map(function (foo, i) {
    return mulAdd(datas.map(function (d) {
      return d[i]
    }))
  })
}

function getTwoPointDistance (pointOne, pointTwo) {
  const minusX = Math.abs(pointOne[0] - pointTwo[0])
  const minusY = Math.abs(pointOne[1] - pointTwo[1])
  return Math.sqrt(minusX * minusX + minusY * minusY)
}

function getLinearGradientColor (ctx, begin, end, color) {
  if (!ctx || !begin || !end || !color.length) return
  let colors = color
  typeof colors === 'string' && (colors = [color, color])
  const linearGradientColor = ctx.createLinearGradient.apply(ctx, (0, _toConsumableArray2.default)(begin).concat((0, _toConsumableArray2.default)(end)))
  const colorGap = 1 / (colors.length - 1)
  colors.forEach(function (c, i) {
    return linearGradientColor.addColorStop(colorGap * i, c)
  })
  return linearGradientColor
}

function getPolylineLength (points) {
  const lineSegments = new Array(points.length - 1).fill(0).map(function (foo, i) {
    return [points[i], points[i + 1]]
  })
  const lengths = lineSegments.map(function (item) {
    return getTwoPointDistance.apply(void 0, (0, _toConsumableArray2.default)(item))
  })
  return mulAdd(lengths)
}

function getPointToLineDistance (point, linePointOne, linePointTwo) {
  const a = getTwoPointDistance(point, linePointOne)
  const b = getTwoPointDistance(point, linePointTwo)
  const c = getTwoPointDistance(linePointOne, linePointTwo)
  return 0.5 * Math.sqrt((a + b + c) * (a + b - c) * (a + c - b) * (b + c - a)) / c
}

function initNeedSeries (series, config, type) {
  series = series.filter(function (_ref4) {
    const st = _ref4.type
    return st === type
  })
  series = series.map(function (item) {
    return deepMerge((0, _util.deepClone)(config, true), item)
  })
  return series.filter(function (_ref5) {
    const show = _ref5.show
    return show
  })
}

function radianToAngle (radian) {
  return radian / Math.PI * 180
}
