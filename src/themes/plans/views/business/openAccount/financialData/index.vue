<template>
    <div class='financial'>
        <p class='h1'>
            <img alt='' class='title_log' src='../../../../images/business/openAccount/Frame.png' />
            {{ $t('JG_referral.referBtn') }}
        </p>
        <div class='info'>
            <p class='data'>
                <span class='copydata'>
                    {{ customerNo }}
                </span>
                <van-icon v-if='copySuc == 1' color='#0062FF' name='checked' size='16' />
                <img
                    v-else
                    alt=''
                    class='copyid copy_icon'
                    :data-clipboard-text='customerNo'
                    src='../../../../images/business/openAccount/copy.svg'
                    @click='copyID($event)'
                />
            </p>
            <p class='desc'>
                {{ $t('JG_referral.referralID') }}
            </p>
            <p class='data'>
                <span class='copydata'>
                    {{ resLink }}
                </span>
                <van-icon v-if='copySuc == 2' color='#0062FF' name='checked' size='16' />
                <img
                    v-else
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
            <p id='qrcodeImg' ref='qrcodeImgRef' class='qrcodeImg' @click='showCode = true'></p>
            <p class='btn' @click='showInvite = true'>
                Refer Friends
            </p>
        </div>
        <p class='h1'>
            <img alt='' class='title_log' src='../../../../images/business/openAccount/overview.jpg' />
            {{ $t('JG_referral.overview') }}
        </p>
        <p class='overview_text'>
            {{ $t('JG_referral.referText') }}
        </p>
        <div class='filter'>
            <span class='btn' :class="{ 'active':statsType == 1 }" @click='setStatstype(1)'>
                {{ $t('JG_referral.all') }}
            </span>
            <span class='btn' :class="{ 'active':statsType == 2 }" @click='setStatstype(2)'>
                {{ $t('JG_referral.yesteday') }}
            </span>
            <span class='btn' :class="{ 'active':statsType == 3 }" @click='setStatstype(3)'>
                {{ $t('JG_referral.week') }}
            </span>
            <span class='btn' :class="{ 'active':statsType == 4 }" @click='setStatstype(4)'>
                {{ $t('JG_referral.month') }}
            </span>
        </div>
        <van-row class='overview_row'>
            <van-col span='8'>
                <p class='title'>
                    {{ $t('JG_referral.OverviewText1') }}
                </p>
                <p class='num'>
                    {{ commissionData.income || 0 }}  {{ $t('JG_referral.usdt') }}
                </p>
            </van-col>
            <van-col span='8'>
                <p class='title'>
                    {{ $t('JG_referral.OverviewText2') }}
                </p>
                <p class='num'>
                    {{ commissionData.recommendedCount || 0 }}
                </p>
            </van-col>
            <van-col span='8'>
                <p class='title'>
                    {{ $t('JG_referral.OverviewText3') }}
                </p>
                <p class='num'>
                    {{ commissionData.recommendedTradeCount || 0 }}
                </p>
            </van-col>
        </van-row>
        <div class='t_body'>
            <div class='left'>
                <p class='col t_header'>
                    {{ $t('JG_referral.userAccount') }}
                </p>
                <template v-for='(item,index) in listData' :key='index'>
                    <p class='col'>
                        {{ item.recommenderCustomerNo }}
                    </p>
                </template>
            </div>
            <div class='right'>
                <div class='tr'>
                    <p class='col t_header'>
                        {{ $t('JG_referral.refereesAccount') }}
                    </p>
                    <p class='col t_header'>
                        {{ $t('JG_referral.product') }}
                    </p>
                    <p class='col t_header'>
                        {{ $t('JG_referral.feeCurrency') }}
                    </p>
                    <p class='col t_header'>
                        {{ $t('JG_referral.feeAmount') }}
                    </p>
                    <p class='col t_header'>
                        {{ $t('JG_referral.referralRate') }}
                    </p>
                    <p class='col t_header'>
                        {{ $t('JG_referral.referralAmount') }}
                    </p>
                </div>
                <template v-for='(item,index) in listData' :key='index'>
                    <div class='tr'>
                        <p class='col'>
                            {{ item.recommendedCustomerNo }}
                        </p>
                        <p class='col'>
                            {{ item.dealCode }}
                        </p>
                        <p class='col'>
                            {{ item.dealFeeCurrency }}
                        </p>
                        <p class='col'>
                            {{ item.dealFee }}
                        </p>
                        <p class='col'>
                            {{ item.commissionRatio }}
                        </p>
                        <p class='col'>
                            {{ item.commissionAmount }}
                        </p>
                    </div>
                </template>
            </div>
        </div>
        <van-loading v-if='loading' class='noData loading' size='38' />
        <div v-if='!loading && listData.length == 0' class='noData'>
            No data
        </div>
        <div class='t-footer'>
            <p class='page'>
                {{ $t('JG_referral.total') }} {{ totalPage }} {{ $t('JG_referral.pages') }}
            </p>
            <div v-if='listData.length > 0'>
                <van-button :disabled='current==1' type='default' @click='changePage(current-1)'>
                    <van-icon name='arrow-left' size='16' />
                </van-button>
                <van-button :disabled='totalPage<2' type='default' @click='changePage(current+1)'>
                    <van-icon name='arrow' size='16' />
                </van-button>
            </div>
            <van-button v-if='current > 1' type='primary' @click='changePage(1)'>
                First page
            </van-button>
        </div>
        <van-dialog v-model:show='showCode' :close-on-click-overlay='true' :show-confirm-button='false' style='width: 80vw'>
            <ReferralCode v-if='showCode' :customer-no='customerNo' :res-link='resLink' @close='closeDialog' />
        </van-dialog>
        <van-dialog v-model:show='showInvite' :close-on-click-overlay='true' :show-confirm-button='false' style='width: 90vw'>
            <Invite v-if='showInvite' :res-link='resLink' @close='closeDialog' @copyURL='copyInviteURL' />
        </van-dialog>
    </div>
</template>

<script>
import Qrcodejs from 'qrcodejs2'
import { onMounted, computed, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { getCookie } from '@/utils/util.js'
import ClipboardJS from 'clipboard'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import Invite from '../dialogItem/Invite'
import ReferralCode from '../dialogItem/referralCode'
import { commissionSummary, commissionRecords } from '../../../../api/activity'
import { useRoute } from 'vue-router'

export default {
    components: {
        Invite,
        ReferralCode
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const appCustomerNo = route.query.ref // app 用户数据
        const wapCustomerNo = computed(() => store.state._user.customerInfo.customerNo) // wap 用户数据
        const customerNo = appCustomerNo || wapCustomerNo.value
        const qrcodImg = ref(null)
        const qrcodeImgRef = ref(null)
        const { t } = useI18n({ useScope: 'global' })
        const statsType = ref(1) // 统计类型 1:全部 2:日 3:周 4:月
        const showInvite = ref(false) // 邀请弹窗
        const showCode = ref(false) // 二维码弹窗
        const refcopyurl = ref() // 用于获取页面上的复制邀请链接的元素img

        // 生成邀请url
        const currentOrigin = window.location.origin // 当前环境的端口
        const lang = getCookie('lang') || 'zh-CN' // 当前语言环境
        const utm_campaign = appCustomerNo ? 'app_share_link' : 'web_share_link'
        const resLink = currentOrigin + '/' + lang + '/register?ref=' + customerNo + '&utm_campaign=' + utm_campaign // 分享的链接地址
        const copySuc = ref(0) // 复制状态 1复制id成功 2复制url成功
        const totalPage = ref(0) // 列表数据总页数
        const current = ref(1) // 列表当前页
        const loading = ref(false) // 加载状态x
        const listData = ref([]) // 列表数据

        const commissionData = reactive({ // 推荐统计数据
            income: '',
            recommendedCount: '',
            recommendedTradeCount: ''
        })

        // 筛选数据
        const setStatstype = (value) => {
            statsType.value = value
            getListData()
        }

        // 改变当前页数
        const changePage = (value) => {
            console.log('value', value)
            console.log('current', current)
            current.value = value
            getListData()
        }

        // 获取列表数据
        const getListData = () => {
            loading.value = true
            const params = {
                size: 10,
                current: current.value,
                queryParam: {
                    statsType: statsType.value,
                    customerNo: customerNo
                },
                customerNo: customerNo,
                timestamp: new Date().getTime().toString(),
            }
            commissionRecords(params).then(res => {
                loading.value = false
                if (res.check()) {
                    const { data } = res
                    listData.value = data?.list || []
                    totalPage.value = Math.ceil(data?.total / 10) || 0
                    console.log('totalPage', totalPage)
                }
            })
        }

        // 获取推荐统计数据
        const getCommissionSummary = () => {
            const params = {
                statsType: statsType.value,
                customerNo: customerNo,
                timestamp: new Date().getTime().toString(),
            }
            commissionSummary(params).then(res => {
                if (res.ok) {
                    commissionData.income = res.data.income
                    commissionData.recommendedCount = res.data.recommendedCount
                    commissionData.recommendedTradeCount = res.data.recommendedTradeCount
                }
            })
        }

        // 生成二维码
        const intQrcode = () => {
            qrcodeImgRef.value.innerHTML = ''
            qrcodImg.value = new Qrcodejs('qrcodeImg', {
                text: resLink,
                width: 128,
                height: 128,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: Qrcodejs.CorrectLevel.H
            })
        }

        // 复制ID
        const copyID = ($event) => {
            const clipboard = new ClipboardJS('.copyid')
            clipboard.on('success', function (e) {
                copySuc.value = 1
                const timer = setTimeout(() => {
                    copySuc.value = 0
                    clearTimeout(timer)
                }, 3500)
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
                copySuc.value = 2
                const timer = setTimeout(() => {
                    copySuc.value = 0
                    clearTimeout(timer)
                }, 3500)
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

        const copyInviteURL = () => {
            refcopyurl.value.click()
        }

        // 关闭弹窗
        const closeDialog = (val) => {
            if (val === 'Invite') { showInvite.value = false }
            if (val === 'Code') { showCode.value = false }
        }

        onMounted(() => {
            intQrcode()
            getListData()
            getCommissionSummary()
        })
        return {
            qrcodImg,
            qrcodeImgRef,
            customerNo,
            resLink,
            listData,
            setStatstype,
            statsType,
            copyID,
            copyURL,
            copySuc,
            showInvite,
            showCode,
            closeDialog,
            copyInviteURL,
            refcopyurl,
            totalPage,
            current,
            changePage,
            getListData,
            getCommissionSummary,
            commissionData,
            loading
        }
    }

}
</script>

<style lang="scss" scoped>
.financial{
    background-color: #ffffff;
    padding: 0 rem(28px);
}
.h1{
    font-size: rem(48px);
    font-weight: 600;
    color: #333333;
    line-height: rem(72px);
    padding-top: rem(80px);
    padding-bottom: rem(40px);
}
.info{
    background-color: #ceedff;
    padding: rem(56px) rem(28px);
    border-radius: rem(10px);
    .data{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .copydata{
            font-size: rem(32px);
            line-height: rem(48px);
            font-weight: 500;
            width: 60%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space:nowrap;
            color: #333333;
        }
    }
    .desc{
        height: rem(42px);
        line-height: rem(42px);
        font-size: rem(28px);
        color:#999999;
        margin-bottom: rem(24px);
    }
    .qrcodeImg{
        margin: rem(36px) 0;
    }
    .copy_icon{
        width: rem(32px);
    }
    .btn{
        height: rem(80px);
        line-height: rem(80px);
        background: #0062FF;
        box-shadow: 0px rem(2px) 0px rem(1px) #145ACC;
        border-radius: rem(44px);
        color: #FFFFFF;
        font-size: rem(32px);
        font-weight: 500;
        text-align: center;
    }
}
.title_log{
    width: rem(38px);;
}
.overview_text{
    margin-bottom: rem(40px);
}
.overview_row{
    background: #F5F5F5;
    border-radius: rem(10px);
    padding: rem(40px) 0;
    text-align: center;
    margin-top: rem(56px);
    margin-bottom: rem(64px);
    .num{
        line-height: rem(48px);
        font-size: rem(32px);
        font-weight: 500;
    }
    .title{
        line-height: rem(42px);
        font-size: rem(28px);
        color: #999999;
    }
}
.filter{
    display: flex;
    align-items: center;
    .btn{
        display: block;
        height: rem(60px);
        line-height: rem(60px);
        padding: 0px rem(24px);;
        margin-right: rem(14px);
        border-radius: rem(30px);
        font-size: rem(28px);
        background: rgba(0, 98, 255, 0.1);
        color: #0062FF;
        &.active{
            color: #ffffff;
            background:#0062FF ;
        }
    }
}

.t_body{
    display: flex;
}
.left{
    width: rem(210px);
    border-right: rem(2px) solid rgba(0,0,0,0.1000); ;
    .col{
        width: rem(210px);
    }
}
.right{
    overflow-x: scroll;
    .tr{
        white-space: nowrap;
    }

}
.col{
    word-break: break-all;
    display: inline-block;
    width: rem(250px);
    text-align: center;
    line-height: rem(114px);
    font-size: rem(28px);
    color: #333333;
    border-bottom: rem(2px) solid rgba(0,0,0,0.1000);
}

.t_header{
    line-height: rem(114px);
    height: rem(114px);
    background: #F5F5F5;
    border-bottom:  0px;
    padding: 0 rem(8px);
}
.t-footer{
    margin-top: rem(28px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: rem(80px);
    .page{
        font-size: rem(28px);
        color: #999999;
        font-weight: 500;
    }
    .van-button--default{
        width: rem(60px);
        height: rem(60px);
        margin: 0 rem(12px);
    }
    .van-button--primary{
        height: rem(60px);
        background: #0062FF;
        border-radius: rem(10px);
    }
}

.noData{
    line-height: rem(114px);
    height: rem(114px);
    text-align: center;
    color: #999999;
    font-size: rem(28px);
}

</style>
