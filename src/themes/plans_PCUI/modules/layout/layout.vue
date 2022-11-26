<template>
    <div class='m-layout' :style='data.styleObj'>
        <div
            v-for='(item, i) in dataList'
            :key='i'
            class='col'
            :style="{ margin: '0 ' + data.gutter + 'px' }"
        >
            <a class='link' href='javascript:;' @click="$emit('openUrl',item)">
                <img v-if='item.src' :src='item.src' />
                <p v-if='item.label' class='label'>
                    {{ item.label }}
                </p>
            </a>
        </div>
        <slot></slot>
    </div>
</template>

<script>
// import ImgComp from '../img/img.vue'
export default {
    components: {
        // ImgComp,
    },
    props: {
        data: {
            type: Object,
            default: function () {
                return {
                    href: '',
                    src: '',
                    target: '',
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
        }
    },

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
