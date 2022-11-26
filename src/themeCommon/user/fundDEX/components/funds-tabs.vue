<template>
    <div class='funds-tabs'>
        <div :class="['item', { 'active': route.name === 'Earning' }]" @click="switchRouter('/earning')">
            <svg
                class='svg-icon'
                fill='currentColor'
                stroke='currentColor'
                stroke-width='0'
                viewBox='0 0 576 512'
                xmlns='http://www.w3.org/2000/svg'
            >
                <path d='M560 224h-29.5c-8.8-20-21.6-37.7-37.4-52.5L512 96h-32c-29.4 0-55.4 13.5-73 34.3-7.6-1.1-15.1-2.3-23-2.3H256c-77.4 0-141.9 55-156.8 128H56c-14.8 0-26.5-13.5-23.5-28.8C34.7 215.8 45.4 208 57 208h1c3.3 0 6-2.7 6-6v-20c0-3.3-2.7-6-6-6-28.5 0-53.9 20.4-57.5 48.6C-3.9 258.8 22.7 288 56 288h40c0 52.2 25.4 98.1 64 127.3V496c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16v-48h128v48c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16v-80.7c11.8-8.9 22.3-19.4 31.3-31.3H560c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16zm-128 64c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zM256 96h128c5.4 0 10.7.4 15.9.8 0-.3.1-.5.1-.8 0-53-43-96-96-96s-96 43-96 96c0 2.1.5 4.1.6 6.2 15.2-3.9 31-6.2 47.4-6.2z' />
            </svg>
            <span>Earning</span>
        </div>
        <div :class="['item', { 'active': route.name === 'IndexFunds' }]" @click="switchRouter('/indexFunds')">
            <svg
                class='svg-icon'
                fill='currentColor'
                stroke='currentColor'
                stroke-width='0'
                viewBox='0 0 1024 1024'
                xmlns='http://www.w3.org/2000/svg'
                xmlns:xlink='http://www.w3.org/1999/xlink'
            >
                <path d='M515 376.29c-74.61 0-135.31 60.69-135.31 135.3S440.43 646.9 515 646.9s135.31-60.7 135.31-135.31-60.66-135.3-135.31-135.3z m0 221.16a85.86 85.86 0 1 1 0-171.71 85.86 85.86 0 1 1 0 171.71z' p-id='6121' /><path d='M926.42 482.63h-66.85V203.78a36.76 36.76 0 0 0-36.72-36.72H534.36V108h-51.73v59.07h-275.4a36.77 36.77 0 0 0-36.73 36.72v286.27H98v51.72h72.5V819.4a36.78 36.78 0 0 0 36.73 36.73h282.83v70.29h51.72v-70.29h281.07a36.77 36.77 0 0 0 36.72-36.73v-285h66.85z m-116.3 324H541.78v-40.21h-51.72v40.26H220v-264.9h38v-51.72h-38V216.51h262.63V268h51.73v-51.49h275.76v266.12h-43.7v51.73h43.7z' p-id='6122' />
            </svg>
            <span>Index Funds</span>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 切换路由
const switchRouter = (value) => {
    if (value === route.path) return
    router.replace({ path: value })
}
</script>

<style lang="scss" scoped>
.funds-tabs {
    display: none;
    height: 50px;
    padding: 0 15px;
    background: var(--contentColor);
    border-bottom: 1px solid var(--lineColor);
    .item {
        display: inline-flex;
        align-items: center;
        height: 100%;
        margin-right: 15px;
        color: var(--minorColor);
        cursor: pointer;
        .svg-icon {
            width: 20px;
            height: 20px;
        }
        span {
            margin-left: 5px;
        }
    }
    .active {
        color: var(--primary);
        border-bottom: 3px solid var(--primary);
    }
    @media (max-width: 768px) {
        display: flex;
        align-items: center;
    }
}
</style>
