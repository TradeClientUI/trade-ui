<template>
    <div class='page-wrap'>
        <service />
    </div>
</template>

<script>
import service from '@/themeCommon/user/service'
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'

export default {
    components: {
        service
    },
    setup (props) {
        const store = useStore()
        const phone = computed(() => store.state._user.customerInfo?.phone)
        return {
            phone
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    background: var(--contentColor);
    max-width: 1280px;
    margin: 0 auto;
}
:deep(.block) {
    .inputWrapper {
        background: var(--contentColor);
        .input {
            height: 35px;
            line-height: 35px;
            font-size: 12px;
        }
    }
}
:deep(.mobileBar) {
    .zone {
        .el-input__inner {
            font-size: 12px;
            background: var(--contentColor);
            height: 35px;
            line-height: 35px;
        }
        .el-input__suffix-inner {
            .el-input__icon {
                line-height: 35px;
            }
        }
    }
}

</style>
