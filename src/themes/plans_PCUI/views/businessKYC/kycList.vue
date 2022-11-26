<template>
    <router-view />
    <div class='page-wrap'>
        <h3>{{ $t("businessKYC.enterpriseKYC") }}</h3>
        <div v-if='kycList.length === 0' class='empty-data'>
            <van-empty :description='$t("auth.noRequired")' image='/images/empty.png' />
        </div>
        <div v-for='(item,index) in kycList' v-else :key='index' class='kyc-list'>
            <p>{{ kycMap[item.levelCode] }}</p>
            <el-button
                :disabled='[1,2].includes(item.status)'
                size='default'
                type='primary'
                @click='handleNext(item)'
            >
                {{ kycAuditStatus[item.status] }}
            </el-button>
        </div>

        <div class='info-list'>
            <p>  {{ $t('businessKYC.infoList') }}  ：</p>
            <p>1、{{ $t('businessKYC.certificate') }}</p>
            <p>2、{{ $t('businessKYC.memorandum') }}  </p>
            <p>3、{{ $t('businessKYC.CertificateIssued') }} </p>
            <p class='t1'>
                {{ $t('businessKYC.tip1') }}
            </p>
            <p>4、{{ $t('businessKYC.CertificateIssued') }} </p>
            <p class='t1'>
                {{ $t('businessKYC.tip3') }}
            </p>
            <p>5、 {{ $t('businessKYC.ownershipStructure') }} </p>
            <p class='t1'>
                {{ $t('businessKYC.tip4') }}
            </p>
            <p> 6、{{ $t('businessKYC.sanctionQuestionnaire') }} </p>
            <p>7、 {{ $t('businessKYC.letterOfAuthorization') }} </p>
            <p>8、 {{ $t('businessKYC.businessConditions') }} </p>
            <p class='t1'>
                {{ $t('businessKYC.tip5') }}
            </p>

            <p class='t1'>
                {{ $t('businessKYC.tip6') }}
            </p>
            <p class='t1'>
                {{ $t('businessKYC.tip7') }}
            </p>
            <p class='t1'>
                {{ $t('businessKYC.tip8') }}
            </p>
            <p> 9、{{ $t('businessKYC.tip9') }} </p>
            <p class='t1'>
                {{ $t('businessKYC.tip10') }}
            </p>
            <p class='t1'>
                {{ $t('businessKYC.tip11') }}
            </p>
            <p>10、{{ $t('businessKYC.directorTips') }}</p>
            <p>11、{{ $t('businessKYC.verifyTips') }}</p>
            <p>12、{{ $t('businessKYC.tradersTips') }}</p>
            <p>13、{{ $t('businessKYC.mainTradersTips') }}</p>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { upload, getListByParentCode } from '@/api/base'
import { useI18n } from 'vue-i18n'
import { findAllLevelKyc, kycLevelApply, kycApply, findAllBizKycList } from '@/api/user'

const router = useRouter()
const store = useStore()
const { t, tm } = useI18n({ useScope: 'global' })

const kycMap = {
    level_1: t('common.kycLevel1'),
    level_2: t('common.kycLevel2'),
    level_3: t('common.kycLevel3'),
}

const kycList = computed(() => store.state._user.kycList)
const kycAuditStatus = tm('kycAuditStatus')

const handleNext = (item) => {
    if (Number(item.status) === 0 || Number(item.status) === 3) {
        router.push({
            path: '/businessKYC/index',
            query: {
                levelCode: item.levelCode
            }
        })
    }
}

// 获取需要认证的kyc列表
store.dispatch('_user/findAllBizKycList')

</script>

<style lang="scss" scoped>
.page-wrap {
    width: 1200px;
    margin: rem(100px) auto;
    padding: rem(100px);
    background: var(--contentColor);
    border-radius: rem(10px);
    h3 {
        margin-bottom: rem(100px);
        line-height: rem(100px);
        //background: var(--bgColor);
    }
    .kyc-list {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: rem(20px);
        border-bottom: solid 1px var(--lineColor);
    }
    .info-list {
        padding: rem(50px) 0;
        p {
            padding: rem(10px) 0;
        }
        p.t1 {
            padding-left: rem(48px);
        }
    }
}
</style>
