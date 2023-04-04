<template>
    <div class="box">
        <div class="item">
            <div class="title"><dv-decoration-8 style="width:230px;height:30px;" />高斯滤波</div>
            <div class="content">
                <div class="content-item">
                    <el-form  label-width="120px">
                        <el-form-item label="Activity name">
                            <el-input/>
                        </el-form-item>
                        <el-form-item label="x轴标准差">
                            <el-input/>
                        </el-form-item>
                        <el-form-item label="Activity name">
                            <el-input/>
                        </el-form-item>
                        <el-form-item label="Activity name">
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
                    :src="img2"
                    :zoom-rate="1.2"
                    :preview-src-list="srcList"
                    :initial-index="1"
                    fit="cover"
                >
                    <template #error>
                        <div class="image-slot">
                            <el-icon><icon-picture /></el-icon>
                        </div>
                    </template>
                </el-image>
                </div>
            </div>
        </div>
        <div class="item">
            <div class="title right">形态学腐蚀<dv-decoration-8 :reverse="true" style="width:230px;height:30px;" /></div>
            <div class="content">
                <div class="content-item">
                    <el-form  label-width="120px">
                        <el-form-item label="Activity name">
                            <el-input/>
                        </el-form-item>
                        <el-form-item label="x轴标准差">
                            <el-input/>
                        </el-form-item>
                        <el-form-item label="Activity name">
                            <el-input/>
                        </el-form-item>
                        <el-form-item label="Activity name">
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
                    :src="img2"
                    :zoom-rate="1.2"
                    :preview-src-list="srcList"
                    :initial-index="1"
                    fit="cover"
                >
                    <template #error>
                        <div class="image-slot">
                            <el-icon><icon-picture /></el-icon>
                        </div>
                    </template>
                </el-image>
                </div>
            </div>
        </div>
        <div class="item"><div class="title"><dv-decoration-8 style="width:230px;height:30px;" />中值滤波</div></div>
        <div class="item"><div class="title right">尺寸修改<dv-decoration-8 :reverse="true" style="width:230px;height:30px;" /></div></div>
        <div class="item"><div class="title"><dv-decoration-8 style="width:230px;height:30px;" />双边滤波</div></div>
        <div class="item"> <div class="title right">形态学膨胀<dv-decoration-8 :reverse="true" style="width:230px;height:30px;" /></div></div>
    </div>
</template>

<script setup>
import { Plus, Picture as IconPicture } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.box{
    width:100%;
    height: calc(100vh - 58px);
    display: flex;
    flex-wrap: wrap;
    .item{
        background-color: #0f1325;
        margin: 1% 2%;
        width: 46%;
        height: 29%;
        .title{
            display: flex;
            color:#339999;
            font-size: 25px;
            line-height: 36px;
            font-weight: 600;
        }
        .title.right{
            justify-content: right;
        }
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
    }
}
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
  width: 180px;
  height: 180px;
  text-align: center;
}
</style>
