<template>
  <div class="history">
    <div class="title">
      <span>
        <i class="iconfont icon-tongji4" />
      </span>
      <span class="fs-xl text mx-2">
        CT室使用情况

      </span>
      <dv-decoration-3 style="width:250px;height:20px;" />
    </div>
    <div class="content">
      <div class="ring">
        <dv-active-ring-chart :config="Ringconfig" style="width:180px;height:200px" />
      </div>
      <div class="scroll">
        <dv-scroll-board :config="config" style="width:100%;height:100%" @click="click" />

      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      config: {
        header: ['楼层', '房间号', '使用状态'],
        data: [
          ['<span style="color:#37a2da;">行1列1</span>', '行1列2', '行1列3'],
          ['行2列1', '<span style="color:#32c5e9;">行2列2</span>', '行2列3'],
          ['行3列1', '行3列2', '<span style="color:#67e0e3;">行3列3</span>'],
          ['行4列1', '<span style="color:#9fe6b8;">行4列2</span>', '行4列3'],
          ['<span style="color:#ffdb5c;">行5列1</span>', '行5列2', '<span  ><a href="https://www.baidu.com/" target="_blank" style="color:#ffdb5c;">空闲|查看</a></span> '],
          ['行6列1', '<span style="color:#ff9f7f;">行6列2</span>', '行6列3'],
          ['行7列1', '行7列2', '<span style="color:#fb7293;">行7列3</span>'],
          ['行8列1', '<span style="color:#e062ae;">行8列2</span>', '行8列3'],
          ['<span style="color:#e690d1;">行9列1</span>', '行9列2', '行9列3'],
          ['行10列1', '<span style="color:#e7bcf3;">行10列2</span>', '行10列3']
        ],
        headerBGC: '#0f1325', // 表头
        oddRowBGC: '#0f1325', // 奇数行
        evenRowBGC: '#171c33' // 偶数行
      },
      Ringconfig: {
        data: [
          {
            name: '空闲',
            value: 10
          },
          {
            name: '使用中',
            value: 25
          },
          {
            name: '停用',
            value: 5
          }
        ],
        color: ['#95d475', '#409eff', '#f56c6c'],
        hoverPause: true
      }
    }
  },
  methods: { // 点击事件
    click(e) {
      if (e.row) { // 根据点击的index判断跳转到模型页
        console.log(e.rowIndex)
        console.log(e.columnIndex)
      }
    }
    // jumpHtml() {
    //   window.Location.href = "../../../static/CTRoom2/index.html"
    // }
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

  .content {
    width: 100%;
    height: calc(100% - 30px);
    display: flex;

    .ring {
      width: 200px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .scroll {
      width: calc(100% - 180px);
    }
  }
}
</style>
