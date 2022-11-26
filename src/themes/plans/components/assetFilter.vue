<template>
    <div class='filter-block'>
        <van-checkbox
            v-model='checked'
            icon-size='16px'
            shape='round'
            @change='changeState'
        >
            {{ $t('assets.hideAsset') }}
        </van-checkbox>
        <van-search
            v-model='searchText'
            input-align='center'
            :placeholder='$t("assets.searchAsset")'
            @clear='clear'
            @update:model-value='search'
        />
    </div>
</template>

<script setup>
import { defineProps, ref, defineEmits, defineExpose, watch } from 'vue'
import { localGet, debounce, localSet, isEmpty } from '@/utils/util'
const emit = defineEmits(['changeState', 'searchAsset'])
const props = defineProps({
    hideAsset: Boolean,
    searchText: String
})

const checked = ref(JSON.parse(localGet('hideAsset')))

const searchText = ref(props.searchText || '')
console.log('checked====', checked, props.hideAsset)

if (isEmpty(localGet('hideAsset'))) {
    localSet('hideAsset', false)
}

// 点击隐藏0资产
const changeState = val => {
    localSet('hideAsset', val)
    emit('changeState', val)
}

// 搜索资产
const search = debounce(val => {
    emit('searchAsset', val)
}, 800)

const clear = () => {
    searchText.value = ''
    emit('searchAsset', '')
}

watch(() => props.hideAsset, newVal => {
    checked.value = newVal
})

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.filter-block {
    display: flex;
    justify-content: space-between;
    height: rem(100px);
    padding: 0 rem(30px);
    background: var(--contentColor);
    border-bottom: solid 1px var(--lineColor);
    :deep(.van-checkbox) {
        //flex: 1;
        width: 60%;
        .van-checkbox__label {
            margin-top: 3px;
        }
    }
    :deep(.van-search) {
        flex: 1;
        margin: rem(20px) 0;
        padding: rem(10px) 0;
        //border: solid 1px var(--lineColor);
        .van-cell {
            padding-right: rem(20px);
            border: solid 1px var(--lineColor);
            border-radius: rem(10px);
        }
    }
    :deep(.van-search__content) {
        background-color: var(--contentColor);
    }
}
</style>
