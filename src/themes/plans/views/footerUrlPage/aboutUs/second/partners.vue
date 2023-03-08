<template>
    <div class='partners'>
        <van-swipe :autoplay='3000' class='my-swipe'>
            <van-swipe-item v-for='item in list' :key='item.id'>
                <div class='cont'>
                    <img alt='' class='img-left' :src='item.srcLeft' />
                    <div class='left'>
                        <img alt='' class='img-right' :src='item.srcRight' />
                        <p class='desc'>
                            {{ item.desc }}
                        </p>
                    </div>
                </div>
            </van-swipe-item>
        </van-swipe>
    </div>
</template>

<script setup>
const list = [
    {
        id: 1,
        srcLeft: require('../../../../images/aboutus/lunbo1-1.png'),
        srcRight: require('../../../../images/aboutus/lunbo1-2.png'),
        desc: "It's a pleasure to work with CATS, we assist with fiat deposit and withdrawal issues and look forward to getting better and better in the future. "
    },
    {
        id: 2,
        srcLeft: require('../../../../images/aboutus/lunbo2-1.png'),
        srcRight: require('../../../../images/aboutus/lunbo2-2.png'),
        desc: 'We are happy to work with CATS to coordinate business processes for vetted individuals and entities within the ecosystem. '
    },
    {
        id: 3,
        srcLeft: require('../../../../images/aboutus/lunbo3-1.png'),
        srcRight: require('../../../../images/aboutus/lunbo3-2.png'),
        desc: 'The whole team at Metaverse is proud to work with CATS to further our common mission of bringing digital assets to the world.'
    },
    {
        id: 4,
        srcLeft: require('../../../../images/aboutus/lunbo4-1.png'),
        srcRight: require('../../../../images/aboutus/lunbo4-2.png'),
        desc: 'Trade Switcher is excited to be part of CATS, provide digital asset trading system and each module is iterated independently.'
    }
]
</script>

<style lang='scss' scoped>
.cont {
    background-image: url('../../../../images/aboutus/lunbobg.png');
    background-size: 100% 100%;
    height: rem(298px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: rem(74px) rem(40px);
    .left {
        margin-left: rem(60px);
    }
    .desc {
        font-size: rem(28px);
        color: #FFF;
    }
    .img-left {
        width: rem(116px);
    }
    .img-right {
        height: rem(63px);
        margin-bottom: rem(8px);
    }
}
.my-swipe {
    padding-bottom: rem(20px);
    :deep(.van-swipe__indicators) {
        bottom: 0;
        .van-swipe__indicator {
            background: #DDD;
        }
        .van-swipe__indicator--active {
            background: #0062FF;
        }
    }
}
</style>
