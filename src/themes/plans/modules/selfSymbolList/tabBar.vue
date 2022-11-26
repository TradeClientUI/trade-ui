<template>
    <div class='titleBar'>
        <van-dropdown-menu>
            <van-dropdown-item
                ref='dropdownItem'
                v-model='displayType'
                :options='displayTypeOptions'
                @change='handleDisplayTypeChange'
            />
        </van-dropdown-menu>
        <div class='sortTypeWrap' :class='sortIcon' @click='handleSortTypeClick'>
            <span>{{ sortTypeText }}</span>
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
export default {
    props: ['dType', 'sType'],
    emits: ['sort', 'update:dType', 'update:sType'],
    setup (props, { emit }) {
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            sortType: 1,
            sortTypeOptions: [
                { text: t('selfSymbol.sortDefault'), value: 1 },
                { text: t('selfSymbol.sortIncrease'), value: 2 },
                { text: t('selfSymbol.sortDecline'), value: 3 },
            ],
            displayType: props.dType || 2,
            displayTypeOptions: [
                { text: t('selfSymbol.changePoints'), value: 1 },
                { text: t('selfSymbol.changePrice'), value: 2 },
            ],
        })
        // 排序方式
        const enumObj = {
            1: 'default',
            2: 'up',
            3: 'down',
        }
        const sortIcon = computed(() => enumObj[state.sortType])
        const sortTypeText = computed(() => state.sortTypeOptions.find(el => el.value === state.sortType).text)
        // 切换排序方式
        const handleSortTypeClick = () => {
            const newSortType = state.sortType + 1
            const target = state.sortTypeOptions.find(item => item.value === newSortType)
            if (target) {
                state.sortType = target.value
            } else {
                state.sortType = state.sortTypeOptions[0].value
            }
            emit('update:sType', state.sortType)
        }

        // 切换显示点或者价格
        const handleDisplayTypeChange = (val) => {
            emit('update:dType', val)
        }
        return {
            ...toRefs(state),
            sortIcon,
            sortTypeText,
            handleSortTypeClick,
            handleDisplayTypeChange,
        }
    }

}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.titleBar {
    display: flex;
    justify-content: space-between;
    height: rem(76px);
    padding: 0 rem(30px);
    color: var(--minorColor);
    line-height: rem(76px);
    background: var(--bgColor);
    .van-dropdown-menu {
        height: auto;
        background: none;
        &::after {
            border: none;
        }
        :deep(.van-dropdown-menu__title) {
            color: rgba(153, 153, 153, 1);
            font-size: rem(24px);
        }
        :deep(.van-dropdown-menu__bar) {
            height: 100%;
            background: none;
            box-shadow: none;
            .van-dropdown-menu__item:active {
                opacity: 1;
            }
        }
        :deep(.van-dropdown-item__option--active) {
            color: #1989FA;
            .van-dropdown-item__icon {
                color: #1989FA;
            }
        }
    }
    .sortTypeWrap {
        position: relative;
        padding-right: rem(26px);
        color: rgba(153, 153, 153, 1);
        font-size: rem(24px);
        cursor: pointer;
        &::after {
            position: absolute;
            top: 50%;
            right: 0;
            display: block;
            width: rem(20px);
            height: rem(20px);
            transform: translateY(-50%);
            content: '';
        }
        &.default::after {
            background: url('../../images/moren_default.png') transparent center center no-repeat;
            background-size: rem(20px) auto;
        }
        &.up {
            color: rgb(71, 127, 211);
            &::after {
                background: url('../../images/moren_up.png') transparent center center no-repeat;
                background-size: rem(20px) auto;
            }
        }
        &.down {
            color: rgb(71, 127, 211);
            &::after {
                background: url('../../images/moren_down.png') transparent center center no-repeat;
                background-size: rem(20px) auto;
            }
        }
    }
}
</style>
