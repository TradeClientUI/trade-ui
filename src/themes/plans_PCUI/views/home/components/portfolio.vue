<template>
    <div class='fullWidth'>
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
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.fullWidth{
    margin-top: 20px;
    padding: 50px 0;
    background: var(--contentColor);
}
.portfolio{
    width: 1200px;
    margin: 0 auto;
    background: url('../../../images/home/portfolio.png') no-repeat right 160px;
    .h2title{
        font-family: "Microsoft Yahei";
        font-size: 30px;
        font-weight: bold;
        text-align: center;
        padding-bottom: 20px;
    }
    .titleDesc{
        padding-bottom: 70px;
        text-align: center;
        font-size: 16px;
    }
    .list{
        margin-top: 30px;
    }
    .row{
        position: relative;
        padding-left: 110px;
        padding-bottom: 60px;
        .icon{
            position: absolute;
            left: 0;
            top: 0;
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
        padding-bottom: 15px;
        font-size: 20px;

    }
}
</style>
