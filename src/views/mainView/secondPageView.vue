 <template>
    <div class="body">
      <div class="main">
         <div class="item">
            <div class="title"><h2>科室使用情况</h2></div>
         </div>
      </div>
      <div class="second">
         <div class="item">
            <div class="title"><h2>历史记录</h2></div>
         </div>
         <div class="item">
            <div class="title"><h2>医生出勤信息</h2></div>
         </div>
      </div>
    </div>
 </template>
<script>
</script>
<style scoped lang="scss">
.body{
   height: calc(100vh - 60px);
   background: url('../../assets/bg.jpg') center center no-repeat;
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
         border:lightskyblue 1px solid;
         .title{
            background: linear-gradient(to right, #4cb4e7, transparent);
            text-align: center;
            color:white;
            padding:5px;
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
         border:lightskyblue 1px solid;
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
