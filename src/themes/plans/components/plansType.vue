<template>
    <div v-if='plansList.length > 1' class='playType'>
        <van-tabs v-if='reRender' v-model:active='active' class='tabs' :data='active' :swipe-threshold='1'>
            <van-tab v-for='item in plansList' :key='item.id' :name='item.id' :title='item.name' />
        </van-tabs>
    </div>
</template>

<script>
import { computed, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { getCookie } from '@/utils/util'
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
        const { t } = useI18n({ useScope: 'global' })

        // 玩法列表
        const plansList = computed(() => {
            const lang = getCookie('lang') || store.state._base.wpCompanyInfo.language
            const tradeTypesConfig = store.state._base.wpCompanyInfo.tradeTypesConfig
            const tradeTypes = props.list || store.state._base.plans.map(el => (el.name = t('tradeType.' + el.tradeType), el))
            console.log('tradeTypes', tradeTypes)
            if (store.state._base.wpCompanyInfo.tradeTypesConfig) {
                const tradeTypesEnum = store.state._base.wpCompanyInfo.tradeTypesConfig[lang]
                for (const key in tradeTypesEnum) {
                    const arr = tradeTypes.forEach(el => {
                        if (el.id == key) {
                            if (tradeTypesEnum[key]) { // 为空的值视为没有设置别名还是取原来默认的名字
                                el.name = tradeTypesEnum[key]
                            }
                        }
                    })
                }
            }
            return tradeTypes
        })
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
    padding-top: rem(10px);
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    height: rem(110px);
    padding-right: rem(30px);
    padding-left: rem(20px);
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
        width: 100%;
        :deep(.van-tab) {
            margin-left: rem(55px);
            padding: 0;
            font-weight: bold;
            font-size: rem(32px);
            position: relative;
            top: rem(-6px);
            &:first-child {
                margin-left: 0;
            }
            .van-tab__text {
                color: var(--minorColor);
            }
        }
        :deep(.van-tab--active) {
            font-weight: bold;
            font-size: rem(48px);
            position: relative;
            top: rem(-10px);
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
