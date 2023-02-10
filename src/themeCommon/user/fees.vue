
<template>
    <div class='vita_dwt_fees'>
        <h1>{{ $t('commonFees.feesMargin') }}</h1>
        <div class='fees-table-wrap'>
            <table class='fees-table'>
                <thead>
                    <tr class='table-tr-th'>
                        <th
                            v-for='(th, id) in thList'
                            :key='id'
                            :width='(th.id === 5 || th.id === 6 ) ? 160 : "auto"'
                        >
                            {{ th.value }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for='(td, index) in tdList'
                        :key='index'
                        class='table-tr'
                        :class="{ 'table-row': rowspans.index[index] }"
                    >
                        <td v-if='rowspans.index[index]' :rowspan='rowspans[td.id]'>
                            {{ td.type }}
                        </td>
                        <td>{{ td.name }}</td>
                        <td>{{ td.contract }}</td>
                        <td>{{ td.margin }}</td>
                        <td>
                            {{ td.long }}
                        </td>
                        <td>
                            {{ td.short }}
                        </td>
                        <td>{{ td.min }}</td>
                        <td>{{ td.max }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
export default {
    setup () {
        const { t } = useI18n({ useScope: 'global' })
        const thList = [
            { id: 1, value: t('commonFees.productType') },
            { id: 2, value: t('commonFees.fullName') },
            { id: 3, value: t('commonFees.contract') },
            { id: 4, value: t('commonFees.margin') },
            { id: 5, value: t('commonFees.long') },
            { id: 6, value: t('commonFees.short') },
            { id: 7, value: t('commonFees.min') },
            { id: 8, value: t('commonFees.max') },
        ]
        const tdList = [
            { id: 1, type: 'Forex', name: 'USD/JPY', contract: '100000', margin: '0.20%', long: '1.8720%', short: '-5.5800%', min: '0.01', max: '20' },
            { id: 1, type: 'Forex', name: 'GBP/JPY', contract: '100000', margin: '0.20%', long: '0.9360%', short: '-4.6440%', min: '0.01', max: '20' },
            { id: 1, type: 'Forex', name: 'EUR/USD', contract: '100000', margin: '0.20%', long: '-3.0840%', short: '0.7020%', min: '0.01', max: '20' },
            { id: 1, type: 'Forex', name: 'EUR/JPY', contract: '100000', margin: '0.20%', long: '-0.5400%', short: '-3.1770%', min: '0.01', max: '20' },
            { id: 1, type: 'Forex', name: 'EUR/GBP', contract: '100000', margin: '0.20%', long: '-2.1658%', short: '-0.9180%', min: '0.01', max: '20' },
            { id: 1, type: 'Forex', name: 'AUD/USD', contract: '100000', margin: '0.20%', long: '-1.2980%', short: '-0.4320%', min: '0.01', max: '20' },
            { id: 1, type: 'Forex', name: 'AUD/JPY', contract: '100000', margin: '0.20%', long: '0.1417%', short: '-3.1680%', min: '0.01', max: '20' },
            { id: 1, type: 'Forex', name: 'USD/CNH', contract: '100000', margin: '0.20%', long: '0.3240%', short: '-3.9960%', min: '0.01', max: '20' },
            { id: 1, type: 'Forex', name: 'USD/CHF', contract: '100000', margin: '0.20%', long: '1.4760%', short: '-5.1840%', min: '0.01', max: '20' },
            { id: 1, type: 'Forex', name: 'USD/CAD', contract: '100000', margin: '0.20%', long: '-0.8023%', short: '-2.0520%', min: '0.01', max: '20' },
            { id: 1, type: 'Forex', name: 'NZD/JPY', contract: '100000', margin: '0.20%', long: '1.9080%', short: '-4.7079%', min: '0.01', max: '20' },
            { id: 1, type: 'Forex', name: 'GBP/USD', contract: '100000', margin: '0.20%', long: '-1.4786%', short: '-0.2520%', min: '0.01', max: '20' },
            { id: 1, type: 'Forex', name: 'GBP/CHF', contract: '100000', margin: '0.20%', long: '0.0927%', short: '-3.6000%', min: '0.01', max: '20' },
            { id: 1, type: 'Forex', name: 'GBP/AUD', contract: '100000', margin: '0.20%', long: '-1.4473%', short: '-1.0890%', min: '0.01', max: '20' },
            { id: 1, type: 'Forex', name: 'EUR/CHF', contract: '100000', margin: '0.20%', long: '-0.5222%', short: '-2.8080%', min: '0.01', max: '20' },
            { id: 1, type: 'Forex', name: 'EUR/AUD', contract: '100000', margin: '0.20%', long: '-2.8961%', short: '0.7731%', min: '0.01', max: '20' },
            { id: 1, type: 'Forex', name: 'CAD/JPY', contract: '100000', margin: '0.20%', long: '1.6920%', short: '-5.4000%', min: '0.01', max: '20' },
            { id: 1, type: 'Forex', name: 'AUD/NZD', contract: '100000', margin: '0.20%', long: '-1.4878%', short: '-0.3600%', min: '0.01', max: '20' },
            { id: 2, type: 'Energy', name: 'US Oil', contract: '1000', margin: '1%', long: '-2.7175%', short: '-3.9240%', min: '0.01', max: '20' },
            { id: 2, type: 'Energy', name: 'UK Oil', contract: '1000', margin: '1%', long: '-0.9679%', short: '-3.9240%', min: '0.01', max: '20' },
            { id: 2, type: 'Energy', name: 'Natural Gas', contract: '10000', margin: '1.00%', long: '-3.9240%', short: '-3.9240%', min: '0.01', max: '20' },
            { id: 3, type: 'Metal', name: 'platinum', contract: '50', margin: '2%', long: '-5.6633%', short: '-3.9240%', min: '0.01', max: '20' },
            { id: 3, type: 'Metal', name: 'palladium', contract: '100', margin: '2%', long: '-5.6633%', short: '-3.9240%', min: '0.01', max: '20' },
            { id: 3, type: 'Metal', name: 'GOLD', contract: '100', margin: '0.50%', long: '-4.7065%', short: '-3.9240%', min: '0.01', max: '20' },
            { id: 3, type: 'Metal', name: 'SILVER', contract: '5000', margin: '2.00%', long: '-11.4840%', short: '-3.9240%', min: '0.01', max: '20' },
            { id: 3, type: 'Metal', name: 'COPPER', contract: '100', margin: '1.00%', long: '-6.6950%', short: '-3.9240%', min: '0.01', max: '20' },
            { id: 4, type: 'Cryptocurrency', name: 'SAND/USDT', contract: '1', margin: '5.00%', long: '-20.2680%', short: '-7.7400%', min: '10', max: '50000' },
            { id: 4, type: 'Cryptocurrency', name: 'FIL/USDT', contract: '1', margin: '5.00%', long: '-20.2680%', short: '-7.7400%', min: '1', max: '5000' },
            { id: 4, type: 'Cryptocurrency', name: 'TRX/USDT', contract: '100', margin: '5.00%', long: '-20.2680%', short: '-7.7400%', min: '1', max: '5000' },
            { id: 4, type: 'Cryptocurrency', name: 'BCH/USDT', contract: '1', margin: '5.00%', long: '-20.2680%', short: '-7.7400%', min: '0.05', max: '200' },
            { id: 4, type: 'Cryptocurrency', name: 'ATOM/USDT', contract: '1', margin: '5.00%', long: '-20.2680%', short: '-7.7400%', min: '1', max: '2000' },
            { id: 4, type: 'Cryptocurrency', name: 'LTC/USDT', contract: '1', margin: '5.00%', long: '-20.2680%', short: '-7.7400%', min: '0.1', max: '300' },
            { id: 4, type: 'Cryptocurrency', name: 'UNI/USDT', contract: '1', margin: '5.00%', long: '-20.2680%', short: '-7.7400%', min: '1', max: '5000' },
            { id: 4, type: 'Cryptocurrency', name: 'MATIC/USDT', contract: '1', margin: '5.00%', long: '-20.2680%', short: '-7.7400%', min: '10', max: '30000' },
            { id: 4, type: 'Cryptocurrency', name: 'DOGE/USDT', contract: '1', margin: '5.00%', long: '-20.2680%', short: '-7.7400%', min: '100', max: '250000' },
            { id: 4, type: 'Cryptocurrency', name: 'AVAX/USDT', contract: '1', margin: '5.00%', long: '-20.2680%', short: '-7.7400%', min: '1', max: '2000' },
            { id: 4, type: 'Cryptocurrency', name: 'DOT/USDT', contract: '1', margin: '5.00%', long: '-20.2680%', short: '-7.7400%', min: '1', max: '5000' },
            { id: 4, type: 'Cryptocurrency', name: 'XRP/USDT', contract: '10', margin: '5.00%', long: '-20.2680%', short: '-7.7400%', min: '1', max: '6000' },
            { id: 4, type: 'Cryptocurrency', name: 'ADA/USDT', contract: '1', margin: '5.00%', long: '-20.2680%', short: '-7.7400%', min: '20', max: '100000' },
            { id: 4, type: 'Cryptocurrency', name: 'SOL/USDT', contract: '1', margin: '5.00%', long: '-20.2680%', short: '-7.7400%', min: '1', max: '2000' },
            { id: 4, type: 'Cryptocurrency', name: 'BNB/USDT', contract: '1', margin: '5.00%', long: '-20.2680%', short: '-7.7400%', min: '0.05', max: '100' },
            { id: 4, type: 'Cryptocurrency', name: 'ETH/USDT', contract: '1', margin: '5.00%', long: '-20.2680%', short: '-7.7400%', min: '0.01', max: '25' },
            { id: 4, type: 'Cryptocurrency', name: 'BTC/USDT', contract: '1', margin: '5.00%', long: '-20.2680%', short: '-7.7400%', min: '0.001', max: '3' },
            { id: 4, type: 'Cryptocurrency', name: 'SHIB/USDT', contract: '1000', margin: '5.00%', long: '-20.2680%', short: '-7.7400%', min: '1000', max: '5000000' }
        ]
        const rowspans = computed(() => {
            const list = { index: {}, count: 0 }
            tdList.forEach((item, i) => {
                if (!list[item.id]) {
                    list.index[i] = true
                    list[item.id] = 0
                }
                list[item.id] += 1
            })
            return list
        })
        return {
            thList,
            rowspans,
            tdList
        }
    }
}
</script>

<style lang="scss" scoped>
.vita_dwt_fees {
    margin: 0 auto;
    background: var(--bgColor);
    padding: 0 0 136px;
    h1 {
        color: var(--primary);
        font-size: 28px;
        padding: 60px 0;
        text-align: center;
    }
    .fees-table {
        width: 1200px;
        margin: 0 auto;
        text-align: left;
        border-spacing: 0;
        font-size: 14px;
        height: 46px;
        line-height: 46px;
        th,
        td {
            padding-left: 8px;
            text-align: center;
        }
        .table-tr-th {
            background: var(--lineColor);
            font-weight: 500;
            line-height: 1.5;
            th {
                padding: 15px;
            }
        }
        .table-tr {
            font-weight: 400;
            position: relative;
            &.table-row>td::after {
                content: '';
                position: absolute;
                top: 0;
                width: 100%;
                height: 2px;
                background: var(--lineColor);
                left: 0;
            }
            &:nth-child(2n) {
                background: var(--lineColor);
            }
            &:hover {
                background: var(--lineColor);
            }
        }
    }
    @media screen and (max-width: 1200px) {
        .vita_dwt_fees {
            padding-bottom: 20px;
        }
        .fees-table-wrap {
            overflow: hidden;
            overflow-x: scroll;
        }
        .fees-table {
            width: 300%;
            table-layout: fixed;
            .table-tr-th {
                th {
                    padding: 4px 8px;
                }
            }
            th {
                font-size: 12px;
                line-height: 24px;
            }
            tr {
                font-size: 13px;
            }
        }
    }
}
body.night {
    .vita_dwt_fees {
        .fees-table {
            .table-th-tr,
            .table-tr {
                color: var(--normalColor);
                background: var(--contentColor);
                &:hover {
                    td {
                        background: var(--bgColor);
                    }
                    td[rowspan] {
                        background: none;
                    }
                }
            }
        }
    }
}
</style>
