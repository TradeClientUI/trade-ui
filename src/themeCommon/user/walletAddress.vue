<template>
    <div class='layout'>
        <!-- 加载中组件 -->
        <Loading :show='loading' />
        <!-- 头部导航 -->
        <Top
            back
            left-icon='arrow-left'
            show-center
        />
        <div class='container'>
            <div v-if='addressList.length > 0' class='address-list'>
                <div v-for='item in addressList' :key='item.id' class='item'>
                    <div class='above'>
                        <p class='info'>
                            <span class='name'>
                                {{ item.currency }}-{{ item.chainName }}
                            </span>
                            <span v-if='item.remark' class='tag'>
                                {{ item.remark }}
                            </span>
                        </p>
                        <p class='code'>
                            {{ item.address }}
                        </p>
                    </div>
                    <div class='below'>
                        <span class='delete' @click='deleteWallet(item.id)'>
                            {{ $t('walletAddress.deleteBtn') }}
                        </span>
                    </div>
                </div>
            </div>
            <van-empty
                v-else
                :description="$t('walletAddress.none')"
                image='/images/empty.png'
            />
        </div>
        <!-- 底部按钮 -->
        <button class='footer-btn' @click="$router.push({ path: '/walletAdd' })">
            <van-icon :color='style.color' name='plus' />
            <span>{{ $t('walletAddress.addBtn') }}</span>
        </button>
    </div>
</template>

<script>
// vue
import { onMounted, reactive, toRefs, computed } from 'vue'
// components
import Top from '@/components/top'
import { Toast, Dialog } from 'vant'
// i18n
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

// api
import { getWalletAddressList, deleteWalletAddress } from '@/api/user'

export default {
    components: {
        Top
    },
    setup () {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const style = computed(() => store.state.style)
        const state = reactive({
            // 加载状态
            loading: true,
            // 钱包地址列表
            addressList: []
        })

        // 删除钱包
        const deleteWallet = (id) => {
            Dialog.confirm({
                title: t('withdraw.hint'),
                message: t('walletAddress.addHint'),
            }).then(() => {
                // 发起api请示
                deleteWalletAddress({
                    id
                }).then(() => {
                    Toast.success(t('withdraw.successHint'))
                    state.addressList = state.addressList.filter(v => v.id !== id)
                })
            }).catch(() => {})
        }

        // 获取钱包地址列表
        const getWalletAddress = () => {
            getWalletAddressList({
                currency: '',
                chainName: ''
            }).then(res => {
                state.loading = false
                if (res.check()) {
                    const { data } = res
                    state.addressList = data
                }
            })
        }

        onMounted(() => {
            // 获取钱包地址列表
            getWalletAddress()
        })

        return {
            ...toRefs(state),
            deleteWallet,
            style
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: var(--bgColor);
}
.container {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-y: auto;
    background-color: var(--bgColor);
    //padding-bottom: rem(104px);
}
.address-list {
    .item {
        width: rem(690px);
        margin: rem(30px) auto rem(30px);
        padding: 0 rem(32px);
        background-color: var(--contentColor);
        border: 1px solid var(--lineColor);
        border-radius: rem(4px);
        .above {
            height: rem(122px);
            padding-top: rem(20px);
            border-bottom: 1px solid var(--lineColor);
            .info {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .name {
                    color: var(--color);
                    font-size: rem(30px);
                }
                .tag {
                    padding: rem(9px) rem(7px);
                    color: var(--primary);
                    font-size: rem(20px);
                    background-color: var(--primaryAssistColor);
                    border-radius: rem(4px);
                }
            }
            .code {
                color: var(--color);
                font-size: rem(24px);
            }
        }
        .below {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            height: rem(68px);
            :deep(.van-radio__label) {
                margin-top: rem(4px);
                margin-left: rem(10px);
                color: var(--minorColor);
                font-size: rem(24px);
            }
            .delete {
                color: var(--minorColor);
                font-size: rem(24px);
            }
        }
    }
}
.footer-btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    height: rem(104px);
    background-color: var(--contentColor);
    border-top: 1px solid var(--lineColor);
    :deep(.van-icon-plus) {
        font-weight: bold;
    }
    span {
        margin-left: rem(15px);
        color: var(--color);
        font-weight: bold;
        font-size: rem(34px);
        letter-spacing: 1px;
    }
}
</style>
