<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' />
        <div class='header' @click="$router.push('/invite/rule')">
            <img alt='' :src='"/images/invite-"+ lang +".jpg"' srcset='' />
        </div>
        <div class='block'>
            <p class='title'>
                {{ $t('invite.rebate') }}
            </p>
            <div class='flex-wrap'>
                <div class='flex-item'>
                    <p class='fit'>
                        <label> {{ $t('invite.total') }}(USDT)</label>
                        <van-icon name='arrow' />
                    </p>
                    <p class='val'>
                        1.563
                    </p>
                </div>
                <div class='flex-item'>
                    <p class='fit'>
                        <label> {{ $t('invite.inviteCount') }}</label>
                        <van-icon name='arrow' />
                    </p>
                    <p class='val'>
                        60
                    </p>
                </div>
            </div>
        </div>

        <div class='block'>
            <p class='title'>
                {{ $t('invite.method') }}
            </p>
            <div class='flex-column'>
                <div class='flex-item'>
                    <span class='left-label'>
                        {{ $t('invite.invite') }}ID
                    </span>
                    <span class='right-val copy-id' data-clipboard-text='1563354' @click='handleCopy("copy-id")'>
                        1563354 <img alt='' src='../../../assets/copy.png' srcset='' />
                    </span>
                </div>
                <div class='flex-item'>
                    <span class='left-label'>
                        {{ $t('invite.link') }}
                    </span>
                    <span class='right-val copy-link' data-clipboard-text='https://trade......1563354' @click='handleCopy("copy-link")'>
                        https://trade......1563354 <img alt='' src='../../../assets/copy.png' srcset='' />
                    </span>
                </div>
            </div>
            <div class='btn'>
                {{ $t('invite.inviteFriend') }}
            </div>
        </div>

        <div class='block'>
            <p class='title'>
                {{ $t('invite.invite') }}TOP10
            </p>
            <div class='invite-list'>
                <div v-for='(item,index) in inviteList' :key='item.id' class='intite-item'>
                    <div class='no'>
                        <i class='icon-no'>
                            {{ index + 1 }}
                        </i>
                        <span>{{ item.id }}</span>
                    </div>
                    <div class='rewards'>
                        {{ item.commission }} USDT
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, unref, computed, defineEmits } from 'vue'
import Clipboard from 'clipboard'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { setCookie, getCookie, isEmpty, localGet, localSet } from '@/utils/util'
const store = useStore()
const { t } = useI18n({ useScope: 'global' })
const lang = computed(() => getCookie('lang') || store.state._base.wpCompanyInfo.language)
const inviteList = ref([
    {
        id: 'ID****5425',
        commission: 182.56
    },
    {
        id: 'ID****4354',
        commission: 159.01
    },
    {
        id: 'ID****7442',
        commission: 140.88
    },
    {
        id: 'ID****0054',
        commission: 105.45
    },
    {
        id: 'ID****5475',
        commission: 100.93
    },
    {
        id: 'ID****8845',
        commission: 80.33
    },
    {
        id: 'ID****1025',
        commission: 77.12
    },
    {
        id: 'ID****0125',
        commission: 51.56
    },
    {
        id: 'ID****7456',
        commission: 18.56
    },
    {
        id: 'ID****2256',
        commission: 10.12
    }

])

const handleCopy = (c) => {
    var clipboard = new Clipboard('.' + c)
    clipboard.on('success', e => {
        Toast(t('common.copySuccess'))
        // 释放内存
        clipboard.destroy()
    })
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    width: 100%;
    margin-top: rem(110px);
    background: #E6444B;
    .header {
        img {
            width: 100%;
            vertical-align: bottom;
        }
    }
    .block {
        margin: 0 rem(30px) rem(30px);
        margin-bottom: rem(30px);
        padding: rem(30px);
        background: #FFF;
        border-radius: rem(10px);
        .title {
            margin-bottom: rem(20px);
            font-size: rem(32px);
        }
        .flex-wrap {
            display: flex;
            .flex-item {
                flex: 1;
                margin-right: rem(20px);
                padding: rem(20px) rem(30px);
                background: #F8F8F8;
                border-radius: rem(8px);
                &:last-child {
                    margin-right: 0;
                }
                .fit {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: rem(20px);
                    color: #999;
                    font-size: rem(24px);
                }
                .val {
                    color: #333;
                    font-size: rem(60px);
                }
            }
        }
        .flex-column {
            display: flex;
            flex-direction: column;
            .flex-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: rem(96px);
                margin-bottom: rem(30px);
                padding: 0 rem(20px);
                background: #F8F8F8;
                img {
                    width: rem(30px);
                    vertical-align: rem(-3px);
                }
            }
        }
        .btn {
            height: rem(100px);
            color: #7C4514;
            font-weight: bold;
            font-size: rem(36px);
            line-height: rem(100px);
            text-align: center;
            background: linear-gradient(#FFCC9F, #F8B77C);
            border-radius: rem(10px);
        }
        .invite-list {
            margin-top: rem(40px);
            .intite-item {
                display: flex;
                justify-content: space-between;
                height: rem(70px);
                .icon-no {
                    display: inline-block;
                    width: rem(40px);
                    height: rem(40px);
                    margin-right: rem(20px);
                    line-height: rem(40px);
                    text-align: center;
                    background: linear-gradient(to right, #F9BA81, #FFF);
                    border-radius: 50%;
                }
            }
        }
    }
}
</style>
