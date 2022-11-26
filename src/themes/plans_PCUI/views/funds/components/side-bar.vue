<template>
    <div class='side-bar'>
        <!-- 基金账户模块 -->
        <div v-if='customerInfo' class='fund-account'>
            <div class='nav-title'>
                <a href='javascript:;'>
                    <svg fill='none' height='32' viewBox='0 0 32 32' width='32' xmlns='http://www.w3.org/2000/svg'>
                        <rect fill='#EEEEEE' height='32' rx='16' width='32' /><g clip-path='url(#clip0)'>
                            <path d='M21.6875 7.5H10.3125C9.03737 7.5 8 8.53737 8 9.8125C8 11.0876 9.03737 12.125 10.3125 12.125H21.6875C22.9626 12.125 24 11.0876 24 9.8125C24 8.53737 22.9626 7.5 21.6875 7.5ZM21.6875 10.875H10.3125C9.72663 10.875 9.25 10.3984 9.25 9.8125C9.25 9.22663 9.72663 8.75 10.3125 8.75H21.6875C22.2734 8.75 22.75 9.22663 22.75 9.8125C22.75 10.3984 22.2734 10.875 21.6875 10.875Z' fill='#555555' /><path d='M21.6875 13.1875H10.3125C9.03737 13.1875 8 14.2249 8 15.5C8 16.7751 9.03737 17.8125 10.3125 17.8125H21.6875C22.9626 17.8125 24 16.7751 24 15.5C24 14.2249 22.9626 13.1875 21.6875 13.1875ZM21.6875 16.5625H10.3125C9.72663 16.5625 9.25 16.0859 9.25 15.5C9.25 14.9141 9.72663 14.4375 10.3125 14.4375H21.6875C22.2734 14.4375 22.75 14.9141 22.75 15.5C22.75 16.0859 22.2734 16.5625 21.6875 16.5625Z' fill='#555555' /><path d='M21.6875 18.875H10.3125C9.03737 18.875 8 19.9124 8 21.1875C8 22.4626 9.03737 23.5 10.3125 23.5H18.5625C18.9077 23.5 19.1875 23.2202 19.1875 22.875C19.1875 22.5298 18.9077 22.25 18.5625 22.25H10.3125C9.72663 22.25 9.25 21.7734 9.25 21.1875C9.25 20.6016 9.72663 20.125 10.3125 20.125H21.6875C22.2734 20.125 22.75 20.6016 22.75 21.1875C22.75 21.7734 22.2734 22.25 21.6875 22.25C21.3423 22.25 21.0625 22.5298 21.0625 22.875C21.0625 23.2202 21.3423 23.5 21.6875 23.5C22.9626 23.5 24 22.4626 24 21.1875C24 19.9124 22.9626 18.875 21.6875 18.875Z' fill='#555555' />
                        </g><defs>
                            <clipPath id='clip0'>
                                <rect fill='white' height='16' transform='translate(8 7.5)' width='16' />
                            </clipPath>
                        </defs>
                    </svg>
                    <span class='name'>
                        {{ $t('funds.fundsAccount') }}
                    </span>
                    <van-popover v-model:show='showPopover' theme='dark'>
                        <p style='padding: 10px;'>
                            {{ $t('fundInfo.buyRedeemRecords') }}
                        </p>
                        <template #reference>
                            <i
                                class='record-link icon_zijinjilu'
                                @click='showRecords'
                                @mouseenter='showPopover=true'
                                @mouseleave='showPopover=false'
                            >
                            </i>
                        </template>
                    </van-popover>
                </a>
            </div>
            <p class='nav-sub-title'>
                Fund-Token Balance
            </p>
            <ul class='nav-assets'>
                <li v-for='(item, index) in fundAccounts' :key='index'>
                    <a href='javascript:;'>
                        <currency-icon class='currency' :currency='item.currency' size='32px' />
                        <span class='name'>
                            {{ item.currency }}
                        </span>
                        <span class='available'>
                            {{ item.available }}
                        </span>
                    </a>
                    <p class='total'>
                        ≈ {{ item.wholeWarehouseBalance }} {{ assetsInfo?.currency }}
                    </p>
                </li>
            </ul>
        </div>

        <!-- 基金产品模块 -->
        <div class='fund-products'>
            <div class='nav-title'>
                <a href='javascript:;' @click="switchFundItem('')">
                    <svg fill='none' height='32' viewBox='0 0 32 32' width='32' xmlns='http://www.w3.org/2000/svg'>
                        <rect fill='#EEEEEE' height='32' rx='16' width='32' /><g clip-path='url(#clip0)'>
                            <path d='M21.6875 7.5H10.3125C9.03737 7.5 8 8.53737 8 9.8125C8 11.0876 9.03737 12.125 10.3125 12.125H21.6875C22.9626 12.125 24 11.0876 24 9.8125C24 8.53737 22.9626 7.5 21.6875 7.5ZM21.6875 10.875H10.3125C9.72663 10.875 9.25 10.3984 9.25 9.8125C9.25 9.22663 9.72663 8.75 10.3125 8.75H21.6875C22.2734 8.75 22.75 9.22663 22.75 9.8125C22.75 10.3984 22.2734 10.875 21.6875 10.875Z' fill='#555555' /><path d='M21.6875 13.1875H10.3125C9.03737 13.1875 8 14.2249 8 15.5C8 16.7751 9.03737 17.8125 10.3125 17.8125H21.6875C22.9626 17.8125 24 16.7751 24 15.5C24 14.2249 22.9626 13.1875 21.6875 13.1875ZM21.6875 16.5625H10.3125C9.72663 16.5625 9.25 16.0859 9.25 15.5C9.25 14.9141 9.72663 14.4375 10.3125 14.4375H21.6875C22.2734 14.4375 22.75 14.9141 22.75 15.5C22.75 16.0859 22.2734 16.5625 21.6875 16.5625Z' fill='#555555' /><path d='M21.6875 18.875H10.3125C9.03737 18.875 8 19.9124 8 21.1875C8 22.4626 9.03737 23.5 10.3125 23.5H18.5625C18.9077 23.5 19.1875 23.2202 19.1875 22.875C19.1875 22.5298 18.9077 22.25 18.5625 22.25H10.3125C9.72663 22.25 9.25 21.7734 9.25 21.1875C9.25 20.6016 9.72663 20.125 10.3125 20.125H21.6875C22.2734 20.125 22.75 20.6016 22.75 21.1875C22.75 21.7734 22.2734 22.25 21.6875 22.25C21.3423 22.25 21.0625 22.5298 21.0625 22.875C21.0625 23.2202 21.3423 23.5 21.6875 23.5C22.9626 23.5 24 22.4626 24 21.1875C24 19.9124 22.9626 18.875 21.6875 18.875Z' fill='#555555' />
                        </g><defs>
                            <clipPath id='clip0'>
                                <rect fill='white' height='16' transform='translate(8 7.5)' width='16' />
                            </clipPath>
                        </defs>
                    </svg>
                    <div class='text'>
                        <span class='name'>
                            {{ $t('funds.fundsList') }}
                        </span>
                    </div>
                </a>
            </div>
            <p class='nav-sub-title'>
                Investment Funds
            </p>
            <ul class='nav-menu'>
                <li v-for='(item, index) in fundProductList' :key='index'>
                    <a :class="{ 'active': item.fundId === fundId }" href='javascript:;' @click='switchFundItem(item.fundId)'>
                        <currency-icon class='currency' :currency='item.shareTokenCode' size='32px' />
                        <div class='text'>
                            <span class='tag'>
                                {{ item.fundType }}
                            </span>
                            <span class='name'>
                                {{ item.fundName }}
                            </span>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, defineEmits, inject } from 'vue'
import { useStore } from 'vuex'
import { useFund } from '../hooks.js'
import currencyIcon from '@/components/currencyIcon.vue'

const emits = defineEmits(['select'])
const fundId = inject('fundId')
const changeShowModel = inject('changeShowModel')

const store = useStore()
// 用户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 资产信息
const assetsInfo = computed(() => store.state._user.assetsInfo[5])
// 账户列表
const accountList = computed(() => {
    if (customerInfo.value) {
        return customerInfo.value.accountList?.filter(el => Number(el.tradeType) === 5) || []
    } else {
        return []
    }
})
// 基金账户
const fundAccounts = computed(() => {
    const result = []
    fundProductList.value.map(fund => {
        accountList.value.map(account => {
            if (account.currency === fund.shareTokenCode) {
                result.push(account)
            }
        })
    })
    return result
})
// 基金产品列表
const { fundProductList } = useFund()
// 是否显示弹出层
const showPopover = ref(false)

// 切换基金产品
const switchFundItem = (value) => {
    emits('select', value)
}

// 显示申购赎回记录模块
const showRecords = () => {
    changeShowModel('fundRecord')
}
</script>

<style lang='scss' scoped>
@import "@/sass/mixin.scss";
.side-bar {
    padding-bottom: 10px;
}
// 标题
.nav-title {
    a {
        display: flex;
        align-items: center;
        height: 52px;
        margin: 8px;
        padding: 4px;
        font-weight: 400;
        border-radius: 8px;
        background-color: var(--lineColor);
    }
    .name {
        flex: 1;
        margin-left: 10px;
        font-size: 20px;
        font-weight: 600;
        color: var(--mainColor);
    }
    .record-link {
        margin: 0 8px;
        font-size: 16px;
        color: var(--normalColor);
        cursor: pointer;
    }
}
.nav-sub-title {
    font-size: 12px;
    color: var(--normalColor);
    margin: 16px 16px 8px;
}

// 基金账户
.fund-account {
    margin-bottom: 40px;
    .nav-title {
        a {
            cursor: default;
        }
    }
    .nav-assets {
        li {
            margin-bottom: 8px;
            padding: 4px 12px;
            &:last-of-type {
                margin-bottom: 0;
            }
            a {
                display: flex;
                align-items: center;
                font-weight: 400;
                border-radius: 8px;
                cursor: default;
                .name {
                    flex: 1;
                    margin-left: 10px;
                }
                .name, .available {
                    font-size: 16px;
                    font-weight: 500;
                    color: var(--mainColor);
                }
            }
            .total {
                line-height: 1.2;
                text-align: right;
                font-size: 12px;
                color: var(--normalColor);
            }
        }
    }
}

// 基金列表
.nav-menu {
    li {
        height: 52px;
        margin-bottom: 8px;
        a {
            display: flex;
            align-items: center;
            height: 100%;
            margin: 0 8px;
            padding: 4px;
            font-weight: 400;
            border-radius: 8px;
            &.active {
                background-color: var(--lineColor);
            }
            &:hover {
                background-color: var(--bgColor);
            }
        }
        .text {
            flex: 1;
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            margin-left: 10px;
            .tag {
                font-size: 10px;
                color: var(--normalColor);
            }
            .name {
                font-size: 16px;
                font-weight: 500;
                color: var(--mainColor);
            }
        }
    }
}
</style>

<style>
.footer-nav.Funds {
    display: none;
}
</style>
