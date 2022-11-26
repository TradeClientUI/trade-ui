<template>
    <div ref='wrapper' :style='data.styleObj'>
        <van-cell-group :border='false' class='cellGroup'>
            <van-cell
                v-for='(item, key) in cellList'
                :key='key'
                class='cellItem'
                :is-link='item.isLink'
                :title='item.title'
                @click='openUrl(item)'
            >
                <template #icon>
                    <img
                        v-if='item.icon'
                        alt=''
                        class='icon'
                        height='20'
                        :src='item.icon'
                        width='20'
                    />
                </template>
                <template #label>
                    <span v-if='item.describe'>
                        {{ item.describe }}
                    </span>
                </template>
                <template #value>
                    <van-tag v-if='item.value' round :type='item.valueStyle'>
                        <span v-if='!h5Preview && item.dataKey'>
                            {{ $store.getters[item.dataKey] }}
                        </span>
                        <span v-else-if='item.value'>
                            {{ item.value }}
                        </span>
                    </van-tag>
                </template>
            </van-cell>
        </van-cell-group>
        <slot></slot>
    </div>
</template>

<script>

export default {
    props: {
        data: {
            type: Object,
            default: () => ({
                href: '',
                src: '',
                target: '',
            })
        },
    },
    data () {
        return {
            placeholder: '',
            fccInfoFlow: {}
        }
    },
    computed: {
        userAccountType () {
            return this.$store.getters['_user/userAccountType']
        },
        cellList () {
            const userAccountType = this.userAccountType
            const list = this.data.items
            if (this.h5Preview || this.data.accountType.includes(userAccountType)) {
                return list.map(el => {
                    let dataKey = null
                    const reg = /\{\{(\w+)\}\}/
                    if (el.value && el.value.trim().match(reg)) {
                        dataKey = el.value.trim().match(reg)[1]
                    }
                    return Object.assign({}, el, { dataKey })
                })
            }

            return []
        }
    },
    methods: {
        open (item) {
            const toRoute = item.href
            if (toRoute.name === 'Nest') {
                toRoute.params.type = 'otherPage'
                this.$router.push(toRoute)
            } else {
                this.$router.push({ name: toRoute.name })
            }
        },

    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.title {
    padding: 10px 20px;
    font-size: 14px;
    line-height: 1;
    vertical-align: middle;
}
.icon {
    display: inline-block;
    //font-size: rem(32px);
    width: rem(40px);
    height: rem(40px);
    margin-right: rem(24px);
    vertical-align: middle;
}
.cellGroup {
    .cellItem {
        display: flex;
        align-items: center;
        height: rem(120px);
        font-size: rem(32px);
        line-height: rem(120px);
        background: var(--contentColor);
        border-top: solid rem(10px) var(--bgColor);
        &::after {
            border: none;
        }
        :deep(.van-icon-arrow) {
            margin-top: -2px;
        }
        :deep(.van-cell__title) {
            color: var(--color);
        }
        :deep(.van-cell__value) {
            flex: none;
        }
    }
}
:deep(.van-tag--none) {
    color: #969799;
}
:deep(.van-cell__label:empty) {
    display: none;
}

</style>
