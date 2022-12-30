<template>
    <!-- 杠杆倍数设置 逐仓合约 -->
    <van-popup
        v-model:show='show'
        class='custom-popup leverage-popup'
        position='bottom'
        round
        teleport='body'
        @open='open'
    >
        <div class='multipleSet'>
            <div v-show='warn' class='warnRangeTip'>
                {{ $t('trade.unRangeMultilpe') }}
            </div>
            <div class='header'>
                <div class='header-title'>
                    {{ $t('trade.multilpSetting') }}
                </div>
                <i class='icon_guanbi' @click="$emit('update:modelValue', false)"></i>
            </div>
            <div class='body'>
                <template v-if="marginInfo.type==='2'">
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

            <van-button block :disabled='loading' type='primary' @click='saveClick'>
                {{ $t('trade.saveSetting') }}
            </van-button>
        </div>
    </van-popup>
    <Loading :show='loading' />
</template>

<script>
import { computed, onMounted, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { updateCrossLevelNum } from '@/api/trade'
import StepperComp from '@plans/components/stepper'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'

export default {
    components: {
        StepperComp,
    },
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
        },
    },
    emits: ['update:modelValue', 'update:multipleVal', 'save'],
    setup (props, { emit }) {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const show = computed({
            get: () => props.modelValue,
            set: val => emit('update:modelValue', val)
        })
        const accountInfo = computed(() => store.state._user.customerInfo?.accountList?.find(el => el.tradeType === props.product.tradeType))
        const marginInfo = computed(() => props.product?.marginInfo)

        // 杠杆倍数范围
        const multipleRange = computed(() => {
            if (props.position) {
                return props.position.adjustCrossLevel.split('-')
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

        const state = reactive({
            loading: false,
            multipleValue: '',
            max: 100,
            min: 1,
            step: 1,
        })
        const open = () => {
            state.multipleValue = String(props.multipleVal)
        }

        // const change = (val) => {
        //     if (marginInfo.value.type !== '2') return false
        //     console.log(val)
        //     if (Number(val) < multipleRange.value[0]) {
        //         emit('update:multipleVal', multipleRange.value[0])
        //     } else if (Number(val) > multipleRange.value[1]) {
        //         emit('update:multipleVal', multipleRange.value[1])
        //     }
        // }
        const firstChange = () => {}

        // 保存设置
        const saveClick = () => {
            if (warn.value) {
                return false
            }
            Promise.resolve().then(() => {
                if (props.position) {
                    return savePosition(state.multipleValue)
                }
                return true
            }).then((result) => {
                if (result) {
                    emit('update:multipleVal', state.multipleValue)
                    emit('update:modelValue', false)
                    emit('save', state.multipleValue)
                }
            })
        }
        // 修改仓位杠杆倍数
        const savePosition = (val) => {
            state.loading = true
            return updateCrossLevelNum({
                positionId: props.position.positionId,
                symbolId: props.product.symbolId,
                orderId: props.position.orderId,
                tradeType: props.position.tradeType,
                accountDigits: accountInfo.value.digits,
                accountId: accountInfo.value.accountId,
                crossLevelNum: parseInt(val),
            }).then(res => {
                if (res.check()) {
                    Toast(t('trade.modifySuccess'))
                    store.dispatch('_trade/queryPositionPage', { tradeType: props.position.tradeType })
                    return true
                }
                return false
            }).finally(err => {
                state.loading = false
            })
        }

        onMounted(() => {
            if (marginInfo?.value?.type === '2') {
                emit('update:multipleVal', multipleRange.value[0])
            } else if (marginInfo?.value?.type === '3') {
                const val = multipleList.value[0]
                state.multipleValue = val
                emit('update:multipleVal', val)
            }
        })

        return {
            ...toRefs(state),
            show,
            open,
            marginInfo,
            multipleList,
            // multipleValue,
            multipleRange,
            warn,
            savePosition,
            firstChange,
            saveClick,
        }
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.leverage-popup{
    background-color: var(--contentColor);
}
</style>

<style lang="scss" scoped>
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
        border: rem(2px) solid var(--warn);
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
</style>
