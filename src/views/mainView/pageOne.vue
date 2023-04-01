<template>
    <div class="body">
        <div class="work">

        </div>
        <div class="history">
            <h2>历史记录</h2>
            <ul>
                <li v-for="item in history" :key="item.id">
                    <div class="item">
                        {{ item.time }}
                        <el-button type="primary" text>查看</el-button>
                        <el-button type="danger" text>删除</el-button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { Plus } from '@element-plus/icons-vue'
</script>
<script>
export default {
  data () {
    return {
      history: [
        {
          id: '6435131',
          time: '6546134846'
        },
        {
          id: '6435131',
          time: '6546134656'
        },
        {
          id: '6435131',
          time: '6546134659'
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
body{
  background-color: rgba(0,0,0,0);
}
.body{
    height: calc(100vh - 58px);
    display: flex;
    flex-direction: row;
     .work{
      width:80%;
      border-right: 1px dashed var(--el-border-color);;
    }
    .history{
        // background-color: green;
        width:20%;
        height:100%;
        .item{
            // background-color: aqua;
            margin: 10px;
            padding:10px;
            border: 1px dashed var(--el-border-color);
        }
    }
    .avatar-uploader .avatar {
        width: 178px;
        height: 178px;
        display: block;
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
  margin-top:20px;
  margin-bottom:40px;
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 238px;
  height: 238px;
  text-align: center;
}
</style>
