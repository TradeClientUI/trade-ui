<template>
    <div>
        <van-empty v-if='!loadStatus && orderList && orderList.length===0' :description='$t("trade.closedEmpty")' image='/images/empty.png' />
        <template v-else-if='orderList'>
            <van-list
                v-model:error='isError'
                v-model:loading='loadStatus'
                :error-text='errorTip'
                :finished='finished'
                :finished-text='$t("historyList.noMore")'
                :immediate-check='false'
                :loading-text="$t('compLang.loading')"
                @load='onLoad'
            >
                <HistoryItem v-for='item in orderList' :key='item' :data='item' />
            </van-list>
            <!-- <positionItem v-for='item in orderList' :key='item' :data='item' /> -->
        </template>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watchEffect } from 'vue'
import { useStore } from 'vuex'
import HistoryItem from './historyItem'
export default {
    components: {
        HistoryItem,
    },
    props: {
        loading: Boolean,
        finished: Boolean,
        error: String,
    },
    setup (props, { emit }) {
        const store = useStore()
        const orderList = computed(() => store.state._trade.historyList)
        const state = reactive({
            loadStatus: props.loading,
            isError: !!props.error,
            errorTip: props.error,
        })
        const onLoad = () => {
            emit('onLoad')
        }
        watchEffect(() => {
            state.loadStatus = props.loading
            state.isError = !!props.error
            state.errorTip = props.error
        })

        return {
            ...toRefs(state),
            orderList,
            onLoad,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.loading {
    padding-top: 30%;
    text-align: center;
}
</style>
