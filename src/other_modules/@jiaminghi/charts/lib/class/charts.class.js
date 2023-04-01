'use strict'

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0

const _typeof2 = _interopRequireDefault(require('@babel/runtime/helpers/typeof'))

const _classCallCheck2 = _interopRequireDefault(require('@babel/runtime/helpers/classCallCheck'))

require('../extend/index')

const _cRender = _interopRequireDefault(require('@jiaminghi/c-render'))

const _util = require('@jiaminghi/c-render/lib/plugin/util')

const _core = require('../core')

const Charts = function Charts (dom) {
  (0, _classCallCheck2.default)(this, Charts)

  if (!dom) {
    console.error('Charts Missing parameters!')
    return false
  }

  const clientWidth = dom.clientWidth
  const clientHeight = dom.clientHeight
  const canvas = document.createElement('canvas')
  canvas.setAttribute('width', clientWidth)
  canvas.setAttribute('height', clientHeight)
  dom.appendChild(canvas)
  const attribute = {
    container: dom,
    canvas: canvas,
    render: new _cRender.default(canvas),
    option: null
  }
  Object.assign(this, attribute)
}
/**
 * @description Set chart option
 * @param {Object} option Chart option
 * @param {Boolean} animationEnd Execute animationEnd
 * @return {Undefined} No return
 */

exports.default = Charts

Charts.prototype.setOption = function (option) {
  const animationEnd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false

  if (!option || (0, _typeof2.default)(option) !== 'object') {
    console.error('setOption Missing parameters!')
    return false
  }

  if (animationEnd) {
    this.render.graphs.forEach(function (graph) {
      return graph.animationEnd()
    })
  }
  const optionCloned = (0, _util.deepClone)(option, true);
  (0, _core.mergeColor)(this, optionCloned);
  (0, _core.grid)(this, optionCloned);
  (0, _core.axis)(this, optionCloned);
  (0, _core.radarAxis)(this, optionCloned);
  (0, _core.title)(this, optionCloned);
  (0, _core.bar)(this, optionCloned);
  (0, _core.line)(this, optionCloned);
  (0, _core.pie)(this, optionCloned);
  (0, _core.radar)(this, optionCloned);
  (0, _core.gauge)(this, optionCloned);
  (0, _core.legend)(this, optionCloned)
  this.option = option
  this.render.launchAnimation() // console.warn(this)
}
/**
 * @description Resize chart
 * @return {Undefined} No return
 */

Charts.prototype.resize = function () {
  const container = this.container
  const canvas = this.canvas
  const render = this.render
  const option = this.option
  const clientWidth = container.clientWidth
  const clientHeight = container.clientHeight
  canvas.setAttribute('width', clientWidth)
  canvas.setAttribute('height', clientHeight)
  render.area = [clientWidth, clientHeight]
  this.setOption(option)
}
