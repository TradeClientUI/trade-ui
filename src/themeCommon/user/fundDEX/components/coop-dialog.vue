<template>
    <div class='dialog-layer'>
        <el-dialog
            ref='SupplyDialog'
            v-model='dialogShow'
            :title='topTitle'
            width='400px'
            @closed='closeFn'
        >
            <div class='body-module'>
                <!--申购 借贷-->
                <div v-if='isSuccess === false' class='supplyBox'>
                    <p class='Txt black'>
                        From
                    </p>
                    <div class='row trade-row'>
                        <div class='col price'>
                            <div class='value'>
                                <input placeholder='0.00' type='text' />
                            </div>
                            <div class='name'>
                                $ <span>0.00</span>
                            </div>
                        </div>
                        <div class='col'>
                            <div class='tradeType'>
                                <span class='el-dropdown-link' @click='changeToken'>
                                    ETF
                                    <!--<i class='el-icon-arrow-down el-icon--right'></i>-->
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class='Balance black small'>
                        Balance: <span>0.00</span>
                    </div>
                    <p class='Txt black mt-20'>
                        To
                    </p>
                    <div class='row trade-row'>
                        <div class='col price'>
                            <div class='value'>
                                <input placeholder='0.00' type='text' />
                            </div>
                            <div class='name'>
                                $ 0.00
                            </div>
                        </div>
                        <div class='col'>
                            <div class='tradeType'>
                                <span class='el-dropdown-link'>
                                    BED
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class='Balance black small'>
                        Balance: <span>0.00</span>
                    </div>

                    <div v-if='calcData.minimun' class='calcBox'>
                        <div class='calcItem'>
                            <div class='label'>
                                Exact BED Received
                            </div>
                            <div class='value'>
                                46.0060
                            </div>
                        </div>
                        <div class='calcItem'>
                            <div class='label'>
                                Maximum ETH Payment
                            </div>
                            <div class='value'>
                                1.4688
                            </div>
                        </div>
                        <div class='calcItem'>
                            <div class='label'>
                                Network Fee
                            </div>
                            <div class='value'>
                                0.0998 ETH
                            </div>
                        </div>
                        <div class='calcItem'>
                            <div class='label'>
                                Slippage Tolerance
                            </div>
                            <div class='value'>
                                1%
                            </div>
                        </div>
                        <div class='calcItem'>
                            <div class='label'>
                                Offered From
                            </div>
                            <div class='value'>
                                <p>Index - Exchange Issuance</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!--操作成功 提示-->
                <div v-if='isSuccess' class='success'>
                    <i class='el-icon-check'></i>
                    <h5>All Done!</h5>
                    <p>You Supplied 0.500000 ETH</p>
                    <span class='addToWallet'>
                        +ADD AWETH TO THE WALLET
                    </span>
                </div>
            </div>
            <template #footer>
                <button v-if='!isSuccess' v-loading='isSubmit' class='handle-btn' @click='checkSubmit'>
                    supply
                </button>
                <button v-if='isSuccess' class='handle-btn' @click='closeFn'>
                    Ok, Close
                </button>
            </template>
        </el-dialog>

        <el-dialog
            ref='selectToken'
            v-model='tokenSelectShow'
            title='Select a token'
            width='400px'
        >
            <div class='body-module'>
                <div class='tokenListBox'>
                    <div v-for='item in options' :key='item.id' class='row tokenCell' :index='item.id' @click='handleSelectToken(item)'>
                        <div class='value'>
                            <img alt='' class='currencyIcon' :src='item.icon' /> {{ item.label }}
                        </div>
                        <div class='name'>
                            <span>0.00</span>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { computed, reactive, watch, toRefs, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

export default {
    // components: { },
    props: ['show', 'data'],
    setup (props, context) {
        const store = useStore()
        const state = reactive({
            loading: false,
            dialogShow: props.show,
            tokenSelectShow: false,
            isSubmit: false,
            data: props.data,
            topTitle: 'Quick Trade',
            isSuccess: false,
            options: [
                {
                    id: 1,
                    label: 'BTC',
                    icon: '/img/BTC.e8d20076.png'
                },
                {
                    id: 2,
                    label: 'DAI',
                    icon: '/img/BTC.e8d20076.png'
                },
                {
                    id: 3,
                    label: 'ETH',
                    icon: '/img/BTC.e8d20076.png'
                },
                {
                    id: 4,
                    label: 'JPG',
                    icon: '/img/BTC.e8d20076.png'
                },
            ],
            optionsVal: '',
            calcData: {
                minimun: null,
                netfee: null,
                slippage: null,
                offered: null
            }
        })

        watch(
            () => [props.show, props.data],
            (val) => {
                state.dialogShow = props.show
                state.data = props.data
                // console.log(props.data)
            }
        )

        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const { id } = route.query

        const checkSubmit = () => {
            state.isSubmit = true
            const st = setTimeout(() => {
                state.isSubmit = false
                state.isSuccess = true
                clearTimeout(st)
            }, 1500)
        }

        const closeFn = () => {
            context.emit('update:show', false)
            state.isSuccess = false
        }

        const changeToken = () => {
            state.tokenSelectShow = true
        }

        const handleSelectToken = (item) => {
            // console.log(item)
            state.tokenSelectShow = false
        }

        onMounted(() => {

        })

        return {
            ...toRefs(state),
            closeFn,
            checkSubmit,
            changeToken,
            handleSelectToken
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
:deep(.el-dialog) {
    height: auto !important;
    min-height: 200px;
}
:deep(.el-dialog__header) {
    margin: auto 0 !important;
    text-align: left !important;
}
.body-module {
    .row {
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        .col {
            display: inline-flex;
            flex-direction: column;
            .name {
                color: var(--minorColor);
                font-size: 12px;
            }
        }
        .tradeType {
            display: inline-block;
            font-size: 16px;
            text-align: right;
            .el-dropdown-link {
                line-height: 42px;
            }
        }
        .price {
            .value {
                height: 36px;
                font-size: 20px;
                line-height: 36px;
            }
        }
        .cellItem {
            color: var(--color);
            font-size: 18px;
            line-height: 36px;
        }
    }
    .Balance.small {
        font-size: 12px;
    }
    .mt-20 {
        margin-top: 20px;
    }
    .black {
        color: var(--color);
    }
    .Txt,
    .gas {
        font-size: 16px;
    }
    .trade-row {
        padding: 10px;
        border: 1px solid var(--lineColor);
    }
    .calcItem {
        margin-top: 20px;
        .label {
            font-size: 14px;
        }
        .value {
            color: var(--color);
            font-weight: 600;
            font-size: 18px;
        }
    }
}
.currencyIcon {
    display: inline-block;
    width: 24px;
    margin-right: 5px;
    vertical-align: middle;
}
.handle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 48px;
    color: #FFF;
    font-size: 16px;
    background: var(--primary);
    border-radius: 4px;
    cursor: pointer;
}
.tokenCell {
    margin-bottom: 10px !important;
    padding: 6px 10px;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
        background-color: var(--bgColor);
    }
}
.success {
    padding: 20px;
    text-align: center;
    h5 {
        margin-bottom: 10px;
        color: var(--color);
        font-size: 20px;
    }
    i.el-icon-check {
        color: var(--success);
        font-size: 32px;
    }
    p {
        margin: 10px 0;
        font-size: 16px;
    }
    .addToWallet {
        display: inline-block;
        padding: 2px 10px;
        color: var(--normalColor);
        background-color: var(--assistColor);
        border: 1px solid var(--lineColor);
        cursor: pointer;
    }
}

</style>
