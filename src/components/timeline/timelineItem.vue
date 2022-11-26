<template>
    <li class='timeline-item'>
        <div class='timeline-item-tail'></div>
        <span class='iconWrap'>
            <slot name='icon'>
                <span class='icon'></span>
            </slot>
        </span>
        <div class='timeline-item-content'>
            <slot></slot>
        </div>
    </li>
</template>

<script>
export default {
    setup () {
        return {}
    }
}
</script>

<style lang="scss" scoped>
.timeline-item {
    position: relative;
    margin: 0;
    margin-bottom: 20px;
    font-size: 14px;
    list-style: none;
    &:last-of-type .timeline-item-tail {
        display: none;
    }
    .timeline-item-tail {
        position: absolute;
        top: 10px;
        left: -1px;
        height: calc(100%);
        border-left: 2px solid var(--bdColor);
        transform: scaleX(0.5);
    }
    .iconWrap {
        position: absolute;
        top: 0.2em;
        left: 0;
        padding-bottom: 2px;
        background-color: #FFF;
        transform: translateX(-50%);
        .icon {
            position: absolute;
            top: 0.3em;
            width: 10px;
            height: 10px;
            color: #52C41A;
            border: 2px solid transparent;
            border-color: #52C41A;
            border-radius: 100px;
            transform: translateX(-50%);
        }
    }
    .timeline-item-content {
        position: relative;
        top: 0;
        margin: 0 0 0 20px;
        line-height: 1.5;
        word-break: break-word;
    }
}
</style>
