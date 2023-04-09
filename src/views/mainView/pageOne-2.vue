<template>
    <div class="box">
        <div class="content">
          <dv-border-box-1>
            <div class="video-box">
              <div class="item">
                <video
                  :src="videoUrl[0]"
                  :controls="false"
                  class="video"
                  webkit-playsinline="true"
                  playsinline="true"
                  x-webkit-airplay="allow"
                  x5-playsinline
                  style="width: 100%;"
                  @play="onPlayerPlay"
                  @pause="onPlayerPause"
                  @seeking="seeking"
                  loop="true"
                  autoplay="autoplay"
                  ref="video">
                </video>
                <dv-decoration-7 class="text">原视频</dv-decoration-7>
              </div>
              <div class="item">
                <video
                    :src="videoUrl[1]"
                    :controls="false"
                    class="video"
                    webkit-playsinline="true"
                    playsinline="true"
                    x-webkit-airplay="allow"
                    x5-playsinline
                    style="width: 100%;"
                    @play="onPlayerPlay"
                    @pause="onPlayerPause"
                    @seeking="seeking"
                    autoplay="autoplay"
                    loop="true"
                    ref="video">
                </video>
                <dv-decoration-7 class="text">检测视频</dv-decoration-7>
            </div>
          </div>
        </dv-border-box-1>
      </div>
    </div>
</template>

<script>
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
  mounted () {
    this.initVideo()
    this.setUrl(this.$route.query.type)
  },
  watch: {
    // 监听query参数变化
    $route (to, from) {
      if (to.query.type !== from.query.type) {
        this.setUrl(to.query.type)
      }
    }
  },
  methods: {
    initVideo () {
      // 原生初始化视频方法
      const myVideo = this.$refs.video
      // ontimeupdate
      myVideo.ontimeupdate = function () { myFunction() }
      const _this = this

      function myFunction () {
        const playTime = myVideo.currentTime
        setTimeout(function () {
          localStorage.setItem('cacheTime', playTime)
        }, 500)
        const time = localStorage.getItem('cacheTime')
        // 当前播放位置发生变化时触发。
        if (playTime - Number(time) > 2) {
          myVideo.currentTime = Number(time)
        }
      }
    },
    setUrl (type) {
      let arr
      switch (type) {
        case '2':
          arr = ['http://106.55.171.221/medical-assistance/video/pharyngolaryngeal.mp4',
            'http://106.55.171.221/medical-assistance/video/pharyngolaryngeal_2.mov']
          break
        case '1':
          arr = ['http://106.55.171.221/medical-assistance/video/blood_original.mp4',
            'http://106.55.171.221/medical-assistance/video/blood_2.mov']
          break
        case '0':
          arr = ['http://106.55.171.221/medical-assistance/video/breast_original.mp4',
            'http://106.55.171.221/medical-assistance/video/breast_cancer.mov']
          break
      }
      this.videoUrl = arr
    },
    // 播放回调
    onPlayerPlay (player) {
      // this.globalSetting = true
      console.log('player play!', player)
      // document.getElementsByClassName("vjs-control-bar").style.display = "block";
      // document.getElementsByClassName("vjs-control-bar").style.display = "block";
    },

    // 暂停回调
    onPlayerPause (player) {
      // this.globalSetting.controls = false;
      // console.log("player pause!", player);
      // var video = document.getElementById("video");
      // video.controls=false;
      // document.getElementsByClassName("vjs-control-bar").style.display = "none";
    },

    beforeDestroy () {
      if (this.player) {
        this.player.dispose()
      }
    }
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
