<template>
    <div class="box">
        <div class="content">
          <dv-border-box-1>
            <Work></Work>
          </dv-border-box-1>
      </div>
    </div>
</template>

<script>
import Work from './workView.vue'
export default {
  name: 'showVideo',
  data () {
    return {
      videoOptions: {
        controls: true
      },
      player: null,
      playTime: '',
      seekTime: '',
      current: '',
      videoUrl: ['', '']
    }
  },
  components: {
    Work
  },
  mounted () {
  },
  watch: {
    // 监听query参数变化
    $route (to, from) {
      if (to.query.type !== from.query.type) {

      }
    }
  },
  methods: {

  }

}
</script>
<style lang="scss" scoped>
.box{
  width:100%;
  height:calc(100vh - 60px);
  .content{
    margin: 0 10%;
    width: 80%;
    height:calc(100vh - 60px);
    background-color: #0f1325;
    .video-box{
      display:flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      .item{
        display: flex;
        flex-direction: column;
        align-items: center;
        .text{
        color: #339999;
        font-size: 16px;
        font-weight: 600;
        margin-top: 20px;
        }
      }
    }
  }

}
.video{
    width: 600px !important;
    height: 600px;
  }

</style>
