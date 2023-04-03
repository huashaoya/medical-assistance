<template>
    <div class="box">
        <div class="image">
            <div class="item">
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
            </div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
        </div>
        <div class="console"></div>
    </div>
</template>
<script setup>
import { Plus } from '@element-plus/icons-vue'
</script>
<script>
</script>
<style lang="scss" scoped>
    .box{
        width:100%;
        height:100%;
        display: flex;
        .image{
            width:75%;
            height: 100%;
            display: flex;
            flex-wrap: wrap;
            .item{
                width:50%;
                height:50%;
            }
        }
        .console{
            width:25%;
            height: 100%;
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
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
