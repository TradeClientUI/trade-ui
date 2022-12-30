<template>
    <Top show-center @back='back' />
    <div class='page-wrap'>
        <van-cell-group>
            <van-cell is-link :title='$t("cRoute.authentication")' to='/authentication' />
            <!-- <van-cell is-link :title='$t("cRoute.bankList")' to='/bankList' /> -->
            <van-cell is-link :title='$t("faceAuth.faceDetect")' @click='toFaceDetect'>
                <template #right-icon>
                    <van-icon class='right-icon' :color='faceDetectSuccess ? $style.success : $style.minorColor' :name="faceDetectSuccess ? 'success': 'arrow'" />
                </template>
            </van-cell>
            <!-- <van-cell is-link :title='$t("cRoute.walletAddress")' to='/walletAddress' /> -->
        </van-cell-group>
    </div>
</template>

<script>
import Top from '@/components/top'
import { useRouter } from 'vue-router'
import { localGet } from '@/utils/util'
export default {
    components: {
        Top
    },
    setup (props) {
        const router = useRouter()
        const back = () => {
            router.replace('/')
        }
        const faceDetectSuccess = localGet('faceDetectSuccess')
        const toFaceDetect = () => {
            if (!faceDetectSuccess) {
                router.push('/faceDetect')
            }
        }
        return {
            back,
            faceDetectSuccess,
            toFaceDetect
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    height: 100%;
    background-color: var(--bgColor);
    .right-icon {
        font-size: rem(29px);
    }
}
</style>
