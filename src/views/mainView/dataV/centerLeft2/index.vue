<template>
  <div class="centreLeft1">
    <span class="drawing-review">
      <img src="../../../../assets/drawing-review.png" alt="" class="drawing-review-img">2022高德软件GS京(2022)1061号
    </span>
    <div class="bg-color-black">
      <div class="d-flex pt-2 pl-2">
        <span>
          <i class="iconfont icon-layer-group" />
        </span>
        <div class="d-flex">
          <span class="fs-xl text mx-2">广东省癌症发病人数统计</span>
          <dv-decoration-1 class="dv-dec-1" />
        </div>
      </div>
      <div class="d-flex jc-center">
        <chart />
      </div>
      <div class="sth">2022 高德软件 GS京(2022)1061号
    </div></div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import Chart from './chart/index'
export default defineComponent({
  components: {
    Chart
  }
})
</script>

<style lang="scss" scoped>
.sth{
  transform: translateY(-26px);
  font-size: 14px;
}
.centreLeft1 {
  position: relative;
  $box-width: 300px;
  $box-height: 410px;
  padding: 16px;
  height: $box-height;
  min-width: $box-width;
  border-radius: 5px;

  .drawing-review {
    position: absolute;
    left: 160px;
    top: 371px;
    height: 24px;
    font-size: 12px;
    text-align: center;
    line-height: 24px;
  }

  .drawing-review-img {
    position: absolute;
    left: -22px;
    top: -1px;
  }

  .bg-color-black {
    height: $box-height - 30px;
    border-radius: 10px;
  }

  .text {
    color: #c3cbde;
  }

  .dv-dec-1 {
    position: relative;
    width: 100px;
    height: 20px;
    top: -3px;
  }

  .chart-box {
    margin-top: 16px;
    width: 170px;
    height: 170px;

    .active-ring-name {
      padding-top: 10px;
    }
  }
}
</style>
