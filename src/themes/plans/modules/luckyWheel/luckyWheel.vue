<template>
    <div class='luckyWheelWrapper'>
        <LuckyWheel
            ref='LuckyWheel'
            :blocks='blocks'
            :buttons='buttons'
            class='luckyWheel'
            :default-style='defaultStyle'
            height='300px'
            :prizes='prizes'
            width='300px'
            @end='endCallBack'
            @start='startCallBack'
        />
    </div>
</template>

<script>
const prizeButton = require('./imgs/button.png')
export default {
    props: {
        data: {
            type: Object
        },
    },
    data () {
        return {
            prizes: [],
            defaultStyle: {
                fontColor: '#d64737',
                fontSize: '14px'
            },
            blocks: [
                { padding: '13px', background: '#d64737' }
            ],
            buttons: [
                { radius: '50px', background: '#d64737' },
                { radius: '45px', background: '#fff' },
                { radius: '41px', background: '#f6c66f', pointer: true },
                {
                    radius: '35px',
                    background: '#ffdea0',
                    imgs: [{ src: this.data?.prizeButton || prizeButton, width: '65%', top: '-50%' }]
                }
            ],
        }
    },
    watch: {
        data () {
            this.getPrizesList()
        }
    },
    mounted () {
        console.log(this.data)
        // this.getPrizesList()
    },
    methods: {
        getPrizesList () {
            const prizes = []
            // const data = this.data.items.map(el => el.prizeName)
            // const data = ['1元红包', '100元红包', '0.5元红包', '2元红包', '10元红包', '50元红包', '0.3元红包', '5元红包']
            this.data.items.forEach((item, index) => {
                prizes.push({
                    title: item.prizeName,
                    background: index % 2 ? '#f9e3bb' : '#f8d384',
                    fonts: [{ text: item.prizeName, top: '10%' }],
                    imgs: [{ src: item.prizeImg || require(`./imgs/${index}.png`), width: '30%', top: '35%' }],
                })
            })
            this.prizes = prizes
        },
        startCallBack () {
            this.$refs.LuckyWheel.play()
            setTimeout(() => {
                this.$refs.LuckyWheel.stop(Math.random() * 8 >> 0)
            }, 3000)
        },
        endCallBack (prize) {
            alert(`恭喜你获得${prize.title}`)
        },
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.luckyWheel {
    margin: 0 auto;
}

</style>
