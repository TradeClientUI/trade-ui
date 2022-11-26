<template>
    <span class='iconWrapper'>
        <i v-if='disabledSuccAnimtion || successIconAnimated' class='van-icon van-icon-success successColorBg'></i>
        <svg
            class='svg'
            version='1.1'
            viewBox='0 0 60 60'
            xmlns='http://www.w3.org/2000/svg'
            xmlns:xlink='http://www.w3.org/1999/xlink'
        >
            <g fill='none' fill-rule='evenodd' stroke='none' stroke-width='1'>
                <g id='Artboard' stroke='#10b873' stroke-width='3'>
                    <circle class='Oval animate-oval' cx='30' cy='30' r='28' />
                    <path
                        class='animate-check'
                        d='M44.5038705,21.7819773 L23.5895375,41.995235 L13.5270395,31.313432 C11.6014933,28.2666192 9.4997705,26.7432128 7.22187102,26.7432128 C3.19361944,26.7432128 2.00387054,30 2.00387054,30 C1.74465551,44.5862972 14.5398975,58 30.0038705,58 C45.4678435,58 58.0038705,45.463973 58.0038705,30 C58.0038705,22.2901599 54.8877913,15.3081191 49.8463524,10.2445972'
                        stroke-dasharray='168'
                        stroke-dashoffset='-168'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                    />
                </g>
            </g>
        </svg>
    </span>
</template>

<script>
export default {
    props: ['disabledSuccAnimtion'],
    data () {
        return {
            successIconAnimated: false
        }
    },
    mounted () {
        this.timer = setTimeout(() => {
            this.successIconAnimated = true
        }, 800)
    },
    beforeUnmount () {
        if (this.timer) clearTimeout(this.timer)
        this.$store.commit('UPDATE_disabledSuccAnimtion', true)
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/animations.scss';
@import '~@/sass/mixin.scss';
.iconWrapper {
    position: relative;
    .van-icon-success {
        position: absolute;
        width: rem(90px);
        height: rem(90px);
        color: #FFF;
        font-size: rem(70px);
        line-height: rem(90px);
        border-radius: 50%;
        animation: AnimFadeIn 0.2s ease-in forwards;
    }
    .svg {
        width: rem(90px);
        height: rem(90px);
    }
    .successColorBg {
        background: var(--success);
    }
}
.animate-check {
    animation: check_animation 0.5s linear 0.3s forwards;
}
.animate-oval {
    transform-origin: 30px 30px;
    opacity: 0;
    animation: circle_animation 0.5s ease-in forwards;
    stroke-dasharray: 200px;
    stroke-dashoffset: 200;
}

@keyframes circle_animation {
    60% {
        opacity: 1;
    }
    100% {
        transform: rotate(40deg);
        opacity: 1;
        stroke-dasharray: 400px;
    }
}

@keyframes check_animation {
    0% {
        stroke-dasharray: 126;
        stroke-dashoffset: 126;
    }
    100% {
        stroke-dasharray: 45;
        stroke-dashoffset: 94;
    }
}
</style>
