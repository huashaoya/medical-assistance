<template>
    <div class="box"
        v-loading="loading"
        element-loading-text="处理中..."
        :element-loading-spinner="svg"
        element-loading-svg-view-box="-10, -10, 50, 50"
        element-loading-background="rgba(0, 0, 0, 0.8)"
    >
        <div class="image" >
            <div class="item">
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
                <el-button type="primary" class="btn" @click="submitUpload" :disabled="disabled">开始处理</el-button>
            </div>
            <div class="item">
                <el-image
                    style="width: 300px; height: 300px"
                    :src="img1"
                    :zoom-rate="1.2"
                    :preview-src-list="srcList"
                    :initial-index="0"
                    fit="cover"
                >
                    <template #error>
                        <div class="image-slot">
                            <el-icon><icon-picture /></el-icon>
                        </div>
                    </template>
                </el-image>
            </div>
            <div class="item"><el-image
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
            <div class="item">
                <el-image
                    style="width: 300px; height: 300px"
                    :src="img3"
                    :zoom-rate="1.2"
                    :preview-src-list="srcList"
                    :initial-index="2"
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
        <div class="console">
            <ul>
                <li v-for="item in consoleList" :key="item">{{ item }}</li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { Plus, Picture as IconPicture } from '@element-plus/icons-vue'
// import http from '@/utils/judge'
import { ref } from 'vue'
import { genFileId } from 'element-plus'

const uploadRef = ref()

const handleExceed = (files) => {
  uploadRef.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  uploadRef.value.handleStart(file)
}

const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
</script>

<script>
export default {
  data () {
    return {
      img1: '',
      img2: '',
      img3: '',
      srcList: [],
      imageUrl: '',
      consoleList: ['控制台已开启', '等待上传图片..'],
      loading: false,
      disabled: true
    }
  },
  methods: {
    success (res) {
      // console.log(res)
      this.img1 = res.img1
      this.img2 = res.img2
      this.img3 = res.img3
      this.loading = false
      this.srcList.push(res.img1, res.img2, res.img3)
    },
    onChange (event) {
      console.log(event)
      let URL = null
      if (window.createObjectURL !== undefined) {
        // basic
        URL = window.createObjectURL(event.raw)
      } else if (window.URL !== undefined) {
        // mozilla(firefox)
        URL = window.URL.createObjectURL(event.raw)
      } else if (window.webkitURL !== undefined) {
        // webkit or chrome
        URL = window.webkitURL.createObjectURL(event.raw)
      }
      // 转换后的地址为 blob:http://xxx/7bf54338-74bb-47b9-9a7f-7a7093c716b5
      this.imageUrl = URL
      // console.log(this.imageUrl)
      this.consoleList.push('选择图片：' + event.name)
      this.disabled = true
      if (event.percentage === 0) {
        this.img1 = ''
        this.img2 = ''
        this.img3 = ''
        this.disabled = false
        this.srcList = []
      }
    },
    submitUpload () {
      this.$refs.uploadRef.submit()
      this.loading = true
    }
  }
}
</script>
<style lang="scss" scoped>
.box{
    width:100%;
    height:100%;
    display: flex;
    .image{
        width:70%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content:flex-start;
        border-radius:20px;
        .item{
            width:50%;
            // margin:2%;
            height:50%;
            background-color: #0f132598;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            position: relative;
            .btn{
                position: absolute;
                bottom: 0;
            }
        }
    }
    .console{
        width:30%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.391);
        color:white;
        text-align: start;
        padding:20px;
        padding-top:40px;
    }
}
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
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
  width: 300px;
  height: 300px;
  text-align: center;
}
</style>
