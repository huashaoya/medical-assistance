<template>
  <div class="history">
    <div class="title">
      <span>
        <i class="iconfont icon-tongji4" />
      </span>
      <span class="fs-xl text mx-2">B超室使用情况</span>
      <dv-decoration-3 style="width:250px;height:20px;" />
    </div>
    <div class="content">
      <div class="ring">
        <dv-active-ring-chart :config="Ringconfig" style="width:180px;height:200px;" />
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
          ['门诊楼二楼', '207', '<span style="color:yellow;">忙碌中</span>'],
          ['门诊楼二楼', '208', '<span style="color:yellow;">忙碌中</span>'],
          ['门诊楼二楼', '209', '<span ><a href="javascript:;" target="_blank" style="color:#00ff22;">空闲|查看</a></span> '],
          ['门诊楼二楼', '210', '<span style="color:yellow;">忙碌中</span>'],
          ['门诊楼二楼', '211', '<span style="color:yellow;">忙碌中</span>'],
          ['门诊楼三楼', '301', '<span style="color:yellow;">忙碌中</span>'],
          ['门诊楼三楼', '302', '<span ><a href="javascript:;" target="_blank" style="color:#00ff22;">空闲|查看</a></span> '],
          ['门诊楼三楼', '303', '<span style="color:yellow;">忙碌中</span>'],
          ['门诊楼三楼', '304', '<span style="color:yellow;">忙碌中</span>'],
          ['门诊楼三楼', '305', '<span style="color:red;">停用</span>']
        ],
        headerBGC: '#0f1325', // 表头
        oddRowBGC: '#0f1325', // 奇数行
        evenRowBGC: '#171c33', // 偶数行
        waitTime: 2300
      },
      Ringconfig: {
        data: [
          {
            name: '空闲',
            value: 1
          },
          {
            name: '忙碌中',
            value: 8
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
      flex-direction: column;
    }

    .scroll {
      width: calc(100% - 180px);
    }
  }
}
</style>
