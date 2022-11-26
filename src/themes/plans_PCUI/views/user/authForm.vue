<template>
    <centerViewDialog class='bindMobilePage'>
        <authFormComponent class='authForm' platform='web' />
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import authFormComponent from '@/themeCommon/user/authForm'

export default {
    name: 'AuthForm',
    components: {
        centerViewDialog,
        authFormComponent
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.bindMobilePage {
    line-height: 50px;
    .authentication {
        :deep {
            .page-wrap {
                padding-top: 10px;
            }
        }
    }
    .authForm{
        height: 100%;
    }
}
</style>
