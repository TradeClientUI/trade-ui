<template>
    <div class='page-wrap'>
        <appRegister />
    </div>
</template>

<script>
import appRegister from '@/themeCommon/user/register/appRegister'
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'

export default {
    components: {
        appRegister
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
.page-wrap{
    width: 520px;
    height: 560px;
    margin: 64px auto;
    padding: 40px 50px;
    background: var(--contentColor);
    border-radius: 10px;

}

:deep(.block){
    .inputWrapper{
        background: var(--contentColor);
        .input{
            height: 35px;
            line-height: 35px;
            font-size: 12px;
        }
    }

}

:deep(.mobileBar){
    .zone{
        .el-input__inner{
            font-size: 12px;
            background: var(--contentColor);
            height: 35px;
            line-height: 35px;
        }
        .el-input__suffix-inner{
             .el-input__icon{
                 line-height: 35px;
             }

        }
    }

}

</style>
