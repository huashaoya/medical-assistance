<template>
  <div class="box">
    <dv-decoration-7 class="desc">B超室使用情况</dv-decoration-7>
    <div class="content">
      <div class="info">
        <div class="num" style="margin-top:30px">23</div>
        <div class="text">今日使用</div>
        <div class="num">33</div>
        <div class="text">昨日使用</div>
        <div class="num">4586</div>
        <div class="text">年住院使用</div>
      </div>
      <div class="chart" id="chart"></div>
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts'

export default {
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    this.initChart()
  },
  beforeUnmount () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart () {
      const chartDom = document.getElementById('chart')
      const myChart = echarts.init(chartDom)
      const option = {
        label: {
          color: '#000'
        },
        legend: {
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {},
        dataset: {
          source: [
            ['product', '上周人数', '今周人数', '本月总数'],
            ['乳腺癌', 43, 50, 218],
            ['血癌', 30, 25, 108],
            ['喉癌下咽癌', 35, 36, 135]
          ]
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
      }

      option && myChart.setOption(option)
      this.chart = myChart
    }
  }

}

</script>
<style scoped lang="scss" >
.box {
  padding: 20px;
  width: 100%;
  height: 100%;

  .desc {
    width: 180px;
    height: 30px;
    padding: 0 5px;
    color: rgb(229, 229, 229);
    font-size: 16px;
  }

  .content {
    width: 100%;
    height: calc(100% - 30px);
    display: flex;

    .info {
      width: 25%;
      height: 100%;
      color: rgba(255, 255, 255, 0.719);
      padding-top: 20px;

      .num {
        color: #339999;
        font-size: 32px;
        font-weight: 600;
        margin-top: 20px;
      }

      .text {
        font-size: 12px;
      }
    }

    .chart {
      width: 75%;
      height: 100%;
      background-color: #0f1325cf;
      border-radius: 10px;
    }
  }

  .chart {
    width: 75%;
    height: 100%;
    background-color: #0f1325cf;
    border-radius: 10px;
  }
}</style>
