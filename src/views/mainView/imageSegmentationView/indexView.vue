<template>
    <div class="body">
      <el-dialog v-model="dialogVisible" title="" width="60%" draggable>
        <el-image
            style="width: 300px; height: 300px"
            :src="history[historyIndex].img1"
            :zoom-rate="1.2"
            :preview-src-list="histotyRrcList"
            :initial-index="0"
            fit="cover"
        >
        </el-image>
        <el-image
            style="width: 300px; height: 300px"
            :src="history[historyIndex].img2"
            :zoom-rate="1.2"
            :preview-src-list="histotyRrcList"
            :initial-index="1"
            fit="cover"
        >
        </el-image>
        <el-image
            style="width: 300px; height: 300px"
            :src="history[historyIndex].img3"
            :zoom-rate="1.2"
            :preview-src-list="histotyRrcList"
            :initial-index="2"
            fit="cover"
        >
        </el-image>

      </el-dialog>
        <div class="work">
          <dv-border-box-1>
            <Work @handleHistory="handleHistory"></Work>
          </dv-border-box-1>
        </div>
        <div class="history">
            <h2>历史记录</h2>
            <ul>
                <li v-for="(item ,index) in history" :key="item.id">
                    <div class="item" v-if="item.type===$route.query.type">
                        {{ item.time }}
                        <el-button type="primary" text @click="look(index)">查看</el-button>
                        <el-popconfirm
                          confirm-button-text="确认"
                          cancel-button-text="取消"
                          hide-icon
                          title="确认删除这条记录?"
                          @confirm="deleteHistory(index)"
                          width="150"
                        >
                          <template #reference>
                            <el-button type="danger" text >删除</el-button>
                          </template>
                        </el-popconfirm>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import Work from './workView.vue'
export default {
  components: {
    Work
  },
  data () {
    return {
      history: [],
      dialogVisible: false,
      historyIndex: 0,
      histotyRrcList: []
    }
  },
  mounted () {
    const hi = localStorage.getItem('history')// 读取数据
    // console.log(hi)
    if (hi) {
      this.history = JSON.parse(hi)
    }
  },
  methods: {
    deleteHistory (index) {
      // console.log(index)
      this.history.splice(index, 1)
      localStorage.setItem('history', JSON.stringify(this.history))// 保存数据
    },
    handleHistory (data) {
      // console.log(666)
      this.history.unshift({ ...data, type: this.$route.query.type })
      // console.log(JSON.stringify(this.history))
      localStorage.setItem('history', JSON.stringify(this.history))// 保存数据
    },
    look (index) {
      this.dialogVisible = true
      this.historyIndex = index
      this.histotyRrcList = [this.history[index].img1,
        this.history[index].img2,
        this.history[index].img3]
    }
  }
}
</script>

<style scoped lang="scss">
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
        color:#339999;
            font-size: 20px;
            line-height: 36px;
        .item{
            // background-color: aqua;
            color:rgb(198, 198, 198);
            margin: 10px;
            padding:10px;
            border: 1px dashed var(--el-border-color);
            font-size: 18px;
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
.el-dialog{
  background-color: #5d627598;
  border-radius: 10px;
}
</style>
