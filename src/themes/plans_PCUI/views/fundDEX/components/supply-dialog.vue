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
                                <!--<el-dropdown>
                                    <span class='el-dropdown-link'>
                                        <img alt='' class='currencyIcon' src='/img/BTC.e8d20076.png' /> ETF
                                        <i class='el-icon-arrow-down el-icon--right'></i>
                                    </span>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item v-for='item in options' :key='item.id' :index='id'>
                                                <img alt='' class='currencyIcon' :src='item.icon' /> {{ item.label }}
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                                -->
                                <a class='el-dropdown-link' href='javascript:;' @click='changeToken'>
                                    <img alt='' class='currencyIcon' src='/img/BTC.e8d20076.png' /> ETF
                                    <i class='el-icon-arrow-down el-icon--right'></i>
                                </a>
                            </div>

                            <div class='Balance'>
                                Balance <span>0</span> <span class='black'>
                                    MAX
                                </span>
                            </div>
                        </div>
                    </div>
                    <p class='Txt black'>
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
                                    <img alt='' class='currencyIcon' src='/img/BTC.e8d20076.png' /> ETF
                                </span>
                            </div>
                            <div class='Balance'>
                                Balance <span>0</span>
                            </div>
                        </div>
                    </div>
                    <div class='row trade-row '>
                        <div class='col cellItem'>
                            <div class='cellName'>
                                APY
                            </div>
                        </div>
                        <div class='col cellItem'>
                            <div class='cellVal'>
                                0.02%
                            </div>
                        </div>
                    </div>
                    <div class='gas'>
                        <i class='el-icon-shopping-cart-full'></i> <span>--</span>
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
        {{ selectTokenDialogVisible }}
        <SelectTokenDialog v-model='selectTokenDialogVisible' @select='tokenSelect' />
    </div>
</template>

<script>
import { computed, reactive, watch, toRefs, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import SelectTokenDialog from './coop-selectToken-dialog.vue'

export default {
    components: {
        SelectTokenDialog,
    },
    props: ['show', 'data'],
    setup (props, context) {
        const store = useStore()
        const state = reactive({
            loading: false,
            dialogShow: props.show,
            selectTokenDialogVisible: false,
            isSubmit: false,
            data: props.data,
            topTitle: 'Quick Trade',
            isSuccess: false,
            from: {},
            optionsVal: ''
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
            state.selectTokenDialogVisible = true
        }

        // 选择token
        const tokenSelect = item => {
            state.from = item
        }

        onMounted(() => {

        })

        return {
            ...toRefs(state),
            closeFn,
            tokenSelect,
            checkSubmit,
            changeToken,
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
        margin-bottom: 20px;
        font-size: 14px;
        .col {
            display: inline-flex;
            flex-direction: column;
            .name {
                color: var(--minorColor);
            }
        }
        .tradeType {
            display: inline-block;
            text-align: right;
            .el-dropdown-link {
                line-height: 32px;
            }
        }
        .price {
            .value {
                height: 32px;
                font-size: 18px;
                line-height: 32px;
            }
        }
        .Balance {
            color: var(--minorColor);
        }
        .cellItem {
            color: var(--color);
            font-size: 18px;
            line-height: 36px;
        }
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
    .handle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
            color: var(--minorColor);
            font-size: 14px;
        }
        .stepper {
            background: var(--assistColor);
            border-radius: 5px;
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
