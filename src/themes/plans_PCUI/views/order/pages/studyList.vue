<template>
    <div class='popup-warp'>
        <van-popup
            v-model:show='showList'
            class='popup'
            :close-on-click-overlay='true'
            closeable
            :get-container='getContainer'
            :style="{ width: '520px' }"
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
                        class='item'
                        :class="{ 'active': mainStudy === item.name }"
                        @click='onClick("main", item.name)'
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
                        class='item'
                        :class="{ 'active': subStudy === item.name }"
                        @click='onClick("sub", item.name)'
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
    </div>
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
.popup-warp{
    :deep(.van-popup){
        border-radius: 8px;
        .content {
            display: flex;
            height: 100%;
            flex-direction: column;
            width: 100%;
            padding: rem(50px) rem(20px) rem(35px) rem(20px);
            .type {
                margin: rem(10px) 0;
                padding: 0 rem(30px);
                font-size: rem(36px);
                font-weight: bold;
            }
            .list {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: flex-start;
                margin-bottom: rem(20px);
                padding: 10px 0;
                .item {
                    cursor: pointer;
                    padding: 8px 10px;
                    flex: 0 0 rem(112px);
                    box-sizing: border-box;
                    margin: 6px 10px;
                    color: var(--color);
                    font-weight: normal;
                    line-height: rem(40px);
                    text-align: center;
                    border: 1px solid var(--lineColor);
                    border-radius: 4px;
                    transition: all 0.2s ease 0s;
                    &:hover{
                        border-color: var(--primary);
                    }
                    &.active {
                        color: #FFF;
                        background: var(--primary);
                        border-color: var(--primary);
                    }
                }
            }
            .submit {
                box-sizing: border-box;
                width: 88%;
                height: 45px;
                color: #FFF;
                line-height: 45px;
                text-align: center;
                background: var(--primary);
                margin: 10px auto;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease 0s;
                font-size: 16px;
                &:hover{
                    background: var(--primary);
                    opacity: 0.8;
                }
                &:focus, &:active{
                    transform: scale(0.99);
                }
            }
        }
        .van-popup__close-icon{
            &:hover{
                opacity: .8;
            }
        }
    }
}

</style>
