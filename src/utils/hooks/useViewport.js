import { ref, onMounted, onUnmounted } from 'vue'

// 实时监听屏幕视口宽度hooks
export function useViewport () {
    const bodyWidth = ref(window.innerWidth)
    const bodyHeight = ref(window.innerHeight)
    function update (e) {
        bodyWidth.value = window.innerWidth
        bodyHeight.value = window.innerHeight
    }
    onMounted(() => {
        window.addEventListener('resize', update)
    })

    onUnmounted(() => {
        window.removeEventListener('resize', update)
    })
    return { bodyWidth, bodyHeight }
}
