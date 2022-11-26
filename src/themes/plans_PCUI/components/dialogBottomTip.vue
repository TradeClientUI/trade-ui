<template>
    <div>
        <van-popup
            v-model:show='showDialog'
            class='m-dialog m-dialogTips'
            get-container='body'
            position='bottom'
            @closed='close'
        >
            <div class='dialog-header'>
                <div class='title'>
                    {{ title }}
                </div>
            </div>
            <div class='dialog-body'>
                <div class='words'>
                    {{ tips }}
                </div>
            </div>
            <div class='dialog-footer'>
                <van-button plain @click='close'>
                    {{ cancelTxt }}
                </van-button>
                <van-button color='#477FD3' @click='submit'>
                    {{ confirmTxt }}
                </van-button>
            </div>
        </van-popup>
    </div>
</template>

<script>
import i18n from '@planspc/i18n/i18n'

export default {
    name: 'DialogBottomTip',
    emits: ['update:show'],
    props: {
        show: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: i18n.global.t('tip')
        },
        cancelTxt: {
            type: String,
            default: i18n.global.t('compLang.cancel')
        },
        confirmTxt: {
            type: String,
            default: i18n.global.t('compLang.confirm')
        },
        tips: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            showDialog: false
        }
    },
    watch: {
        'show' (val) {
            this.showDialog = val
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        },
        submit () {
            this.$emit('submit')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.m-dialogTips {
    &.pc {
        width: 400px;
        height: 192px;
        border-radius: 6px;
        .dialog-footer {
            padding-bottom: 20px;
            .van-button {
                margin: 0 10px;
                border-radius: 2px;
                &:first-child {
                    margin-left: 20px;
                    color: var(--color);
                    background: var(--contentColor);
                }
                &:last-child {
                    margin-right: 20px;
                }
            }
        }
    }
    .dialog-body {
        padding-bottom: rem(60px);
        overflow-y: auto;
        .words {
            font-size: rem(28px);
            text-align: center;
        }
    }
    .dialog-footer {
        padding-bottom: 20px;
        .van-button {
            margin: 0 10px;
            border-radius: 2px;
            &:first-child {
                margin-left: 20px;
                color: var(--color);
                background: var(--primaryAssistColor);
            }
            &:last-child {
                margin-right: 20px;
            }
        }
    }
}
</style>
