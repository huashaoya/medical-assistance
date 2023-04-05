<template>
   <div class="body" v-if="loading">
      <dv-loading>Loading...</dv-loading>
   </div>
   <div class="body" v-else>
      <div class="main">
         <div class="item">
            <dv-border-box-7>
               <div class="content">
                  <div class="item">
                     <dv-border-box-12>
                        <ChartOne></ChartOne>
                     </dv-border-box-12>
                  </div>
                  <div class="item">
                     <dv-border-box-12>
                        <ChartThree></ChartThree>
                     </dv-border-box-12>
                  </div>
                  <div class="item">
                     <dv-border-box-12>
                        <ChartTwo></ChartTwo>
                     </dv-border-box-12>
                  </div>
                  <div class="item">
                     <dv-border-box-12>
                        <ChartFour></ChartFour>
                     </dv-border-box-12>
                  </div>
               </div>
            </dv-border-box-7>
         </div>
      </div>
      <div class="second">
         <div class="item">
            <dv-border-box-13>
               <History></History>
            </dv-border-box-13>
         </div>
         <div class="item">
            <dv-border-box-13>
               <Attender></Attender>
            </dv-border-box-13>
         </div>
      </div>
   </div>
</template>
<script>
import History from './historyView.vue'
import Attender from './attenderView.vue'
import ChartOne from './chartOne.vue'
import ChartTwo from './chartTwo.vue'
import ChartThree from './chartThree.vue'
import ChartFour from './chartFour.vue'
export default {
  data () {
    return {
      loading: true
    }
  },
  components: {
    History,
    Attender,
    ChartOne,
    ChartThree,
    ChartTwo,
    ChartFour
  },
  mounted () {
    this.cancelLoading()
  },
  methods: {
    cancelLoading () {
      setTimeout(() => {
        this.loading = false
      }, 500)
    }
  }
}
</script>
<style scoped lang="scss">
.body {
   height: calc(100vh - 60px);
   background: url('@/assets/pageBg.png') center center no-repeat;
   display: flex;
   flex-direction: row;

   .main {
      width: 70%;
      // background-color: red;
      height: calc(100vh - 60px);
      padding: 20px;

      .item {
         width: calc(100% - 40px);
         height: calc(100% - 40px);

         // border:lightskyblue 1px solid;
         .title {
            background: linear-gradient(to right, #0199ca, transparent);
            text-align: center;
            color: white;
            padding: 5px;
         }

         .content {
            display: flex;
            flex-wrap: wrap;
            height: 100%;
            align-content: flex-start;

            .item {
               width: 48%;
               margin: 0 1%;
               height: 48%;
               margin-top: .3%;
               margin-bottom: 0;

               .chart {
                  width: 100%;
                  height: calc(100% - 25px);
               }
            }
         }
      }
   }

   .second {
      width: 30%;
      // background-color: aqua;
      height: calc(100vh - 60px);
      padding: 20px;
      display: flex;
      flex-direction: column;

      .item {
         width: calc(100% - 40px);
         height: calc(50% - 40px);
         // border:lightskyblue 1px solid;
         margin-bottom: 40px;
      }
   }
}</style>
