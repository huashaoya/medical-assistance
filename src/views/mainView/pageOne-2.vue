<template>
    <div>
        <video
            src="http://106.55.171.221/medical-assistance/video/pharyngolaryngeal.mp4"
            :controls="videoOptions.controls"
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
            ref="video">
        </video>
        <video
            src="http://106.55.171.221/medical-assistance/video/pharyngolaryngeal_2.mp4"
            :controls="videoOptions.controls"
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
            ref="video">
        </video>
    </div>
    </template>

<script>
export default {
  name: 'showVideo',
  data () {
    return {
      videoOptions: {
        controls: true,
        src:
                        'xxxxxxx.mp4' // url地址
      },
      player: null,
      playTime: '',
      seekTime: '',
      current: ''
    }
  },
  mounted () {
    this.initVideo()
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
        } else {
        }
      }
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
<style>
.video{
    width: 600px !important;;
    height: 600px;
}
</style>
