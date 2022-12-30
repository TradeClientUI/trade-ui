import { useDark } from '@vueuse/core'
import { useToggle } from '@vueuse/shared'

export const isDark = useDark()
export const toggleDark = useToggle(isDark)
