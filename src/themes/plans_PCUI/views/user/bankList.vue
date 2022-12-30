<template>
    <centerViewDialog>
        <!-- 头部导航 -->
        <Top
            back
            left-icon='arrow-left'
            show-center
        />
        <div class='page-wrap'>
            <Loading :show='loading' />
            <div class='list'>
                <van-empty
                    v-if='bankList.length === 0'
                    :description="$t('bank.noBanks')"
                    image='/images/empty.png'
                />
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
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import { toRefs, reactive, onBeforeMount } from 'vue'
import { queryBankList } from '@/api/user'
import Top from '@/components/top'
import { useRouter, useRoute } from 'vue-router'

export default {
    components: {
        centerViewDialog,
        Top
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
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    background: var(--bgColor);
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
                margin-top: rem(-8px);
                color: var(--minorColor);
                font-size: rem(52px);
            }
            .text {
                flex: 1;
                margin: 0 rem(20px);
                .account {
                    margin-top: rem(6px);
                }
            }
        }
        .no-data {
            line-height: rem(100px);
            text-align: center;
        }
    }
    .add-wrap {
        @include hover();
        display: flex;
        justify-content: center;
        align-items: center;
        padding: rem(34px);
        background-color: var(--contentColor);
        border: solid 1px var(--lineColor);
        cursor: pointer;
        .van-icon-plus {
            margin-top: rem(-4px);
            margin-right: rem(10px);
            color: var(--minorColor);
            font-size: rem(36px);
            font-weight: bold;
        }
        .btn-text {
            color: var(--color);
            font-size: rem(34px);
            font-weight: bold;
        }
    }
}
</style>
