<template>
    <div :style='data.styleObj'>
        <div v-if="userAccountType==='G'" class='mineGuest'>
            <img class='faceImg' :src='faceImg' />
            <div class='guestBts'>
                <button class='btn' @click="$router.push('/login')">
                    {{ $t('login.loginOrRegist') }}
                </button>
            </div>
        </div>
        <div v-else class='personInfo'>
            <div class='personNo'>
                <img class='faceImg' :src='faceImg' />
                <div v-if='customerInfo' class='customerNo'>
                    <p class='text1'>
                        Hi,
                        <span v-if='customerInfo?.phone'>
                            {{ hideMobileInfo(customerInfo?.phone) }}
                        </span>
                        <span v-else>
                            {{ hideEmailInfo(customerInfo?.email) }}
                        </span>
                    </p>
                    <p class='text2'>
                        ID: {{ customerInfo.customerNo }}
                        <i class='icon_fuzhi copy-btn' :data-clipboard-text='customerInfo.customerNo' @click='copyCustomerNo'></i>
                    </p>
                    <!-- <span v-if='Number(customerInfo.kycStatus) !== 0' class='status' :class='kycStateMap[customerInfo.kycStatus].className' @click="$router.push('/authentication')">
                        <span class='icon' :class='customerInfo.kycStatus === -1 ? kycStateMap[customerInfo.kycStatus].icon[customerInfo.kycRemark] : kycStateMap[customerInfo.kycStatus].icon'>
                        </span>

                        <span v-if='customerInfo.kycStatus === -1'>
                            {{ kycMap[customerInfo.kycRemark] }}
                        </span>
                        <span v-else-if='customerInfo.kycStatus!==0'>
                            {{ kycStateTextMap[customerInfo.kycStatus] }}
                        </span>
                    </span> -->
                </div>
            </div>
            <div v-if='data.src' class='capitalImg'>
                <!-- <img alt='' src='/images/minePlace.png' /> -->
                <ImgComp :data='data' />
            </div>
            <!-- <fund /> -->
        </div>
    </div>
</template>

<script>
import Clipboard from 'clipboard'
import ImgComp from '../img/img'
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { hideEmailInfo, hideMobileInfo } from '@/utils/util'
import { Toast } from 'vant'
import fund from './components/fund.vue'
const faceImgDefault = require('@plans/images/face.png')

export default {
    components: {
        ImgComp,
        fund,
    },
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    setup (props) {
        const { t, tm } = useI18n({ useScope: 'global' })
        const store = useStore()
        const faceImg = props.data.faceImg || faceImgDefault
        const adImg = props.src
        const userAccountType = computed(() => store.getters['_user/userAccountType'])
        const customerInfo = computed(() => store.state._user.customerInfo)
        const assets = computed(() => store.state._user.accountAssets)
        const miniAmountText = computed(() => assets.value?.balance?.length + assets.value?.availableMargin?.length > 25)
        const state = reactive({

        })

        const kycMap = {
            level_1: t('common.kycLevel1'),
            level_2: t('common.kycLevel2'),
            level_3: t('common.kycLevel3'),
        }
        const kycStateTextMap = tm('kycStateTextMap')
        const kycStateMap = {
            '0': { className: 'unverified', icon: 'icon_weirenzheng' },
            '1': { className: 'unverified', icon: 'icon_weirenzheng' },
            '2': { className: 'check', icon: 'icon_shenhezhong' },
            '3': { className: 'fail', icon: 'icon_renzhengshibai' },
            '4': { className: 'success', icon: 'icon_yirenzheng' },
            '-1': {
                className: 'custom',
                icon: {
                    'level_1': 'icon_jichurenzheng',
                    'level_2': 'icon_zhongjirenzheng',
                }
            }
        }

        // 赋值账号
        const copyCustomerNo = (value) => {
            var clipboard = new Clipboard('.copy-btn')
            clipboard.on('success', e => {
                Toast(t('common.copySuccess'))
                // 释放内存
                clipboard.destroy()
            })
        }

        return {
            ...toRefs(state),
            faceImg,
            userAccountType,
            customerInfo,
            assets,
            miniAmountText,
            kycMap,
            kycStateTextMap,
            kycStateMap,
            hideMobileInfo,
            hideEmailInfo,
            copyCustomerNo
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.mineGuest {
    padding: rem(40px) 0 rem(60px);
    background: var(--contentColor);
    .faceImg {
        display: block;
        width: rem(160px);
        height: rem(160px);
        margin: 0 auto;
        border-radius: 50%;
    }
    .guestBts {
        display: flex;
        justify-content: space-between;
        margin: rem(50px) rem(30px) 0;
        .btn {
            width: 100%;
            height: rem(80px);
            color: #FFF;
            font-size: rem(32px);
            line-height: 1;
            background: var(--primary);
            border-radius: rem(6px);
            letter-spacing: 1px;
        }
    }
}
.personInfo {
    padding: rem(60px) rem(20px);
    color: var(--color);
    background: var(--contentColor);
}
.personNo {
    position: relative;
    text-align: center;
    .faceImg {
        margin: 0 auto;
        display: block;
        width: rem(160px);
        height: rem(160px);
        border-radius: 50%;
    }
    .customerNo {
        display: inline-block;
        padding-top: rem(24px);
        font-size: rem(32px);
        .text1{
            font-size: rem(48px);
            font-weight: bold;
            margin-bottom: rem(6px);
        }
        .text2{
            font-size: rem(28px);
            color: var(--minorColor);
            .copy-btn{
                font-size: rem(22px);
            }
        }
    }
    .arrowIcon {
        color: var(--minorColor);
        vertical-align: 0;
    }
    .status {
        display: inline-block;
        height: rem(40px);
        margin-top: 3px;
        padding: 0 rem(20px) 0 rem(6px);
        color: var(--color);
        font-size: rem(20px);
        line-height: rem(40px);
        background: var(--bgColor);
        border-radius: rem(20px);
        &.unverified {
            color: var(--minorColor);
        }
        &.check {
            color: var(--primary);
            background: var(--primaryAssistColor);
        }
        &.success {
            color: #FF9E00;
            background: rgba(255, 158, 0, 0.08);
        }
        &.fail {
            color: var(--fallColor);
            background: rgba(239, 83, 83, 0.08);
        }
        &.custom {
            color: var(--success);
            background: rgba(38, 166, 154, 0.08);
        }
        .icon {
            margin-right: rem(8px);
        }
    }
}
.capitalImg {
    margin-top: rem(30px);
    text-align: center;
    background: var(--assistColor);
    img {
        width: 100%;
    }
}
</style>
