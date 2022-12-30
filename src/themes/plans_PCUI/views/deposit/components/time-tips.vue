<template>
    <div class='time-tips'>
        <van-icon class='clock' name='clock' />
        <p v-if='(timeList.length > 0)' class='text'>
            {{ $t('deposit.timeTip1') }}
            <span v-for='(item, index) in timeList' :key='index'>
                {{ item }}
                <span v-if='timeList.length - 1 !== index'>
                    ,
                </span>
            </span>
        </p>
        <p v-else class='text'>
            {{ $t('deposit.timeTip2') }}
        </p>
    </div>
</template>

<script>
export default {
    props: {
        // 时间列表数据
        timeList: {
            type: Array,
            default: () => []
        }
    }
}
</script>

<style lang="scss" scoped>
.time-tips {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 450px;
    padding: rem(50px) 0;
    background: var(--contentColor);
    border-radius: rem(16px);
    .clock {
        font-size: rem(100px);
        color: var(--normalColor);
    }
    .text {
        margin-top: rem(30px);
    }
}
</style>
