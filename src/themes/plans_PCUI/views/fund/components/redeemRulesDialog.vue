<template>
    <div class='dialog-layer'>
        <el-dialog
            v-model='show'
            :before-close='close'
            :close-on-click-modal='false'
            :title="$t('fundInfo.redeemRules')"
            width='520px'
        >
            <div class='rules-info'>
                <div class='tDate'>
                    <div class='start'>
                        <p>{{ $t('fundInfo.tDate') }}</p>
                        <p>{{ $t('fundInfo.redeemSubmit') }}</p>
                    </div>
                    <div class='center'>
                        <p>{{ $t('fundInfo.tDate') }}+1</p>
                    </div>
                    <div class='end'>
                        <p>{{ $t('fundInfo.tDate') }}+2</p>
                        <p>{{ $t('fundInfo.fundArrive') }}</p>
                    </div>
                </div>
                <div class='list'>
                    <p class='row'>
                        <span class='no'>
                            1
                        </span>
                        <span class='value'>
                            {{ $t('fundInfo.redeem_tip1') }}
                        </span>
                    </p>
                    <p class='row'>
                        <span class='no'>
                            2
                        </span>
                        <span class='value'>
                            {{ $t('fundInfo.redeem_tip2') }}
                        </span>
                    </p>
                    <p class='row'>
                        <span class='no'>
                            3
                        </span>
                        <span class='value'>
                            {{ $t('fundInfo.redeem_tip3') }}
                        </span>
                    </p>
                </div>
                <div class='block'>
                    <p class='title'>
                        {{ $t('fundInfo.jz_formula') }}
                    </p>
                    <p>{{ $t('fundInfo.jz_formulaContent') }}</p>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue'
// 是否显示弹窗
const show = ref(false)

// 打开弹窗
const open = () => {
    show.value = true
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.rules-info {
    .row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .no {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            flex-shrink: 0;
            width: 20px;
            height: 20px;
            line-height: 1;
            margin-right: 5px;
            color: #fff;
            background: var(--primary);
            border-radius: 50%;
        }
        .value {
            line-height: 18px;
        }
    }
    .block {
        margin-top: 20px;
        .title {
            color: var(--color);
            font-size: 20px;
        }
    }
    .tDate {
        display: flex;
        justify-content: space-between;
        position: relative;
        padding-top: 15px;
        padding-bottom: rem(30px);
        &::before {
            content: "";
            position: absolute;
            height: 1px;
            left: 15px;
            right: 15px;
            top: 5px;
            background: var(--primary);
        }
        .end {
            text-align: right;
        }
        .start,.center,.end{
            position: relative;
            &::before {
                content: "";
                position: absolute;
                height: 5px;
                width: 5px;
                left: 10px;
                top: -14px;
                border-radius: 100%;
                background: var(--contentColor);
                border: 2px solid var(--primary);
            }
        }
        .end{
            &::before{
                left: initial;
                right: 10px;
            }
        }
    }
}
</style>
