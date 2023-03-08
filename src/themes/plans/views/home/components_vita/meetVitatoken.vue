<template>
    <div class='meetCATS-module'>
        <div class='module-cont'>
            <h2 class='title'>
                Meet CATS
            </h2>
            <p class='title-label'>
                One-stop fund investment marketplace, a platform trusted by millions of investors
            </p>
            <div class='video-body'>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.meetCATS-module {
    width:100%;
    background: #F2F4F8;
    padding: 0 rem(32px);
    .module-cont {
        margin:0 auto;
        @include globalFont();
        padding-bottom: rem(80px);
        .title {
            font-size: rem(48px);
            padding: rem(96px) 0 rem(16px);
            text-align: center;
            font-weight: bold;
            line-height: rem(72px);
            &-label {
                text-align: center;
                color: #333333;
                font-size: rem(28px);
                line-height: rem(33px);
                font-weight: 400;
                line-height: rem(42px);
            }
        }
        .video{
            width: 100%;
        }
        .video-body {
            width: 100%;
            height:rem(397px);
            background: url('../../../images/home/new_version/video_bgd.png') left top no-repeat;
            background-size: 100%;
            display: flex;
            justify-content:center;
            align-items:center;
            margin-top:rem(86px);
            // border:rem(1px) dashed #666;
        }
    }

}
</style>
