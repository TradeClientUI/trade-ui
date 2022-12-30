<template>
    <div class='code'>
        <p id='qrcodeImg' ref='qrcodeImgRef' class='img' @click='showCode = true'></p>
        <p class='hr'></p>
        <div class='idNumebr'>
            <!-- 推荐ID  -->
            <p class='desc'>
                Referral ID
            </p>
            <p class='h2'>
                {{ customerNo }}
            </p>
        </div>
    </div>
</template>

<script>
import Qrcodejs from 'qrcodejs2'
import { onMounted, ref } from 'vue'

export default {
    components: {},
    props: {
        resLink: String,
        customerNo: String
    },
    setup (props) {
        const qrcodeImgRef = ref(null)
        const qrcodImg = ref(null)

        // 生成二维码
        const intQrcode = () => {
            qrcodeImgRef.value.innerHTML = ''
            qrcodImg.value = new Qrcodejs('qrcodeImg', {
                text: props.resLink,
                width: 180,
                height: 180,
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
        }
    }
}

</script>

<style lang="scss" scoped>
.code{
    background-color: #FFFFFF;
    width: 216px;
    border-radius: 5px;
    .img{
        height: 180px;
        margin: 18px 18px 6px;
        padding-top: 18px;
    }
    .hr{
        height: 9px;
        &:before{
            position: absolute;
            content: "";
            width: 10px;
            height: 9px;
            left: 66px;
            background-color: #333333;
            border-radius: 50px;
        }
        &:after{
            position: absolute;
            content: "";
            width: 10px;
            height: 9px;
            right: 66px;
            background-color: #333333;
            border-radius: 50px;
        }
    }
    .idNumebr{
        padding-bottom: 12px;
        padding-top: 4px;
        text-align: center;
        .desc{
            height: 21px;
            font-size: 16px;
            font-weight: 600;
            color: #999999;
            line-height: 21px;
        }
        .h2{
            height: 30px;
            font-size: 20px;
            font-weight: 600;
            color: #333333;
            line-height: 30px;
        }
    }
}

</style>
