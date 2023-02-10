<template>
    <div class='wifi-symbol'>
        <div class='wifi-circle first'></div>
        <div class='wifi-circle second'></div>
        <div class='wifi-circle third'></div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.wifi-symbol {
    width: 40px;
    height: 40px;
    position: relative;
    overflow: hidden;
}
.wifi-circle {
    border-radius: 999px;
    position: absolute;
    border: 4px solid #DF4506;
    animation: run1 1s linear infinite;
    &.first {
        width: 8px;
        height: 8px;
        bottom: -4px;
        left: -4px;
    }
    &.second {
        width: 28px;
        height: 28px;
        bottom: -14px;
        left: -14px;
        animation-name: run2;
    }
    &.third {
        width: 48px;
        height: 48px;
        bottom: -24px;
        left: -24px;
        animation-name: run3;
    }
}

@keyframes run1 {
    0% {
        opacity: 0;
    }
    25% {
        opacity: 1;
    }
    50% {
        opacity: 1;
    }
    75% {
        opacity: 1;
    }
    100% {
        opacity: 1;
    }
}

@keyframes run2 {
    0% {
        opacity: 0;
    }
    25% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    75% {
        opacity: 1;
    }
    100% {
        opacity: 1;
    }
}

@keyframes run3 {
    0% {
        opacity: 0;
    }
    25% {
        opacity: 0;
    }
    50% {
        opacity: 0;
    }
    75% {
        opacity: 1;
    }
    100% {
        opacity: 1;
    }
}
</style>
