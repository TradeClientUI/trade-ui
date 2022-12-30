
<template>
    <section
        ref='barrageWrapper'
        class='barrage-wrapper'
        :style="{ height:percent+'%' }"
    >
        <div class='barrage-main'>
            <div
                ref='barrageMainDm'
                class='barrage-main-dm'
                :class="{ 'ani-pause':isPause,'ani-running':!isPause }"
            ></div>
        </div>
    </section>
</template>

<script>
import { onMounted, reactive, ref, toRefs, watch } from 'vue'
export default {
    components: {

    },
    props: {
        // 源数组
        arr: {
            type: Array,
            default: function () {
                return [
                    '这是一条有弹幕1',
                    '我是弹幕二'
                ]
            }
        },
        // 弹幕是否暂停状态
        isPause: {
            type: Boolean
        },
        // 弹幕占比
        percent: {
            type: Number,
            default: 80
        },
        // 速度
        speed: {
            type: Number,
            default: 50
        }
    },

    setup (props, context) {
        const barrageWrapper = ref(null)
        const barrageMainDm = ref(null)
        const state = reactive({
            // arr: props.arr,
            isPause: props.isPause,
            percent: props.percent,
            // 每行弹幕数最大值
            MAX_DM_COUNT: 5,
            // 行数
            CHANNEL_COUNT: 8,
            // 弹幕数组
            barrages: props.arr,
            // dom池
            domPool: [],
            // intervalDM
            intervalDM: null,
            // 取弹幕时间间隔
            interValTime: 500,
            // 滚动弹幕的通道
            hasPosition: [],
            // 顶部弹幕的通道
            hasTopPosition: [],
            // 弹幕容器
            barrageMainDm: null,
            // 弹幕容器宽度
            barMainWidth: 500,
            speed: 100 - props.speed, // 0-100
            // 自定义弹幕样式属性列表
            dmStyles: [
                'color',
                'fontSize'
            ]

        })

        watch(
            () => props.arr, list => {
                state.barrages = list
                console.log(list.length)
            },
            () => props.percent, val => {
                state.CHANNEL_COUNT = val / 10
            },
            () => props.speed, val => {
                state.speed = val
            }
        )

        const visibilitychangeFn = () => {
            // if (!document.hidden) {
            //     // 处于当前页面
            //     console.log(state.intervalDM)
            //     if (state.intervalDM === null) {
            //         state.isPause = true
            //     } else {
            //         playDm()
            //     }
            //     // playDm()
            //     console.log('进入页面，启动弹屏')
            // } else {
            //     console.log('离开页面，暂停弹屏')
            //     state.isPause = true
            //     // clearInterval(state.intervalDM)
            //     // state.intervalDM = null
            // }
            console.log(state.isPause)
        }

        const init = () => {
            // const wrapper = barrageMainDm
            // 先new一些div 重复利用这些DOM
            for (let j = 0; j < state.CHANNEL_COUNT; j++) {
                const doms = []
                for (let i = 0; i < state.MAX_DM_COUNT; i++) {
                    // 初始化dom
                    const dom = document.createElement('div')
                    // 初始化dom的位置 通过设置className
                    dom.className = 'barrage-item'
                    dom.style.transform = `translate3d(${state.barMainWidth}px,0,0)`
                    // DOM的通道是固定的 所以设置好top就不需要再改变了
                    dom.style.top = j * (state.barrageMainDm.clientHeight / state.CHANNEL_COUNT) + 'px'
                    // console.log(dom.style.top)
                    // 每次到animationend结束的时候 就是弹幕划出屏幕了 将DOM位置重置 再放回DOM池
                    dom.addEventListener('animationend', (e) => {
                        // 初始化dom样式
                        dom.className = 'barrage-item'
                        dom.style.transform = `translate3d(${state.barMainWidth}px,0,0)`
                        dom.style.animation = null
                        // 清空自定义样式
                        state.dmStyles.forEach(key => {
                            dom.style[key] = null
                        })
                        // state.domPool[j].push({ el: dom });
                        // 动画结束后设置当前dom为空闲状态
                        // console.log(i, j)
                        if (state.domPool[i][j]) {
                            state.domPool[i][j].isFree = false
                        }
                        // console.log(dom)
                    })
                    // 放入该通道的DOM池
                    doms.push({
                        row: j,
                        col: i,
                        el: dom,
                        isUse: false,
                        isFree: false
                    })
                }
                state.domPool.push(doms)
            }
            // hasPosition 标记每个通道目前是否有位置
            for (let i = 0; i < state.CHANNEL_COUNT; i++) {
                state.hasPosition[i] = true
                state.hasTopPosition[i] = true
            }
        }

        /**
         * 获取一个可以发射弹幕的通道 没有则返回-1
         */
        const getChannel = () => {
            for (let i = 0; i < state.CHANNEL_COUNT; i++) {
                if (state.hasPosition[i] && state.domPool[i].length) return i
            }
            return -1
        }

        /**
         * 获取一个可以发射顶部弹幕的通道 没有则返回-1
         */
        const getTopChannel = () => {
            for (let i = 0; i < state.CHANNEL_COUNT; i++) {
                if (state.hasTopPosition[i]) return i
            }
            return -1
        }

        /**
         * 根据DOM和弹幕信息 发射弹幕
         */
        const shootDanmu = (domItem, dmItem, channel) => {
            // 设置当前通道为false
            state.hasPosition[channel] = false
            // 获取dom
            const dom = domItem.el
            // 是否已经使用的dom
            if (!domItem.isUse && state.barrageMainDm) {
                domItem.isUse = true
                state.barrageMainDm.appendChild(domItem.el)
            }
            // 判断是否有自定义样式
            if (dmItem.style) {
                const keys = Object.keys(dmItem.style)
                const self = state
                keys.forEach(key => {
                    // 检查样式属性是否合法
                    const isStyle = state.dmStyles.includes(key)
                    if (isStyle) {
                        dom.style[key] = dmItem.style[key]
                    }
                })
            }
            domItem.isFree = true
            // 判断是否是js弹幕
            if (dmItem.isJs) {
                dom.innerHTML = dmItem.txt
            } else {
                let dmObj = null
                // dom.innerText = dmItem.txt
                if (dmItem.icon !== '') {
                    if (dmItem.link) {
                        dmObj = '<a href="' + dmItem.link + '" target="_blank">' + (dmItem.index ? dmItem.index + '.' : '') + "<img src='" + dmItem.icon + "' class='barrageIcon'/>" + dmItem.txt + '</a>'
                    } else {
                        dmObj = (dmItem.index ? dmItem.index + '.' : '') + "<img src='" + dmItem.icon + "' class='barrageIcon'/>" + dmItem.txt
                    }
                    dom.innerHTML = dmObj
                } else {
                    if (dmItem.link) {
                        dmObj = '<a href="' + dmItem.link + '" target="_blank">' + (dmItem.index ? dmItem.index + '.' : '') + dmItem.txt + '</a>'
                    } else {
                        dmObj = (dmItem.index ? dmItem.index + '.' : '') + dmItem.txt
                    }
                    dom.innerHTML = dmObj
                }
            }

            dom.addEventListener('animationend', () => {
                // state.barrageMainDm.removeChild(dom)
                state.hasTopPosition[channel] = true
            })
            // 设置弹幕的位置信息 性能优化 left -> transform
            // dom.style.transform = `translateX(${-dom.clientWidth}px)`;
            // dom.style.transform = `translate3d(${-dom.clientWidth}px,0,0)`; // css硬件加速
            dom.className = dmItem.isSelf ? 'barrage-item self-dm' : 'barrage-item'
            dom.style.animation = 'barrage-run ' + state.speed + 's linear'
            // 弹幕全部显示之后 才能开始下一条弹幕
            // 大概 dom.clientWidth * 10 的时间 该条弹幕就从右边全部划出到可见区域 再加1秒保证弹幕之间距离
            setTimeout(() => {
                state.hasPosition[channel] = true
            }, dom.clientWidth * 10 + 1000)
        }

        const shootTopDanmu = (dmItem, channel) => {
            // 设置当前通道为false
            state.hasTopPosition[channel] = false
            // 获取dom
            const dom = document.createElement('div')

            dom.className = dmItem.isSelf ? 'barrage-item top-item self-dm' : 'barrage-item top-item'
            // 判断是否有自定义样式
            if (dmItem.style) {
                const keys = Object.keys(dmItem.style)
                const self = state
                keys.forEach(key => {
                    // 检查样式属性是否合法
                    const isStyle = state.dmStyles.includes(key)
                    if (isStyle) {
                        dom.style[key] = dmItem.style[key]
                    }
                })
            }
            // 判断是否是js弹幕
            if (dmItem.isJs) {
                dom.innerHTML = dmItem.txt
                // dom.innerHTML = "<img src='" + dmItem.icon + "' class='barrageIcon'/>" + dmItem.txt
            } else {
                dom.innerText = dmItem.txt
                // dom.innerText = "<img src='" + dmItem.icon + "' class='barrageIcon'/>" + dmItem.txt
            }

            state.barrageMainDm.appendChild(dom) // 一定要在获取宽度和执行动画之前渲染dom

            dom.style.transform = `translate3d(${state.barMainWidth / 2 - (dom.clientWidth / 2)}px,${channel * dom.clientHeight}px,0)`
            dom.style.animation = 'barrage-fade 6s'
        }

        // 获取空闲通道中空闲的dom
        const getFreeChannelDom = (channel) => {
            let item
            item = state.domPool[channel].find(it => !it.isFree)
            return item
        }

        // 暂停弹幕
        const pauseDm = () => {
            if (state.intervalDM) {
                clearInterval(state.intervalDM)
                state.intervalDM = null
            }
        }

        // 播放弹幕
        const playDm = () => {
            // 每隔1ms从弹幕池里获取弹幕（如果有的话）并发射
            const self = state // 这里取一个self this 为了方便调试的时候看到this具体内容
            state.intervalDM = setInterval(() => {
                // 更新逻辑
                if (state.barrages.length > 0) {
                    let channel
                    let topChannel
                    const barrage = state.barrages.shift()
                    if (barrage.direction === 'top' && (topChannel = getTopChannel()) !== -1) {
                        shootTopDanmu(barrage, topChannel)
                    }
                    if (barrage.direction === 'default' && (channel = getChannel()) !== -1) {
                        const domItem = getFreeChannelDom(channel)
                        if (domItem) {
                            // let danmu = state.barrages.shift();
                            shootDanmu(domItem, barrage, channel)
                        }
                    }
                }
            }, state.interValTime)
        }

        const resizeBarrage = (event) => {
            console.log(event)
            state.barMainWidth = event.target.innerWidth
        }

        onMounted(() => {
            state.barrageMainDm = barrageMainDm.value
            // 缓存容器宽度
            state.barMainWidth = state.barrageMainDm.clientWidth
            // 初始化弹幕dom组
            init()
            // 开始播放弹幕
            playDm()
            // 注册页面监听器
            document.addEventListener('visibilitychange', visibilitychangeFn)
            // 监听浏览器窗口尺寸变化
            window.addEventListener('resize', resizeBarrage)
        })

        return {
            ...toRefs(state),
            visibilitychangeFn,
            init,
            getChannel,
            getTopChannel,
            shootDanmu,
            shootTopDanmu,
            getFreeChannelDom,
            pauseDm,
            playDm,
            barrageWrapper,
            barrageMainDm,
            resizeBarrage
        }
    }
}
</script>

<style  lang="scss">
.barrage-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    * {
        margin: 0;
        padding: 0;
    }
    .barrage-item {
        position: absolute;
        z-index: 99;
        display: inline-block;
        padding: 3px;
        color: #333;
        font-size: 14px;
        white-space: pre;
        // shadow: 0 0 10px #EEE;
        text-shadow: 0 0 10px #EEE;
        // pointer-events: none;
        // perspective: 500px;
        background: rgba(255, 255, 255, 0.6);
        border: 1px solid #4355FF;
        border-radius: 4px;
        cursor: pointer;
        opacity: 1;
        user-select: none; // 禁用选择文字
        will-change: transform;
        &:hover {
            z-index: 150;
            background: rgba(100, 214, 210, 0.6);
            transform: scale(1.1);
            animation-play-state: paused !important;
        }
        .barrageIcon {
            display: inline-block;
            width: 24px;
            height: 24px;
            margin-right: 5px;
            vertical-align: middle;
            border-radius: 100%;
        }
    }
    .top-item {
        z-index: 100;
    }
    .barrage-main {
        position: relative;
        /* border: 2px solid blue; */
        width: 100%;
        height: 100%;
        overflow: hidden;
        // background: #000;
    }
    .barrage-main-dm {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
}
.self-dm {
    box-sizing: border-box;
    border: 2px solid #87CEEB;
}

@keyframes barrage-run {
    0% {
        // transform: translate3d(500px, 0, 0);
    }
    100% {
        transform: translate3d(-100%, 0, 0);
    }
}

@keyframes barrage-fade {
    0% {
        visibility: visible;
        // opacity: 1;
    }
    100% {
        visibility: hidden;
        // opacity: 0;
    }
}
.ani-pause {
    & div {
        animation-play-state: paused !important;
    }
}
.ani-running {
    & div {
        animation-play-state: running !important;
    }
}
</style>
