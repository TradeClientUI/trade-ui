<template>
    <div class='home'>
        <div class='barrage-wrapper'>
            <!-- <video controls
             src="@/assets/1.mp4"
             autoplay
             style="width:100%;height:100%;z-index:2;" /> -->
            <!-- 确保父元素是相对定位，弹幕容器是绝对定位 -->
            <VBarrage :arr='arr' :is-pause='isPause' :percent='100' :speed='speed' />
        </div>
        <div class='barrage-control'>
            <input
                id='sendContent'
                v-model='sendContent'
                placeholder='输入文案回车发送弹幕'
                type='text'
                @keyup.enter='sendBarrage'
            />
            方向:
            <select
                v-model='direction'
                style='margin: 0 12px;'
            >
                <option value='default'>
                    默认
                </option>
                <option value='top'>
                    顶部
                </option>
            </select>

            <input
                v-model='isJs'
                type='checkbox'
            /> js弹幕(直接写代码)

            <button
                id='sendBarrageBtn'
                class='btn'
                style='margin-left: 25px;'
                @click='sendBarrage'
            >
                发送
            </button>
            <button
                id='pauseBtn'
                class='btn'
                @click='goBarrageStop'
            >
                暂停
            </button>
            <button
                id='startBtn'
                class='btn'
                @click='goBarrageStar'
            >
                开始
            </button>
        </div>
    </div>
</template>

<script>
import { computed, toRefs, reactive, onMounted, ref, provide } from 'vue'
import VBarrage from '@planspc/components/VBarrage/index.vue'

import icon1 from '@/assets/currency_icon/default.png'
import icon2 from '@/assets/currency_icon/CNY.png'
import icon3 from '@/assets/currency_icon/EUR.png'
import icon4 from '@/assets/currency_icon/GBP.png'
import icon5 from '@/assets/currency_icon/HKD.png'
import icon6 from '@/assets/currency_icon/JPY.png'

export default {
    components: {
        VBarrage
    },

    setup () {
        const state = reactive({
            arr: [],
            isPause: false,
            sendContent: null,
            isJs: false,
            direction: 'default',
            speed: 90
        })

        const initTestData = () => {
            // const arr = [
            //     '这是一条有弹幕',
            //     '我是弹幕二',
            //     '这有点意思？',
            //     '一起嗨！！！',
            //     '看来有点意思',
            //     '看来有点意思2222'
            // ]
            const arr = [
                {
                    txt: '这是一条有弹幕',
                    icon: icon1,
                    link: ''
                },
                {
                    txt: '我是弹幕二',
                    icon: icon2,
                    link: ''
                },
                {
                    txt: '这有点意思？',
                    icon: icon3,
                    link: ''
                },
                {
                    txt: '一起嗨！！！',
                    icon: icon4,
                    link: ''
                },
                {
                    txt: '看来有点意思',
                    icon: icon5,
                    link: ''
                },
                {
                    txt: '看来有点意思2222',
                    icon: icon5,
                    link: ''
                },
                {
                    txt: '看来有点意思3333',
                    icon: '',
                    link: 'https://www.baidu.com'
                }
            ]
            const Arr = []
            let item = null
            for (var i = 0; i < 8; i++) {
                for (var index = 0; index < 500; index++) {
                    item = arr[parseInt(Math.random() * arr.length)]
                    Arr.push({
                        direction: 'default',
                        txt: item.txt,
                        icon: item.icon ? item.icon : '',
                        link: item.link ? item.link : '',
                        index: index
                    })
                }
            }
            state.arr = Arr
            console.log(state.arr.length)
        }

        // 发送弹幕
        const sendBarrage = () => {
            if (state.arr.length > 1 && state.sendContent !== '' && state.sendContent !== null) {
                state.arr.unshift({
                    txt: state.sendContent,
                    direction: state.direction,
                    icon: '',
                    link: '',
                    index: '',
                    isSelf: true,
                    style: {
                        color: 'red',
                        fontSize: '18px'
                    },
                    isJs: state.isJs
                })
            } else {
                state.arr.push({
                    txt: state.sendContent,
                    direction: state.direction,
                    isSelf: true,
                    icon: '',
                    link: '',
                    index: '',
                    style: {
                        color: 'red'
                    },
                    isJs: state.isJs
                })
            }
            console.log(state.sendContent)
            state.sendContent = null
        }

        const goBarrageStar = () => {
            state.isPause = false
        }

        const goBarrageStop = () => {
            state.isPause = true
        }

        onMounted(() => {
            initTestData()
        })

        return {
            goBarrageStop,
            goBarrageStar,
            sendBarrage,
            ...toRefs(state)
        }
    }
}

</script>

<style lang="scss" scoped>
.barrage-control {
    margin: 10px 0;
    text-align: center;
}
.barrage-wrapper {
    position: relative;
    width: 100%;
    height: 600px;
    margin: 40px auto;
    border: 1px solid #DEDEDE;
}
.btn {
    margin: 0 15px;
}
</style>
