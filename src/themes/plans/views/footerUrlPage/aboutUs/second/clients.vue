<template>
    <div class='clients'>
        <div class='row flex'>
            <div class='box'>
                <img alt='' class='logo' src='../../../../images/aboutus/clients1.png' />
                <p class='right'>
                    <span class='h3'>
                        Google Play 4.8
                    </span>
                    <img v-for='i in 4' :key='i' alt='' class='start' src='../../../../images/aboutus/clients-start1.png' />
                    <img alt='' class='start' src='../../../../images/aboutus/clients-start2.png' />
                </p>
            </div>
            <div class='box'>
                <img alt='' class='logo' src='../../../../images/aboutus/clients2.png' />
                <p class='right'>
                    <span class='h3'>
                        iOS Store 4.7
                    </span>
                    <img v-for='i in 4' :key='i' alt='' class='start' src='../../../../images/aboutus/clients-start1.png' />
                    <img alt='' class='start' src='../../../../images/aboutus/clients-start2.png' />
                </p>
            </div>
        </div>
        <div v-for='item in list' :key='item.id' class='cont'>
            <p class='header flex'>
                <span class='h3'>
                    {{ item.headerText }}
                </span>
                <img v-for='i in 5' :key='i' alt='' class='start' src='../../../../images/aboutus/clients-start1.png' />
            </p>
            <p class='desc'>
                {{ item.descText }}
            </p>
        </div>
    </div>
</template>

<script setup>
const list = [
    {
        id: 1,
        headerText: 'Kourtney Ball',
        descText: 'This platform is so good! Buying crypto funds is really easy and I think the crypto funds are very good because of the simple yet promising choice of cryptos. I will buy more if the crypto market continues to fall!'
    },
    {
        id: 2,
        headerText: 'Tess Vinson',
        descText: 'Great app in general, speaking as a new user. Registration and kyc are easy, no problems encountered. I just wish there will be more functions coming up, but if you are new to crypto, you’ve got everything you need on MagnaMarkets.'
    },
    {
        id: 3,
        headerText: 'Leah Cooper',
        descText: 'Very user-friendly platform, I just got into crypto recently and MagnaMarkets has been my favourite. The fees are good and I can buy crypto funds instead of just individual cryptos.'
    },
    {
        id: 4,
        headerText: 'Lavinia Cain',
        descText: 'I have been looking for a platform to purchase crypto funds, finally there is one! Looking forward to more crypto funds and functions on MagnaMarkets.'
    },
    {
        id: 5,
        headerText: 'Johanna Arbana',
        descText: 'MagnaMarkets surely surprises me considering that it is a new platform. The UI is very user friendly and the crypto funds actually look pretty promising. High hopes for this company!'
    },
    {
        id: 6,
        headerText: 'Krysia Gareth',
        descText: 'Great platform for people who want to enter the crypto world. The platform is very easy to use. And there are the crypto funds if you don’t know which crypto to invest in. Looking forward to updates and new features!'
    },
    {
        id: 7,
        headerText: 'Ninad Tatiana',
        descText: 'Amazing new platform! Can’t seem to recall any other platforms focusing on crypto funds. I would suggest everybody to give it a try as it may become one of the big platforms one day.'
    },
    {
        id: 8,
        headerText: 'Tihana Cali',
        descText: 'MagnaMarkets is safe and reliable, licensed by CEZA & FinCEN, I didn’t come across any bugs and I really like the idea of a crypto funds trading platform. I have high hopes for MagnaMarkets.'
    },
    {
        id: 9,
        headerText: 'Clifford Walters',
        descText: 'MagnaMarkets is exactly what I have been looking for, a nice and simple crypto funds platform. Really easy to navigate around the website and the purchasing process is easy to follow as well. No complaints for such a new platform.'
    },
    {
        id: 10,
        headerText: 'Maxine Higgins',
        descText: 'If you are new to crypto and you want to start investing in crypto, MagnaMarkets is for you. It has all the features that you need and what makes this platform stand out is the easy purchasing of crypto funds. Especially if you are not familiar with cryptos, just buy crypto funds.'
    }
]
</script>

<style lang='scss' scoped>
.clients {
    padding-bottom: rem(40px);
    .flex {
        display: flex;
    }
    .row {
        justify-content: space-between;
        align-items: center;
        margin-bottom: rem(20px);
        text-align: left;
    }
    .box {
        padding: rem(20px) rem(30px);
        background: #FFF;
        display: flex;
        align-items: center;
        border-radius: rem(3px);
        .logo {
            width: rem(50px);
            height: rem(50px);
        }
        .h3 {
            font-size: rem(32px);
            display: block;
            text-align: left;
            font-weight: 500;
        }
        .right {
            margin-left: rem(15px);
        }
    }
    .cont {
        background-color: #FFF;
        width: 100%;
        margin-bottom: rem(20px);
        padding: rem(40px);
        border-radius: rem(3px);
        &:nth-child(odd) {
            margin-right: rem(40px);
        }
        .header {
            align-items: center;
        }
        .h3 {
            font-size: rem(40px);
            font-weight: 500;
            margin-right: rem(15px);
        }
        .desc {
            font-size: 16rem(32px);
            margin-top: rem(20px);
        }
    }
    .start {
        height: rem(40px);
    }
}
</style>
