'use strict'

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.doUpdate = doUpdate
exports.Updater = void 0

const _toConsumableArray2 = _interopRequireDefault(require('@babel/runtime/helpers/toConsumableArray'))

const _typeof2 = _interopRequireDefault(require('@babel/runtime/helpers/typeof'))

const _classCallCheck2 = _interopRequireDefault(require('@babel/runtime/helpers/classCallCheck'))

const Updater = function Updater (config, series) {
  (0, _classCallCheck2.default)(this, Updater)
  const chart = config.chart
  const key = config.key
  const getGraphConfig = config.getGraphConfig

  if (typeof getGraphConfig !== 'function') {
    console.warn('Updater need function getGraphConfig!')
    return
  }

  if (!chart[key]) this.graphs = chart[key] = []
  Object.assign(this, config)
  this.update(series)
}

exports.Updater = Updater

Updater.prototype.update = function (series) {
  const _this = this

  const graphs = this.graphs
  const beforeUpdate = this.beforeUpdate
  delRedundanceGraph(this, series)
  if (!series.length) return
  const beforeUpdateType = (0, _typeof2.default)(beforeUpdate)
  series.forEach(function (seriesItem, i) {
    if (beforeUpdateType === 'function') beforeUpdate(graphs, seriesItem, i, _this)
    const cache = graphs[i]

    if (cache) {
      changeGraphs(cache, seriesItem, i, _this)
    } else {
      addGraphs(graphs, seriesItem, i, _this)
    }
  })
}

function delRedundanceGraph (updater, series) {
  const graphs = updater.graphs
  const render = updater.chart.render
  const cacheGraphNum = graphs.length
  const needGraphNum = series.length

  if (cacheGraphNum > needGraphNum) {
    const needDelGraphs = graphs.splice(needGraphNum)
    needDelGraphs.forEach(function (item) {
      return item.forEach(function (g) {
        return render.delGraph(g)
      })
    })
  }
}

function changeGraphs (cache, seriesItem, i, updater) {
  const getGraphConfig = updater.getGraphConfig
  const render = updater.chart.render
  const beforeChange = updater.beforeChange
  const configs = getGraphConfig(seriesItem, updater)
  balanceGraphsNum(cache, configs, render)
  cache.forEach(function (graph, j) {
    const config = configs[j]
    if (typeof beforeChange === 'function') beforeChange(graph, config)
    updateGraphConfigByKey(graph, config)
  })
}

function balanceGraphsNum (graphs, graphConfig, render) {
  const cacheGraphNum = graphs.length
  const needGraphNum = graphConfig.length

  if (needGraphNum > cacheGraphNum) {
    const lastCacheGraph = graphs.slice(-1)[0]
    const needAddGraphNum = needGraphNum - cacheGraphNum
    const needAddGraphs = new Array(needAddGraphNum).fill(0).map(function (foo) {
      return render.clone(lastCacheGraph)
    })
    graphs.push.apply(graphs, (0, _toConsumableArray2.default)(needAddGraphs))
  } else if (needGraphNum < cacheGraphNum) {
    const needDelCache = graphs.splice(needGraphNum)
    needDelCache.forEach(function (g) {
      return render.delGraph(g)
    })
  }
}

function addGraphs (graphs, seriesItem, i, updater) {
  const getGraphConfig = updater.getGraphConfig
  const getStartGraphConfig = updater.getStartGraphConfig
  const chart = updater.chart
  const render = chart.render
  let startConfigs = null
  if (typeof getStartGraphConfig === 'function') startConfigs = getStartGraphConfig(seriesItem, updater)
  const configs = getGraphConfig(seriesItem, updater)
  if (!configs.length) return

  if (startConfigs) {
    graphs[i] = startConfigs.map(function (config) {
      return render.add(config)
    })
    graphs[i].forEach(function (graph, i) {
      const config = configs[i]
      updateGraphConfigByKey(graph, config)
    })
  } else {
    graphs[i] = configs.map(function (config) {
      return render.add(config)
    })
  }

  const afterAddGraph = updater.afterAddGraph
  if (typeof afterAddGraph === 'function') afterAddGraph(graphs[i])
}

function updateGraphConfigByKey (graph, config) {
  const keys = Object.keys(config)
  keys.forEach(function (key) {
    if (key === 'shape' || key === 'style') {
      graph.animation(key, config[key], true)
    } else {
      graph[key] = config[key]
    }
  })
}

function doUpdate () {
  const _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
  const chart = _ref.chart
  const series = _ref.series
  const key = _ref.key
  const getGraphConfig = _ref.getGraphConfig
  const getStartGraphConfig = _ref.getStartGraphConfig
  const beforeChange = _ref.beforeChange
  const beforeUpdate = _ref.beforeUpdate
  const afterAddGraph = _ref.afterAddGraph

  if (chart[key]) {
    chart[key].update(series)
  } else {
    chart[key] = new Updater({
      chart: chart,
      key: key,
      getGraphConfig: getGraphConfig,
      getStartGraphConfig: getStartGraphConfig,
      beforeChange: beforeChange,
      beforeUpdate: beforeUpdate,
      afterAddGraph: afterAddGraph
    }, series)
  }
}
