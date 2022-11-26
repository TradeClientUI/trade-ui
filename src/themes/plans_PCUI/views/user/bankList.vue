<template>
    <centerViewDialog>
        <LayoutTop :back='true' icon='icon_icon_close_big' :menu='false' title='' />
        <div class='page-wrap'>
            <Loading :show='loading' />
            <div class='list'>
                <p v-if='bankList.length === 0' class='no-data'>
                    {{ $t('bank.noBanks') }}
                </p>
                <div v-for='(item,index) in bankList' :key='index' class='bank-item' :class="'BG_'+ item.bankCode">
                    <div class='bi-head'>
                        <div class='icon-bank' :class="'BK_'+ item.bankCode">
                            <img alt='' :src="'/images/bank_icon/BK_'+ item.bankCode+ '.png'" />
                        </div>
                        <span class='bank-name'>
                            {{ item.bankName }}
                        </span>
                    </div>
                    <p class='bank-no'>
                        {{ hideMiddle(item.bankCardNumber) }}
                    </p>
                    <div class='bank-bg'>
                        <img alt='' sizes='' :src="'/images/bank_icon/BK_'+ item.bankCode+ '.png'" />
                    </div>
                </div>
                <div class='add-wrap' @click='toAdd'>
                    <van-icon name='plus' />
                    <span class='btn-text'>
                        {{ $t('bank.addBank') }}
                    </span>
                    <van-icon name='arrow' />
                </div>
            </div>
        </div>
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import { toRefs, reactive, onBeforeMount } from 'vue'
import { queryBankList } from '@/api/user'
import { useRouter, useRoute } from 'vue-router'

export default {
    components: {
        centerViewDialog
    },
    setup (props) {
        const router = useRouter()
        const route = useRoute()
        const state = reactive({
            bankList: [],
            loading: false
        })
        const getBankList = () => {
            console.log('banklist')
            state.loading = true
            queryBankList().then(res => {
                console.log(res)
                state.loading = false
                if (res.check()) {
                    if (res.data && res.data.length > 0) {
                        state.bankList = res.data
                    }
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // 处理银行卡号显示
        const hideMiddle = (value) => {
            return `${value.substring(0, 0)} ${'*'.repeat(value.length - 4).replace(/(.{4})/g, '$1 ')}${value.length % 4 ? ' ' : ''}${value.slice(-4)}`
        }
        const handRoutTo = (path) => {
            router.push(route.path.slice(0, -9) + path)
        }
        const toAdd = () => {
            handRoutTo('/addBank')
            // router.push('/addBank')
        }

        onBeforeMount(() => {
            getBankList()
        })
        return {
            getBankList,
            hideMiddle,
            toAdd,
            handRoutTo,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    flex: 1;
    padding-top: rem(100px);
    overflow: auto;
    background: var(--bgColor);
    .list {
        padding: rem(30px);
        .bank-item {
            position: relative;
            height: rem(210px);
            margin-bottom: rem(30px);
            padding: rem(30px);
            overflow: hidden;
            border-radius: rem(10px);
            &.BG_ICBC {
                background-color: #EC4E56;
                background-image: linear-gradient(to right, #EC4E56, #C92E36);
            }
            &.BG_ABC {
                background-color: #58A8A1;
                background-image: linear-gradient(to right, #58A8A1, #379A85);
            }
            &.BG_CITIC {
                background-color: #E53945;
                background-image: linear-gradient(to right, #E53945, #CF2B37);
            }
            &.BG_BCCB {
                background-color: #E53945;
                background-image: linear-gradient(to right, #E53945, #CF2B37);
            }
            &.BG_CHBHCNBTXXX {
                background-color: #2F70BB;
                background-image: linear-gradient(to right, #2F70BB, #0C53A5);
            }
            &.BG_CZBANK {
                background-color: #EC4E56;
                background-image: linear-gradient(to right, #EC4E56, #C92E36);
            }
            &.BG_CIB,
            &.BG_SPDB {
                background-color: #2F70BB;
                background-image: linear-gradient(to right, #2F70BB, #0C53A5);
            }
            &.BG_HZCB {
                background-color: #2F70BB;
                background-image: linear-gradient(to right, #2F70BB, #0C53A5);
            }
            &.BG_HXBANK {
                background-color: #EC4E56;
                background-image: linear-gradient(to right, #EC4E56, #C92E36);
            }
            &.BG_CCB {
                background-color: #4492D8;
                background-image: linear-gradient(to right, #4492D8, #2073BC);
            }
            &.BG_JSBANK,
            &.BG_BCM {
                background-color: #4492D8;
                background-image: linear-gradient(to right, #4492D8, #2073BC);
            }
            &.BG_COMM {
                background-color: #4492D8;
                background-image: linear-gradient(to right, #4492D8, #2073BC);
            }
            &.BG_NJCB {
                background-color: #E45B48;
                background-image: linear-gradient(to right, #E45B48, #D64746);
            }
            &.BG_NBBANK {
                background-color: #E79243;
                background-image: linear-gradient(to right, #E79243, #E0791A);
            }
            &.BG_CMB {
                background-color: #E45B48;
                background-image: linear-gradient(to right, #E45B48, #D64746);
            }
            &.BG_SPABANK {
                background-color: #E37133;
                background-image: linear-gradient(to right, #E37133, #E95503);
            }
            &.BG_SHBANK {
                background-color: #2F70BB;
                background-image: linear-gradient(to right, #2F70BB, #0C53A5);
            }
            &.BG_BOC {
                background-color: #EC4E56;
                background-image: linear-gradient(to right, #EC4E56, #C92E36);
            }
            &.BG_SHRCB {
                background-color: #2F70BB;
                background-image: linear-gradient(to right, #2F70BB, #0C53A5);
            }
            &.BG_GDB {
                background-color: #EC4E56;
                background-image: linear-gradient(to right, #EC4E56, #C92E36);
            }
            &.BG_CEB {
                background-color: #EC4E56;
                background-image: linear-gradient(to right, #EC4E56, #C92E36);
            }
            &.BG_CMBC {
                background-color: #19A165;
                background-image: linear-gradient(to right, #19A165, #1575B2);
            }
            &.BG_PSBC {
                background-color: #19A165;
                background-image: linear-gradient(to right, #19A165, #167758);
            }
            &.BG_SDB {
                background-color: #3D3DB4;
                background-image: linear-gradient(to right, #4242F1, #03033B);
            }
            &.BG_SRCB {
                background-color: #187AAD;
                background-image: linear-gradient(to right, #187AAD #006599);
            }
            &.BG_RCCSCNBS {
                background-color: #3A51B1;
                background-image: linear-gradient(to right, #3A51B1 #1F38A1);
            }
            &.BG_BJRCB {
                background-color: #EC4E56;
                background-image: linear-gradient(to right, #EC4E56 #C92E36);
            }
            &.BG_GZRCU {
                background-color: #E4AC35;
                background-image: linear-gradient(to right, #E4AC35 #DD9619);
            }
            &.BG_CZCBCN {
                background-color: #EC4E56;
                background-image: linear-gradient(to right, #EC4E56 #C92E36);
            }
            &.BG_SZFZ {
                background-color: #1088CD;
                background-image: linear-gradient(to right, #1088CD #0576B6);
            }
            &.BG_BSB {
                background-color: #995340;
                background-image: linear-gradient(to right, #995340 #81402E);
            }
            &.BG_EGBANK {
                background-color: #C4A46E;
                background-image: linear-gradient(to right, #C4A46E #A78954);
            }
            &.BG_GCB {
                background-color: #EC4E56;
                background-image: linear-gradient(to right, #EC4E56 #C92E36);
            }
            &.BG_CDB {
                background-color: #EC4E56;
                background-image: linear-gradient(to right, #EC4E56 #C92E36);
            }
            &.BG_PBOC {
                background-color: #EC4E56;
                background-image: linear-gradient(to right, #EC4E56 #C92E36);
            }
            &.BG_BANK {
                background-color: #727070;
                background-image: linear-gradient(to right, #727272 #1D0D0D);
            }
            & .bank-bg {
                position: absolute;
                top: rem(90px);
                right: rem(30px);
                z-index: 1;
                opacity: 0.1;
                filter: grayscale(100%) brightness(1000%);
                img {
                    //filter: grayscale(1);
                }
            }
            .icon-bank {
                display: inline-block;
                width: rem(72px);
                height: rem(72px);
                margin-right: rem(22px);
                text-align: center;
                vertical-align: middle;
                background: #FFF;
                border-radius: 50%;
                img {
                    width: rem(52px);
                    height: rem(52px);
                    margin-top: rem(10px);
                }
            }
            .bank-name {
                color: #FFF;
                font-size: rem(28px);
            }
            .bank-no {
                position: relative;
                z-index: 2;
                margin-top: rem(20px);
                margin-left: rem(90px);
                color: #FFF;
                font-size: rem(50px);
            }
        }
        .add-wrap {
            @include hover();
            display: flex;
            align-items: center;
            padding: rem(34px);
            background-color: var(--contentColor);
            border: solid 1px var(--lineColor);
            cursor: pointer;
            .van-icon-plus {
                margin-right: rem(10px);
                color: var(--minorColor);
            }
            .btn-text {
                flex: 1;
                color: var(--color);
                font-size: rem(28px);
            }
        }
        .no-data {
            line-height: rem(100px);
            text-align: center;
        }
    }
}
</style>
