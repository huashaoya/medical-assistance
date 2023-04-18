<template>
    <div class="body">
        <div class="box">
          <div class="item">
            <el-upload
                ref="uploadRef"
                class="upload-demo"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :auto-upload="false"
            >
                <template #trigger>
                <el-button type="primary">选择视频</el-button>
                </template>

                <el-button class="ml-3" type="success" @click="submitUpload">
                开始处理
                </el-button>
            </el-upload>
          </div>
        </div>
        <div class="box">
          <div class="item"></div>
        </div>
        <div class="box" id="chart1"></div>
        <div class="box" id="chart2">

        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  data () {
    return {
      chart: null,
      chart2: null
    }
  },
  mounted () {
    this.initChart1()
    this.initChart2()
  },
  beforeUnmount () {
    // if (!this.chart) {
    //   return
    // }
    this.chart.dispose()
    this.chart = null
    this.chart2.dispose()
    this.chart2 = null
  },
  methods: {
    initChart1 () {
      const chartDom = document.getElementById('chart1')
      const myChart = echarts.init(chartDom)
      const option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true
          }
        ]
      }
      option && myChart.setOption(option)
      this.chart = myChart
    },
    initChart2 () {
      const chartDom = document.getElementById('chart2')
      const myChart = echarts.init(chartDom)
      const option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true
          }
        ]
      }
      option && myChart.setOption(option)
      this.chart2 = myChart
    }
  }
}

</script>

<style lang="scss" scoped>
.body{
    width:100%;
    height:100%;
    display: flex;
    flex-wrap: wrap;
    .box{
        width:50%;
        height:50%;
        padding:50px;
        border-radius: 10px;
        .item{
          width:100%;
          height:100%;
          border: 1px dashed var(--el-border-color);
          display: flex;
          align-items: center;
          justify-content: center;
        }
    }
}
</style>
