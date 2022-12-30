<template>
    <div class='fullWidth'>
        <div class='why-module auto-width'>
            <p class='descTitle'>
                {{ $t('home.why.text1') }}
            </p>
            <div class='descList'>
                <div class='row'>
                    <img alt='' class='icon' src='~@planspc/images/home/moneyBox.png' />
                    <p class='descTitle'>
                        {{ $t('home.why.text2') }}
                    </p>
                    <p class='descContent'>
                        {{ $t('home.why.text3') }}
                    </p>
                </div>
                <div class='row'>
                    <img alt='' class='icon' src='~@planspc/images/home/trafficLight.png' />
                    <p class='descTitle'>
                        {{ $t('home.why.text4') }}
                    </p>
                    <p class='descContent'>
                        {{ $t('home.why.text5') }}
                    </p>
                </div>
                <div class='row'>
                    <img alt='' class='icon' src='~@planspc/images/home/lock.png' />
                    <p class='descTitle'>
                        {{ $t('home.why.text6') }}
                    </p>
                    <p class='descContent'>
                        {{ $t('home.why.text7') }}
                    </p>
                </div>
                <div class='row last'>
                    <img alt='' class='icon' src='~@planspc/images/home/check.png' />
                    <p class='descTitle'>
                        {{ $t('home.why.text8') }}
                    </p>
                    <p class='descContent'>
                        {{ $t('home.why.text9') }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.fullWidth {
    margin-top: 20px;
    padding: 50px 0;
    background: var(--contentColor);
}
.why-module {
    color: var(--color);
    .title {
        @include font();
        font-size: 32px;
        font-weight: bold;
    }
    .subhead {
        margin-top: 5px;
        font-size: 16px;
    }
    .why-ul {
        display: flex;
        margin-top: 55px;
        li {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 245px;
            text-align: center;
            margin-right: 64px;
            &:last-of-type {
                margin-right: 0;
            }
            img {
                width: 140px;
                height: 140px;
            }
            .name {
                margin-top: 25px;
                font-size: 16px;
                font-weight: bold;
            }
            .describe {
                padding: 0 30px;
                margin-top: 18px;
                line-height: 22px;
                font-size: 14px;
                color: var(--normalColor);
            }
        }
    }
}
.descTitle {
    font-size: 32px;
    font-weight: bold;
    text-align: center;
    padding-bottom: 20px;
}
.descList {
    padding-top: 40px;
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 16px;
    text-align: center;
    display: flex;
    justify-content: space-between;
    .row {
        margin-right: 64px;
        width: 245px;
        &.last {
            margin-right: 0;
        }
    }
    .icon {
        width: 56px;
    }
    .descTitle {
        padding-top: 10px;
        color: #1E2329;
        font-weight: 500;
        font-size: 20px;
        line-height: 28px;
        margin-bottom: 8px;
    }
    .descContent {
        color: #474D57;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        min-height: 1.2em;
    }
}
</style>
