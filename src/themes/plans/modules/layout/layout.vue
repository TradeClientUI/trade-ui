<template>
    <div class='m-layout' :style='data.styleObj'>
        <div v-if='data.saved === false'>
            <img alt='' :src="require('./layout.png')" />
        </div>
        <div
            v-for='(item, i) in dataList'
            v-else
            :key='i'
            class='col'
            :style="{ margin: '0 ' + data.gutter + 'px' }"
        >
            <a class='link' href='javascript:;' @click="$emit('openUrl',item)">
                <img v-if='item.src' :src='item.src' />
                <img v-else alt='' src='/wp-content/uploads/cats_business/icon2.png' />
                <p v-if='item.label' class='label'>
                    {{ item.label }}
                </p>
            </a>
        </div>
        <slot>
        </slot>
    </div>
</template>

<script>
export default {
    components: {
    },
    props: {
        data: {
            type: Object,
            default: function () {
                return {
                    href: '',
                    src: '',
                    target: ''
                }
            }
        },
    },
    computed: {
        dataList () {
            const len = this.data?.items?.length ?? 0
            if (!len) return [{ src: '' }]
            return this.data.items
        },
        span () {
            return Math.round(24 / this.dataList.length)
        },
        saved () {
            return this.data.saved
        }
    }

}
</script>

<style lang="scss" >
.m-layout {
    display: flex !important;
    min-height: 10px;
    line-height: 1.4;
    .col {
        flex: 1;
        margin: 0;
        color: inherit;
        line-height: 20px;
        text-align: center;
    }
    .label {
        padding: 5px 0;
        text-align: center;
    }
    .link {
        color: inherit;
    }
    img {
        width: 100%;
    }
}
</style>
