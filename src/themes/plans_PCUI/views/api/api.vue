<template>
    <router-view />

    <div class='wrapper' :style='"min-height:" + wrapperHeight'>
        <div class='page-title'>
            {{ $t('api.title') }}
        </div>
        <div class='api-create'>
            <div class='desc'>
                {{ $t('api.text1') }}
                <!-- <span>
                    <a class='a-link' href='https://www.baidu.com' target='_blank'>
                        {{ $t("api.linkTxt") }}
                    </a>
                </span> -->
            </div>
            <div class='min-tit'>
                {{ $t('api.editTitle4') }}
            </div>
            <div class='api-input'>
                <van-field v-model='query.tag' maxlength='20' :placeholder="$t('api.keyplaceholder')" />
            </div>
            <van-button block class='confirm-btn' type='primary' @click='handleCreate'>
                <span>{{ $t('compLang.confirm') }}</span>
            </van-button>
        </div>

        <div class='sub-title'>
            {{ $t('api.listTitle') }}
            <!-- <van-icon name='replay' @click='getAPIList' /> -->
        </div>

        <div class='list'>
            <Loading :show='loading' />
            <div class='listScroll'>
                <van-collapse v-if='apiList.length > 0' v-model='activeIndex' accordion @change='collapseChange'>
                    <van-collapse-item v-for='(item, i) in apiList' :key='i' class='item' :name='item.id'>
                        <template #title>
                            <van-row gutter='10'>
                                <van-col span='8'>
                                    <h6>{{ item.tag }}</h6>
                                </van-col>
                                <van-col span='12'>
                                    <p>{{ item.timeleft }}</p>
                                </van-col>
                                <van-col align='right' class='operaRight' span='4'>
                                    <span @click='goDetails(item.id)'>
                                        {{ $t('compLang.edit') }}
                                    </span>
                                    <span @click='handleDelete(item.id)'>
                                        {{ $t('compLang.delete') }}
                                    </span>
                                </van-col>
                            </van-row>
                        </template>

                        <div class='itemBox'>
                            <van-row>
                                <van-col class='item-left' span='12'>
                                    {{ $t('api.createSubTit1') }}
                                </van-col>
                                <van-col class='item-right' span='12'>
                                    {{ $t('api.createSubTit6') }}
                                </van-col>
                            </van-row>
                            <van-row>
                                <van-col class='item-left' span='12'>
                                    <div class='txtWrap'>
                                        {{ item.apiKey }}
                                    </div>
                                    <van-icon class='copy-btn' :data-clipboard-text='item.apiKey' name='description' :title="$t('compLang.copy')" @click='copyCustomerNo' />
                                    <!-- <i class='icon_fuzhi copy-btn' :data-clipboard-text='item.apiKey' @click='copyCustomerNo'></i> -->
                                </van-col>
                                <van-col class='item-right col_black' span='12'>
                                    {{ item.updateTime }}
                                </van-col>
                            </van-row>
                            <van-row>
                                <van-col class='item-left' span='12'>
                                    {{ $t('api.createSubTit3') }}
                                </van-col>
                                <van-col class='item-right' span='12'>
                                    {{ $t('api.createSubTit4') }}
                                </van-col>
                            </van-row>
                            <van-row>
                                <van-col class='item-left tags' span='12'>
                                    <span v-for='(it,a) in item.permissionDTOList' :key='a'>
                                        <em v-if='it.status === 1' class='perItem'>
                                            {{ it.name }}
                                        </em>
                                    </span>
                                </van-col>
                                <van-col class='item-right' span='12'>
                                    <div class='whiteIps'>
                                        <span>
                                            {{ item.whiteIps }}
                                        </span>
                                    </div>
                                </van-col>
                            </van-row>
                        </div>
                    </van-collapse-item>
                </van-collapse>
            </div>
            <van-empty
                v-if='apiList.length === 0'
                :description="$t('api.listnone')"
                image='/images/empty.png'
            />
        </div>
    </div>
</template>

<script>
import { computed, toRefs, reactive, onMounted, ref, provide } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Toast, Dialog } from 'vant'
import { getCustomerApiList, checkKycApply, delCustomerApi, createCustomerApiDetail } from '@/api/user'
import Clipboard from 'clipboard'

export default {
    components: {

    },

    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const { type } = route.query
        const state = reactive({
            loading: false,
            showApiHelp: false,
            query: {
                tag: ''
            },
            apiList: [],
            isReLoad: false,
            wrapperHeight: 0
        })

        provide('isReLoad', (value) => {
            state.isReLoad = value
            if (value === true) {
                getAPIList()
                state.query.tag = ''
            }
        })

        const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(state.tradeType)))
        const activeIndex = ref()
        // console.log(store.state)
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const companyId = computed(() => customInfo.value.companyId)
        const inviteVis = computed(() => {
            return (location.href.includes('uat') && companyId.value === 1) || (location.href.includes('pre') && companyId.value === 360) || (companyId.value === 11)
        })

        const getAPIList = () => {
            state.loading = true
            const params = {
                size: 30,
                current: 1
            }
            getCustomerApiList(params).then(res => {
                state.loading = false
                // console.log(res)
                if (Number(res.code) === 0) {
                    const tempArr = []
                    res.data.records.filter(item => {
                        let _timeLeft = ''
                        const vday = item.validityDays
                        if (vday !== undefined) {
                            if (vday === -1) {
                                _timeLeft = t('api.timeTips3')
                            } else {
                                if (vday === null) {
                                    _timeLeft = t('api.timeleftCell2')
                                } else {
                                    _timeLeft = t('api.timeleft') + vday + t('api.timeleftCell')
                                }
                            }
                        } else {
                            _timeLeft = t('api.timeleftCell2')
                        }

                        let whiteIpsStr = ''
                        if (item.whiteIps === null) {
                            whiteIpsStr = '--'
                        } else {
                            const whiteIpsArr = item.whiteIps.split(',')
                            if (whiteIpsArr.length > 3) {
                                whiteIpsStr = item.whiteIps.split(',')[0] + ',' + item.whiteIps.split(',')[1] + ',' + item.whiteIps.split(',')[2] + '...'
                            } else {
                                whiteIpsStr = item.whiteIps
                            }
                        }
                        tempArr.push({
                            id: item.id,
                            apiKey: item.apiKey,
                            pubKey: item.pubKey,
                            permissionDTOList: item.permissionDTOList,
                            whiteIps: whiteIpsStr,
                            updateTime: window.dayjs(new Date(item.updateTime)).format('YYYY-MM-DD HH:mm:ss'),
                            tag: item.tag,
                            timeleft: _timeLeft
                        })
                    })
                    state.apiList = tempArr
                } else {
                    Toast(res.msg)
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // 跳转到编辑页
        const goDetails = (id) => {
            console.log(id)
            router.push({
                path: '/apiEdit',
                query: {
                    id: id
                }
            })
        }

        const showApiHelp = () => {
            state.helpPopupShow = true
        }

        const isReLoad = () => {
            console.log('isReLoad()')
            getAPIList()
        }

        const handleCreate = (id) => {
            if (state.query.tag) {
                // updatePopupVis(true)
                const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im
                const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
                if (regEn.test(state.query.tag) || regCn.test(state.query.tag)) {
                    Toast(t('api.notSpecial'))
                    return false
                }
            } else {
                Toast(t('api.keyplaceholder'))
                return false
            }

            if (Number(customInfo.value.googleId) > 0) {
                checkKycApplyFn()
            } else {
                Dialog.alert({
                    title: t('common.tip'),
                    showCancelButton: true,
                    confirmButtonText: t('api.mfaGoset'),
                    message: t('api.mfaTips'),
                }).then(() => {
                    handRoutTo('/googleMFA/status')
                })
            }
        }

        // 查询KYC验证
        const checkKycApplyFn = () => {
            state.loading = true
            checkKycApply({ businessCode: 'API', openAccountType: customInfo.value.openAccountType }).then(res => {
                state.loading = false
                const status = Number(res.data)
                if (status === 2) {
                    console.log(state.query)
                    handRoutTo('/googleSecurityCheck/index', state.query.tag)
                } else {
                    Dialog.alert({
                        title: t('common.tip'),
                        showCancelButton: true,
                        confirmButtonText: status === 1 ? t('common.goLook') : t('login.goAuthenticate'),
                        message: status === 1 ? t('deposit.KYCReviewing') : t('deposit.needKYC'),
                    }).then(() => {
                        handRoutTo('/authentication')
                    })
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // 复制
        const copyCustomerNo = (value) => {
            var clipboard = new Clipboard('.copy-btn')
            console.log('copyCustomerNo:(list)' + value)
            console.log(clipboard)
            clipboard.on('success', e => {
                Toast(t('common.copySuccess'))
                // 释放内存
                clipboard.destroy()
            })
        }

        const handleDelete = (id) => {
            Dialog.confirm({
                title: t('tip'),
                message:
                    t('api.deleteConfirm'),
            }).then(() => {
                delCustomerApi({ id }).then(res => {
                    state.loading = false
                    if (Number(res.code) === 0) {
                        Toast(t('api.deleteSuccess'))
                        setTimeout(() => {
                            getAPIList()
                        }, 1500)
                    } else {
                        Toast(res.msg)
                    }
                }).catch(err => {
                    state.loading = false
                })
            }).catch(() => {
            // on cancel
            })
        }

        const collapseChange = (index) => {
            if (!index) {
                return false
            }

            const params = {
                id: index
            }
            state.apiList.map((item, index) => {
                if (Number(item.id) === params.id) {
                    if (item.permissionDTOList === null) {
                        state.loading = true
                        createCustomerApiDetail(params).then(res => {
                            state.loading = false
                            if (Number(res.code) === 0) {
                                // console.log(res)
                                var apiArr = []
                                state.apiList.map((item, index) => {
                                    if (Number(item.id) === params.id) {
                                        apiArr.push({
                                        ...item,
                                        permissionDTOList: res.data.permissionDTOList
                                        })
                                    } else {
                                        apiArr.push({
                                        ...item
                                        })
                                    }
                                })
                                state.apiList = apiArr
                                // console.log(apiArr)
                            } else {
                                Toast(res.msg)
                            }
                        }).catch(err => {
                            state.loading = false
                        })
                    }
                } else {
                    state.loading = false
                }
            })
        }

        const handRoutTo = (path, tag) => router.push({
            path: route.path + path,
            query: {
                tag: tag || '',
                originPage: 'apiList'
            }
        })

        const setMinHeight = () => {
            const heightFooter = document.querySelectorAll("div[class='footer-nav']")
            const headerFooter = document.querySelectorAll("div[class='nav-left']")
            const calcHeight = heightFooter[0].clientHeight + headerFooter[0].clientHeight + 40
            state.wrapperHeight = 'calc(100vh - ' + calcHeight + 'px)'
        }

        onMounted(() => {
            getAPIList()
            setMinHeight()
        })

        return {
            handRoutTo,
            setMinHeight,
            collapseChange,
            showApiHelp,
            activeIndex,
            handleCreate,
            handleDelete,
            goDetails,
            checkKycApplyFn,
            getAPIList,
            isReLoad,
            inviteVis,
            copyCustomerNo,
            accountList,
            type,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.wrapper {
    width: 1200px;
    min-height: calc(100% - 297px);
    margin: 20px auto;
    .page-title {
        font-weight: bold;
        font-size: 32px;
    }
    .api-create {
        width: 460px;
        margin: 40px auto;
        .desc {
            margin-bottom: 20px;
            color: var(--minorColor);
            font-size: 14px;
            line-height: 24px;
            a {
                color: var(--riseColor);
            }
        }
        .min-tit {
            font-size: 18px;
        }
        .api-input {
            margin: 20px 0;
        }
    }
    .sub-title {
        font-size: 24px;
    }
    .list {
        margin-top: 15px;
        background-color: var(--contentColor);
        border: 1px solid #DEDEDE;
        :deep(.van-cell__right-icon) {
            margin-top: 5px;
            font-size: rem(50px);
        }
        .operaRight {
            span {
                display: inline-block;
                margin: 0 15px;
                font-size: 14px;
            }
        }
        .item {
            margin-bottom: 0;
            color: var(--minorColor);
            font-size: rem(28px);
            .van-row {
                padding: rem(10px) 0;
            }
            h6 {
                margin-bottom: 0;
                color: var(--color);
                font-weight: normal;
                font-size: rem(32px);
            }
            p {
                color: var(--minorColor);
            }
            .copy-btn {
                margin-left: 10px;
                font-size: 18px;
                cursor: pointer;
            }
            .tags {
                span em {
                    display: inline-block;
                    margin-right: rem(10px);
                    margin-bottom: rem(8px);
                    padding: 0 rem(10px);
                    color: var(--normalColor);
                    font-size: rem(24px);
                    font-style: normal;
                    background-color: var(--lineColor);
                }
            }
            .txtWrap {
                display: inline-block;
                width: auto;
                max-width: 70%;
                overflow: hidden;
                color: var(--normalColor);
                white-space: nowrap;
                text-overflow: ellipsis;
                vertical-align: middle;
            }
            .whiteIps {
                color: var(--normalColor);
                white-space: normal;
                word-wrap: break-word;
                word-break: break-all;
            }
        }
    }
    .col_black {
        color: var(--normalColor);
    }
}

@media screen and (max-width: 1200px) {
    .wrapper {
        width: 980px;
    }
}

@media screen and (max-width: 980px) {
    .wrapper {
        width: 720px;
    }
}
</style>
