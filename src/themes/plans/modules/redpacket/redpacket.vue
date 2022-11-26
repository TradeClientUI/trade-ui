<template>
    <div v-if='h5Preview' class='redpacket'>
        红包雨模块，实际H5页面上不占用此空间
    </div>
</template>

<script>
import redpacket from '@/utils/redpacket'
export default {
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
    },
    mounted () {
        setTimeout(() => {
            if (!window.redpacketFinish) this.init()
        }, 1000)
    },
    methods: {
        init () {
            const { type, time } = this.data
            redpacket({
                time: time || 1,
                finish: () => {
                    if (Number(type) === 1) window.redpacketFinish = true
                }
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.redpacket {
    min-height: 10px;
    padding: 10px;
}
</style>
