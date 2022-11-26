<template>
    <div v-if="routeName==='Quote'" class='rightActions'>
        <a class='icon icon_add' href='javascript:;'></a>
        <a class='icon icon_bi' href='javascript:;'></a>
    </div>
    <div v-else-if="routeName==='Chart'" class='rightActions'>
        <a class='icon icon_xindingdan' href='javascript:;'></a>
    </div>
    <div v-else-if="routeName==='Trade'" class='rightActions'>
        <a class='icon icon_paixu' href='javascript:;'></a>
        <a class='icon icon_xindingdan' href='javascript:;'></a>
    </div>
    <div v-else-if="routeName==='History'" class='rightActions'>
        <a class='icon icon_paixu' href='javascript:;'></a>
        <a class='icon icon_rili' href='javascript:;'></a>
    </div>
    <div v-else-if="routeName==='OnlineService'" class='rightActions'>
        <a class='icon icon_gengduo' href='javascript:;'></a>
    </div>
    <div v-else-if="routeName==='AccountManager'" class='rightActions'>
        <a class='icon icon_add' href='javascript:;' @click="$router.push('/addAccount')"></a>
        <a class='icon icon_gengduo' href='javascript:;' @click='moreVisible=true'></a>
    </div>
    <!-- 账户管理页面更多按钮弹窗 -->
    <div v-show='moreVisible' class='morePopup' @click='moreVisible=false'>
        <div class='morePopupContainer'>
            <router-link class='link of-1px-bottom' to='/modifyPwd'>
                更改密码
            </router-link>
            <a class='link' href='javascript:;'>
                删除账户
            </a>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            moreVisible: false
        }
    },
    computed: {
        routeName () {
            return this.$route.name
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.icon {
    color: var(--contentColor);
    font-size: 1.4em;
    &:not(:first-of-type) {
        margin-left: 0.6em;
    }
    &.icon_gengduo {
        font-size: 1.2em;
        opacity: 0.7;
    }
}
.morePopup {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
}
.morePopupContainer {
    position: absolute;
    top: rem(90px);
    right: rem(10px);
    background: var(--bgColor);
    .link {
        @include active()
    ;
        display: block;
        padding: 0 rem(30px);
        color: var(--color);
        font-size: rem(28px);
        line-height: rem(88px);
    }
}
.morePopupContainer {
    color: var(--color);
}
</style>
