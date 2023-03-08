<template>
    <div class='bannerProfitsAmount'>
        <div class='left'>
            <p class='amount'>
                $ {{ profit.val.value }}
            </p>
            <p class='desc'>
                Total profits from Products
            </p>
        </div>
        <div class='right'>
            <p class='amount'>
                700+ Products
            </p>
            <p class='desc'>
                Being tracked
            </p>
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'
import dayjs from 'dayjs'
import { toFixed } from '@/utils/calculation'

const beatNum = (intialVal = 2000000, x = 3.9, decimals = 2) => {
    const val = ref(intialVal)
    const startDateTime = dayjs.utc('2022-06-01').unix()
    // 根据当前时区
    const setVal = () => {
        const curDateTime = dayjs().unix()
        const diffTime = curDateTime - startDateTime
        const result = toFixed(intialVal + diffTime * x / 10, decimals)
        val.value = result.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    setVal()

    // 定时计算
    const timer = setInterval(() => {
        setVal()
    }, 1000)

    return {
        val,
        timer
    }
}
const profit = beatNum(2000000, 3.9)
const funds = beatNum(50, 0.05, 0)
const nav = beatNum(10, 0.03)

onBeforeUnmount(() => {
    clearInterval(profit.timer)
    clearInterval(funds.timer)
    clearInterval(nav.timer)
})
</script>

<style lang="scss" scoped>
.bannerProfitsAmount {
    margin-top: 48px;
    width: 720px;
    display: flex;
    justify-content: space-between;
    white-space: nowrap;
    .left,
    .right {
        flex: 1;
    }
    .center {
        flex: 1;
        text-align: center;
    }
    .amount {
        line-height: 1;
        font-size: 40px;
        color: #111;
        font-family: 'Poppins', 'sans-serif';
        font-weight: 700;
    }
    .desc {
        margin-top: 8px;
        font-size: 16px;
        color: var(--normalColor);
    }
}
</style>
