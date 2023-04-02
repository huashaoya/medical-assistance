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
  data () {
    return {
      config: {
        header: ['登录时间', '姓名', '科室'],
        data: [
          ['行1列1', '行1列2', '行1列3'],
          ['行2列1', '行2列2', '行2列3'],
          ['行3列1', '行3列2', '行3列3'],
          ['行4列1', '行4列2', '行4列3'],
          ['行5列1', '行5列2', '行5列3'],
          ['行6列1', '行6列2', '行6列3'],
          ['行7列1', '行7列2', '行7列3'],
          ['行8列1', '行8列2', '行8列3'],
          ['行9列1', '行9列2', '行9列3'],
          ['行10列1', '行10列2', '行10列3']
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
.history{
    color:white;
    width: 100%;
    padding: 20px;
    height: 100%;
    .title{
        width: 100%;
        display: flex;
        margin-bottom: 10px;
    }
}
</style>
