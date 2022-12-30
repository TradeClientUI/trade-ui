<template>
    <div class='page-wrap'>
        <div class='page-top' :class="{ 'isLogin':isLogin }">
            <div class='left'>
                <p class='text_title'>
                    {{ $t('JG_referral.text1') }}
                </p>
                <p class='text_content'>
                    <span class='text_content_left'>
                        {{ $t('JG_referral.text2') }}
                    </span>
                    <span>{{ $t('JG_referral.text3') }}</span>
                </p>
                <p class='btn' @click='showRules = true'>
                    {{ $t('JG_referral.rulesBtn') }}
                </p>
            </div>
            <div v-if='isLogin' class='right'>
                <p class='data'>
                    <span class='copydata'>
                        {{ customerNo }}
                    </span>
                    <img alt='' class='copyid copy_icon' :data-clipboard-text='customerNo' src='../../../../images/business/openAccount/copy.svg' @click='copyID($event)' />
                </p>
                <p class='desc'>
                    {{ $t('JG_referral.referralID') }}
                </p>
                <p class='data'>
                    <span class='copydata'>
                        {{ resLink }}
                    </span>
                    <img
                        ref='refcopyurl'
                        alt=''
                        class='copyurl copy_icon'
                        :data-clipboard-text='resLink'
                        src='../../../../images/business/openAccount/copy.svg'
                        @click='copyURL($event)'
                    />
                </p>
                <p class='desc'>
                    {{ $t('JG_referral.referralLink') }}
                </p>
                <p id='qrcod' ref='qrcodeRef' class='code' @click='showCode = true'></p>
                <p class='btn' @click='showInvite = true'>
                    {{ $t('JG_referral.text1') }}
                </p>
            </div>
        </div>
        <FinancialData v-if='isLogin' />
        <Recommendition v-else v-model:show='isLogin' />
        <!-- 邀请好友弹窗 -->
        <el-dialog
            v-model='showInvite'
            :close-on-click-modal='true'
            custom-class='dialogInvite'
            :show-close='false'
            title=''
            width='560px'
            @close='showInvite = false'
        >
            <Invite v-if='showInvite' ref='refInvite' :res-link='resLink' />
            <template #footer>
                <div class='InviteFooter'>
                    <img alt='' class='icon' src='../../../../images/business/openAccount/facebookfacebook52.png' @click='handleInvite(1)' />
                    <img alt='' class='icon' src='../../../../images/business/openAccount/tuitetwitter43.png' @click='handleInvite(2)' />
                    <img alt='' class='icon' src='../../../../images/business/openAccount/telegram.png' @click='handleInvite(3)' />
                    <img alt='link' class='icon' src='../../../../images/business/openAccount/link.png' @click='handleInvite(4)' />
                    <img alt='download' class='icon' src='../../../../images/business/openAccount/download.png' @click='handleInvite(5)' />
                </div>
            </template>
        </el-dialog>

        <!-- 二维码弹窗 -->
        <el-dialog
            v-model='showCode'
            :close-on-click-modal='true'
            custom-class='dialogCode'
            title=''
            width='360px'
            @close='showCode = false'
        >
            <template #title>
                <img alt='' class='dialogCode_header' src='../../../../images/business/openAccount/video_index.png' />
                <!-- 立即注册 一起赚币 -->
                <p class='dialogCode_title'>
                    {{ $t('JG_referral.referralTitle') }}
                </p>
            </template>
            <ReferralCode v-if='showCode' :customer-no='customerNo' :res-link='resLink' />
        </el-dialog>

        <!-- 详情弹窗 -->
        <el-dialog
            v-model='showRules'
            :close-on-click-modal='true'
            custom-class='dialogRules'
            title=''
            width='560px'
            @close='showRules = false'
        >
            <template #title>
                <p class='dialogRules_title'>
                    {{ $t('JG_referral.rulesTitle') }}
                </p>
            </template>
            <DetailedRules v-if='showRules' />
        </el-dialog>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import FinancialData from '../financialData/index'
import Recommendition from '../recommendition/index'
import Invite from '../dialogItem/Invite'
import ReferralCode from '../dialogItem/referralCode'
import DetailedRules from '../dialogItem/detailedRules'
import ClipboardJS from 'clipboard'
import Qrcodejs from 'qrcodejs2'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import { getCookie } from '@/utils/util'
import { useStore } from 'vuex'
export default {
    components: {
        FinancialData,
        Recommendition,
        Invite,
        ReferralCode,
        DetailedRules
    },
    setup () {
        const store = useStore()
        const isLogin = computed(() => !!store.state._user.customerInfo?.customerNo)
        const showInvite = ref(false) // 是否显示邀请朋友弹窗
        const showCode = ref(false) // 是否显示二维码弹窗
        const showRules = ref(false) // 是否显示规则详情弹窗
        const customerNo = computed(() => store.state._user.customerInfo.customerNo) // 获取账户信息
        const { t } = useI18n({ useScope: 'global' })
        const refInvite = ref() // 用于获取页面上的邀请组件元素
        const refcopyurl = ref() // 用于获取页面上的复制邀请链接的元素img

        // 生成邀请url
        const currentOrigin = window.location.origin // 当前环境的端口
        const lang = getCookie('lang') || 'zh-CN' // 当前语言环境
        const resLink = currentOrigin + '/' + lang + '/register?ref=' + customerNo.value + '&utm_campaign=web_share_link' // 分享的链接地址

        // 复制ID
        const copyID = ($event) => {
            const clipboard = new ClipboardJS('.copyid')
            clipboard.on('success', function (e) {
                Toast(t('common.copySuccess'))
                e.clearSelection()
                // 释放内存
                clipboard.destroy()
            })
            clipboard.on('error', e => {
                // 释放内存
                clipboard.destroy()
            })
            clipboard.onClick($event)
        }

        // 复制邀请url
        const copyURL = ($event) => {
            const clipboard = new ClipboardJS('.copyurl')
            clipboard.on('success', function (e) {
                Toast(t('common.copySuccess'))
                e.clearSelection()
                // 释放内存
                clipboard.destroy()
            })
            clipboard.on('error', e => {
                // 释放内存
                clipboard.destroy()
            })
            clipboard.onClick($event)
        }

        // 邀请朋友
        const handleInvite = (type) => {
            const text = 'Click the link to start your cryptocurrency journey.' // 分享的文案
            let links = resLink + '&utm_source='
            switch (type) {
                case 1: // 分享到facebook
                    links = links + 'sharefacebook'
                    window.open(`https://www.facebook.com/sharer.php?u=${links}&t=${encodeURIComponent(text)}`, '_blank')
                    break
                case 2: // 分享到twitter
                    links = links + 'sharetwitter'
                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(links)}&text=${encodeURIComponent(text)}`, '_blank')
                    break
                case 3: // 分享到telegram
                    links = links + 'sharetelegram'
                    window.open(`https://telegram.me/share/url?url=${encodeURIComponent(links)}&text=${encodeURIComponent(text)}`, '_blank')
                    break
                case 4: // 复制链接
                    refcopyurl.value.click()
                    break
                case 5: // 下载图片
                    refInvite.value.imgDownload()
                    break
            }
        }
        const qrcodeRef = ref(null)
        const qrcod = ref(null)

        // 生成二维码
        const intQrcode = () => {
            qrcodeRef.value.innerHTML = ''
            qrcod.value = new Qrcodejs('qrcod', {
                text: resLink,
                width: 80,
                height: 80,
                colorDark: '#ffffff',
                colorLight: '#000000',
                correctLevel: Qrcodejs.CorrectLevel.H
            })
        }
        onMounted(() => {
            intQrcode()
        })

        return {
            isLogin,
            showInvite,
            showCode,
            showRules,
            customerNo,
            resLink,
            copyID,
            copyURL,
            handleInvite,
            refInvite,
            refcopyurl,
            qrcod,
            qrcodeRef
        }
    }
}

</script>

<style lang="scss" scoped>
.page-top{
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url('../../../../images/business/openAccount/topBg.png');
    background-size: 100% 100%;
    height: 392px;
    width: 100%;
    .left{
        width: 770px;
        text-align: center;
        .text_title{
            font-size: 30px;
            font-weight: 600;
            color: #FFFFFF;
            line-height: 35px;
        }
        .text_content{
            margin-top: 12px;
            margin-bottom: 28px;
            font-size: 20px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.7);
            line-height: 23px;
            &_left{
                margin-right: 60px;
            }
        }
        .btn{
            width: 180px;
            line-height: 44px;
            background: #ebb650;
            box-shadow: 0px 2px 0px 1px #E3A122;
            border-radius: 44px 44px 44px 44px;
            border: 1px solid #ebb650;
            font-size: 16px;
            font-weight: 600;
            color: #FFFFFF;
            text-align: center;
            cursor: pointer;
            margin: auto;
        }
    }

    .right{
        width: 267px;
        // height: 265px;
        background: rgba(232, 247, 255, 0.9);
        border-radius: 5px 5px 5px 5px;
        padding: 18px 20px 20px;
        .copy_icon{
            height: 14px;
            width: 14px;
            margin-left: 12px;
            vertical-align: middle;
            cursor: pointer;
        }
        .data{
            height: 24px;
            line-height: 24px;
            font-size: 16px;
            font-weight: 600;
            color:#333333;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .copydata{
                width: 90%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space:nowrap
            }
        }
        .desc{
            height: 21px;
            font-size: 14px;
            color:#999999;
            line-height: 24px;
            margin-bottom: 12px;
        }
        .code{
            width: 80px;
            margin-bottom: 18px;
            cursor: pointer;
        }
        .btn{
            width: 227px;
            height: 44px;
            line-height: 44px;
            background: #0062FF;
            box-shadow: 0px 2px 0px 1px #145ACC;
            border-radius: 44px 44px 44px 44px;
            color: #FFFFFF;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            cursor: pointer;
        }

    }
}
// 登录时切换样式
.isLogin{
    .left{
        width: 756px;
        text-align: start;
        margin-right: 177px;
        .btn{
            margin: 0;
        }
    }

}

.page-wrap{
    // 分享弹窗样式
    :deep(.dialogInvite){
        border-radius: 5px;
        .el-dialog__body{
            padding-top: 2px;
        }
        .el-dialog__footer{
            background: #F3F3F3;
            padding: 16px 48px;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
        }
    }
    // 分享页脚
    .InviteFooter{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .icon{
            width: 32px;
            cursor: pointer;
        }
    }

    // 二维码弹窗
    :deep(.dialogCode){
        background-color: #333333;
        border-radius: 5px;
        .el-dialog__body{
            padding: 14px 72px 36px;
        }
    }
    .dialogCode_title{
        height: 24px;
        font-size: 16px;
        font-weight: 600;
        color: #FFFFFF;
        line-height: 24px;
    }
    .dialogCode_header{
        height: 22px;
        margin-bottom: 2px;
    }
    // 细则弹窗样式
    :deep(.dialogRules){
        border-radius: 5px;
        .el-dialog__body{
            padding: 15px 30px;
            word-break: keep-all;
        }
        .el-dialog__header{
            height: 73px;
            text-align: center;
            font-size: 30px;
            font-weight: 600;
            color: #FBFBFB;
            line-height: 73px;
            background-color: #ebb650;
            padding: 0;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }
        .el-dialog__headerbtn{
            top: 0;
            .el-icon-close{
                color: #FFFFFF;
                font-size: 30px;
            }
        }
    }
}

</style>
