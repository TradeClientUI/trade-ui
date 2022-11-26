<template>
    <div class='page-wrap'>
        <Top absolute back left-icon='arrow-left' :right-action='false' show-center />
        <p class='desc'>
            {{ $t('mfa.secretKeyDesc') }}
        </p>
        <div class='infoBox'>
            <div class='qrcodeWrapper'>
                <span id='qrcodeImg' ref='qrcodeImgRef' class='qrcodeImg'></span>
            </div>
            <van-cell v-if='secret' :title='secret'>
                <template #right-icon>
                    <a class='copyBtn' :data-clipboard-text='secret' href='javascript:;' @click='copySecret($event)'>
                        {{ $t('common.copy') }}
                    </a>
                </template>
            </van-cell>
        </div>
        <div class='footerBox'>
            <van-button block :disabled='!qrcodeId' type='primary' @click="routerTo('/googleMFA/bind',{ id:qrcodeId })">
                {{ $t('mfa.bind') }}
            </van-button>
        </div>
    </div>
</template>

<script >
import Top from '@/components/top'
import { generateGoogleAccount } from '@/api/user'
import { onMounted, ref } from 'vue'
import ClipboardJS from 'clipboard'
import Qrcodejs from 'qrcodejs2'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

export default {
    components: {
        Top,
    },
    setup () {
        const router = useRouter()
        const route = useRoute()

        const qrcodeId = ref(null)
        const qrcode = ref(null)
        const qrcodImg = ref(null)
        const qrcodeImgRef = ref(null)
        const secret = ref(null)
        const { t } = useI18n({ useScope: 'global' })

        // 路由跳转
        const routerTo = (path, query) => {
            const routeMatched = route.matched
            const parent = routeMatched[routeMatched.length - 2]
            router.push({ path: parent.path + path, query })
        }

        // 生成谷歌验证账号
        const getQrcodeInfo = () => {
            generateGoogleAccount().then(res => {
                if (res.check()) {
                    const data = res.data
                    qrcodeId.value = data.id
                    qrcode.value = data.qrcode
                    secret.value = data.secret
                    qrcodeImgRef.value.innerHTML = ''
                    qrcodImg.value = new Qrcodejs('qrcodeImg', {
                        text: data.qrcode,
                        width: 128,
                        height: 128,
                        colorDark: '#000000',
                        colorLight: '#ffffff',
                        correctLevel: Qrcodejs.CorrectLevel.H
                    })
                }
            })
        }

        // 复制
        const copySecret = ($event) => {
            console.log('copySecret')
            const clipboard = new ClipboardJS('.copyBtn')

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

        onMounted(() => {
            getQrcodeInfo()
        })

        return {
            qrcodeId,
            qrcode,
            qrcodImg,
            qrcodeImgRef,
            secret,
            routerTo,
            copySecret,
        }
    }
}

</script>

<style lang="scss" scoped>
.page-wrap {
    width: 100%;
    height: 100%;
    margin-top: rem(110px);
    margin-bottom: rem(110px);
    overflow: auto;
    // background: var(--contentColor);
    :deep(.topNav .main) {
        max-width: 100%;
    }
    .desc {
        margin: 0 rem(30px);
        padding-top: rem(30px);
        // color: var(--minorColor);
        line-height: 1.7;
    }
    .infoBox {
        margin: rem(40px) rem(30px) 0;
        .qrcodeWrapper {
            width: 128px;
            height: 128px;
            margin: rem(30px) auto rem(80px);
        }
    }
    .copyBtn {
        color: var(--primary);
    }
    .footerBox {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
    }
}
</style>
