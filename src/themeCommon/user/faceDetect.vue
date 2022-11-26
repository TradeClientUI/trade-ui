<template>
    <div class='page-wrap'>
        <layoutTop :custom-back='true' @back='back' />
        <Loading :show='loading' />
        <!-- 认证成功 -->
        <div class='main'>
            <div v-show='reacShow' class='success'>
                <i class='icon_success'></i>
                <p>{{ $t('faceAuth.verifiedSuccessfully') }}</p>
            </div>

            <canvas v-show='resultCanvasShow' id='mainCanvas'></canvas>
            <div v-show='reacShow' class='rect' :style='classObj'></div>
            <div id='mainMask' class='mask' style='display: none;'></div>
        </div>
        <!-- 认证失败 -->
        <div v-if='videoShow' class='video'>
            <p class='notice'>
                {{ $t('faceAuth.faceDetectTip') }}
            </p>
            <video
                autoplay
                playsinline
            >
            </video>
            <div class='mask'></div>
        </div>
        <div v-if='videoShow' class='btns'>
            <van-button v-if='!cameraFlag' type='primary' @click='openCamera'>
                {{ $t('faceAuth.open') }}
            </van-button>
            <van-button v-if='cameraFlag' :loading='loading' type='primary' @click='takeSnapshot'>
                {{ $t('faceAuth.submitVerification') }}
            </van-button>
        </div>
        <div v-if='faceDetectSuccess' class='btns'>
            <van-button type='primary' @click='$router.back()'>
                {{ $t('faceAuth.done') }}
            </van-button>
        </div>
    </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { computed, reactive, toRefs, ref, unref, watch, onUnmounted, onMounted } from 'vue'
import { faceDetect, findAllLevelKyc, kycLevelApply, kycApply } from '@/api/user'
import axios from 'axios'
import qs from 'qs'
import { localSet, getArrayObj, isEmpty } from '@/utils/util'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import { upload } from '@/api/base'

const constraints = {
    audio: false,
    video: true
}

export default {
    setup (props) {
        const router = useRouter()
        const route = useRoute()
        const { t, tm } = useI18n({ useScope: 'global' })
        const { levelCode, businessCode } = route.query
        const state = reactive({
            faceDetectSuccess: false,
            classObj: {},
            reacShow: false,
            resultCanvasShow: false,
            videoShow: true,
            loading: false,
            kycList: {},
            uploadURL: '',
            pathCode: '',
            cameraFlag: false
        })
        let video
        const gotStream = (stream) => {
            state.cameraFlag = true
            window.stream = stream // 拿到stream实例存一下
            video.srcObject = stream
        }
        let mCanvas

        const openCamera = (e) => {
            try {
                navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(onError)
            } catch (error) {
                console.log('暂不支持该设备')
            }
        }

        // 点击截取图片
        const takeSnapshot = (e) => {
            if (state.cameraFlag && window.stream && video.srcObject) {
                state.loading = true
                state.resultCanvasShow = true
                mCanvas = window.canvas = document.querySelector('#mainCanvas')
                mCanvas.width = 480
                mCanvas.height = 360
                mCanvas.width = video.videoWidth
                mCanvas.height = video.videoHeight
                mCanvas.getContext('2d').drawImage(video, 0, 0, mCanvas.width, mCanvas.height)

                // 新增1张
                var divItem = document.createElement('div')
                divItem.style.display = 'block'
                divItem.width = 100
                divItem.height = divItem.width * video.videoHeight / video.videoWidth // 计算一下比例
                divItem.style.width = divItem.width + 'px'
                divItem.style.height = divItem.height + 'px'
                console.log('div item size: ', divItem.width, divItem.height)

                var c1 = document.createElement('canvas')
                c1.width = 1000
                c1.height = 1000
                c1.getContext('2d').drawImage(video, 0, 0, mCanvas.width, mCanvas.height, 0, 0, c1.width, c1.height)
                console.log('video===', video)
                divItem.appendChild(c1)
                // 隐藏video
                state.videoShow = false
                c1.toBlob(function (blobObj) {
                    uploadImg(blobObj)
                    console.log('blob', blobObj) // blobObj就是blob对象（类文件）
                })
                document.getElementById('mainMask').style.display = 'block'
            } else {
                state.loading = false
                return Toast(t('faceAuth.openCarme'))
            }
        }

        // 上传图片
        const uploadImg = (blob) => {
            const formData = new FormData()
            formData.append('object', blob)

            upload(
                formData
            ).then(res => {
                state.loading = false
                if (res.check()) {
                    // state.conditionModel[detail.name] = res.data
                    // Toast(t('auth.uploadSuccess'))
                    state.uploadURL = res.data
                    submitKYC()
                }
            }).catch(err => {
                state.loading = false
                console.log(err)
            })
        }

        const submitKYC = () => {
            const { levelCode, elementList } = state.kycList
            let paramsKycList = []
            if (Array.isArray(elementList)) {
                paramsKycList = elementList.map(el => {
                    if (el.showType === 'face_photo') {
                        return {
                            elementCode: 'face_photo',
                            elementValue: state.uploadURL
                        }
                    }
                })
            }
            let params, kycApi

            if (!isEmpty(props.businessCode)) {
                params = {
                    businessCode,
                    levelCode,
                    elementList: paramsKycList
                }
                kycApi = kycApply
            } else {
                params = {
                    levelCode,
                    elementList: paramsKycList,
                    pathCode: state.pathCode
                }
                kycApi = kycLevelApply
            }
            state.loading = true
            kycApi(params).then(res => {
                state.loading = false
                if (res.check()) {
                    if (props.platform === 'web') {
                        const parentPath = route.matched[route.matched.length - 2]
                        router.push({ path: parentPath.path + '/kycCommitted' })
                    } else {
                        router.replace({ name: 'KycCommitted' })
                    }
                }
            }).catch(err => {
                state.loading = false
                console.log(err)
            })
        }

        // 提交第三方验证
        const toVerification = (base64) => {
            const formData = new FormData()
            formData.append('api_key', 'c4wGaiW6hAbnAwSta2WdNm3v1fbdn6Lc')
            formData.append('api_secret', 'JFmsAxsey_NN_1IU7DbuzS_3O4AUcgxu')
            formData.append('image_file', base64)

            const url = 'https://120.79.87.9:7443/facepp/v3/detect'
            axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
                console.log('res', res)
                state.loading = false
                if (res.data.face_num === 1) {
                    localSet('faceDetectSuccess', true)
                    state.faceDetectSuccess = true
                    const rectangle = res.data.faces[0].face_rectangle
                    const widthrate = document.body.clientWidth / 1000
                    const heightRate = mCanvas.clientHeight / 1000
                    let style = ''
                    for (const key in rectangle) {
                        if (rectangle.hasOwnProperty(key)) {
                            if (key !== 'top') {
                                const val = rectangle[key] * widthrate + 'px'
                                style += key + ':' + val + ';'
                            } else {
                                const val = rectangle[key] * heightRate + 90 + 'px'
                                style += key + ':' + val + ';'
                            }
                        }
                    }
                    state.reacShow = true
                    state.classObj = style
                } else {
                    Toast(t('faceAuth.verificationFailed'))
                }
            }).catch(error => {
                state.loading = false
                Toast(t('faceAuth.verificationFailed'))
            })
        }

        const onError = (error) => {
            console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name)
        }

        const getConditon = () => {
            findAllLevelKyc({
                levelCode: levelCode
            }).then(res => {
                if (res.check()) {
                    state.kycList = res.data[0]
                    state.pathCode = res.data[0].pathCode
                }
            }).catch(err => {

            })
        }
        const back = () => {
            router.push('/authentication')
        }
        onUnmounted(() => {
            try {
                window.stream.getTracks().forEach(function (track) {
                    track.stop()
                })
            } catch (error) {
                console.log('未发现设备')
            }
        })

        onMounted(() => {
            video = document.querySelector('video')
            getConditon()
        })

        return {
            openCamera,
            takeSnapshot,
            back,
            ...toRefs(state)
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap{
    padding-top: rem(100px);
    .notice{
        text-align: center;
        color: var(--contentColor);
        font-size: rem(28px);
        position: relative;
        top: rem(40px);
        z-index: 100;
    }
    .video{
        position: relative;
        height: 510px;
        width: 100%;
        .mask{
            position: absolute;
            transform: translate3d(0, 0,10px);
            background-image: url('../../../public/images/face-wrapper.png');
            background-repeat: no-repeat;
            background-position: center center;
            background-size: cover;
            height: 500px;
            top: 0;
            width: 100%;

        }
        video{
            height: 480px;
            background: rgb(255, 255, 255,0.5);
            max-width: 100%;
            width: 100%;
            transform: scaleX(-1);
        }
    }

    .btns{
        display: flex;
        padding: 0 rem(30px);
        margin-top: rem(30px);
        justify-content: space-evenly;
        .van-button{
            flex: 1;
            background: none;
            color: var(--primary);
            border: solid 1px var(--primary);
            &:first-child{
                margin-right: rem(20px);
            }
        }
    }
    .main{
        width: 100%;
        position: relative;
        text-align: center;
        font-size: 18px;
       .success{
           padding: rem(60px) 0;
           .icon_success{
               display: block;
               margin-bottom: rem(20px);
               font-size: 40px;
               color: var(--success)
           }
       }
        canvas{
            width: 100%;
            border-radius: 10px;
        }
        .rect{
            position: absolute;
            border:solid 4px var(--success)
        }
    }
}
</style>
