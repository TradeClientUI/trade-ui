<template>
    <div class='notice-module'>
        <ul>
            <li v-for='(item, index) in noticeList' :key='index' @click='onNoticeItem(item)'>
                <a href='javascript:;'>
                    {{ item.text }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup>
// 公告列表
const noticeList = [
    {
        text: ''
    }
]
// 点击公告
const onNoticeItem = (item) => {

}
</script>

<style lang="scss" scoped>
.notice-module {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    background-color: var(--bgColor);
    ul {
        display: flex;
        align-items: center;
        height: 100%;
        li {
            font-size: 13px;
            a{
                color: var(--color);
            }
            &::after {
                content: '/';
                margin: 0 15px;
            }
            &:last-of-type::after {
                content: '';
            }
        }
    }
}
</style>
