<template>
    <van-popup
        v-model:show='show'
        class='explain-popup'
        position='bottom'
        :round='true'
        teleport='body'
        @close='close'
    >
        <div class='popup-content'>
            <!-- 净值 -->
            <template v-if='explainType === 1'>
                <div class='name'>
                    {{ $t('trade.jingzhi') }}
                </div>
                <div class='des'>
                    {{ $t('assetsExplain.text1') }}
                </div>
            </template>
            <!-- 可用保证金 -->
            <template v-if='explainType === 2'>
                <div class='name'>
                    {{ $t('trade.freeMargin') }}
                </div>
                <div class='des'>
                    {{ $t('assetsExplain.text2') }}
                </div>
            </template>
            <!-- 占用保证金 -->
            <template v-if='explainType === 3'>
                <div class='name'>
                    {{ $t('trade.originalMargin') }}
                </div>
                <div class='des'>
                    {{ $t('assetsExplain.text3') }}
                </div>
            </template>
            <!-- 全仓保证金水平 -->
            <template v-if='explainType === 4'>
                <div class='name'>
                    {{ $t('trade.marginLevel') }}
                </div>
                <div class='des'>
                    {{ $t('assetsExplain.text4') }}
                </div>
                <div class='warning-ul'>
                    <div class='item danger'>
                        {{ $t('assetsExplain.text5', { lessThanVal }) }}
                    </div>
                    <div class='item warn'>
                        {{ $t('assetsExplain.text6', { lessThanVal, moreThanVal }) }}
                    </div>
                    <div class='item safety'>
                        {{ $t('assetsExplain.text7', { moreThanVal }) }}
                    </div>
                </div>
                <div class='explain-case'>
                    <div class='title'>
                        {{ $t('assetsExplain.text8') }}
                    </div>
                    <div class='ul'>
                        <div class='item'>
                            {{ $t('assetsExplain.text9', { lessThanVal }) }}
                        </div>
                    </div>
                </div>
                <div class='explain-case'>
                    <div class='title'>
                        {{ $t('assetsExplain.text10') }}
                    </div>
                    <div class='ul'>
                        <div class='item'>
                            {{ $t('assetsExplain.text11') }}
                        </div>
                        <div class='item'>
                            {{ $t('assetsExplain.text12') }}
                        </div>
                    </div>
                </div>
                <div class='explain-case'>
                    <div class='title'>
                        {{ $t('assetsExplain.text13') }}
                    </div>
                    <div class='ul'>
                        <div class='item'>
                            {{ $t('assetsExplain.text14') }}
                        </div>
                        <div class='item'>
                            {{ $t('assetsExplain.text15') }}
                        </div>
                        <div class='item'>
                            {{ $t('assetsExplain.text16') }}
                        </div>
                    </div>
                </div>
            </template>
            <!-- 逐仓可用保证金 -->
            <template v-if='explainType === 5'>
                <div class='name'>
                    {{ $t('trade.freeMargin') }}
                </div>
                <div class='des'>
                    {{ $t('assetsExplain.text2') }}
                </div>
            </template>
            <!-- 逐仓总占用保证金 -->
            <template v-if='explainType === 6'>
                <div class='name'>
                    {{ $t('trade.allOriginalMargin') }}
                </div>
                <div class='des'>
                    {{ $t('assetsExplain.text3') }}
                </div>
            </template>
            <!-- 逐仓预估强平价 -->
            <template v-if='explainType === 7'>
                <div class='name'>
                    {{ $t('trade.predivStopPrice') }}
                </div>
                <div class='des'>
                    {{ $t('assetsExplain.text17') }}
                </div>
            </template>
            <!-- 逐仓占用保证金 -->
            <template v-if='explainType === 8'>
                <div class='name'>
                    {{ $t('trade.originalMargin') }}
                </div>
                <div class='des'>
                    {{ $t('assetsExplain.text18') }}
                </div>
            </template>
            <!-- 逐仓维持保证金 -->
            <template v-if='explainType === 9'>
                <div class='name'>
                    {{ $t('trade.holdMargin') }}
                </div>
                <div class='des'>
                    {{ $t('assetsExplain.text19') }}
                </div>
            </template>
            <!-- 逐仓风险状态 -->
            <template v-if='explainType === 10'>
                <div class='name'>
                    {{ $t('assetsExplain.text20') }}
                </div>
                <div class='warning-ul'>
                    <div class='item danger'>
                        {{ $t('assetsExplain.text21') }}
                    </div>
                    <div class='item warn'>
                        {{ $t('assetsExplain.text22') }}
                    </div>
                    <div class='item safety'>
                        {{ $t('assetsExplain.text23') }}
                    </div>
                </div>
                <div class='explain-case'>
                    <div class='title'>
                        {{ $t('assetsExplain.text8') }}
                    </div>
                    <div class='ul'>
                        <div class='item'>
                            {{ $t('assetsExplain.text24') }}
                        </div>
                    </div>
                </div>
                <div class='explain-case'>
                    <div class='title'>
                        {{ $t('assetsExplain.text13') }}
                    </div>
                    <div class='ul'>
                        <div class='item'>
                            {{ $t('assetsExplain.text25') }}
                        </div>
                        <div class='item'>
                            {{ $t('assetsExplain.text26') }}
                        </div>
                        <div class='item'>
                            {{ $t('assetsExplain.text27') }}
                        </div>
                    </div>
                </div>
            </template>
            <!-- 重置账户说明 -->
            <template v-if='explainType === 11'>
                <div class='name'>
                    {{ $t('mockAccount.resetAccount') }}
                </div>
                <div class='des'>
                    {{ $t('assetsExplain.text28') }}
                </div>
            </template>
            <!-- 可取金额说明 -->
            <template v-if='explainType === 12'>
                <div class='name'>
                    {{ $t('fund.acceptAmount') }}
                </div>
                <div class='explain-case'>
                    <div class='title'>
                        {{ $t('assetsExplain.text30') }}
                    </div>
                </div>
                <div class='explain-case'>
                    <div class='title'>
                        {{ $t('assetsExplain.text31') }}
                    </div>
                    <div class='ul'>
                        <div class='item'>
                            {{ $t('assetsExplain.text32') }}
                        </div>
                    </div>
                </div>
                <div class='explain-case'>
                    <div class='title'>
                        {{ $t('assetsExplain.text33') }}
                    </div>
                    <div class='ul'>
                        <div class='item'>
                            {{ $t('assetsExplain.text34') }}
                        </div>
                    </div>
                    <br />
                </div>
            </template>

            <button class='know' @click='close'>
                {{ $t('common.know') }}
            </button>
        </div>
    </van-popup>
</template>

<script>
import { reactive, toRefs, computed, watch } from 'vue'
export default {
    props: {
        // 是否默认显示弹窗
        modelValue: {
            type: Boolean,
            default: false
        },
        /*
            说明类型
            1:全仓净值
            2:全仓可用保证金
            3:全仓占用保证金
            4:全仓保证金水平
            5:逐仓可用保证金
            6:逐仓总占用保证金
            7:逐仓预估强平价
            8:逐仓占用保证金
            9:逐仓维持保证金
            10:逐仓风险状态
        */
        explainType: {
            type: Number,
            default: 0
        },
        // 当前账户信息
        userAccount: {
            type: Object,
            default: () => {}
        }
    },
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        // 小于
        const lessThanVal = computed(() => props.userAccount.closePositionProportion)
        // 大于
        const moreThanVal = computed(() => props.userAccount.earlyWarningProportion)
        // 页面数据
        const state = reactive({
            // 是否显示弹窗
            show: false
        })

        // 关闭弹窗
        const close = () => {
            emit('update:modelValue', false)
        }

        // 监听modelValue
        watch(() => props.modelValue, () => {
            state.show = props.modelValue
        }, { immediate: true })

        return {
            ...toRefs(state),
            lessThanVal,
            moreThanVal,
            close
        }
    }
}
</script>

<style lang="scss" scoped>
.popup-content {
    padding: rem(50px) rem(50px) rem(100px);
    max-height: 90vh;
    .name {
        font-size: rem(32px);
        font-weight: bold;
    }
    .des {
        margin-top: rem(20px);
        font-size: rem(28px);
    }
}
.know {
    @include hover();
    display: flex;
    justify-content: center;
    align-items: center;
    width: rem(260px);
    height: rem(80px);
    line-height: 1;
    margin: rem(80px) auto 0;
    color: #FFF;
    background: var(--primary);
    border-radius: rem(10px);
}
.warning-ul {
    display: flex;
    flex-direction: column;
    .item {
        margin-top: rem(12px);
        padding: rem(10px) rem(20px);
        font-size: rem(26px);
        border-radius: rem(4px);
        &.danger {
            color: var(--warn);
            background: rgba(239, 83, 83, 0.1);
        }
        &.warn {
            color: var(--focusColor);
            background: rgba(241, 161, 27, 0.1);
        }
        &.safety {
            color: var(--success);
            background: rgba(38, 166, 154, 0.1);
        }
    }
}
.explain-case {
    margin-top: rem(36px);
    .title {
        margin-bottom: rem(4px);
        font-size: rem(28px);
    }
    .ul {
        font-size: rem(26px);
    }
    .item {
        line-height: rem(36px);
        color: var(--normalColor);
    }
}
</style>

<style lang="scss">
.explain-popup {
    border-radius: rem(20px) rem(20px) 0 0 !important;
}
</style>
