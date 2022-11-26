<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' :menu='false' :title='$t("withdraw.coinTitle")'>
            <template #right>
                <a class='withdorw-title' href='javascript:;' @click='toList'>
                    {{ $t('withdraw.withdrawRecord') }}
                </a>
            </template>
        </LayoutTop>
        <div class='withdraw-wrap'>
            <p class='title'>
                {{ $t('withdrawCoin.coinName') }}
            </p>
            <ul class='coin-list'>
                <li v-for='(item,index) in currencyList' :key='index' :class='{ active: currencyActive === index }' @click='handleChangeCurrency(index)'>
                    {{ item.name }}
                </li>
            </ul>
            <p class='title'>
                {{ $t('withdrawCoin.mainChainName') }}
            </p>
            <ul class='coin-list'>
                <li v-for='(item,index) in chainList' :key='index' :class='{ active: chainActive === index }' @click='handleChangechain(index)'>
                    {{ item.name }}
                </li>
            </ul>

            <div class='address'>
                <p class='title'>
                    {{ $t('withdrawCoin.coinAddress') }}
                </p>
                <van-field v-model='address' :placeholder='$t("withdrawCoin.addressPlaceholder")' required />
            </div>

            <div class='quantity'>
                <p class='title'>
                    {{ $t('withdrawCoin.coinCount') }}
                </p>
                <span class='all' @click='handleAll'>
                    {{ $t('common.all') }}
                </span>
                <van-field v-model='address' :placeholder='$t("withdrawCoin.coinCountPlaceholder")' required />
            </div>

            <div class='text'>
                <p>{{ $t('withdrawCoin.can') }}：35000.000 USDT</p>
                <p>{{ $t('withdrawCoin.service') }}： 3500.000 USDT</p>
            </div>

            <div class='submitBox'>
                <div class='bottom-text'>
                    <label for=''>
                        {{ $t('withdrawCoin.reciveAmount') }}
                    </label>
                    <span class='val'>
                        <em>10000000.00</em> USDT
                    </span>
                </div>
                <van-button size='normal' type='primary' @click='showCancelOrderTip = true'>
                    {{ $t('common.sure') }}
                </van-button>
            </div>
        </div>
    </div>
</template>

<script>
// import { useI18n } from 'vue-i18n'
import { reactive, computed, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { isEmpty } from '@/utils/util'
export default {
    setup (props) {
        const store = useStore()
        const router = useRouter()
        // const { t } = useI18n({ useScope: 'global' })
        const currencyList = computed(() => store.state.currencyList)
        const state = reactive({
            address: '',
            currencyActive: 0,
            chainActive: 0
        })

        const chainList = computed(() => {
            return currencyList.value.find((item, index) => index === state.currencyActive)?.subList
        })

        const handleChangeCurrency = (index) => {
            state.currencyActive = index

            if (isEmpty(currencyList.value[index].subList)) {
                store.dispatch('getCurrencyList', currencyList.value[index].name)
            }
        }
        const handleChangechain = (index) => {
            state.chainActive = index
        }

        const toList = () => {
            router.push('/coinRecord')
        }

        store.dispatch('getCurrencyList').then(() => {
            handleChangeCurrency(0)
        })

        return {
            ...toRefs(state),
            toList,
            handleChangeCurrency,
            handleChangechain,
            currencyList,
            chainList
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    position: relative;
    height: 100%;
    margin-top: rem(90px);
    background-color: var(--contentColor);
    .withdorw-title {
        color: var(--primary);
        font-size: rem(24px);
    }
    .withdraw-wrap {
        padding: 0 rem(30px);
        border-top: solid rem(20px) var(--primaryAssistColor);
        .title {
            margin-top: rem(20px);
            margin-bottom: rem(20px);
        }
        ul.coin-list {
            li {
                display: inline-block;
                width: rem(140px);
                height: rem(70px);
                margin-right: rem(20px);
                line-height: rem(70px);
                text-align: center;
                background-color: var(--primaryAssistColor);
                border-radius: rem(6px);
                &.active {
                    color: #FFF;
                    background-color: var(--primary);
                }
            }
        }
        .address,
        .quantity {
            position: relative;
            margin-top: rem(70px);
            :deep(.van-field) {
                padding-left: 0;
            }
            .all {
                position: absolute;
                top: rem(80px);
                right: rem(20px);
                z-index: 1;
                color: var(--primary);
            }
        }
        .text {
            margin-top: rem(20px);
            color: var(--color);
            font-size: rem(24px);
        }
        .van-field {
            border-bottom: solid 1px var(--lineColor);
        }
    }
    .submitBox {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 2;
        width: 100%;
        font-size: rem(30px);
        .bottom-text {
            display: flex;
            justify-content: space-between;
            margin-bottom: rem(24px);
            padding: 0 rem(30px);
            label {
                font-weight: bold;
            }
            em {
                color: var(--warn);
                font-style: normal;
            }
        }
        .van-button {
            width: 100%;
            height: rem(90px);
            font-size: rem(30px);
            border: none;
            border-radius: 0;
        }
    }
}

</style>
