<template>
    <div class="body">
        <div class="work">

            <div class="main">
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
                    <el-button type="primary">开始分割</el-button>
                </div>

            </div>

            <div class="info"></div>
        </div>
        <div class="history">
            <h2>历史记录</h2>
        </div>
    </div>
</template>
<script setup>
import { Plus } from '@element-plus/icons-vue'

</script>
<style scoped lang="scss">
.body{
    background-color: black;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: row;
    .work{
        background-color: rgb(57, 0, 0);
        width:80%;
        height:100%;
        display: flex;
        flex-direction: column;
        .main{
            width:100%;
            height: 50%;
            display: flex;
            .upload{
                width:300px;
                background-color: white;
            }
        }
        .info{
            width:100%;
            height: 50%;
            background-color: aqua;
        }
    }
    .history{
        background-color: green;
        width:20%;
        height:100%;
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
