<template>
    <div class='success-content'>
        <div v-if='fund' class='success-block'>
            <div class='success-icon'>
                <svg aria-hidden='true' class='svg-icon' focusable='false' viewBox='0 0 24 24'>
                    <svg aria-hidden='true' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                        <path clip-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' fill-rule='evenodd' />
                    </svg>
                </svg>
            </div>
            <h4 v-if='isMobilePolygon' class='all-done'>
                Submission completed!
            </h4>
            <h4 v-else class='all-done'>
                All done!
            </h4>
            <!-- <p class='amount'>
                You Purchased {{ count }} {{ fund.symbol }}
            </p> -->
            <!-- <div class='add-box'>
                <p class='des'>
                    Add aToken to the wallet to track your purchase balance.
                </p>
                <button class='btn' @click='addCoin'>
                    <van-icon class='icon' name='paid' />
                    <span>Add to wallet</span>
                </button>
            </div> -->
        </div>

        <div class='handle-action'>
            <div v-if='!isMobilePolygon' class='review' @click='reviewDetail(successData.transactionHash)'>
                <span>
                    Review tx details
                </span>
                <svg aria-hidden='true' class='svg-icon' focusable='false' viewBox='0 0 24 24'>
                    <svg
                        aria-hidden='true'
                        fill='none'
                        stroke='currentColor'
                        stroke-width='2'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' stroke-linecap='round' stroke-linejoin='round' />
                    </svg>
                </svg>
            </div>
            <button class='default' @click='close'>
                Ok, Close
            </button>
        </div>
    </div>
</template>

<script setup>
import networkConfigs from '@/plugins/web3/config/networkConfigs'
import { computed } from 'vue'
import { useStore } from 'vuex'

const isMobile = process.env.VUE_APP_theme === 'plans'

const store = useStore()
const props = defineProps(['fund', 'count', 'successData'])

const emit = defineEmits(['close'])

// 关闭弹窗事件
const close = () => emit('close')

const isMobilePolygon = computed(() => props.fund.chainId === 137 && isMobile)

// 查看详情
const reviewDetail = (transactionHash) => {
    const { chainId } = store.state._web3
    const explorerLink = networkConfigs[chainId]?.explorerLink + '/tx/' + transactionHash
    window.open(explorerLink)
}

// 添加货币
const addCoin = () => {}
</script>

<style lang="scss" scoped>

// 申购成功
.success-content {
    padding: 0 24px;
    .success-block {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 10px;
        color: var(--color);
    }
    .success-icon {
        display: flex;
        width: 48px;
        height: 48px;
        justify-content: center;
        align-items: center;
        background-color: rgb(236, 248, 237);
        border-radius: 50%;
        .svg-icon {
            width: 32px;
            height: 32px;
            color: rgb(76, 175, 80);
        }
    }
    .all-done {
        margin-top: 16px;
        font-size: 18px;
        font-weight: 600;
    }
    .amount {
        margin-top: 8px;
    }
    .add-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 12px 24px;
        margin-top: 24px;
        margin-bottom: 24px;
        background: rgb(247, 247, 249);
        border-radius: 12px;
        .coin {
            width: 28px;
            height: 28px;
            margin-bottom: 8px;
        }
        .des {
            text-align: center;
            font-size: 12px;
            font-weight: bold;
            color: var(--normalColor);
        }
        .btn {
            @include hover();
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 64px;
            margin-top: 8px;
            padding: 6px 12px;
            color: #FFF;
            font-size: 14px;
            font-weight: 500;
            background-color: var(--primary);
            border-radius: 4px;
            cursor: pointer;
            .icon {
                font-size: 20px;
                margin-top: -4px;
                margin-right: 5px;
            }
        }
    }
    .handle-action {
        margin-top: 120px;
        .review {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            color: var(--color);
            font-size: 13px;
            cursor: pointer;
            .svg-icon {
                width: 14px;
                height: 14px;
                margin-top: 4px;
                margin-left: 2px;
            }
            &:hover {
                text-decoration: underline;
            }
        }
        button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 44px;
            margin-top: 8px;
            font-size: 16px;
            border-radius: 4px;
            transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
            &.default {
                @include hover();
                background: var(--primary);
                color: #FFF;
                cursor: pointer;
            }
        }
    }
    @media (max-width: 768px) {
        padding: 0 16px;
        .add-box {
            display: none;
        }
    }
}
</style>
