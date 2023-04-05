<template>
    <div class="content"
        v-loading="loading"
        element-loading-text="处理中..."
        :element-loading-spinner="svg"
        element-loading-svg-view-box="-10, -10, 50, 50"
        element-loading-background="rgba(0, 0, 0, 0.8)"
    >
        <div class="content-item">
            <el-form  label-width="120px">
                <el-form-item label="领域直径">
                    <el-input v-model="input_1"/>
                </el-form-item>
                <el-form-item label="灰度值标准差">
                    <el-input v-model="input_2"/>
                </el-form-item>
                <el-form-item label="空间标准差">
                    <el-input v-model="input_3"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitUpload" color="#2c3147" >开始处理</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-image">
            <div style="width:30px"></div>
            <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            action="http://127.0.0.1:8000/imageProcessing/"
            :data="{
                'type':4,
                'input_1':input_1,
                'input_2':input_2,
                'input_3':input_3,
            }"
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
            style="width: 180px; height: 180px"
            fit="contain"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <div style="width:30px"></div>
        <el-image
            style="width: 180px; height: 180px"
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
      imageUrl: '',
      img: '',
      disabled: true,
      loading: false,
      input_1: null,
      input_2: null,
      input_3: null
    }
  },
  methods: {
    success (res) {
      console.log(res)
      this.img = res.img1
      //   this.img2 = res.img2
      //   this.img3 = res.img3
      this.loading = false
    //   this.srcList.push(res.img1, res.img2, res.img3)
    },
    onChange (event) {
      // console.log(event)
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
      this.disabled = true
      if (event.percentage === 0) {
        this.img = ''
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
.image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 180px;
    height: 180px;
    background: #2c3147;
    color:rgb(171, 171, 171);
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

    }
}
</style>
