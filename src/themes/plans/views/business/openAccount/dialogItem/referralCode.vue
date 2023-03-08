<template>
    <div class='referralCode'>
        <p class='header'>
            <van-icon class='cross' color='#FFFFFF' name='cross' size='24' @click='cross' />
        </p>
        <p class='title'>
            {{ $t('JG_referral.referralTitle') }}
        </p>
        <div class='code'>
            <p id='qrCode' ref='qrCodeRef' class='qrCode' @click='showCode = true'></p>
            <p class='hr'></p>
            <div class='idNumebr'>
                <!-- 推荐ID  -->
                <p class='desc'>
                    {{ $t('JG_referral.referralID') }}
                </p>
                <p class='h2'>
                    {{ customerNo }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import Qrcodejs from 'qrcodejs2'
import { onMounted, ref, toRefs } from 'vue'

export default {
    props: {
        resLink: String,
        customerNo: String
    },
    emits: ['close'],
    setup (props, { emit }) {
        const qrcodImg = ref(null)
        const qrCodeRef = ref(null)

        // 生成二维码
        const intQrcode = () => {
            // 清除二维码
            qrCodeRef.value.innerHTML = ''
            qrcodImg.value = new Qrcodejs('qrCode', {
                text: props.resLink,
                width: 200,
                height: 200,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: Qrcodejs.CorrectLevel.H
            })
        }
        // 关闭弹窗
        const cross = () => {
            emit('close', 'Code')
        }

        onMounted(() => {
            intQrcode()
        })

        return {
            ...toRefs(props),
            qrCodeRef,
            qrcodImg,
            cross
        }
    }
}

</script>

<style lang="scss" scoped>
.referralCode{
    background-color: #333333;
    padding: rem(36px);
    .header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        &_img{
            height: rem(44px);
        }
    }
    .title{
        font-size: rem(32px);
        font-weight: 500;
        color: #FFFFFF;
        margin-top: rem(8px);
    }
    .code{
        border-radius: rem(10px);
        // width: rem(400px);
        margin: rem(48px) auto;
        background: #FFFFFF;
        // padding: 36px;
        .qrCode{
            margin: rem(36px) auto;
            width: 200px;
            padding-top: rem(36px);
        }
        .hr{
            position: relative;
            height: rem(18px);
            &:before{
                position: absolute;
                content: "";
                width: rem(20px);
                height: rem(18px);
                left: rem(-10px);
                background-color: #333333;
                border-radius: 50px;
            }
            &:after{
                position: absolute;
                content: "";
                width: rem(20px);
                height: rem(18px);
                right: rem(-10px);
                background-color: #333333;
                border-radius: 50px;
            }
        }
        .idNumebr{
            padding-bottom: 12px;
            padding-top: 4px;
            text-align: center;
            .desc{
                height: rem(42px);
                line-height: rem(42px);
                font-size: rem(32px);
                font-weight: 500;
                color: #999999;
            }
            .h2{
                height: rem(60px);
                font-size: rem(40px);
                font-weight: 600;
                color: #333333;
                line-height: rem(60px);
            }
        }
    }
}

</style>
