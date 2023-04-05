<template>
  <div class="history">
    <div class="title">
      <span>
        <i class="iconfont icon-vector" />
      </span>
      <span class="fs-xl text mx-2">医生出勤信息</span>
      <dv-decoration-1 style="width:200px;height:20px;" />
    </div>
    <dv-scroll-board :config="config" style="width:100%;height:calc(100% - 30px)" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      config: {
        header: ['姓名', '科室', '出勤时间'],
        data: [
          ['宋医生', '乳腺外科', '14：30-17：00'],
          ['叶医生', '乳腺外科', '08：30-12：00'],
          ['徐医生', '血液科', '14：30-17：00'],
          ['张医生', '血液科', '08：30-12：00'],
          ['容医生', '耳鼻喉科', '14：30-17：00'],
          ['王医生', '乳腺外科', '08：30-12：00'],
          ['张医生', '耳鼻喉科', '14：30-17：00'],
          ['李医生', '血液科', '08：30-12：00'],
          ['吴医生', '乳腺外科', '14：30-17：00'],
          ['陈医生', '耳鼻喉科', '08：30-12：00']
        ],
        headerBGC: '#0f1325', // 表头
        oddRowBGC: '#0f1325', // 奇数行
        evenRowBGC: '#171c33' // 偶数行
      }
    }
  }
}
</script>
<style scoped lang="scss">
.history {
  color: white;
  width: 100%;
  padding: 20px;
  height: 100%;

  .title {
    width: 100%;
    display: flex;
    margin-bottom: 10px;
  }
}
</style>
