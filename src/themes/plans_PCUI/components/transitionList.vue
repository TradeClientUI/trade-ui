<template>
    <transition-group
        :css='false'
        @before-enter='beforeEnter'
        @enter='enter'
        @leave='leave'
    >
        <slot></slot>
    </transition-group>
</template>

<script>
import gsap from 'gsap'

export default {
    setup () {
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
            beforeEnter,
            enter,
            leave
        }
    }
}
</script>
