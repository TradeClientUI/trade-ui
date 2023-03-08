<template>
    <div class='cliens'>
        <h2 class='h2title'>
            {{ $t('JG_newHome.cliens') }}
        </h2>
        <div class='cont'>
            <div v-for='item in cliensList' :key='item.id'>
                <p class='info'>
                    <span>
                        {{ item.name }}
                    </span>
                    <span>
                        <van-icon color='#999' name='star' />
                        <van-icon color='#999' name='star' />
                        <van-icon color='#999' name='star' />
                        <van-icon color='#999' name='star' />
                        <van-icon color='#999' name='star' />
                        {{ item.time }}
                    </span>
                </p>
                <p class='text'>
                    {{ item.reviews }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
const cliensList = [
    {
        id: 1,
        name: 'Kourtney Ball',
        reviews: 'This platform is so good! Buying crypto funds is really easy and I think the crypto funds are very good because of the simple yet promising choice of cryptos. I will buy more if the crypto market continues to fall!',
        time: '16/7/2022',
        stars: 5
    },
    {
        id: 2,
        name: 'Tess Vinson',
        reviews: 'Great app in general, speaking as a new user. Registration and kyc are easy, no problems encountered. I just wish there will be more functions coming up, but if you are new to crypto, you’ve got everything you need on CATS.',
        time: '11/7/2022',
        stars: 5
    },
    {
        id: 3,
        name: 'Leah Cooper',
        reviews: ' Very user-friendly platform, I just got into crypto recently and CATS has been my favourite. The fees are good and I can buy crypto funds instead of just individual cryptos.',
        time: '7/7/2022',
        stars: 5
    },
    {
        id: 4,
        name: 'Lavinia Cain',
        reviews: 'I have been looking for a platform to purchase crypto funds, finally there is one! Looking forward to more crypto funds and functions on CATS.',
        time: '24/6/2022',
        stars: 5
    },
    {
        id: 5,
        name: 'Johanna Arbana ',
        reviews: 'CATS surely surprises me considering that it is a new platform. The UI is very user friendly and the crypto funds actually look pretty promising. High hopes for this company!',
        time: '16/6/2022',
        stars: 5
    },
    {
        id: 6,
        name: 'Krysia Gareth',
        reviews: 'Great platform for people who want to enter the crypto world. The platform is very easy to use. And there are the crypto funds if you don’t know which crypto to invest in. Looking forward to updates and new features!',
        time: '18/5/2022',
        stars: 5
    },
    {
        id: 7,
        name: 'Ninad Tatiana',
        reviews: 'Amazing new platform! Can’t seem to recall any other platforms focusing on crypto funds. I would suggest everybody to give it a try as it may become one of the big platforms one day.',
        time: '13/5/2022',
        stars: 5
    },
    {
        id: 8,
        name: 'Tihana Cali',
        reviews: 'content content content content content content content content content content content.',
        time: '29/4/2022',
        stars: 5
    },
    {
        id: 9,
        name: 'Clifford Walters',
        reviews: 'CATS is exactly what I have been looking for, a nice and simple crypto funds platform. Really easy to navigate around the website and the purchasing process is easy to follow as well. No complaints for such a new platform.',
        time: '22/4/2022',
        stars: 5
    },
    {
        id: 10,
        name: 'Maxine Higgins',
        reviews: 'If you are new to crypto and you want to start investing in crypto, CATS is for you. It has all the features that you need and what makes this platform stand out is the easy purchasing of crypto funds. Especially if you are not familiar with cryptos, just buy crypto funds.',
        time: '4/4/2022',
        stars: 5
    }
]

</script>

<style lang="scss" scoped>
.cliens{
    margin-top: rem(8px);
    padding: rem(60px) rem(30px);
    background: var(--contentColor);
}
.h2title{
    font-size: rem(48px);
    font-weight: bold;
    text-align: center;
    padding-bottom: rem(64px);
}
.cont{
    margin: 0 auto;
    height: rem(400px);
    overflow-y: scroll;
    .info{
        font-size: rem(32px);
        font-weight: 500;
        display: flex;
        justify-content: space-between;
        padding-right: rem(18px);
        margin-bottom: rem(18px);
        .van-icon {
            &:last-child{margin-right: rem(20px);}
        }
    }
    .text{
        font-size: rem(28px);
        margin-bottom: rem(40px);
        line-height: rem(40px);
    }
}

</style>
