<template>
    <div class="body">
        <div class="work">
            <div class="main">
                <div class="option">
                    <el-select v-model="value" class="m-2" placeholder="Select" size="large" placement="top">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                    <div class="console">
                    </div>
                </div>
                <div class="upload">
                    <el-upload
                    class="avatar-uploader"
                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    >
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                    <el-button type="primary" size="large" color="midnightblue">开始分割</el-button>
                </div>
                <div class="result">
                    <div class="pic">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                        <div></div>
                    </div>
                    <div class="pic">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                        <div></div>
                    </div>
                    <div class="pic">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                        <div></div>
                    </div>
                </div>

            </div>

            <div class="info"></div>
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
      options: [
        {
          label: '图像处理',
          value: 'option1'
        },
        {
          label: '图像分割',
          value: 'option1'
        },
        {
          label: '目标检测',
          value: 'option2'
        }
      ],
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
.body{
    background-color: rgb(255, 255, 255);
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: row;
    .work{
        width:80%;
        height:100%;
        display: flex;
        flex-direction: column;
        border-right:2px dashed var(--el-border-color);;
        .main{
            width:100%;
            height: 50%;
            display: flex;
            border-bottom: 2px dashed var(--el-border-color);
            overflow-x: auto;
            .option{
                width:240px;
                height: 100%;
                border-right: 2px dashed var(--el-border-color);
                padding-top: 20px;
                .console{
                    width:calc(100% - 20px);
                    height: calc(100% - 60px);
                    margin: 10px;
                    border-radius: 10px;
                    border: 1px dashed var(--el-border-color);
                }
            }
            .upload{
                width:300px;
                background-color: white;
                border-right: 2px dashed var(--el-border-color);
            }
            .result{
                display: flex;
                .pic{
                    width:260px;
                    margin: 20px;
                    // background-color: aquamarine;
                    height:calc(100% - 40px);
                    border: 1px dashed var(--el-border-color);
                    border-radius: 10px;
                }
            }
        }
        .info{
            width:100%;
            height: 50%;
            // background-color: aqua;
        }
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
