
<template>
    <div class='vita_dwt_fees'>
        <table class='fees-table'>
            <thead>
                <tr class='table-tr'>
                    <th v-for='(th, id) in thList' :key='id'>
                        {{ th.value }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for='(td, id) in tdList' :key='id' class='table-td'>
                    <td>{{ td.currency }}</td>
                    <td>{{ td.fullName }}</td>
                    <td>{{ td.transactionFee }}</td>
                    <td>{{ td.deposit }}</td>
                    <td>{{ td.minWithdrawal }}</td>
                    <td>{{ td.withdrawalFee }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    setup () {
        const thList = [
            { id: 1, value: 'Currency' },
            { id: 2, value: 'Full Name' },
            { id: 3, value: 'Transaction Fee' },
            { id: 4, value: 'Deposit' },
            { id: 5, value: 'Min Withdrawal' },
            { id: 6, value: 'Withdrawal Fee' },
        ]
        const tdList = [
            { id: 1, currency: '-', fullName: 'V10', transactionFee: '0.50%', deposit: '-', minWithdrawal: '-', withdrawalFee: '-' },
            { id: 2, currency: '-', fullName: 'V10/USDT', transactionFee: '0.10%', deposit: '-', minWithdrawal: '-', withdrawalFee: '-' },
            { id: 3, currency: 'BTC', fullName: 'Bitcoin', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '0.0025', withdrawalFee: '0.0011' },
            { id: 4, currency: 'ETH', fullName: 'Ethereum', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '0.0350', withdrawalFee: '0.0220' },
            { id: 5, currency: 'BNB', fullName: 'BNB', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '0.1500', withdrawalFee: '0.0011' },
            { id: 6, currency: 'SOL', fullName: 'Solana', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '0.5000', withdrawalFee: '0.0110' },
            { id: 7, currency: 'ADA', fullName: 'Cardano', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '55.0000', withdrawalFee: '1.1000' },
            { id: 8, currency: 'XRP', fullName: 'XRP', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '65.0000', withdrawalFee: '0.1100' },
            { id: 9, currency: 'LUNA', fullName: 'Terra', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '0.6000', withdrawalFee: '0.0110' },
            { id: 10, currency: 'DOT', fullName: 'Polkadot', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '2.7500', withdrawalFee: '0.1100' },
            { id: 11, currency: 'AVAX', fullName: 'Avalanche', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '0.6000', withdrawalFee: '0.1100' },
            { id: 12, currency: 'DOGE', fullName: 'Dogecoin', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '370.0000', withdrawalFee: '22.0000' },
            { id: 13, currency: 'MATIC', fullName: 'Polygon', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '30.0000', withdrawalFee: '16.5000' },
            { id: 14, currency: 'SHIB', fullName: 'SHIBA INU', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '3,750,000.0000', withdrawalFee: '1,540,000.000' },
            { id: 15, currency: 'LINK', fullName: 'ChainLink', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '3.5000', withdrawalFee: '0.5500' },
            { id: 16, currency: 'NEAR', fullName: 'NEAR Protocol', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '4.5000', withdrawalFee: '0.1100' },
            { id: 17, currency: 'UNI', fullName: 'Uniswap', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '5.0000', withdrawalFee: '1.1000' },
            { id: 18, currency: 'ALGO', fullName: 'Algorand', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '60.0000', withdrawalFee: '0.2200' },
            { id: 19, currency: 'LTC', fullName: 'Litecoin', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '0.5000', withdrawalFee: '0.0055' },
            { id: 20, currency: 'ATOM', fullName: 'Cosmos', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '1.7500', withdrawalFee: '0.0110' },
            { id: 21, currency: 'ICP', fullName: 'Internet Computer', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '2.7500', withdrawalFee: '0.0110' },
            { id: 22, currency: 'BCH', fullName: 'Bitcoin Cash', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '0.1600', withdrawalFee: '0.0006' },
            { id: 23, currency: 'TRX', fullName: 'TRON', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '825.0000', withdrawalFee: '1.1000' },
            { id: 24, currency: 'XLM', fullName: 'Stellar Lumens', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '255.0000', withdrawalFee: '0.1100' },
            { id: 25, currency: 'FTM', fullName: 'Fantom', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '25.0000', withdrawalFee: '1.1000' },
            { id: 26, currency: 'EOS', fullName: '-', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '25.0000', withdrawalFee: '0.1100' },
            { id: 27, currency: 'MANA', fullName: 'Decentraland', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '35.0000', withdrawalFee: '16.5000' },
            { id: 28, currency: 'HBAR', fullName: 'Hedera Hashgraph', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '225.000', withdrawalFee: '1.1000' },
            { id: 29, currency: 'VET', fullName: 'VeChain', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '95.0000', withdrawalFee: '0.0110' },
            { id: 30, currency: 'AXS', fullName: 'Axie Infinity', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '1.0000', withdrawalFee: '0.2750' },
            { id: 31, currency: 'FIL', fullName: 'Filecoin', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '2.5000', withdrawalFee: '0.0022' },
            { id: 32, currency: 'SAND', fullName: 'The Sandbox', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '15.0000', withdrawalFee: '8.8000' },
            { id: 33, currency: 'USDT', fullName: 'TetherUS(ERC)', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '50.0000', withdrawalFee: '33.0000' },
            { id: 34, currency: 'USDT', fullName: 'TetherUS(TRC)', transactionFee: '0.10%', deposit: 'No Charges', minWithdrawal: '50.0000', withdrawalFee: '3.3000' },
        ]
        return {
            thList,
            tdList
        }
    }
}
</script>

<style lang="scss" scoped>
.vita_dwt_fees{
    margin: 0 auto;
    background: #fff;
    padding: 60px 0 136px;
    .fees-table {
        font-family: IBMPlexSansArabic-Regular;
        width: 1200px;
        margin: 0 auto;
        text-align: left;
        border-spacing:0px;
        font-size: 14px;
        height:46px;
        line-height: 46px;
        th,td {
            padding-left: 8px;
        }
        .table-tr {
            background: #F8F8F8;
            box-shadow: inset 0px -1px 0px 0px rgba(240,240,240,1);
            color: rgba(51,51,51,0.85);
            font-weight: 500;
        }
        .table-td {
            box-shadow: inset 0px -1px 0px 0px rgba(240,240,240,1);
            color: rgba(51,51,51,0.85);
            font-weight: 400;
            &:nth-child(2n) {
                background: #F8F8F8;
            }
        }
   }

}
</style>
