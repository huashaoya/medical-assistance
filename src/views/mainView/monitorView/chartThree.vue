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
          ['门诊楼八楼', '803', '<span ><a href="http://106.55.171.221/medical-assistance/CTRoom/CTRoom2/index.html" target="_blank" style="color:#00ff22;">空闲|查看</a></span> '],
          ['门诊楼八楼', '804', '<span style="color:yellow;">忙碌中</span>'],
          ['门诊楼八楼', '805', '<span style="color:yellow;">忙碌中</span>'],
          ['门诊楼八楼', '806', '<span style="color:red;">停用</span>'],
          ['门诊楼八楼', '807', '<span style="color:yellow;">忙碌中</span>'],
          ['门诊楼九楼', '908', '<span style="color:yellow;">忙碌中</span>'],
          ['门诊楼九楼', '909', '<span style="color:yellow;">忙碌中</span>'],
          ['门诊楼九楼', '910', '<span ><a href="http://106.55.171.221/medical-assistance/CTRoom/CTRoom3/index.html" target="_blank" style="color:#00ff22;">空闲|查看</a></span> '],
          ['门诊楼九楼', '911', '<span style="color:yellow;">忙碌中</span>'],
          ['门诊楼九楼', '912', '<span style="color:yellow;">忙碌中</span>']
        ],
        headerBGC: '#0f1325', // 表头
        oddRowBGC: '#0f1325', // 奇数行
        evenRowBGC: '#171c33' // 偶数行
      },
      Ringconfig: {
        data: [
          {
            name: '空闲',
            value: 2
          },
          {
            name: '忙碌中',
            value: 7
          },
          {
            name: '停用',
            value: 1
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
