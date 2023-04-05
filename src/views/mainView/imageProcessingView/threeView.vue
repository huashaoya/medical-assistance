<template>
    <div class="content">
        <div class="content-item">
            <el-form  label-width="120px">
                <el-form-item label="卷积核大小">
                    <el-input/>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-image">
            <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            action="http://127.0.0.1:8000/judge/"
            :data="{type:$route.query.type}"
            :on-change="onChange"
            :auto-upload="false"
            :on-success="success"
            :limit="1"
            ref="uploadRef"
            :on-exceed="handleExceed"
        >
            <el-image
            v-if="imageUrl"
            :src="imageUrl"
            class="avatar"
            style="width: 300px; height: 300px"
            fit="contain"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <el-image
            style="width: 300px; height: 300px"
            :src="img"
            :zoom-rate="1.2"
            :preview-src-list="srcList"
            :initial-index="1"
            fit="cover"
        >
            <template #error>
                <div class="image-slot">
                    <el-icon><icon-picture/></el-icon>
                </div>
            </template>
        </el-image>
        </div>
    </div>
</template>
<script setup>
import { Plus, Picture as IconPicture } from '@element-plus/icons-vue'
</script>
<script>
export default {
  data () {
    return {
      imageUrl: '',
      img: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.image-slot {
    margin-left: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 180px;
    height: 180px;
    background: #2c3147;
    color:white;
    font-size: 30px;
}
.image-slot .el-icon {
  font-size: 30px;
}
</style>
<style lang="scss">
 .content{
    width:100%;
    height: calc(100% - 30px);
    display: flex;
    .content-item{
        width:30%;
        height:100%;
    }
    .content-image{
        width:70%;
        height:100%;
        display: flex;
        justify-content: right;
    }
}
</style>
