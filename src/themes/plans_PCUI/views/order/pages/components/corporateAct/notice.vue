<template>
    <div v-if='list.length' class='act-notice'>
        <!-- <van-icon name='volume-o' size='16' /> -->
        <van-notice-bar
            color='var(--normalColor)'
            left-icon='volume-o'
            :text='noticeMsg'
        />
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default {
    setup () {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const list = computed(() => {
            return (store.getters.productActived?.tradeType === 6 && store.getters.productActived?.dividendFutureInfos) || []
        })
        const noticeMsg = computed(() => {
            return list.value.length === 0 ? '' : t('corporateAct.exDividend') + ': ' + list.value[0].actionInfo
        })
        return {
            noticeMsg,
            list,
        }
    }
}
</script>

<style lang="scss" scoped>
.act-notice {
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 14px 0 17px;
    background: var(--assistColor);
    .van-notice-bar {
        flex: 1;
        padding: 0 7px 0 0;
        height: 32px;
        font-size: 12px;
        background: none;
    }
    :deep() {
        .van-icon-volume-o {
            margin-top: -4px;
        }
    }
}

</style>
