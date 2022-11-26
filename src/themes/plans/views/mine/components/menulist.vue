<template>
    <div class='menulist'>
        <template v-for='(item,i) in menuData' :key='item.icon+i'>
            <van-cell v-if='item.role.includes(userAccountType)' :is-link='!!item.href' :title='item.title' @click='handlerMenu(item)'>
                <template #icon>
                    <img class='icon_icon' :src='item.icon' />
                </template>
            </van-cell>
        </template>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
    setup () {
        const store = useStore()
        const router = useRouter()
        const userAccountType = computed(() => store.getters['_user/userAccountType'])
        const menuData = [
            // {
            //     icon: 'https://img.yienecom.com/upload/%E8%B5%84%E9%87%91%E6%98%8E%E7%BB%86.jpg',
            //     title: '清理缓存去首页',
            //     href: '/home?nocache',
            //     role: ['D', 'R_3', 'R_2', 'R_1'],
            // },
            // {
            //     icon: require('../../../images/fund.png'),
            //     title: '资金明细',
            //     href: '/fundLog',
            //     role: ['D', 'R_3', 'R_2', 'R_1'],
            // },
            {
                icon: require('../../../images/msg.png'),
                title: '消息中心',
                href: '/msg',
                role: ['D', 'R_3', 'R_2', 'R_1'],
            },
            {
                icon: require('../../../images/user.png'),
                title: '个人信息',
                href: '/personal',
                role: ['D', 'R_3', 'R_2', 'R_1'],
            },
            {
                icon: require('../../../images/services.png'),
                title: '在线客服',
                href: 'https://cs.zhixuan6868.com:8188/?company_id=14&chat_type=1&uagent=1000&lang=zh-cn&lastPageDesc=h5%E5%85%AC%E7%89%88&account_no=&reffer=',
                role: ['G', 'D', 'R_3', 'R_2', 'R_1'],
            },
            {
                icon: require('../../../images/setting.png'),
                title: '设置',
                href: '/setting',
                role: ['G', 'D', 'R_3', 'R_2', 'R_1'],
            }
        ]
        // 点击菜单
        const handlerMenu = (item) => {
            const { href } = item
            if (href && href.startsWith('/')) {
                router.push(href)
            } else if (href && href.startsWith('http')) {
                router.push({ name: 'Otherpage', params: { type: 'page' }, query: { pageTitle: item.title, url: encodeURIComponent(href) } })
            }
        }
        return {
            userAccountType,
            menuData,
            handlerMenu,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.menulist {
    margin-top: rem(20px);
}
.icon_icon {
    width: rem(40px);
    height: rem(40px);
    color: #477FD3;
    &::before {
        display: none;
        content: '';
    }
}
.van-cell {
    :deep() {
        .van-cell__title {
            margin-left: rem(28px);
            font-size: rem(28px);
        }
    }
}

</style>
