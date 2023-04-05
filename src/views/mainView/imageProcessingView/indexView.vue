<template>
    <div class="box">
        <div class="item">
            <div class="title"><dv-decoration-8 style="width:230px;height:30px;" />高斯滤波</div>
            <oneView/>
        </div>
        <div class="item">
            <div class="title right">形态学腐蚀<dv-decoration-8 :reverse="true" style="width:230px;height:30px;" /></div>
            <twoView/>
        </div>
        <div class="item">
            <div class="title"><dv-decoration-8 style="width:230px;height:30px;" />中值滤波</div>
            <threeView/>
        </div>
        <div class="item">
            <div class="title right">尺寸修改<dv-decoration-8 :reverse="true" style="width:230px;height:30px;" /></div>
            <fourView/>
        </div>
        <div class="item"><div class="title"><dv-decoration-8 style="width:230px;height:30px;" />双边滤波</div>
            <fiveView/>
        </div>
        <div class="item"> <div class="title right">形态学膨胀<dv-decoration-8 :reverse="true" style="width:230px;height:30px;" /></div>
            <sixView/>
        </div>
    </div>
</template>

<script>
import oneView from './oneView.vue'
import twoView from './twoView.vue'
import threeView from './threeView.vue'
import fourView from './fourView.vue'
import fiveView from './fiveView.vue'
import sixView from './sixView.vue'
export default {
  data: function () {
    return {

    }
  },
  components: {
    oneView,
    twoView,
    threeView,
    fourView,
    fiveView,
    sixView
  }
}
</script>
<style lang="scss" scoped>
.box{
    width:100%;
    height: calc(100vh - 58px);
    display: flex;
    flex-wrap: wrap;
    .item{
        background-color: #0f1325;
        margin: 1% 2%;
        width: 46%;
        height: 29%;
        .title{
            display: flex;
            color:#339999;
            font-size: 25px;
            line-height: 36px;
            font-weight: 600;
        }
        .title.right{
            justify-content: right;
        }
    }
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 180px;
    height: 180px;
    text-align: center;
}
.el-input{
    background-color: #2c3147;
}
.el-input__wrapper{
    background-color: #2c3147;
    box-shadow:none;
}
.el-input__inner{
  color:#00ccff;
  background-color: #2c3147;
}
.el-button{
    color:rgb(171, 171, 171);
}
</style>
