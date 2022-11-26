<template>
    <div :class="['scroll-pane', { 'showAll': showAllFlag }]">
        <!-- <div class='arrow-content left-icon-content' @click="scollByIcon('left')">
            <i class='ic-arrow el-icon-arrow-left'></i>
        </div> -->
        <div
            ref='container'
            class='scroll-container'
        >
            <div ref='contentScroll' class='scoll-slot'>
                <!-- <slot></slot> -->
                <span
                    class='scItem'
                    :class='{ "current": activeMarket === "all" }'
                    @click='switchMarket("all")'
                >
                    All Networks
                </span>

                <span
                    v-for='item in marketTypeList'
                    :key='item'
                    class='scItem'
                    :class='{ "current": activeMarket === item }'
                    @click='switchMarket(item)'
                >
                    <img alt='#' class='currencyIcon' :src='"/images/markets/"+ item.marketName.toLowerCase() +".svg"' />
                    <span>{{ item.marketName }} Market</span>
                    <span v-if='item.networkType === 2' class='testnet'>
                        <span class='text'>
                            {{ item.networkName.substr(0,1) }}
                        </span>
                    </span>
                </span>
            </div>
        </div>
        <!-- <div class='arrow-content right-icon-content' @click="scollByIcon('right')">
            <i class='ic-arrow el-icon-arrow-right'></i>
        </div>
        <span class='showAllIco' @click='showAll'>
            <i class='el-icon-more'></i>
        </span> -->
    </div>
</template>

<script>
import { computed, reactive, watch, toRefs, ref, onMounted, provide } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { localGet } from '@/utils/util'

export default {
    // components: { },
    props: ['show', 'markets'],
    setup (props, context) {
        const store = useStore()
        const state = reactive({
            loading: false,
            dialogShow: props.show,
            isSubmit: false,
            data: props.markets,
            showLeftIcon: false,
            showRightIcon: false,
            topTitle: 'Quick Trade',
            showAllFlag: 0,
            activeMarket: 'all',
        })

        const container = ref(null)

        watch(
            () => [props.show, props.markets],
            (val) => {
                state.data = props.markets
            }
        )

        // web3连接信息
        const _web3 = computed(() => store.state._web3)
        const marketTypeList = computed(() => {
            if (_web3.value.testnetMode) {
                return state.data.filter(el => el.networkType === 2)
            } else {
                return state.data.filter(el => el.networkType === 1)
            }
        })

        watch(() => _web3.value.testnetMode, val => {
            state.activeMarket = 'all'
            context.emit('switchMarket', 'all')
        })

        const closeFn = () => {

        }
        const contentScroll = ref(null)

        const scollByIcon = (direction) => {
            console.log(contentScroll.value)

            // 每一个列表的高度
            const offsetWidth = container.value.clientWidth
            if (direction === 'right') {
                container.value.scrollLeft += offsetWidth
            } else {
                container.value.scrollLeft -= offsetWidth
            }
        }

        const showAll = () => {
            const sf = state.showAllFlag
            state.showAllFlag = sf ? 0 : 1
        }

        const switchMarket = name => {
            state.activeMarket = name
            context.emit('switchMarket', name)
        }

        onMounted(() => {
            console.log(contentScroll.value)
        })

        return {
            ...toRefs(state),
            closeFn,
            showAll,
            scollByIcon,
            switchMarket,
            container,
            marketTypeList
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.scroll-pane {
    position: relative;
    width: 100%;
    height: auto;
    margin-top: 20px;
    overflow: hidden;
    .arrow-content {
        display: inline-block;
        box-sizing: border-box;
        width: 26px;
        height: 26px;
        margin-top: -13px;
        line-height: 26px;
        text-align: center;
        vertical-align: middle;
        background: #FFF;
        border: 1px solid #D8DCE5;
        border-radius: 4px;
        .ic-arrow {
            color: #666;
            font-size: 14px;
        }
        &:hover {
            cursor: pointer;
            .ic-arrow {
                color: var(--el-color-primary) !important;
            }
        }
        &.el-icon-arrow-left {
            transform: rotate(180deg);
        }
    }
    .right-icon-content {
        margin-right: 10px;
        cursor: pointer;
    }
    .scroll-container {
        position: relative;
        display: inline-block;
        //margin: 0 10px;
        vertical-align: middle;
        &::-webkit-scrollbar {
            width: 10px;
            height: 2px;
        }
        &::-webkit-scrollbar-thumb {
            background: #CFCBCB;
            border-radius: 10px;
        }
        &::-webkit-scrollbar-track {
            background: #EDEDED;
            border-radius: 10px;
            cursor: pointer;
        }
        .scoll-slot {
            display: block;
            width: auto;
            padding: 10px 0;
        }
        .scItem {
            position: relative;
            display: inline-block;
            margin: 0 10px 0 0;
            margin-bottom: 10px;
            padding: 0 18px;
            font-weight: normal;
            font-size: 14px;
            line-height: 40px;
            border: 1px solid var(--lineColor);
            border-radius: 20px;
            transition: 0.2s;
            &:hover {
                background-color: var(--assistColor);
                border: 1px solid var(--assistColor);
                cursor: pointer;
            }
            img {
                display: inline-block;
                width: 23px;
                margin-right: 5px;
                vertical-align: middle;
                border-radius: 100%;
            }
            &.current {
                font-weight: bold;
                background: #F2F7FB;
            }
            .testnet {
                position: absolute;
                bottom: 5px;
                left: 34px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 13px;
                height: 13px;
                color: rgb(255, 255, 255);
                font-size: 11px;
                line-height: 13px;
                background-color: rgb(41, 182, 246);
                border-radius: 50%;
                -webkit-box-align: center;
                -webkit-box-pack: center;
                .text {
                    transform: scale(0.7);
                }
            }
        }
    }
    .showAllIco {
        cursor: pointer;
    }
    &.showAll {
        .arrow-content {
            display: none;
        }
        .scroll-container {
            overflow: auto;
            white-space: inherit;
        }
        .scroll-container {
            width: 920px;
        }
    }
}
</style>
