 <template>
   <div class="body" v-if="loading">
      <dv-loading >Loading...</dv-loading>
   </div>
    <div class="body" v-else>
      <div class="main" >
         <div  class="item">
            <dv-border-box-7>dv-border-box-10
               <div class="content">
               <div class="item">
                  <dv-border-box-12>
                     <dv-scroll-board :config="config-one" style="width:500px;height:220px" />
                  </dv-border-box-12>
                  <!-- <div class="title">

                     <h3>科室使用情况</h3>
                  </div> -->
               </div>
               <div class="item">
                  <dv-border-box-12>dv-border-box-12</dv-border-box-12>
                  <!-- <div class="title">
                     <h3>科室使用情况</h3>
                  </div> -->
               </div>
               <div class="item">
                  <dv-border-box-12>dv-border-box-12</dv-border-box-12>
                  <!-- <div class="title">
                     <h3>手术室使用情况</h3>
                  </div>
                  <div id="chart-1" class="chart"></div> -->
               </div>
               <div class="item">
                  <dv-border-box-12>dv-border-box-12</dv-border-box-12>
                  <!-- <div class="title">
                     <h3>CT房使用情况</h3>
                  </div>
                  <div id="chart-2" class="chart"></div> -->
               </div>
            </div>
            </dv-border-box-7>
            <!-- <div class="title">
               <h2>科室使用情况</h2>
            </div> -->

         </div>
      </div>
      <div class="second">
         <div class="item">
            <!-- <div class="title"><h2>历史记录</h2></div> -->
            <dv-border-box-8>dv-border-box-10</dv-border-box-8>
         </div>
         <div class="item">
            <!-- <div class="title"><h2>医生出勤信息</h2></div> -->
            <dv-border-box-10>dv-border-box-10</dv-border-box-10>
         </div>
      </div>
    </div>
 </template>
<script>
import * as echarts from 'echarts'

export default {
  data () {
    return {
      loading: true
    }
  },
  mounted () {
    //  this.drawChart('chart-1')
    //  this.drawChart('chart-2')
    this.cancelLoading()
  },
  methods: {
    drawChart (id) {
      const chartDom = document.getElementById(id)
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
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      }

      option && myChart.setOption(option)
    },
    cancelLoading () {
      setTimeout(() => {
        this.loading = false
      }, 500)
    }
  }
}
</script>
<style scoped lang="scss">
.body{
   height: calc(100vh - 60px);
   background: url('@/assets/pageBg.png') center center no-repeat;
   display: flex;
   flex-direction: row;
   .main{
      width:70%;
      // background-color: red;
      height: calc(100vh - 60px);
      padding: 20px;
      .item{
         width:calc(100% - 40px);
         height:calc(100% - 40px);
         // border:lightskyblue 1px solid;
         .title{
            background: linear-gradient(to right, #0199ca, transparent);
            text-align: center;
            color:white;
            padding:5px;
         }
         .content{
            display:flex;
            flex-wrap: wrap;
            height: 100%;
            align-content: flex-start;
            .item{
               width:48%;
               margin:0 1%;
               height: 48%;
               margin-top: .3%;
               margin-bottom: 0;
               .chart{
                  width:100%;
                  height: calc(100% - 25px);
               }
            }
         }
      }
   }
   .second{
      width:30%;
      // background-color: aqua;
      height: calc(100vh - 60px);
      padding: 20px;
      display: flex;
      flex-direction: column;
      .item{
         width:calc(100% - 40px);
         height:calc(50% - 40px);
         // border:lightskyblue 1px solid;
         margin-bottom: 40px;
         .title{
            padding:5px;
            background: linear-gradient(to right, #4cb4e7, transparent);
            text-align: center;
            color:white;
         }
      }
   }
}
</style>
