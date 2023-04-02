<template>
    <div class="box">
        <dv-decoration-7 style="width:150px;height:30px;">CT室使用情况</dv-decoration-7>
        <div class="content">
            <div class="info">
                <div style="margin-top:10px">今日手术人数</div>
                <div>23</div>
                <div style="margin-top:10px">昨日手术人数</div>
                <div>33</div>
                <div style="margin-top:10px">年住院手术人数</div>
                <div>4586</div>
            </div>
            <div class="chart" id="chart4"></div>
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
      const chartDom = document.getElementById('chart4')
      const myChart = echarts.init(chartDom)
      const option = {
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ['product', '上周人数', '今周人数', '本月总数'],
            ['乳腺癌', 43.3, 85.8, 93.7],
            ['血癌', 83.1, 73.4, 55.1],
            ['喉癌和下咽癌', 86.4, 65.2, 82.5]
          ]
        },
        xAxis: { type: 'category' },
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
    .box{
        padding:20px;
        width:100%;
        height: 100%;
        .content{
            width:100%;
            height:calc(100% - 30px);
            display: flex;
            .info{
                width:25%;
                height:100%;
                color:rgba(255, 255, 255, 0.719);
                padding-top:20px;
            }
            .chart{
                width:75%;
                height:100%;
                background-color: #0f1325cf;
                border-radius: 10px;
            }
        }
    }
</style>
