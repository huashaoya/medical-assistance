<template>
    <div class="body" v-loading="loading"  element-loading-background="rgba(122, 122, 122, 0.6)">
        <div class="box">
          <div class="item">
            <div class="item-content" v-if="6">
              <el-upload
                ref="uploadRef"
                class="upload-demo"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :auto-upload="false"
            >
                <template #trigger>
                <el-button color="#2c3147">选择视频</el-button>
                </template>

                <el-button class="ml-3" color="#2c3147" @click="submitUpload">
                开始处理
                </el-button>
              </el-upload>
            </div>
            <div class="item-content" v-else>
             <video></video>
            </div>
            <dv-decoration-7 class="desc">原视频</dv-decoration-7>
          </div>
        </div>
        <div class="box">
          <div class="item">
            <div class="item-content">
              <video src="http://106.55.171.221:8888/download?filename=/www/wwwroot/106.55.171.221/bcs/%E5%90%8E%E7%AB%AF/serve/upload/video/processes/%E7%A0%82%E4%BB%81%E7%82%AE%E5%88%B6%E5%8A%A8%E7%94%BB.mp4&play=true"></video>
            </div>
            <dv-decoration-7 class="desc">检测视频</dv-decoration-7>
          </div>
        </div>
        <div class="box" >
          <div class="item">
            <div class="item-content no-border" id="chart1"></div>
            <dv-decoration-7 class="desc">最大检测框相对面积变化</dv-decoration-7>
          </div>
        </div>
        <div class="box">
          <div class="item">
            <div class="item-content no-border" id="chart2"></div>
            <dv-decoration-7 class="desc">检测框数量变化</dv-decoration-7>
          </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  data () {
    return {
      chart: null,
      chart2: null,
      loading: false,
      X1: [1, 2, 3, 4],
      X2: [1, 2, 3, 4],
      Y1: [0, 0, 0, 0],
      Y2: [0, 0, 0, 0]
    }
  },
  mounted () {
    this.initChart1()
    this.initChart2()
  },
  beforeUnmount () {
    this.chart.dispose()
    this.chart = null
    this.chart2.dispose()
    this.chart2 = null
  },
  watch: {
    X1: function () {
      this.initChart1()
    },
    Y1: function () {
      this.initChart1()
    },
    X2: function () {
      this.initChart2()
    },
    Y2: function () {
      this.initChart2()
    }
  },

  methods: {
    chartChange (chart) {
      let option
      option.xAxis.data = this.xData
      option.series = this.yData
      // 使用刚指定的配置项和数据显示图表。
      chart.setOption(option, true)
    },
    initChart1 () {
      const chartDom = document.getElementById('chart1')
      const myChart = echarts.init(chartDom)
      const option = {
        xAxis: {
          type: 'category',
          data: this.X1
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.Y1,
            type: 'line',
            smooth: true
          }
        ]
      }
      option && myChart.setOption(option, true)
      this.chart = myChart
    },
    initChart2 () {
      const chartDom = document.getElementById('chart2')
      const myChart = echarts.init(chartDom)
      const option = {
        xAxis: {
          type: 'category',
          data: this.X2
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.Y2,
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
        padding:20px 20px;
        border-radius: 10px;
        .item{
          width:100%;
          height:100%;
          display: flex;
          flex-wrap: wrap;
          .item-content{
            width:100%;
            height:calc(100% - 20px);
            border: 1px dashed var(--el-border-color);
            display: flex;
            justify-content: center;
            align-items: center;
            video{
              width:100%;
              height: 100%;
            }
          }
          .item-content.no-border{
            border: none;
          }
          .desc{
              width:100%;
              height:20px;
              margin-top: 10px;
              padding: 0 5px;
              color:#339999;
              font-size: 18px;
              font-weight: 600;
            }

        }
    }
}
</style>
