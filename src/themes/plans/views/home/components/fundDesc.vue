<template>
    <div class='full'>
        <div class='fundDesc'>
            <div class='column rightLine'>
                <p class='title'>
                    {{ $t('home.fundDesc.text1') }}
                </p>
                <p class='desc'>
                    {{ $t('home.fundDesc.text2') }}
                </p>
                <!-- <ul class='fundList'>
                    <li v-for='item in fundList' :key='item.ratio' class='item'>
                        <p class='ratio'>
                            {{ item.ratio }}
                        </p>
                        <img alt='' :src='"/images/homeFundIcons/"+item.name.toLowerCase()+".png"' />
                    </li>
                </ul> -->
                <div class='btnBox'>
                    <button class='btn' @click="openPDF('https://www.vitatoken.io/site/v10-whitepaper.pdf')">
                        {{ $t('home.fundDesc.text3') }}
                    </button>
                </div>
            </div>
            <div class='column'>
                <p class='title'>
                    {{ $t('home.fundDesc.text4') }}
                </p>
                <p class='desc' v-html="$t('home.fundDesc.text5')"></p>
                <!-- <img alt='' class='jingzhiImg' src='../../../images/home/jingzhi.png' /> -->
                <div class='btnBox'>
                    <button class='btn' @click="openPDF('https://www.vitatoken.io/site/v10-fund-whitepaper.pdf')">
                        {{ $t('home.fundDesc.text6') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue-demi'
export default {
    setup () {
        const fundList = ref([
            {
                name: 'BTC',
                ratio: '40.00%'
            },
            {
                name: 'ETH',
                ratio: '34.43%'
            },
            {
                name: 'BNB',
                ratio: '6.68%'
            },
            {
                name: 'SOL',
                ratio: '3.05%'
            },
            {
                name: 'ADA',
                ratio: '3.22%'
            },
            {
                name: 'XRP',
                ratio: '3.65%'
            },
            {
                name: 'LUNA',
                ratio: '3.30%'
            },
            {
                name: 'DOT',
                ratio: '1.83%'
            },
            {
                name: 'AVAX',
                ratio: '2.10%'
            },
            {
                name: 'DOGE',
                ratio: '1.74%'
            },
        ])

        // 打开pdf
        const openPDF = url => {
            window.open(url)
        }

        return {
            fundList,
            openPDF
        }
    }
}
</script>

<style lang="scss" scoped>
.fundDesc{
    background: var(--contentColor);
    padding: rem(40px) rem(30px);
    margin-top: rem(50px);
    margin-bottom: rem(50px);
    text-align: center;
    .column{
        line-height: 1.4;
        .title{
            font-weight: 700;
            padding-bottom: 0.5em;
            font-size: 20px;
        }
    }
    .rightLine{
        position: relative;
        padding-bottom: rem(60px);
        margin-bottom: rem(60px);
        &::after{
            content: "";
            height: 1px;
            width: 100%;
            background: var(--lineColor);
            position: absolute;
            right:0;
            bottom: 0;
        }
    }
    .fundList{
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        background: #eee;
        padding: 10px;
        border-radius: 4px;
        .ratio{
            font-size: 12px;
            padding-bottom: 5px;
        }
        img{
            width: 32px;
        }
    }
    .jingzhiImg{
        display: block;
        margin-top: 15px;
    }
    .btnBox{
        margin-top: 20px;
        .btn{
           height: 40px;
           padding: 0 15px;
           font-size: 14px;
           color: #fff;
           background-color: #0062ff;
           border-radius: 4px;
           cursor: pointer;
        }
    }

}
</style>
