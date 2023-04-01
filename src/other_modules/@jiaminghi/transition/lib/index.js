'use strict'

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.transition = transition
exports.injectNewCurve = injectNewCurve
exports.default = void 0

const _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'))

const _typeof2 = _interopRequireDefault(require('@babel/runtime/helpers/typeof'))

const _curves = _interopRequireDefault(require('./config/curves'))

const defaultTransitionBC = 'linear'
/**
 * @description Get the N-frame animation state by the start and end state
 *              of the animation and the easing curve
 * @param {String|Array} tBC               Easing curve name or data
 * @param {Number|Array|Object} startState Animation start state
 * @param {Number|Array|Object} endState   Animation end state
 * @param {Number} frameNum                Number of Animation frames
 * @param {Boolean} deep                   Whether to use recursive mode
 * @return {Array|Boolean} State of each frame of the animation (Invalid input will return false)
 */

function transition (tBC) {
  const startState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null
  const endState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null
  const frameNum = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 30
  const deep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false
  if (!checkParams.apply(void 0, arguments)) return false

  try {
    // Get the transition bezier curve
    const bezierCurve = getBezierCurve(tBC) // Get the progress of each frame state

    const frameStateProgress = getFrameStateProgress(bezierCurve, frameNum) // If the recursion mode is not enabled or the state type is Number, the shallow state calculation is performed directly.

    if (!deep || typeof endState === 'number') return getTransitionState(startState, endState, frameStateProgress)
    return recursionTransitionState(startState, endState, frameStateProgress)
  } catch (_unused) {
    console.warn('Transition parameter may be abnormal!')
    return [endState]
  }
}
/**
 * @description Check if the parameters are legal
 * @param {String} tBC      Name of transition bezier curve
 * @param {Any} startState  Transition start state
 * @param {Any} endState    Transition end state
 * @param {Number} frameNum Number of transition frames
 * @return {Boolean} Is the parameter legal
 */

function checkParams (tBC) {
  const startState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false
  const endState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false
  const frameNum = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 30

  if (!tBC || startState === false || endState === false || !frameNum) {
    console.error('transition: Missing Parameters!')
    return false
  }

  if ((0, _typeof2.default)(startState) !== (0, _typeof2.default)(endState)) {
    console.error('transition: Inconsistent Status Types!')
    return false
  }

  const stateType = (0, _typeof2.default)(endState)

  if (stateType === 'string' || stateType === 'boolean' || !tBC.length) {
    console.error('transition: Unsupported Data Type of State!')
    return false
  }

  if (!_curves.default.has(tBC) && !(tBC instanceof Array)) {
    console.warn('transition: Transition curve not found, default curve will be used!')
  }

  return true
}
/**
 * @description Get the transition bezier curve
 * @param {String} tBC Name of transition bezier curve
 * @return {Array} Bezier curve data
 */

function getBezierCurve (tBC) {
  let bezierCurve = ''

  if (_curves.default.has(tBC)) {
    bezierCurve = _curves.default.get(tBC)
  } else if (tBC instanceof Array) {
    bezierCurve = tBC
  } else {
    bezierCurve = _curves.default.get(defaultTransitionBC)
  }

  return bezierCurve
}
/**
 * @description Get the progress of each frame state
 * @param {Array} bezierCurve Transition bezier curve
 * @param {Number} frameNum   Number of transition frames
 * @return {Array} Progress of each frame state
 */

function getFrameStateProgress (bezierCurve, frameNum) {
  const tMinus = 1 / (frameNum - 1)
  const tState = new Array(frameNum).fill(0).map(function (t, i) {
    return i * tMinus
  })
  const frameState = tState.map(function (t) {
    return getFrameStateFromT(bezierCurve, t)
  })
  return frameState
}
/**
 * @description Get the progress of the corresponding frame according to t
 * @param {Array} bezierCurve Transition bezier curve
 * @param {Number} t          Current frame t
 * @return {Number} Progress of current frame
 */

function getFrameStateFromT (bezierCurve, t) {
  const tBezierCurvePoint = getBezierCurvePointFromT(bezierCurve, t)
  const bezierCurvePointT = getBezierCurvePointTFromReT(tBezierCurvePoint, t)
  return getBezierCurveTState(tBezierCurvePoint, bezierCurvePointT)
}
/**
 * @description Get the corresponding sub-curve according to t
 * @param {Array} bezierCurve Transition bezier curve
 * @param {Number} t          Current frame t
 * @return {Array} Sub-curve of t
 */

function getBezierCurvePointFromT (bezierCurve, t) {
  const lastIndex = bezierCurve.length - 1
  let begin = ''
  let end = ''
  bezierCurve.findIndex(function (item, i) {
    if (i === lastIndex) return
    begin = item
    end = bezierCurve[i + 1]
    const currentMainPointX = begin[0][0]
    const nextMainPointX = end[0][0]
    return t >= currentMainPointX && t < nextMainPointX
  })
  const p0 = begin[0]
  const p1 = begin[2] || begin[0]
  const p2 = end[1] || end[0]
  const p3 = end[0]
  return [p0, p1, p2, p3]
}
/**
 * @description Get local t based on t and sub-curve
 * @param {Array} bezierCurve Sub-curve
 * @param {Number} t          Current frame t
 * @return {Number} local t of sub-curve
 */

function getBezierCurvePointTFromReT (bezierCurve, t) {
  const reBeginX = bezierCurve[0][0]
  const reEndX = bezierCurve[3][0]
  const xMinus = reEndX - reBeginX
  const tMinus = t - reBeginX
  return tMinus / xMinus
}
/**
 * @description Get the curve progress of t
 * @param {Array} bezierCurve Sub-curve
 * @param {Number} t          Current frame t
 * @return {Number} Progress of current frame
 */

function getBezierCurveTState (_ref, t) {
  const _ref2 = (0, _slicedToArray2.default)(_ref, 4)
  const _ref2$ = (0, _slicedToArray2.default)(_ref2[0], 2)
  const p0 = _ref2$[1]
  const _ref2$2 = (0, _slicedToArray2.default)(_ref2[1], 2)
  const p1 = _ref2$2[1]
  const _ref2$3 = (0, _slicedToArray2.default)(_ref2[2], 2)
  const p2 = _ref2$3[1]
  const _ref2$4 = (0, _slicedToArray2.default)(_ref2[3], 2)
  const p3 = _ref2$4[1]

  const pow = Math.pow
  const tMinus = 1 - t
  const result1 = p0 * pow(tMinus, 3)
  const result2 = 3 * p1 * t * pow(tMinus, 2)
  const result3 = 3 * p2 * pow(t, 2) * tMinus
  const result4 = p3 * pow(t, 3)
  return 1 - (result1 + result2 + result3 + result4)
}
/**
 * @description Get transition state according to frame progress
 * @param {Any} startState   Transition start state
 * @param {Any} endState     Transition end state
 * @param {Array} frameState Frame state progress
 * @return {Array} Transition frame state
 */

function getTransitionState (begin, end, frameState) {
  let stateType = 'object'
  if (typeof begin === 'number') stateType = 'number'
  if (begin instanceof Array) stateType = 'array'
  if (stateType === 'number') return getNumberTransitionState(begin, end, frameState)
  if (stateType === 'array') return getArrayTransitionState(begin, end, frameState)
  if (stateType === 'object') return getObjectTransitionState(begin, end, frameState)
  return frameState.map(function (t) {
    return end
  })
}
/**
 * @description Get the transition data of the number type
 * @param {Number} startState Transition start state
 * @param {Number} endState   Transition end state
 * @param {Array} frameState  Frame state progress
 * @return {Array} Transition frame state
 */

function getNumberTransitionState (begin, end, frameState) {
  const minus = end - begin
  return frameState.map(function (s) {
    return begin + minus * s
  })
}
/**
 * @description Get the transition data of the array type
 * @param {Array} startState Transition start state
 * @param {Array} endState   Transition end state
 * @param {Array} frameState Frame state progress
 * @return {Array} Transition frame state
 */

function getArrayTransitionState (begin, end, frameState) {
  const minus = end.map(function (v, i) {
    if (typeof v !== 'number') return false
    return v - begin[i]
  })
  return frameState.map(function (s) {
    return minus.map(function (v, i) {
      if (v === false) return end[i]
      return begin[i] + v * s
    })
  })
}
/**
 * @description Get the transition data of the object type
 * @param {Object} startState Transition start state
 * @param {Object} endState   Transition end state
 * @param {Array} frameState  Frame state progress
 * @return {Array} Transition frame state
 */

function getObjectTransitionState (begin, end, frameState) {
  const keys = Object.keys(end)
  const beginValue = keys.map(function (k) {
    return begin[k]
  })
  const endValue = keys.map(function (k) {
    return end[k]
  })
  const arrayState = getArrayTransitionState(beginValue, endValue, frameState)
  return arrayState.map(function (item) {
    const frameData = {}
    item.forEach(function (v, i) {
      return frameData[keys[i]] = v
    })
    return frameData
  })
}
/**
 * @description Get the transition state data by recursion
 * @param {Array|Object} startState Transition start state
 * @param {Array|Object} endState   Transition end state
 * @param {Array} frameState        Frame state progress
 * @return {Array} Transition frame state
 */

function recursionTransitionState (begin, end, frameState) {
  const state = getTransitionState(begin, end, frameState)

  const _loop = function _loop (key) {
    const bTemp = begin[key]
    const eTemp = end[key]
    if ((0, _typeof2.default)(eTemp) !== 'object') return 'continue'
    const data = recursionTransitionState(bTemp, eTemp, frameState)
    state.forEach(function (fs, i) {
      return fs[key] = data[i]
    })
  }

  for (const key in end) {
    const _ret = _loop(key)

    if (_ret === 'continue') continue
  }

  return state
}
/**
 * @description Inject new curve into curves as config
 * @param {Any} key     The key of curve
 * @param {Array} curve Bezier curve data
 * @return {Undefined} No return
 */

function injectNewCurve (key, curve) {
  if (!key || !curve) {
    console.error('InjectNewCurve Missing Parameters!')
    return
  }

  _curves.default.set(key, curve)
}

const _default = transition
exports.default = _default
