<template>
    <div class='fullWidth'>
        <div class='portfolio auto-width'>
            <div class='case'>
                <p class='t1'>
                    {{ $t('home.portfolioCreate.text1') }}
                </p>
                <ul class='pro-list'>
                    <li class='pro-item'>
                        <img alt='' class='icon-img' src='/images/threeStep_img2.png' srcset='' />
                        <div class='text'>
                            <p class='t3'>
                                {{ $t('home.portfolioCreate.text2') }}
                            </p>
                            <p class='t4'>
                                {{ $t('home.portfolioCreate.text3') }}
                            </p>
                        </div>
                    </li>
                    <li class='pro-item'>
                        <img alt='' class='icon-img' src='/images/threeStep_img3.png' srcset='' />
                        <div class='text'>
                            <p class='t3'>
                                {{ $t('home.portfolioCreate.text4') }}
                            </p>
                            <p class='t4'>
                                {{ $t('home.portfolioCreate.text5') }}
                            </p>
                        </div>
                    </li>
                    <li class='pro-item'>
                        <img alt='' class='icon-img' src='/images/threeStep_img4.png' srcset='' />
                        <div class='text'>
                            <p class='t3'>
                                {{ $t('home.portfolioCreate.text6') }}
                            </p>
                            <p class='t4'>
                                {{ $t('home.portfolioCreate.text7') }}
                            </p>
                        </div>
                    </li>
                </ul>
                <router-link v-if='!$store.state._user.customerInfo' class='start-btn' to='/register'>
                    {{ $t('home.getStarted') }}
                </router-link>
            </div>
            <div class='case img-wrap'>
                <img alt='' class='pro-img' src='/images/portfolio-section.png' srcset='' />
            </div>
        </div>
    </div>
</template>

<script setup>
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.fullWidth{
    margin-top: 20px;
    background: var(--contentColor);
    padding-top: 60px;
}
.portfolio {
    display: flex;
    .case {
        flex: 1;
    }
    .t1 {
        color: #1E2329;
        font-weight: 600;
        font-size: 30px;
        line-height: 1;
    }
    .t2 {
        margin-top: 6px;
        color: #474D57;
        font-weight: 400;
        font-size: 20px;
    }
    .img-wrap {
        .pro-img {
            width: 335px;
            margin-left: 150px;
        }
    }
    .pro-list {
        margin-top: 60px;
        .pro-item {
            display: flex;
            margin-bottom: 64px;
            .icon-img {
                width: 80px;
                height: 80px;
            }
            .text {
                margin-left: 30px;
            }
            .t3 {
                margin-bottom: 12px;
                color: #1E2329;
                font-size: 20px;
                line-height: 28px;
            }
            .t4 {
                color: #474D57;
                font-weight: 400;
                font-size: 14px;
                line-height: 20px;
            }
        }
    }
    .start-btn {
        display: inline-block;
        width: 180px;
        color: #fff;
        font-weight: bold;
        line-height: 40px;
        text-align: center;
        background-color: var(--primary);
        border-radius: 5px;
        cursor: pointer;
        @include hover();
    }
}
</style>
