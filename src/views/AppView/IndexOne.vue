<template>
    <div class="body">
        <div class="work">
            <div class="pic">
                <div class="item item-1">
                    <div class="img">
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
                    <div class="btn"></div>
                </div>
                <div class="item item-2"></div>
                <div class="item item-3"></div>
                <div class="item item-4"></div>
            </div>
            <div class="video">这里放视频</div>
        </div>
        <div class="history">
            <h1>历史记录</h1>
        </div>
    </div>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>
.body{
    width:100%;
    height: calc(100vh - 58px);
    background-color: aquamarine;
    display: flex;
    .work{
        width:80%;
        background-color: red;
        height:calc(100vh - 58px);
        .pic{
            background-color: rgb(15, 102, 85);
            height:50vh;
            display: flex;
            .item{
                width:25%;
                .img{
                    height:70%;
                    width:100%;
                }
                .btn{
                    height:30%;
                    background-color: brown;
                }
            }
            .item-1{
                border-right:1px solid black;
            }
        }
        .video{
            background-color: blueviolet;
            height:calc(50vh - 58px);
        }
    }
    .history{
        width:20%;
        height:calc(100vh - 58px);
        background-color: bisque;
    }
}
</style>
