<template>
    <div>
        <div class='m-fastlink '>
            <div class='m-fastlink_content'>
                <a
                    v-for='item in list'
                    :key='item.img'
                    class='m-fastlink_content_item'
                    href='javascript:void(0)'
                    @click='openUrl(item.href, item.title)'
                >
                    <img alt='' class='img' :src='item.img' />
                    <div>{{ item.title }}</div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    setup () {
        const list = [
            {
                img: 'http://prewpadmin.cmfbl.com/wp-content/uploads/2021/07/4%E6%B6%88%E6%81%AF%E4%B8%AD%E5%BF%83.png',
                href: 'https://m.zhixuan6868.com/lp295A_v3.html?app=ix_app_orig&menu-button=lp295A',
                title: '行情推荐',
            },
            {
                img: 'http://prewpadmin.cmfbl.com/wp-content/uploads/2021/07/1%E8%A1%8C%E6%83%85%E5%9B%BE%E8%A1%A8.png',
                href: 'https://m.zhixuan6868.com/helpcenter.html?h5=y',
                title: '常见问答',
            },
            {
                img: 'http://prewpadmin.cmfbl.com/wp-content/uploads/2021/07/3%E8%B5%84%E9%87%91%E6%98%8E%E7%BB%86.png',
                href: 'https://www.zhixuan6868.com/03-App-lp/H5TradeInfo.html?app=ix_app_orig&inIframe=y',
                title: '关于智选',
            },
            {
                img: 'http://prewpadmin.cmfbl.com/wp-content/uploads/2021/07/2%E4%BA%A4%E6%98%93.png',
                href: 'https://cs.zhixuan6868.com:8188/?company_id=14&chat_type=1&uagent=1000&lang=zh-cn&lastPageDesc=h5%E5%85%AC%E7%89%88&account_no=&reffer=',
                title: '联系客服',
            },
        ]
        return {
            list,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.m- {
    &fastlink_content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: rem(20px) rem(50px);
        font-size: 0;
    }
    &fastlink_content_item {
        color: var(--color);
        font-size: rem(25px);
        text-align: center;
        img {
            width: rem(86px);
            padding-bottom: 5px;
        }
    }
}

</style>
