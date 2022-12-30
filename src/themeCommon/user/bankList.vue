<template>
    <LayoutTop :back='true' :menu='false' :title='$t("route.mine")' />
    <div class='page-wrap'>
        <Loading :show='loading' />
        <p class='header'>
            {{ $t('cRoute.bankList') }}
        </p>
        <div class='list'>
            <p v-if='bankList.length === 0' class='no-data'>
                {{ $t('bank.noBanks') }}
            </p>
            <div v-for='(item,index) in bankList' :key='index' class='bank-item'>
                <van-icon class='card' name='card' />
                <div class='text'>
                    <div class='name'>
                        {{ item.bankName }}
                    </div>
                    <div v-if='item.bankAccount' class='account'>
                        {{ item.bankAccount }}
                    </div>
                </div>
                <div class='currency'>
                    {{ item.bankCurrency }}
                </div>
            </div>
        </div>
        <div class='add-wrap' @click='toAdd'>
            <van-icon name='plus' />
            <span class='btn-text'>
                {{ $t('bank.addBank') }}
            </span>
        </div>
    </div>
</template>

<script>
import Top from '@/components/top'
import { toRefs, reactive, onBeforeMount } from 'vue'
import { queryBankList } from '@/api/user'
import { useRouter } from 'vue-router'

export default {
    components: {
        Top
    },
    setup (props) {
        const router = useRouter()
        const state = reactive({
            bankList: [],
            loading: false
        })
        const getBankList = () => {
            console.log('banklist')
            state.loading = true
            queryBankList().then(res => {
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

        const toAdd = () => {
            router.push('/addBank')
        }

        onBeforeMount(() => {
            getBankList()
        })
        return {
            getBankList,
            toAdd,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    padding-top: rem(110px);
    background: var(--bgColor);
    .header{
        font-size: rem(48px);
        padding-left: rem(30px);
        padding-bottom: rem(20px);
        background-color: var(--contentColor);
    }
    .list {
        flex: 1;
        overflow-y: auto;
        padding: rem(30px);
        .bank-item {
            position: relative;
            display: flex;
            align-items: center;
            height: rem(160px);
            padding: rem(30px);
            margin-bottom: rem(20px);
            color: var(--color);
            background-color: var(--contentColor);
            border: 1px solid var(--lineColor);
            border-radius: rem(10px);
            overflow: hidden;
            .card {
                color: var(--minorColor);
                font-size: rem(48px);
            }
            .text {
                flex: 1;
                margin: 0 rem(20px);
                .account {
                    margin-top: rem(10px);
                }
            }
        }
        .no-data {
            line-height: rem(100px);
            text-align: center;
        }
    }
    .add-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: rem(34px);
        border-top: 1px solid var(--lineColor);
        background-color: var(--contentColor);
        cursor: pointer;
        .van-icon-plus {
            margin-right: rem(10px);
            color: var(--color);
            font-weight: bold;
            margin-top: -1px;
        }
        .btn-text {
            color: var(--color);
            font-size: rem(28px);
        }
    }
}
</style>
