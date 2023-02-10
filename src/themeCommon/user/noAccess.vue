<template>
    <Top v-if='!isPC' class='topBar' on-back @back='$router.back()' />
    <div class='page-wrap' :class="isPC ? 'isPC' : ''">
        <div class='container'>
            <div class='noaccess'>
                <div class='title'>
                    <van-icon :color='$style.warn' name='close' size='30' />
                    <span> {{ $t('noAccess.ip') }}</span>
                </div>
                <p>
                    {{ $t('noAccess.text') }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import Top from '@/components/top'
const isPC = window.isPC
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    position: relative;
    height: 100%;
    background: var(--contentColor);

    .topBar {
        height: rem(100px);
    }
    .container {
        overflow: auto;

        .noaccess{
            margin: rem(60px) rem(60px) 0 ;
            padding: rem(40px);
            border: solid 1px var(--lineColor);
            border-radius: rem(16px);
            .title{
                .van-icon{
                    line-height: normal;
                    margin-right: rem(20px);
                    margin-top: -2px;
                }
                font-size: rem(40px);
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: rem(40px);
            }
            >p{
                color: var(--normalColor);
                line-height: rem(50px);
                width: 90%;
                margin: 0 auto;
            }
        }
    }
    &.isPC{
        //PC样式
        margin: 100px 0;
        border-radius: 10px;
        width: 520px;
        .container{
            .noaccess{
                border: none;
                margin: 20px;
            }
        }

    }
}

</style>
