<template>
    <div class='meetVitatoken-module'>
        <div class='module-cont'>
            <div class='left'>
            </div>

            <div class='right'>
                <h2 class='title'>
                    Meet CATS
                </h2>
                <p class='title-label'>
                    One-stop fund investment marketplace, a platform trusted by millions of investors
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.meetVitatoken-module {
    width: 100%;
    background: #F2F4F8;
    @include pagePadding();
    .module-cont {
        @include pagePadding();
        max-width: 1280px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 128px !important;
        padding-bottom: 128px !important;
        .left {
            flex: 1;
            .video {
                // border:1px dashed #666;
                border-radius: 12px;
                width: 100%;
            }
        }
        .right {
            flex: 1;
            padding-left: 80px;
            .title {
                color: #111;
                font-size: 32px;
                line-height: 38px;
                font-weight: 600;
                margin-bottom: 16px;
                &-label {
                    color: #666;
                    font-size: 16px;
                    line-height: 20px;
                    font-weight: 400;
                }
            }
        }
    }
}
</style>
