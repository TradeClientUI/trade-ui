<template>
    <div class='playType'>
        <van-tabs v-if='reRender' v-model:active='active' class='tabs' :data='active' :swipe-threshold='1'>
            <van-tab v-for='item in plansList' :key='item.id' :name='item.id' :title='item.name' />
        </van-tabs>
    </div>
</template>

<script>
import { computed, ref, nextTick } from 'vue'
import { useStore } from 'vuex'

export default {
    props: {
        value: {
            type: [Number, String],
            default: ''
        },
        list: {
            type: [Array],
            default: null
        }
    },
    setup (props, context) {
        const store = useStore()

        // 玩法列表
        const plansList = computed(() => props.list || store.state._base.plans)
        const active = computed({
            get: () => props.value,
            set: (val) => context.emit('change', val)
        })

        const reRender = ref(true)

        const reset = () => {
            reRender.value = false
            nextTick(() => {
                reRender.value = true
            })
        }

        return {
            props,
            active,
            plansList,
            reRender,
            reset
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.playType {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    height: rem(100px);
    padding-right: rem(30px);
    background-color: var(--contentColor);
    border: 1px solid var(--bgColor);
    // .item {
    //     margin-left: rem(55px);
    //     color: var(--minorColor);
    //     font-weight: bold;
    //     font-size: rem(28px);
    //     white-space: nowrap;
    //     &:first-child {
    //         margin-left: 0;
    //     }
    //     &.active {
    //         color: var(--color);
    //         font-weight: bold;
    //         font-size: rem(38px);
    //     }
    // }
    .tabs {
        :deep(.van-tab) {
            margin-left: rem(55px);
            padding: 0;
            font-weight: bold;
            font-size: rem(28px);
            &:first-child {
                margin-left: 0;
            }
            .van-tab__text {
                color: var(--minorColor);
            }
        }
        :deep(.van-tab--active) {
            font-weight: bold;
            font-size: rem(38px);
            .van-tab__text {
                color: var(--color);
            }
        }
        :deep(.van-tabs__line) {
            display: none;
        }
    }
}
</style>
