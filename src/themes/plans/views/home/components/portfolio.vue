<template>
    <div class='portfolio'>
        <h2 class='h2title'>
            {{ $t('home.portfolio.text1') }}
        </h2>
        <p class='titleDesc'>
            {{ $t('home.portfolio.text2') }}
        </p>
        <div class='list'>
            <div class='row'>
                <i class='icon icon1'></i>
                <p class='title'>
                    {{ $t('home.portfolio.text3') }}
                </p>
                <p class='desc'>
                    {{ $t('home.portfolio.text4') }}
                </p>
            </div>
            <div class='row'>
                <i class='icon icon2'></i>
                <p class='title'>
                    {{ $t('home.portfolio.text5') }}
                </p>
                <p class='desc'>
                    {{ $t('home.portfolio.text6') }}
                </p>
            </div>
            <div class='row'>
                <i class='icon icon3'></i>
                <p class='title'>
                    {{ $t('home.portfolio.text7') }}
                </p>
                <p class='desc'>
                    {{ $t('home.portfolio.text8') }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.portfolio{
    margin: rem(40px) auto 0;
    .h2title{
        font-family: "Microsoft Yahei";
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        padding-bottom: 20px;
    }
    .titleDesc{
        text-align: center;
        font-size: 16px;
    }
    .list{
        margin-top: 40px;
    }
    .row{
        position: relative;
        padding-bottom: 40px;
        text-align: center;
        .icon{
            display: block;
            margin: 0 auto;
            width: 78px;
            height: 78px;
            background-size: contain;
            background-repeat: no-repeat;
        }
        .icon1{
            background-image: url('../../../images/home/portfolio-icon1.png');
        }
        .icon2{
            background-image: url('../../../images/home/portfolio-icon2.png');
        }
        .icon3{
            background-image: url('../../../images/home/portfolio-icon3.png');
        }
    }
    .title{
        margin-bottom: 8px;
        padding-top: 10px;
        color: #1E2329;
        font-weight: 500;
        font-size: 20px;
        line-height: 28px;

    }
}
</style>
