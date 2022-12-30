<template>
    <div class='ranking'>
        <h2 class='title'>
            {{ $t('route.ranking') }}
        </h2>
        <a class='rightMore' href='javascript:;' @click="$router.push('/ranking')">
            <van-icon name='arrow' />
        </a>
        <div>
            <rankingModule :max='3' type='module' />
        </div>
    </div>
</template>

<script>
import productranking from '@planspc/hooks/productranking'
import { computed, ref, unref, watch, onUnmounted } from 'vue'
import rankingModule from '@planspc/modules/ranking/rankingModule'

export default {
    components: {
        rankingModule,
    },
    setup () {
        return {
        }
    }
}
</script>

<style lang="scss" scoped>
.ranking {
    position: relative;
    margin: 40px 0;
    padding: 10px 20px 0;
    background: var(--contentColor);
    border-radius: 5px;
    font-size: 12px;
    .title {
        height: 56px;
        line-height: 56px;
        font-size: 24px;
    }
    .rightMore {
        position: absolute;
        right: 20px;
        top: 25px;
        font-size: 24px;
        color: var(--color);
    }
    .labelTabs {
        margin-top: 10px;
    }
    .rankContent {
        margin-top: 10px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-column-gap: 30px;
    }
    .lastLabel {
        text-align: right;
    }
    .symbolCurrencyIcon {
        margin-right: 0.2em;
    }
    .symbolCurrency {
        display: inline-block;
        line-height: 16px;
        vertical-align: middle;
        font-size: 14px;
    }
}
</style>
