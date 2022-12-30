<template>
    <!-- 全仓合约杠杆倍数设置 -->
    <div class='dialog-layer'>
        <el-dialog
            v-model='multipleShow'
            :before-close='close'
            :close-on-click-modal='false'
            :title='$t("trade.multilpSetting")'
            width='500px'
        >
            <div v-if='multipleShow' class='body-module'>
                <div class='multipleSet'>
                    <div v-show='warn' class='warnRangeTip'>
                        {{ $t('trade.unRangeMultilpe') }}
                    </div>
                    <div class='body'>
                        <template v-if="marginInfo?.type==='2'">
                            <StepperComp
                                v-model='multipleValue'
                                class='stepper'
                                :controlbtn='true'
                                :digits='0'
                                :max='Number(multipleRange[1])'
                                :min='Number(multipleRange[0])'
                                :step='step'
                                @firstMinus='firstChange'
                                @firstPlus='firstChange'
                            />
                            <div class='multipleRange'>
                                {{ $t('trade.multilpRange') }}{{ multipleRange[0] }}x - {{ multipleRange[1] }}x
                            </div>
                        </template>
                        <template v-else>
                            <div class='multipleVal'>
                                {{ multipleValue }}x
                            </div>
                            <ul class='multipleList'>
                                <li v-for='item in multipleList' :key='item' class='item' :class='{ active:multipleValue===item }' @click='multipleValue = item'>
                                    {{ item }}x
                                </li>
                            </ul>
                        </template>

                        <div class='warnTip'>
                            <p class='t1'>
                                {{ $t('riskLevel.warn') }}
                            </p>
                            <p class='t2'>
                                {{ $t('trade.multilpSettingTip1') }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <van-button block class='handle-btn' :disabled='loading || warn' type='primary' @click='saveClick'>
                    {{ $t('trade.saveSetting') }}
                </van-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import centerViewDialog from '@planspc/layout/centerViewDialog'
import { setCrossLevelNum } from '@/api/trade'
import { Toast } from 'vant'
import StepperComp from '@planspc/components/stepper'
import { onBeforeMount, onMounted, computed, reactive, toRefs, onUnmounted, watch } from 'vue'
import { isEmpty } from '@/utils/util'
export default {
    components: { StepperComp },
    props: {
        product: {
            type: Object
        },
        modelValue: {
            type: Boolean,
            default: false
        },
        multipleVal: {
            type: [String, Number],
            default: ''
        },
        position: {
            type: [String, Object],
            default: ''
        }
    },
    emits: ['update:modelValue', 'update:multipleVal', 'save', 'beforeClose'],
    setup (props, { emit }) {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const show = computed({
            get: () => props.modelValue,
            set: val => {
                state.multipleShow = val
                emit('update:modelValue', val)
            }
        })
        let prevProduct = store.getters.productActived // 记录弹窗打开之前的产品
        const accountInfo = computed(() => store.state._user.customerInfo?.accountList?.find(el => el.tradeType === props.product.tradeType))
        const marginInfo = computed(() => props.product?.marginInfo)

        // 杠杆倍数范围
        const multipleRange = computed(() => {
            if (state.position) {
                return state.position.adjustCrossLevel.split('-')
            } else {
                return marginInfo?.value?.type === '2' ? marginInfo.value.values.split('-') : []
            }
        })

        // 杠杆倍数固定列表
        const multipleList = computed(() => marginInfo?.value?.type === '3' ? marginInfo.value.values.split(',') : [])
        const warn = computed(() => {
            if (marginInfo.value?.type !== '2') return false
            if (Number(state.multipleValue) < multipleRange.value[0]) {
                return true
            } else if (Number(state.multipleValue) > multipleRange.value[1]) {
                return true
            } else {
                return false
            }
        })

        console.log('props.multipleVal===', props.multipleVal)
        const state = reactive({
            loading: false,
            multipleValue: props.multipleVal,
            max: 100,
            min: 1,
            step: 1,
            multipleShow: false
        })

        const open = (row) => {
            show.value = true
            if (!isEmpty(row)) {
                state.multipleValue = row.crossLevelNum
                state.position = row
                prevProduct = store.getters.productActived
                store.commit('_quote/Update_productActivedID', `${row.symbolId}_${row.tradeType}`)
            } else {
                state.multipleValue = String(props.multipleVal)
            }
        }

        const close = () => {
            emit('beforeClose', prevProduct.symbolKey)
            show.value = false
            state.position = null
        }

        const firstChange = () => {}

        // 保存设置
        const saveClick = () => {
            if (warn.value) {
                return false
            }
            Promise.resolve().then(() => {
                return saveCrossLevelNum(state.multipleValue)
            }).then((result) => {
                if (result) {
                    emit('update:multipleVal', state.multipleValue)
                    emit('update:modelValue', false)
                    emit('save', state.multipleValue)
                    store.dispatch('_trade/queryPositionPage', { tradeType: props.product.tradeType })
                    if (state.position) {
                        Toast(t('trade.modifySuccess'))
                        show.value = false

                        const detail = {
                            multipleVal: state.multipleValue,
                            symbolId: state.position.symbolId
                        }
                        const event = new CustomEvent('update:multipLeVal', { detail })
                        document.body.dispatchEvent(event)
                    }
                }
            })
        }

        // 下单保存杠杆倍数
        const saveCrossLevelNum = (val) => {
            state.loading = true
            const symbolId = state.position ? state.position.symbolId : props.product.symbolId
            return setCrossLevelNum({
                tradeType: 1,
                symbolId,
                crossLevelNum: val
            }).then(res => {
                if (res.check()) {
                    return true
                }
                return false
            }).finally(() => {
                state.loading = false
            })
        }

        onMounted(() => {
            if (marginInfo?.value?.type === '2' && !props.multipleVal) {
                const val = multipleRange.value[0]
                state.multipleValue = val
                emit('update:multipleVal', val)
            } else if (marginInfo?.value?.type === '3') {
                const val = multipleList.value[0]
                state.multipleValue = val
                emit('update:multipleVal', val)
            }
        })

        watch(() => show.value, val => {
            state.multipleShow = val
        })
        watch(() => props.multipleVal, val => {
            state.multipleValue = val
        })

        return {
            ...toRefs(state),
            show,
            open,
            marginInfo,
            multipleList,
            multipleRange,
            warn,
            firstChange,
            saveClick,
            close
        }
    }

}
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.multipleSet{
    position: relative;
    .warnRangeTip{
        padding: rem(10px);
        line-height: 1.4;
        color: var(--warn);
        text-align: center;
        background: #FFF0E2;
    }
    .body{
        padding: rem(10px) 0 rem(30px);
        text-align: center;
    }
    .stepper{
        background: var(--bgColor);
        display: flex;
        :deep(.input){
            flex: 1;
        }
    }
    .multipleRange{
        margin-top: rem(20px);
        color: var(--minorColor);
    }
    .multipleVal{
        background: var(--bgColor);
        text-align: center;
        height: rem(80px);
        line-height: rem(80px);
        color: var(--color);
        font-size: rem(28px);
    }
    .multipleList{
        margin-top: rem(20px);
        color: var(--color);
        display: flex;
        justify-content: flex-start;
        text-align: center;
        font-size: rem(24px);
        .item{
            margin-right: 10px;
            width: rem(96px);
            height: rem(40px);
            line-height: rem(40px);
            background: var(--bgColor);
            &.active{
                color: var(--primary);
                background: var(--primaryAssistColor);
            }
        }
    }
    .warnTip{
        margin-top: rem(90px);
        padding: rem(15px) 0;
        font-size: rem(24px);
        background: #FEF6F7;
        color: var(--warn);
        background: rgba(183, 33, 34, 0.05);
        border: 1px solid var(--warn);
        border-radius: 6px;
        padding:rem(40px);
        text-align: center;
        .t1{
            margin-bottom: rem(20px);
            font-size: rem(40px);
            font-weight: bold;
            color: var(--warn);
        }
        .t2{
            color: var(--color);
        }
    }
}
.handle-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--primary);
    width: 100%;
    height: 48px;
    font-size: 16px;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
}
</style>
