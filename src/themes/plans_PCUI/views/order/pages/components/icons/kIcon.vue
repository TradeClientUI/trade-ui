<template>
    <span class='icon'>
        <template v-if='value===1'>
            <svg height='28' viewBox='0 0 28 28' width='28' xmlns='http://www.w3.org/2000/svg'>
                <g fill='none' stroke='currentColor' stroke-linecap='square'>
                    <path d='M10.5 7.5v15M7.5 20.5H10M13.5 11.5H11M19.5 6.5v15M16.5 9.5H19M22.5 16.5H20' />
                </g>
            </svg>
        </template>
        <template v-else-if='value===2'>
            <svg fill='currentColor' height='28' viewBox='0 0 28 28' width='28' xmlns='http://www.w3.org/2000/svg'>
                <path
                    d='M17 11v6h3v-6h-3zm-.5-1h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z'
                />
                <path d='M18 7h1v3.5h-1zm0 10.5h1V21h-1z' />
                <path
                    d='M9 8v12h3V8H9zm-.5-1h4a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5z'
                />
                <path d='M10 4h1v3.5h-1zm0 16.5h1V24h-1z' />
            </svg>
        </template>
        <template v-else-if='value===3'>
            <svg fill='currentColor' height='28' viewBox='0 0 28 28' width='28' xmlns='http://www.w3.org/2000/svg'>
                <path
                    d='M17 11v6h3v-6h-3zm-.5-1h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z'
                />
                <path d='M18 7h1v3.5h-1zm0 10.5h1V21h-1z' />
                <path
                    d='M9 8v11h3V8H9zm-.5-1h4a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-12a.5.5 0 0 1 .5-.5z'
                />
                <path
                    d='M10 4h1v5h-1zm0 14h1v5h-1zM8.5 9H10v1H8.5zM11 9h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11z'
                />
            </svg>
        </template>
        <template v-else-if='value===4'>
            <svg fill='currentColor' height='28' viewBox='0 0 28 28' width='28' xmlns='http://www.w3.org/2000/svg'>
                <path
                    d='M9 8v12h3V8H9zm-1-.502C8 7.223 8.215 7 8.498 7h4.004c.275 0 .498.22.498.498v13.004a.493.493 0 0 1-.498.498H8.498A.496.496 0 0 1 8 20.502V7.498z'
                />
                <path d='M10 4h1v3.5h-1z' />
                <path
                    d='M17 6v6h3V6h-3zm-1-.5c0-.276.215-.5.498-.5h4.004c.275 0 .498.23.498.5v7c0 .276-.215.5-.498.5h-4.004a.503.503 0 0 1-.498-.5v-7z'
                />
                <path d='M18 2h1v3.5h-1z' />
            </svg>
        </template>
        <template v-else-if='value===5'>
            <svg height='28' viewBox='0 0 28 28' width='28' xmlns='http://www.w3.org/2000/svg'>
                <path
                    d='M11.982 16.689L17.192 12h3.033l4.149-4.668-.748-.664L19.776 11h-2.968l-4.79 4.311L9 12.293l-4.354 4.353.708.708L9 13.707z'
                    fill='currentColor'
                />
            </svg>
        </template>
        <template v-else-if='value===6'>
            <svg fill='currentColor' height='28' viewBox='0 0 28 28' width='28' xmlns='http://www.w3.org/2000/svg'>
                <path
                    d='M12.5 17.207L18.707 11h2l3.647-3.646-.708-.708L20.293 10h-2L12.5 15.793l-3-3-4.854 4.853.708.708L9.5 14.207z'
                />
                <path
                    d='M9 16h1v1H9zm1 1h1v1h-1zm-1 1h1v1H9zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1H9zm2 0h1v1h-1zm-3-3h1v1H8zm-1 1h1v1H7zm-1 1h1v1H6zm2 0h1v1H8zm-1 1h1v1H7zm-2 0h1v1H5zm17-9h1v1h-1zm1-1h1v1h-1zm0 2h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-5-7h1v1h-1zm2 0h1v1h-1zm1-1h1v1h-1zm-2 2h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-2-6h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-3-3h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1z'
                />
            </svg>
        </template>
        <template v-else-if='value===7'>
            <svg height='28' viewBox='0 0 28 28' width='28' xmlns='http://www.w3.org/2000/svg'>
                <g fill='none' stroke='currentColor'>
                    <path d='M4 14.5h22' stroke-dasharray='1 1' />
                    <path d='M7.5 12.5l2-4 1 2 2-4 3 6' stroke-linecap='round' stroke-linejoin='round' />
                    <path d='M5.5 16.5l-1 2' stroke-linecap='round' />
                    <path d='M17.5 16.5l2 4 2-4m2-4l1-2-1 2z' stroke-linecap='round' stroke-linejoin='round' />
                </g>
            </svg>
        </template>
        <template v-else-if='value===8'>
            <svg
                class='icon'
                p-id='1428'
                t='1590479572150'
                version='1.1'
                height='16'
                viewBox='0 0 1024 1024'
                fill='currentColor'
                width='16'
                xmlns='http://www.w3.org/2000/svg'
                xmlns:xlink='http://www.w3.org/1999/xlink'
            >
                <path
                    d='M147.911 876.089v-800.995h-72.818v800.995h-0.182v72.818h873.813v-72.818h-800.814z'
                    p-id='1429'
                />
                <path
                    d='M622.137 657.271l-209.078-184.047-139.537 175.218-56.98-45.329 187.324-235.11 210.352 185.322 282.533-337.783 55.796 46.785-330.411 394.945z'
                    p-id='1430'
                />
            </svg>
        </template>
    </span>
</template>

<script>
export default {
    props: {
        value: {
            type: Number,
            default: 1
        }
    }
}
</script>

<style lang="scss" scoped>
svg {
    width: 22px;
    vertical-align: middle;
}
</style>
