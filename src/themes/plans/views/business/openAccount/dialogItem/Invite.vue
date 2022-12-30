<template>
    <div class='Invite'>
        <van-loading v-if='downloading' class='loading' size='48' />
        <div class='img_warp'>
            <div id='nodeBox' ref='getImageDom'>
                <div class='nodeHeader'>
                    <!-- 邀请好友 共同赚币 -->
                    <span>{{ $t('JG_referral.referralTitle') }}</span>
                </div>
                <div class='img'>
                    <img class='img' src='../../../../images/business/openAccount/InviteFriends2.png' />
                </div>
                <div class='nodeFooter'>
                    <img alt='' class='logo' src='../../../../images/business/openAccount/video_index.png' />
                    <!-- <QrcodeVue class='code' level='H' :size='ratioValue == 1?108:64' :value='resLink' @click='showCode = true' /> -->
                    <p id='inviteCode' ref='inviteCodeRef' class='code'></p>
                </div>
            </div>
        </div>
        <div class='InviteFooter'>
            <img alt='' class='icon' src='../../../../images/business/openAccount/facebookfacebook52.png' @click='inviteTo(1)' />
            <img alt='' class='icon' src='../../../../images/business/openAccount/tuitetwitter43.png' @click='inviteTo(2)' />
            <img alt='' class='icon' src='../../../../images/business/openAccount/telegram.png' @click='inviteTo(3)' />
            <img
                alt='link'
                class='icon'
                src='../../../../images/business/openAccount/link.png'
                @click='inviteTo(4)'
            />
            <img alt='download' class='icon' src='../../../../images/business/openAccount/download.png' @click='imgDownload' />
        </div>
    </div>
</template>

<script>
import { ref, onMounted, toRefs } from 'vue'
import html2canvas from 'html2canvas'
import Qrcodejs from 'qrcodejs2'

export default {
    props: {
        resLink: String
    },
    emits: ['copyURL'],
    setup (props, { emit }) {
        const ratioValue = ref(3) // 比例标记值，1(9:6) 2(1:1)  3(16:9)
        const qrcodImg = ref(null)
        const inviteCodeRef = ref(null)
        // 生成二维码
        const intQrcode = () => {
            // 清除二维码
            inviteCodeRef.value.innerHTML = ''
            qrcodImg.value = new Qrcodejs('inviteCode', {
                text: props.resLink,
                width: 80,
                height: 80,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: Qrcodejs.CorrectLevel.H
            })
        }

        const downloading = ref(false)
        const imgDownload = () => {
            const myBox = document.getElementById('nodeBox')
            downloading.value = true
            setTimeout(() => {
                html2canvas(myBox, {
                    scale: 1
                }).then(function (canvas) {
                    const imgUrl = canvas.toDataURL('image/jpeg', 1)
                    const eleLink = document.createElement('a')
                    eleLink.href = imgUrl // 转换后的图片地址
                    eleLink.download = 'MagnaMarkets Referral'
                    // 触发点击
                    document.body.appendChild(eleLink)
                    eleLink.click()
                    // 然后移除
                    document.body.removeChild(eleLink)
                    downloading.value = false
                })
            }, 500)
        }

        // 邀请朋友
        const inviteTo = (type) => {
            const text = 'Click the link to start your cryptocurrency journey.' // 分享的文案
            let links = props.resLink + '&utm_source='
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
                case 4: // 分享到telegram
                    emit('copyURL')
                    break
            }
        }

        onMounted(() => {
            intQrcode()
        })

        return {
            ...toRefs(props),
            ratioValue,
            downloading,
            imgDownload,
            qrcodImg,
            inviteCodeRef,
            inviteTo,
        }
    }
}
</script>

<style lang="scss" scoped>
.Invite {
    .nodeHeader {
        height: rem(84px);
        font-size: rem(38px);
    }
    .img {
        height: rem(460px);
    }
}
.img_warp {
    display: flex;
    align-items: center;
    justify-content: center;
    #nodeBox {
        width: 360px;
        .nodeHeader {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            background-color: #EBB650;
            font-weight: 500;
            color: #FFF;
            text-align: center;
            word-break: break-word;
        }
        .nodeFooter {
            padding: 12px;
            display: flex;
            justify-content: space-between;
            width: 100%;
            background: #2A2D32;
            .logo {
                height: 22px;
            }
            .code {
                border: 2px solid #FFF;
                height: 84px;
            }
        }
        .img {
            width: 100%;
        }
    }
}

// 分享页脚
.InviteFooter {
    height: rem(112px);
    display: flex;
    align-items: center;
    justify-content: space-around;
    .icon {
        width: rem(48px);
    }
}
.loading {
    position: fixed;
    left: calc(50% - 24px);
    top: 30%;
}
</style>
