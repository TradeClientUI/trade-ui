
<template>
    <div class='vita_dwt_fees'>
        <fees />
        <NewFooter />
    </div>
</template>

<script setup>
import NewFooter from '../../../layout/layoutBottom'
import fees from '@/themeCommon/user/fees.vue'

</script>

<style lang="scss" scoped>

.vita_dwt_fees {
    margin: 0 auto;
    width: 100vw;
    flex: 1;
    overflow-y: auto;
    .content-title {
        text-align: center;
        font-size: rem(48px);
        font-weight: 600;
        color: var(--primary);
        margin: rem(80px) 0 rem(48px);
    }
    .content-main {
        overflow: hidden;
        position: relative;
        padding-bottom: rem(80px);
        .main {
            overflow: hidden;
            overflow-x: scroll;
            .fees-table {
                width: 100%;
                margin: 0 auto;
                text-align: center;
                border-spacing: 0;
                font-size: rem(26px);
                color: var(--normalColor);
                height: rem(64px);
                line-height: rem(64px);
                th,
                td {
                    padding: 0 rem(34px);
                    white-space: nowrap;
                    &:first-child {
                        position: absolute;
                        left: 0;
                        z-index: 5;
                        width: rem(250px);
                    }
                    &:nth-child(2) {
                        padding-left: rem(250px);
                    }
                }
                th {
                    &:first-child {
                        background: var(--lineColor);
                    }
                }
                tr {
                    &:nth-child(odd) {
                        .tbody-td {
                            background: var(--contentColor);
                        }
                    }
                    &:nth-child(even) {
                        .tbody-td {
                            background: var(--lineColor);
                        }
                    }
                }
                .table-tr {
                    background: var(--lineColor);
                    font-size: rem(28px);
                    th {
                        font-weight: 500;
                    }
                }
                .table-td {
                    font-weight: 400;
                    &:nth-child(odd) {
                        background: var(--contentColor);
                    }
                    &:nth-child(even) {
                        background: var(--lineColor);
                    }
                }
            }
        }
    }
    .remarks {
        padding: rem(40px) rem(30px) 0;
        color: var(--color);
        .h2 {
            font-size: rem(30px);
            font-weight: 500;
            margin-bottom: rem(16px);
        }
        .text {
            font-size: rem(26px);
            margin-top: rem(40px);
            line-height: rem(40px);
        }
    }
}
</style>
