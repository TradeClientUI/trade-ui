<template>
    <van-popup v-model:show='show' position='left' :style="{ height: '100%' }" @click-overlay='popClose' @update:modelValue='updateSearchKey'>
        <div class='switchProductContainer'>
            <div class='topSearch'>
                <van-search v-model='fakeKey' :placeholder='$t("search.keywords")' />
            </div>
            <div class='productsList'>
                <p class='dt'>
                    名称代码
                </p>
                <transition-group
                    class='transitionContainer'
                    :css='false'
                    name='productCell'
                    tag='ul'
                    @before-enter='beforeEnter'
                    @enter='enter'
                    @leave='leave'
                >
                    <li v-for='(item,i) in productList' :key='item.symbolId' class='dd item' :data-index='i'>
                        <p class='symbolName'>
                            {{ item.symbolName }}
                        </p>
                        <p class='symbolCode'>
                            {{ item.symbolCode }}
                        </p>
                    </li>
                </transition-group>
            </div>
        </div>
    </van-popup>
</template>

<script>
import { computed, reactive, toRefs, watchEffect } from 'vue'
import { useStore } from 'vuex'
import gsap from 'gsap'
import { debounce } from '@/utils/util'
export default {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const store = useStore()
        const state = reactive({
            show: true,
            fakeKey: '',
            searchKey: '',
        })
        const productList = computed(() => {
            const allList = store.state._quote.productList
            // return allList
            if (!state.searchKey) return allList
            const resultList = allList.filter(el => {
                const searchContent = el.symbolName + el.symbolCode
                return searchContent.toLowerCase().includes(state.searchKey.toLowerCase())
            })
            return resultList
        })
        watchEffect(() => {
            if (props.modelValue !== state.show) state.show = props.modelValue
        })

        // 防抖处理搜索输入框输入效果，vant update:model-value事件无效
        const updateSearchKey = debounce((val) => {
            state.searchKey = val
        })
        watchEffect(() => {
            updateSearchKey(state.fakeKey)
        })

        const popClose = () => {
            emit('update:modelValue', false)
        }
        const beforeEnter = (el) => {
            el.style.opacity = 0
            el.style.height = 0
        }
        const enter = (el, done) => {
            gsap.to(el, {
                opacity: 1,
                height: 'auto',
                delay: 0,
                onComplete: done
            })
        }
        const leave = (el, done) => {
            gsap.to(el, {
                opacity: 0,
                height: 0,
                delay: 0,
                onComplete: done
            })
        }
        return {
            ...toRefs(state),
            productList,
            popClose,
            updateSearchKey,
            beforeEnter,
            enter,
            leave,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.switchProductContainer {
    width: rem(500px);
    .productsList {
        margin-top: rem(20px);
        .dt {
            color: var(--minorColor);
            font-size: rem(22px);
        }
        .dt,
        .dd {
            padding: rem(20px);
            border-bottom: 1px solid var(--bgColor);
        }
    }
    .symbolName {
        font-size: rem(30px);
        line-height: 1.5;
    }
    .symbolCode {
        color: var(--minorColor);
        font-size: rem(24px);
    }
}

</style>
