<template>
    <div :class="['Invite',{ 'ratio9_6': ratioValue === 1,'ratio1_1': ratioValue === 2,'ratio16_9': ratioValue === 3 }]">
        <div class='img_warp'>
            <div id='nodeBox' ref='getImageDom'>
                <div class='nodeHeader'>
                    <!-- 邀请好友 共同赚币 -->
                    <span>{{ $t('JG_referral.referralTitle') }}</span>
                </div>
                <div class='img'>
                    <img v-show='ratioValue === 1' alt='' class='img' src='../../../../images/business/openAccount/InviteFriends1.png' />
                    <img v-show='ratioValue === 2' alt='' class='img' src='../../../../images/business/openAccount/InviteFriends2.png' />
                    <img v-show='ratioValue === 3' alt='' class='img' src='../../../../images/business/openAccount/InviteFriends3.png' />
                </div>
                <div class='nodeFooter'>
                    <img alt='' class='logo' src='../../../../images/business/openAccount/video_index.png' />
                    <p id='qrcodeImg' ref='qrcodeImgRef' class='code' @click='showCode = true'></p>
                    <!-- <QrcodeVue class='code' level='H' :size='ratioValue == 1?108:64' :value='resLink' @click='showCode = true' /> -->
                </div>
            </div>
        </div>
        <el-row class='row'>
            <el-col :span='8'>
                <div class='ratio_btn' :class="{ 'active':ratioValue==1 }" @click='ratioValue = 1'>
                    <p class='example bg1'></p>
                    <span>9:16</span>
                    <i class='el-icon-success'></i>
                </div>
            </el-col>
            <el-col :span='8'>
                <div class='ratio_btn' :class="{ 'active':ratioValue==2 }" @click='ratioValue = 2'>
                    <p class='example bg2'></p>
                    <span>1:1</span>
                    <i class='el-icon-success'></i>
                </div>
            </el-col>
            <el-col :span='8'>
                <div class='ratio_btn' :class="{ 'active':ratioValue==3 }" @click='ratioValue = 3'>
                    <p class='example bg3'></p>
                    <span>16:9</span>
                    <i class='el-icon-success'></i>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Qrcodejs from 'qrcodejs2'
import { onMounted, ref } from 'vue'
import html2canvas from 'html2canvas'

export default {
    components: {},
    props: {
        resLink: String
    },
    setup (props) {
        const ratioValue = ref(2) // 比例标记值，1(9:6) 2(1:1)  3(16:9)
        // const getImageDom = ref() // 获取ImageDom
        const imgDownload = () => {
            const myBox = document.getElementById('nodeBox')
            setTimeout(() => {
                html2canvas(myBox, {
                    scale: 1
                }).then(function (canvas) {
                    const imgUrl = canvas.toDataURL('image/jpeg', 1)
                    var eleLink = document.createElement('a')
                    eleLink.href = imgUrl // 转换后的图片地址
                    eleLink.download = 'Vitatoken Referral'
                    // 触发点击
                    document.body.appendChild(eleLink)
                    eleLink.click()
                    // 然后移除
                    document.body.removeChild(eleLink)
                })
            }, 500)
        }
        const qrcodeImgRef = ref(null)
        const qrcodImg = ref(null)

        // 生成二维码
        const intQrcode = () => {
            qrcodeImgRef.value.innerHTML = ''
            qrcodImg.value = new Qrcodejs('qrcodeImg', {
                text: props.resLink,
                width: 108,
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
            qrcodImg,
            qrcodeImgRef,
            ratioValue,
            imgDownload
        }
    }
}
</script>

<style lang="scss" scoped>
.Invite{
    &.ratio9_6{
        .nodeHeader{ height: 122px; font-size: 30px;}
        .nodeFooter{ height: auto; }
        .img{ height: 386px; }
    }

    &.ratio1_1{
        .nodeHeader{ height: 41px; font-size: 20px;}
        .nodeFooter{ min-height: 88px; }
        .img{ height: 231px; }
    }
    &.ratio16_9{
        .nodeHeader{ height: 36px; font-size: 16px;}
        .nodeFooter{ min-height: 88px; }
        .img{ height: 146px; }
    }
}

.img_warp{
    display: flex;
    align-items: center;
    justify-content: center;
    #nodeBox{
        width: 360px;
        .nodeHeader{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            background-color: #ebb650;
            font-weight: 600;
            color: #FFFFFF;
            text-align: center;
            word-break: break-word;
        }
        .nodeFooter{
            padding: 12px;
            display: flex;
            justify-content: space-between;
            width: 100%;
            background: #2a2d32;
            .logo{
                height: 22px;
            }
        }
        .img{
            width: 100%;
        }
    }
}

.row{
    padding-top: 32px;
}
.ratio_btn{
    width: 167px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content:space-around;
    border-radius: 51px 51px 51px 51px;
    border: 1px solid #CCCCCC;
    color: #999999;
    font-size: 14px;
    .example{
        width: 43px;
        height: 24px;
        background: #B7BDC6;
        &.bg1{
            border-left: 14px solid #EEEFF1;
            border-right: 18px solid #EEEFF1;
        }
        &.bg2{
            border-left: 9px solid #EEEFF1;
            border-right: 10px solid #EEEFF1;
        }
    }
    &.active{
        border: 1px solid #ebb650;
        color: #EBB651;
        .example{
            background: #ebb650;
        }
    }
}
</style>
