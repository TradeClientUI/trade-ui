<template>
    <!-- <van-popup
        v-model:show='show'

        position='bottom'
        :style="{ width: '100%',height: '50%' }"
    >
        <van-index-bar :index-list='indexList'>
            <van-index-anchor index='A' />
            <van-cell title='文本' />
            <van-cell title='文本' />
            <van-cell title='文本' />

            <van-index-anchor index='B' />
            <van-cell title='文本' />
            <van-cell title='文本' />
            <van-cell title='文本' />

            <van-index-anchor index='C' />
            <van-cell title='文本' />
            <van-cell title='文本' />
            <van-cell title='文本' />

            <van-index-anchor index='D' />
            <van-cell title='文本' />
            <van-cell title='文本' />
            <van-cell title='文本' />

            <van-index-anchor index='E' />
            <van-cell title='文本' />
            <van-cell title='文本' />
            <van-cell title='文本' />

            <van-index-anchor index='F' />
            <van-cell title='文本' />
            <van-cell title='文本' />
            <van-cell title='文本' />
            <van-cell title='文本' />
            <van-cell title='文本' />
            <van-cell title='文本' />
            <van-cell title='文本' />

            <van-index-anchor index='D' />
            <van-cell title='文本' />
            <van-cell title='文本' />
            <van-cell title='文本' />
            <van-cell title='文本' />
            <van-cell title='文本' />
            <van-cell title='文本' />
            <van-cell title='文本' />
        </van-index-bar>
    </van-popup> -->

    <van-popup
        v-model:show='show'
        class='popup-country'
        position='bottom'
        round
        :style="{ width: '100%' }"
    >
        <div class='header'>
            {{ $t('register.area') }}
            <i class='icon_icon_close_big' @click='show=false'></i>
        </div>
        <!-- <van-search v-model='searchVal' placeholder='请输入搜索关键词' /> -->
        <div class='country-list'>
            <div
                v-for='item in actions'
                :key='item.id'
                class='country-item'
                @click='onSelect(item)'
            >
                <span>{{ item.displayName }}</span>
                <span>{{ item.countryCode }}</span>
            </div>
        </div>
    </van-popup>

    <!-- <van-action-sheet v-model:show='show' :actions='actions' @select='onSelect' /> -->
</template>

<script>
import { computed, ref } from 'vue'
export default {
    props: {
        modelValue: Boolean,
        text: {
            type: String,
            default: 'name'
        },
        data: {
            type: Array,
            default () {
                return []
            }
        }
    },
    emits: ['update:modelValue', 'select'],
    setup (props, { emit }) {
        const indexList = ref(['A', 'B', 'C', 'D', 'F'])
        const show = computed({
            get: () => props.modelValue,
            set: val => emit('update:modelValue', val)
        })
        const actions = computed(() => {
            return props.data.map(el => {
                return {
                    ...el,
                    name: el.countryCode ? el[props.text] + '(' + el.countryCode + ')' : el[props.text]
                }
            })
        })

        const onSelect = item => {
            emit('select', item)
            emit('update:modelValue', false)
        }

        return {
            show,
            actions,
            onSelect,
            indexList
        }
    }
}

</script>

<style lang="scss" scoped>
.popup-country {
    background: var(--bgColor);
    .header {
        display: flex;
        justify-content: space-between;
        margin: 0 rem(30px);
        font-size: rem(32px);
        line-height: rem(120px);
        text-align: right;
        .icon_icon_close_big {
            color: var(--normalColor);
            font-weight: bold;
            font-size: rem(28px);
        }
    }
    .van-search {
        padding-top: 0;
        :deep(.van-cell) {
            padding-left: 0;
        }
        :deep(.van-search__content) {
            background: var(--contentColor);
            border: solid 1px var(--lineColor);
            border-radius: rem(10px);
        }
    }
    .country-list {
        height: 400px;
        overflow: auto;
        .country-item {
            display: flex;
            justify-content: space-between;
            padding: 0 rem(30px);
            line-height: rem(100px);
            //border-bottom: solid 1px var(--lineColor);
            &:hover {
                background: var(--bgColor);
            }
        }
    }
}

</style>
