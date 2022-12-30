<template>
    <i
        class='icon'
        :class="theme === 'light' ? 'icon_zhuanhuanchengheiye' : 'icon_zhuanhuanchengbaitian'"
        :title="$t('header.theme')"
        @click='changeTheme'
    ></i>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import Colors, { setRootVariable } from '@planspc/colorVariables'
import { localGet } from '@/utils/util'

export default {
    setup () {
        const store = useStore()
        const state = reactive({
            theme: localGet('invertColor')
        })

        // 切换白天黑夜模式主题
        const changeTheme = () => {
            state.theme = localGet('invertColor') === 'light' ? 'night' : 'light'
            // 设置全局变量
            store.commit('Update_invertColor', state.theme)
            setRootVariable(state.theme)
            document.body.style.setProperty('--color', Colors[state.theme].color)
            document.body.style.setProperty('--contentColor', Colors[state.theme].contentColor)
            document.body.style.setProperty('--primaryAssistColor', Colors[state.theme].primaryAssistColor)
            document.body.style.setProperty('--bgColor', Colors[state.theme].bgColor)
            document.body.style.setProperty('--normalColor', Colors[state.theme].normalColor)
            document.body.style.setProperty('--minorColor', Colors[state.theme].minorColor)
            document.body.style.setProperty('--lineColor', Colors[state.theme].lineColor)
            document.body.style.setProperty('--assistColor', Colors[state.theme].assistColor)
            document.body.style.setProperty('--placeholdColor', Colors[state.theme].placeholdColor)

            const event = new CustomEvent('Launch_theme', { detail: state.theme })
            document.body.dispatchEvent(event)
        }

        return {
            changeTheme,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.icon {
    font-size: 16px;
    color: #D6DAE1;
    cursor: pointer;
}
</style>
