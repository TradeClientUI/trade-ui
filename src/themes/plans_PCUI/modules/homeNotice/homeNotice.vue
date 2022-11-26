<template>
    <div class='notice-module'>
        <ul v-if='data.items && data.items.length'>
            <li v-for='(item, key) in data.items' :key='key'>
                <a v-if='item.href?.name' href='javascript:;' @click='openUrl(item)'>
                    {{ item.label }}
                </a>
                <span v-else>
                    {{ item.label }}
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
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
    }
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
