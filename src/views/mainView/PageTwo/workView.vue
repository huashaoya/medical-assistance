<template>
    <div class="body">
        <div class="box">
            <el-upload
                ref="uploadRef"
                class="upload-demo"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :auto-upload="false"
            >
                <template #trigger>
                <el-button type="primary">select file</el-button>
                </template>

                <el-button class="ml-3" type="success" @click="submitUpload">
                upload to server
                </el-button>
            </el-upload>
        </div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box" id="main">
            <div ></div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  mounted () {
    const chartDom = document.getElementById('main')
    const myChart = echarts.init(chartDom)
    let option
    option = {
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
  }
}

</script>

<style lang="scss">
.body{
    width:100%;
    height:100%;
    display: flex;
    flex-wrap: wrap;
    .box{
        width:50%;
        height:50%;
    }
}
</style>
