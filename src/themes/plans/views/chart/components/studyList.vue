<template>
    <van-popup
        v-model:show='showList'
        :close-on-click-overlay='false'
        closeable
        :duration='0.2'
        :get-container='getContainer'
        round
        :style="{ width: '90%' }"
        @click-close-icon='onClose'
        @closed='closed'
    >
        <div class='content'>
            <span class='type'>
                {{ $t('chart.mainStudy') }}
            </span>
            <!-- :style="{ 'font-size': (1/item.label.length/6) + 24/75+'rem' }" -->
            <div class='list'>
                <span
                    v-for='(item, i) in MAINSTUDIES'
                    :key='i'
                    class='item of-1px'
                    :class="{ 'active': mainStudy === item.name }"
                    :style="[{ 'font-size': item.label.length >=6 ? '0.28rem': '' } ]"
                    @touchend='onClick("main", item.name)'
                >
                    {{ item.label }}
                </span>
            </div>

            <span class='type'>
                {{ $t('chart.subStudy') }}
            </span>
            <div class='list'>
                <span
                    v-for='(item, i) in SUBSTUDIES'
                    :key='i'
                    class='item of-1px'
                    :class="{ 'active': subStudy === item.name }"
                    :style="[{ 'font-size': item.label.length >6 ? '0.28rem': '' } ]"
                    @touchend='onClick("sub", item.name)'
                >
                    {{ item.label }}
                </span>
                <span v-for='item in (5 - SUBSTUDIES.length %5)' :key='"other" + item' class='item of-1px' style='opacity: 0;'></span>
            </div>

            <div class='submit' @click='onSubmit'>
                {{ $t('confirm') }}
            </div>
        </div>
    </van-popup>
</template>

<script>
import { MAINSTUDIES, SUBSTUDIES } from '@/components/tradingview/datafeeds/userConfig/config'
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        propMainStudy: {
            type: String,
            default: ''
        },
        propSubStudy: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            MAINSTUDIES,
            SUBSTUDIES,
            list: [],
            mainStudy: '',
            subStudy: '',
            showList: false
        }
    },
    watch: {
        show (val) {
            this.showList = val
        },
        propMainStudy: {
            immediate: true,
            handler (val) {
                const study = this.MAINSTUDIES.find(e => e.name === val)
                this.mainStudy = study ? val : null
            }
        },
        propSubStudy: {
            immediate: true,
            handler (val) {
                const study = this.SUBSTUDIES.find(e => e.name === val)
                this.subStudy = study ? val : null
            }
        }
    },
    methods: {
        onSubmit () {
            this.$emit('updateStudy', [this.mainStudy, this.subStudy])
            this.onClose()
        },
        onClose () {
            this.$emit('update:show', false)
        },
        closed () {
            this.mainStudy = this.propMainStudy
            this.subStudy = this.propSubStudy
            this.$emit('update:show', false)
        },
        onClick (type, name) {
            switch (type) {
                case 'main': {
                    this.mainStudy = this.mainStudy === name ? '' : name
                    break
                }
                case 'sub': {
                    this.subStudy = this.subStudy === name ? '' : name
                    break
                }
            }
        },
        getContainer () {
            return document.body
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.van-popup {
    width: 90%;
    max-width: rem(736px);
    .content {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: rem(50px) 0 0;
        background-color: var(--bgColor);
        .type {
            margin: rem(10px) 0;
            padding: 0 rem(30px);
            font-size: rem(28px);
        }
        .list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-bottom: rem(20px);
            padding: 0 rem(25px);
            .item {
                flex: 0 0 rem(112px);
                box-sizing: border-box;
                margin: rem(10px) rem(5px);
                color: var(--color);
                font-weight: normal;
                font-size: rem(24px);
                line-height: rem(40px);
                text-align: center;
                border: 1px solid var(--lineColor);
                &.active {
                    color: #FFF;
                    background: var(--primary);
                    border-color: var(--primary);
                }
            }
        }
        .submit {
            box-sizing: border-box;
            width: 100%;
            height: rem(70px);
            margin-top: rem(30px);
            color: #FFF;
            line-height: rem(70px);
            text-align: center;
            background: var(--primary);
        }
    }
}
</style>
