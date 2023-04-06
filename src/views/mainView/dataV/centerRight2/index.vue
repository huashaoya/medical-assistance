<template>
  <div class="centerRight2">
    <div class="bg-color-black">
      <div class="d-flex pt-2 pl-2">
        <span>
          <i class="iconfont icon-vector" />
        </span>
        <div class="d-flex">
          <span class="fs-xl text mx-2">医生今日出诊记录</span>
        </div>
      </div>
      <div class="d-flex mt-1 jc-center body-box">
        <dv-scroll-board class="dv-scr-board" :config="config" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'
export default defineComponent({
  setup() {
    const config = reactive({
      header: ['姓名', '科室', '人数'],
      data: [
        ['宋医生', '乳腺外科', "4"],
        ['容医生', '乳腺外科', "5"],
        ['张医生', '血液科', "3"],
        ['陈医生 ', '耳鼻喉科', "3"],
        ['陆医生', '乳腺外科', "6"],
        ['刘医生', '血液科', "3"],
        ['叶医生', '耳鼻喉科', "4"],
        ['张医生', '乳腺外科', "5"],
        ['王医生', '血液科', "3"],
        ['吴医生', '耳鼻喉科', "4"]
      ],
      rowNum: 7, // 表格行数
      headerHeight: 35,
      headerBGC: '#0f1325', // 表头
      oddRowBGC: '#0f1325', // 奇数行
      evenRowBGC: '#171c33', // 偶数行
      // index: true,
      // columnWidth: [50],
      align: ['center']
    })
    return { config }
  }
})
</script>

<style lang="scss" scoped>
$box-height: 410px;
$box-width: 300px;

.centerRight2 {
  padding: 16px;
  padding-top: 20px;
  height: $box-height;
  width: $box-width;
  border-radius: 5px;

  .bg-color-black {
    height: $box-height - 30px;
    border-radius: 10px;
  }

  .text {
    color: #c3cbde;
  }

  .body-box {
    border-radius: 10px;
    overflow: hidden;

    .dv-scr-board {
      width: 270px;
      height: 340px;
    }
  }
}
</style>
