<template>
    <div class='authConditionWrapper'>
        <Top back show-center />
        <auth-condition :business-code='businessCode' :platform='platform' />
    </div>
</template>

<script>
import Top from '@/components/top'
import authCondition from '@/themeCommon/components/authConditon'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
    components: {
        Top,
        authCondition
    },
    props: {
        platform: {
            type: String,
            default: 'h5'
        }
    },
    setup (props) {
        const route = useRoute()
        const businessCode = computed(() => route.query.businessCode)

        return {
            businessCode
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.authConditionWrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
}
</style>
