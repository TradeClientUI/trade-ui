<template>
    <van-popup
        v-model:show='show'
        class='popup-country'
        position='right'
        :style="{ width: '100%',height:'100%' }"
        teleport='#app'
        @close='onClose'
    >
        <div class='header'>
            <i class='icon_icon_back1' @click='show=false'></i>
            {{ $t('register.area') }}
        </div>
        <van-search v-model='searchVal' :placeholder='$t("search.placeholder")' @focus='handleFocus' />
        <div ref='countryListRef' class='country-list'>
            <div
                v-for='item in searchList'
                :key='item.id'
                class='country-item'
                @click='onSelect(item)'
            >
                <div>
                    <img
                        alt=''
                        class='icon-country'
                        :src="cdnUrl+'/images/countries_flags/' + item.code +'.png'"
                        srcset=''
                    />
                    <span class='country-text'>
                        {{ item.displayName }}
                    </span>
                </div>

                <span>{{ item.countryCode }}</span>
            </div>
            <van-empty v-show='searchList.length === 0' :description="$t('search.norecord')" image='/images/empty.png' />
        </div>
    </van-popup>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { cdnUrl } from '@/config'
export default {
    props: {
        modelValue: Boolean,
        text: {
            type: String,
            default: 'name'
        },
        accountType: {
            type: Number,
            default: 0, // 0 个人开户 1企业开户
        }
    },
    emits: ['update:modelValue', 'select'],
    setup (props, { emit }) {
        const store = useStore()
        const show = computed({
            get: () => props.modelValue,
            set: val => emit('update:modelValue', val)
        })
        const searchVal = ref('') // 搜索文字

        const countryListRef = ref(null) // 滚动条div
        // 列表
        const searchList = computed(() => {
            const value = searchVal.value.toUpperCase()
            // 获取国家区号
            const countrylist = props.accountType === 0 ? store.state.countryList : store.getters.companyCountryList
            const list = (!value) ? countrylist : countrylist.filter(el => {
                if ((el.code && el.code.toUpperCase().indexOf(value) !== -1) || (el.countryCode && el.countryCode.toUpperCase().indexOf(value) !== -1) || (el.displayName && el.displayName.toUpperCase().indexOf(value) !== -1)) {
                    return true
                } else {
                    return false
                }
            })
            return list
        })

        const onSelect = item => {
            emit('select', item)
            emit('update:modelValue', false)
        }

        const handleFocus = (e) => {
            e?.target?.scrollIntoView && e.target.scrollIntoView({
                block: 'nearest',
                inline: 'nearest'
            })
        }

        // 关闭弹窗清除搜索内容
        const onClose = () => {
            searchVal.value = ''
            if (countryListRef.value?.scrollTop) countryListRef.value.scrollTop = 0 // 重置滚动条
        }

        return {
            searchVal,
            countryListRef,
            searchList,
            show,
            onSelect,
            onClose,
            handleFocus,
            cdnUrl
        }
    }
}

</script>

<style lang="scss" scoped>
.popup-country {
    background: var(--bgColor);
    .header {
        margin: 0 rem(30px);
        font-size: rem(32px);
        line-height: rem(120px);
        font-weight: bold;
        .icon_icon_back1 {
            color: var(--minorColor);
            font-weight: bold;
            margin-right: rem(10px);
            font-size: rem(26px);
        }
    }
    .van-search {
        padding-top: 0;
        :deep(.van-cell) {
            padding-left: 0;
            border-radius: rem(40px);
            background: var(--bgColor);
        }
        :deep(.van-search__content) {
            background: var(--bgColor);
            border: solid 1px var(--lineColor);
            border-radius: rem(40px);
            padding-left: rem(16px);
            height: rem(80px);
            align-items: center;
        }
        :deep(.van-icon-search){
            margin-top: -1px;
        }
    }
    .country-list {
        height: calc(100vh - 110px);
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        .country-item {
            display: flex;
            justify-content: space-between;
            padding: 0 rem(30px);
            line-height: rem(100px);
            font-size: rem(28px);
            .icon-country{
                width: rem(50px);
                height: rem(38px);
                vertical-align: middle;
                border: solid 1px var(--lineColor);
                margin-right: rem(10px);
            }
            .country-text{
                vertical-align: middle;
            }
            &:active {
                background: var(--bgColor);
            }
        }
    }
}

</style>
