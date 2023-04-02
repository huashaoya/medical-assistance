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
                     <dv-scroll-board :config="config-one" style="width:100%;height:100%" />
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
            <dv-border-box-8>
               <dv-decoration-3 style="width:250px;height:20px;" />
               <div class="chart">
                  <dv-scroll-board :config="configHistory"  style="width:100%;height:100%" />
               </div>
            </dv-border-box-8>
         </div>
         <div class="item">
            <!-- <div class="title"><h2>医生出勤信息</h2></div> -->
            <dv-border-box-10>
               <dv-decoration-7 style="width:150px;height:30px;">Decoration</dv-decoration-7> -->
            </dv-border-box-10>
         </div>
      </div>
    </div>
 </template>
<script>
import * as echarts from 'echarts'

export default {
  data () {
    return {
      loading: true,
      configHistory: {
        header: ['列1', '列2', '列3'],
        data: [
          ['行1列1', '行1列2', '行1列3'],
          ['行2列1', '行2列2', '行2列3'],
          ['行3列1', '行3列2', '行3列3'],
          ['行4列1', '行4列2', '行4列3'],
          ['行5列1', '行5列2', '行5列3'],
          ['行6列1', '行6列2', '行6列3'],
          ['行7列1', '行7列2', '行7列3'],
          ['行8列1', '行8列2', '行8列3'],
          ['行9列1', '行9列2', '行9列3'],
          ['行10列1', '行10列2', '行10列3']
        ]
      }
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
         .chart{
            margin: 2%;
            margin-top: 0;
            width:96%;
            height:calc(96% - 20px);
         }
      }
   }
}
</style>
