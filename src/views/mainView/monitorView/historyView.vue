<template>
  <div class="history">
    <div class="title">
      <span>
        <i class="iconfont icon-tongji4" />
      </span>
      <span class="fs-xl text mx-2">历史记录</span>
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
        header: ['登录时间', '姓名', '科室'],
        data: [
          ['2023-4-4 9:35:55', '王医生', '乳腺外科'],
          ['2023-4-5 15:35:22', '叶医生', '耳鼻喉科'],
          ['2023-4-5 15:55:02', '赵医生', '血液科'],
          ['2023-4-6 09:50:20', '张医生', '乳腺外科'],
          ['2023-4-6 10:38:44', '陈医生', '血液科'],
          ['2023-4-6 14:40:05', '吴医生', '耳鼻喉科'],
          ['2023-4-6 15:43:53', '张医生', '耳鼻喉科'],
          ['2023-4-7 09:32:12', '徐医生', '血液科'],
          ['2023-4-7 11:31:37', '李医生', '血液科'],
          ['2023-4-7 17:11:18', '容医生', '乳腺外科']
        ],
        headerBGC: '#0f1325', // 表头
        oddRowBGC: '#0f1325', // 奇数行
        evenRowBGC: '#171c33', // 偶数行
        waitTime: 2200
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
